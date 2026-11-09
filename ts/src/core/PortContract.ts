/**
 * Port contracts: promises a module makes about the paths between its own ports, checked on the
 * SV it generates (doc/framework/concepts.md, "Port contracts").
 *
 * The one promise today is "no combinational path from input `from` to output `to`", declared
 * with `Module.addNoCombinationalPathContract()`. Verilator can't report a path from an input to
 * an output, but it does report a combinational loop (UNOPTFLAT). So for each contract a wrapper
 * instantiates the module and ties `to` back into `from`, and any path through the module becomes
 * a loop. `writeSystemVerilogFiles()` writes the wrappers into `<module>.contracts.json`, and
 * `scripts/check-port-contracts.mjs` lints them.
 *
 * @module PortContract
 */

/** One bit-level view of a port: a plain port, or one signal of an interface port */
export interface PortSignal {
  /** the plain port's name, or the interface signal's name */
  name: string
  /** the direction the module sees it in */
  direction: 'input' | 'output' | 'inout'
  /** the width in bits */
  width: number
  /** whether it is declared `signed` */
  isSigned: boolean
}

/**
 * A module's ports as seen from outside: its plain ports, in declaration order, then each
 * interface port with the signals of its modport, in the modport's order.
 */
export interface ModulePorts {
  /** the plain ports, in declaration order */
  plain: PortSignal[]
  /** the interface ports: each one's name, SV type and modport signals */
  interfaces: Array<{
    /** the port's name in the module */
    port: string
    /** the interface's SV type, `Interface.interfaceName()` */
    type: string
    /** the signals of the port's modport, in the modport's order, with the directions it gives them */
    signals: PortSignal[]
  }>
}

/**
 * A promise that the module has no combinational path from input bit `from` to output bit `to`.
 * Each endpoint names one bit: a one-bit port (`ready`), a one-bit signal of an interface port
 * (`out.ready`), or one bit of a wider one (`ready_bus[2]`, `out.ready_bus[2]`).
 */
export interface PortContract {
  /** one bit of an input */
  from: string
  /** one bit of an output */
  to: string
}

/** A contract as a failure names it: `no combinational path from <from> to <to>` */
export function contractText (c: PortContract): string {
  return `no combinational path from ${c.from} to ${c.to}`
}

/** An endpoint resolved against the module's ports */
export interface Endpoint {
  /** the plain port, or the interface port */
  port: string
  /** the interface signal, for an endpoint on an interface port */
  signal?: string
  /** the bit, for an endpoint on a signal wider than one bit */
  bit?: number
  /** the width of the port or signal the endpoint is a bit of */
  width: number
}

// An endpoint: a port name, or `port.signal` for a signal of an interface port, then optionally
// one bit, `[i]`. Captures the port, the signal and the bit's index.
const ENDPOINT = /^([A-Za-z_][A-Za-z0-9_$]*)(?:\.([A-Za-z_][A-Za-z0-9_$]*))?(?:\[(\d+)\])?$/

/**
 * Resolves `text`, one end of contract `c`, against `ports`. Throws, naming the module and the
 * contract, if it isn't one bit of a port in direction `want`.
 */
function resolveEndpoint (module: string, ports: ModulePorts, c: PortContract, text: string, want: 'input' | 'output'): Endpoint {
  const fail = (problem: string): never => { throw Error(`${module}: ${contractText(c)}: ${problem}`) }
  const m = ENDPOINT.exec(text)
  if (m === null) return fail(`'${text}' isn't a port or port.signal, with an optional bit [i]`)
  const [, port, signal, bitText] = m
  let sig: PortSignal | undefined
  if (signal === undefined) {
    sig = ports.plain.find(p => p.name === port)
    if (sig === undefined) return fail(`there is no port ${port}`)
  } else {
    const intf = ports.interfaces.find(i => i.port === port)
    if (intf === undefined) return fail(`there is no interface port ${port}`)
    sig = intf.signals.find(s => s.name === signal)
    if (sig === undefined) return fail(`interface port ${port} has no signal ${signal}`)
  }
  const name = signal === undefined ? port : `${port}.${signal}`
  if (sig.direction !== want) fail(`${name} is an ${sig.direction}; a contract runs from an input to an output`)
  if (bitText === undefined) {
    if (sig.width > 1) fail(`${name} is ${sig.width} bits wide; name one bit, as ${name}[i]`)
    return { port, signal, width: 1 }
  }
  const bit = Number(bitText)
  if (sig.width === 1) fail(`${name} is 1 bit wide; name it without [${bit}]`)
  if (bit >= sig.width) fail(`${name} has bits ${sig.width - 1} to 0, so it has no bit ${bit}`)
  return { port, signal, bit, width: sig.width }
}

/**
 * Checks contract `c` against the module's ports, and returns its two endpoints. Throws, naming
 * the module and the contract, if `from` isn't one bit of an input or `to` one bit of an output.
 */
