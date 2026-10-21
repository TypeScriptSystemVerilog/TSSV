// The SV-guide rules writeSystemVerilog() enforces on each module it emits, whether its SV came
// from a builder or is raw SV: COMB-2, COMB-3, SEQ-1, SEQ-4, SEQ-5, SEQ-6, RST-2 and RST-4.
// ModuleBody.ts reads the module's SV. The module's signal table says which signals are resets,
// of which kind, and which are constants.
import { type AlwaysBlock, readModuleBody } from './ModuleBody.js'

type ResetKind = 'lowasync' | 'highasync' | 'lowsync' | 'highsync'

/** What writeSystemVerilog() knows about a module beyond its SV. */
export interface ModuleTable {
  /** the module's name, for error messages */
  name: string
  /** its ports and signals */
  signals: Record<string, { direction?: string, type?: string, isReset?: ResetKind }>
  /** its interfaces, ports and instances both */
  interfaces: string[]
  /** each submodule port that is a reset (`isReset`), and what the module binds to it */
  resetBindings: Array<{ instance: string, port: string, binding: string }>
}

interface Reset {
  name: string
  kind: ResetKind
}

const isAsync = (kind: ResetKind): boolean => kind === 'lowasync' || kind === 'highasync'
const isLow = (kind: ResetKind): boolean => kind === 'lowasync' || kind === 'lowsync'

// A signal, a bit, part or member of one, or either inverted: the root signal's name, or
// undefined for any other expression. `!rst_n`, `~(rst_q[1])` and `bus.PRESETn` are wiring, not
// logic (RST-4).
function wiredFrom (expr: string): string | undefined {
  return /^[(!~]*([A-Za-z_][\w$]*)(?:\[[^\]]*\]|\.[A-Za-z_][\w$]*)*\)*$/.exec(expr.replace(/\s/g, ''))?.[1]
}

/**
 * Check a module's SV against the SV-guide rules, and throw one error that lists every violation.
 * @param table the module's name, signals, interfaces and submodule reset bindings
 * @param src the module's SV: one module declaration
 */
export function checkModule (table: ModuleTable, src: string): void {
  const module = readModuleBody(table.name, src)
  const findings: string[] = []
  const fail = (block: AlwaysBlock | undefined, msg: string): void => {
    findings.push(block === undefined ? msg : `${block.header}: ${msg}`)
  }
  const resetKind = (name: string | undefined): ResetKind | undefined => name === undefined ? undefined : table.signals[name]?.isReset
  const resets: Reset[] = Object.entries(table.signals)
    .map(([name, s]) => ({ name, kind: s.isReset }))
    .filter((r): r is Reset => r.kind !== undefined)
  const resetWrites = (block: AlwaysBlock, r: Reset): ReturnType<AlwaysBlock['resetWrites']> =>
    block.resetWrites({ name: r.name, activeLow: isLow(r.kind) })
  // What a reset branch mustn't read: a port, a signal that isn't a constant, an interface, or a
  // variable or net declared in raw SV
  const isSignal = (id: string): boolean => {
    const signal = table.signals[id]
    if (signal !== undefined) return signal.type !== 'const logic'
    return table.interfaces.includes(id) || module.declared.has(id)
  }

  // The resets each sequential block uses: in its event control, or to select a branch
  const used = new Map<AlwaysBlock, Reset[]>()
  for (const block of module.blocks) {
    // COMB-2: a local declared with an initializer is static unless it's automatic
    const decl = block.initialized.find((d) => !d.automatic)
    if (decl !== undefined) {
      fail(block, `${decl.names.join(', ')} is declared with an initializer but isn't automatic, so it's static: the initializer runs once, and the value carries over (COMB-2: declare it automatic, or assign it instead)`)
    }
    // COMB-3: no <= in combinational logic
    const nonblocking = block.writes.find((write) => write.kind === 'nonblocking')
    if (block.kind === 'comb' && nonblocking !== undefined) {
      fail(block, `nonblocking assignment to ${nonblocking.target} (COMB-3: use blocking assignments, =, in combinational logic)`)
    }
    if (block.kind !== 'seq') continue

    // SEQ-1: = only for the block's own locals
    const blocking = block.writes.find((write) => write.kind === 'blocking' && write.names.some((name) => !block.locals.has(name)))
    if (blocking !== undefined) {
      fail(block, `blocking assignment to ${blocking.target} (SEQ-1: use <= for every variable visible outside the block, and = only for its automatic locals)`)
    }

    // SEQ-4: one clock, on one edge. Every term that isn't a reset is a clock.
    const clocks = block.events.filter((e) => resetKind(e.name) === undefined)
    const clock = clocks[0]
    if (clock === undefined || clocks.length > 1) {
      fail(block, `${clocks.length === 0 ? 'no clock' : `${clocks.length} clocks, ${clocks.map((c) => c.text).join(' and ')},`} in its event control (SEQ-4: use one clock per sequential block, and one edge. A reset in the event control must be marked isReset, TSSV guide MOD-3)`)
    } else if (clock.edge !== 'posedge' && clock.edge !== 'negedge') {
      fail(block, `clock ${clock.text} is on ${clock.edge === 'edge' ? 'both edges' : 'a level, not an edge'} (SEQ-4: use one edge, posedge or negedge)`)
    }

    const blockResets = resets.filter((r) => block.events.some((e) => e.name === r.name) || resetWrites(block, r).length > 0)
    used.set(block, blockResets)

    // SEQ-5: an async reset is in the event control, on its active edge; a sync reset isn't
    for (const e of block.events) {
      const kind = resetKind(e.name)
      if (kind === undefined) continue
      const edge = isLow(kind) ? 'negedge' : 'posedge'
      if (!isAsync(kind)) {
        fail(block, `${e.text} is ${kind}, a sync reset, but it's in the event control (SEQ-5: leave a sync reset out of the sensitivity list)`)
      } else if (e.edge !== edge) {
        fail(block, `${e.text} is ${kind}, so its event is ${edge} ${e.text}, not ${e.edge === undefined ? 'a level' : `${e.edge} ${e.text}`} (SEQ-5: make the sensitivity list match the reset kind)`)
      }
    }
    for (const r of blockResets) {
      if (isAsync(r.kind) && !block.events.some((e) => e.name === r.name)) {
        fail(block, `${r.name} is ${r.kind}, but it isn't in the event control, so the reset waits for a clock edge (SEQ-5: add ${isLow(r.kind) ? 'negedge' : 'posedge'} ${r.name} to the sensitivity list)`)
      }
    }

    // SEQ-6: a reset branch assigns constants, not the module's signals
    for (const r of blockResets) {
      for (const write of resetWrites(block, r)) {
        const signal = write.reads.find((id) => !block.locals.has(id) && isSignal(id))
        if (signal !== undefined) {
          fail(block, `${write.target} resets to ${signal}, a signal (SEQ-6: reset values must be constants)`)
        }
      }
    }
  }

  // RST-2: every sequential block in a module uses the same kind of reset
  const kinds = new Map<ResetKind, { reset: string, block: AlwaysBlock }>()
  for (const [block, blockResets] of used) {
    for (const r of blockResets) if (!kinds.has(r.kind)) kinds.set(r.kind, { reset: r.name, block })
  }
  if (kinds.size > 1) {
    const uses = [...kinds].map(([kind, { reset, block }]) => `${reset}, which is ${kind}, in ${block.header}`)
    fail(undefined, `resets of ${kinds.size} kinds: ${uses.join('; ')} (RST-2: use one reset kind per module)`)
  }

  // RST-4: a reset is an input, a submodule output, a register, or one of those wired through,
  // perhaps inverted; never a combinational expression
  const combWrites = new Set(module.blocks.filter((b) => b.kind === 'comb' || b.kind === 'latch')
    .flatMap((b) => b.writes.flatMap((w) => w.names).filter((name) => !b.locals.has(name))))
  const assigned = new Map<string, string>()
  for (const a of module.assigns) for (const name of a.names) assigned.set(name, a.rhs)
  // why `name` is a reset generated in logic, or undefined if it isn't
  const generated = (name: string, seen: Set<string>): string | undefined => {
    if (seen.has(name)) return undefined
    seen.add(name)
    if (combWrites.has(name)) return `${name} is assigned in a combinational block`
    const rhs = assigned.get(name)
    if (rhs === undefined) return undefined
    const source = wiredFrom(rhs)
    return source === undefined ? `${name} is assigned ${rhs}` : generated(source, seen)
  }
  const isInput = (name: string): boolean => table.signals[name]?.direction === 'input'
  const toCheck = new Set(resets.map((r) => r.name).filter((name) => !isInput(name)))
  // addSubmodule binds a signal; a bigint becomes a constant signal
  for (const b of table.resetBindings) {
    const source = wiredFrom(b.binding)
    if (source !== undefined) toCheck.add(source)
    else fail(undefined, `reset ${b.instance}.${b.port} is bound to ${b.binding}, an expression (RST-4: never generate a reset in logic)`)
  }
  for (const name of toCheck) {
    const why = generated(name, new Set())
    if (why !== undefined) {
      fail(undefined, `reset ${name} is generated in logic: ${why} (RST-4: never generate a reset in logic; reset synchronizers live in a dedicated module)`)
    }
  }

  if (findings.length === 1) throw Error(`${table.name}: ${findings[0] ?? ''}`)
  if (findings.length > 1) throw Error(`${table.name}: ${findings.length} SV-guide violations:\n  ${findings.join('\n  ')}`)
}