export function resolveContract (module: string, ports: ModulePorts, c: PortContract): {
  /** the input end */
  from: Endpoint
  /** the output end */
  to: Endpoint
} {
  return {
    from: resolveEndpoint(module, ports, c, c.from, 'input'),
    to: resolveEndpoint(module, ports, c, c.to, 'output')
  }
}

function decl (direction: string, width: number, isSigned: boolean, name: string): string {
  const range = width > 1 ? `[${width - 1}:0] ` : ''
  return `${direction === 'input' ? 'input ' : 'output'} logic ${isSigned ? 'signed ' : ''}${range}${name}`
}

/**
 * The SV text of a wrapper module, `top`, that instantiates `module` as `dut`, for a lint run with
 * `-Wall`. A module with an interface port can't be linted as the top on its own: nothing would
 * drive the interface. So the wrapper instantiates each interface port's interface, as
 * `<port>_bus`, and brings each of its signals out to a wrapper port `<port>_<signal>`. A plain
 * port keeps its name. Every wrapper port has the direction the module sees.
 *
 * With `close`, the wrapper also ties output bit `close.to` back into input bit `close.from`, so a
 * combinational path from `from` to `to` inside the module becomes a loop, which Verilator reports
 * as UNOPTFLAT. The other bits of `from`'s signal still come from the wrapper port.
 * @param module the module to wrap
 * @param ports its ports, `Module.ports()`
 * @param top the wrapper's name
 * @param header the comment lines above `module <top>`
 * @param close the contract to close, resolved with resolveContract()
 */
export function wrapperSV (module: string, ports: ModulePorts, top: string, header: string, close?: { from: Endpoint, to: Endpoint }): string {
  const portDecls: string[] = []
  const binds: string[] = []
  const body: string[] = []
  // An endpoint's signal inside the wrapper, and its bit
  const signalOf = (e: Endpoint): string => e.signal === undefined ? e.port : `${e.port}_bus.${e.signal}`
  const bitOf = (e: Endpoint): string => `${signalOf(e)}${e.bit === undefined ? '' : `[${e.bit}]`}`
  // The value that drives `from`'s signal: `to`'s bit in `from`'s place, and `source` elsewhere
  const closed = (from: Endpoint, to: Endpoint, source: string): string => {
    if (from.bit === undefined) return bitOf(to)
    const bits: string[] = []
    for (let i = from.width - 1; i >= 0; i--) bits.push(i === from.bit ? bitOf(to) : `${source}[${i}]`)
    return `{${bits.join(', ')}}`
  }
  const closing = (c: { from: Endpoint, to: Endpoint }): string => `  // The contract's loop: ${bitOf(c.to)} back into ${bitOf(c.from)}`
  for (const io of ports.plain) {
    portDecls.push(decl(io.direction, io.width, io.isSigned, io.name))
    if (close !== undefined && close.from.signal === undefined && close.from.port === io.name) {
      // The module's port is bound to contract_from, so `from` is driven only through the loop
      const range = io.width > 1 ? `[${io.width - 1}:0] ` : ''
      body.push(`  logic ${io.isSigned ? 'signed ' : ''}${range}contract_from;`, closing(close),
        `  assign contract_from = ${closed(close.from, close.to, io.name)};`)
      binds.push(`.${io.name}(contract_from)`)
    } else {
      binds.push(`.${io.name}(${io.name})`)
    }
  }
  for (const { port, type, signals } of ports.interfaces) {
    body.push(`  ${type} ${port}_bus ();`)
    for (const sig of signals) {
      // The module's output is the wrapper's output, and the module's input the wrapper's input
      portDecls.push(decl(sig.direction, sig.width, sig.isSigned, `${port}_${sig.name}`))
      if (close !== undefined && close.from.port === port && close.from.signal === sig.name) {
        body.push(closing(close), `  assign ${port}_bus.${sig.name} = ${closed(close.from, close.to, `${port}_${sig.name}`)};`)
      } else {
        body.push(sig.direction === 'input'
          ? `  assign ${port}_bus.${sig.name} = ${port}_${sig.name};`
          : `  assign ${port}_${sig.name} = ${port}_bus.${sig.name};`)
      }
    }
    binds.push(`.${port}(${port}_bus)`)
  }
  return `${header}
module ${top} (
  ${portDecls.join(',\n  ')}
);
${body.join('\n')}

  ${module} dut (
    ${binds.join(',\n    ')}
  );
endmodule
`
}

/**
 * What writeSystemVerilogFiles() writes to `<module>.contracts.json`, for
 * scripts/check-port-contracts.mjs: the wrapper left open, and one closed wrapper per contract.
 * Each `sv` is the whole file, which includes `<module>.sv` under `USE_INCLUDES`.
 */
export interface ContractManifest {
  /** the module's name */
  module: string
  /** every port brought out, nothing closed: a loop here is the module's own */
  open: {
    /** the wrapper's module name */
    top: string
    /** the wrapper's file */
    sv: string
  }
  /** one wrapper per contract, in the order declared, with that contract's loop closed */
  contracts: Array<{
    /** the contract, as {@link contractText} gives it */
    contract: string
    /** the wrapper's module name */
    top: string
    /** the wrapper's file */
    sv: string
  }>
}
