/**
 * Self-checking test for SystemVerilog attributes on signal and port declarations (#131).
 *
 * `attributes` on a `Signal` or `IOSignal` is emitted in front of the declaration as
 * `(* name = value *)`. Emission goes through Verible, so the expected text below is the
 * formatted output, and the attributes have to come out where they were put.
 *
 * Test 1: attributes on a scalar, a vector and an array signal, and on input and output ports,
 *         with string, numeric, bigint and valueless values
 * Test 2: an empty attributes map emits the same SV as no map
 * Test 3: illegal names, unsafe string values and unsupported values throw; timing-intent
 *         names emit like any other
 * Test 4: addRegister's auto-named q doesn't inherit d's attributes
 * Test 5: addSubmodule(createMissing) doesn't copy a port's attributes to the signal it creates
 * Test 6: attributes on an interface signal throw
 */
import { Module, Interface, type SVAttributes } from 'tssv/lib/core/TSSV'
import { mkdirSync, writeFileSync } from 'fs'
import { writeLintFilelist } from 'tssv/test/models/lintFilelist'

const outDir = 'sv-examples/Core/signalAttributes'
try { mkdirSync(outDir, { recursive: true }) } catch (e) {}

let passed = 0
let failed = 0

function check (label: string, ok: boolean, detail?: string): void {
  if (ok) {
    console.log(`PASS: ${label}`)
    passed++
  } else {
    console.error(`FAIL: ${label}${detail !== undefined ? `\n  ${detail}` : ''}`)
    failed++
  }
}

function expectThrow (label: string, fn: () => unknown, message: string): void {
  try {
    fn()
    check(label, false, 'did not throw')
  } catch (e) {
    const got = (e instanceof Error) ? e.message : String(e)
    check(label, got.includes(message), `expected a message containing '${message}', got '${got}'`)
  }
}

/** Lines of `sv`, trimmed, so a check doesn't depend on Verible's indentation. */
const lines = (sv: string): string[] => sv.split('\n').map((l) => l.trim())

// ---- Test 1: attributes on every kind of declaration --------------------------------------
class AttrDemo extends Module {
  constructor () {
    super({ name: 'attr_demo' })
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      din: { direction: 'input', width: 8, attributes: { mark_debug: 'true' } },
      sel: { direction: 'input', width: 2 },
      dout: { direction: 'output', width: 8, attributes: { keep: true, max_fanout: 4 } },
      parity: { direction: 'output', attributes: { dont_touch: 'yes' } }
    }
    this.addSignal('mem', { width: 8, isArray: 4n, attributes: { ram_style: 'distributed' } })
    this.addSignal('vec', { width: 8, attributes: { weight: 3n, level: -2 } })
    this.addSignal('flag', { attributes: { keep: true } })
    this.addSequentialAlways({ clk: 'clk', outputs: ['mem'] }, `
    begin
        mem[sel] <= din;
    end
    `)
    this.addRegister({ d: 'vec', clk: 'clk' })
    this.addBody(`
    assign vec = mem[sel];
    assign flag = ^vec_q;
    assign parity = flag;
    assign dout = vec_q;
    `)
  }
}

const demoSV = new AttrDemo().writeSystemVerilog()
writeFileSync(`${outDir}/attr_demo.sv`, demoSV)
const demoLines = lines(demoSV)

const expected: Array<[string, string]> = [
  ['input port, string value', '(* mark_debug = "true" *) input logic [7:0] din,'],
  ['output port, valueless and numeric values', '(* keep, max_fanout = 4 *) output logic [7:0] dout,'],
  ['scalar output port', '(* dont_touch = "yes" *) output logic parity'],
  ['port without attributes is unchanged', 'input logic clk,'],
  ['array signal', '(* ram_style = "distributed" *) logic [7:0] mem[0:3];'],
  ['vector signal, bigint and negative number values', '(* weight = 3, level = -2 *) logic [7:0] vec;'],
  ['scalar signal, valueless value', '(* keep *) logic flag;']
]
for (const [label, line] of expected) {
  check(`Test 1: ${label}`, demoLines.includes(line), `expected the line '${line}' in:\n${demoSV}`)
}

// ---- Test 2: an empty map changes nothing --------------------------------------------------
class EmptyMap extends Module {
  constructor (attributes: SVAttributes | undefined) {
    super({ name: 'empty_map' })
    this.IOs = {
      a: { direction: 'input', width: 4, attributes },
      y: { direction: 'output', width: 4 }
    }
    this.addSignal('t', { width: 4, attributes })
    this.addBody('assign t = a;\nassign y = t;')
  }
}
check('Test 2: attributes: {} emits the same SV as no attributes',
  new EmptyMap({}).writeSystemVerilog() === new EmptyMap(undefined).writeSystemVerilog())

// ---- Test 3: invalid attributes throw -----------------------------------------------------
class OneAttr extends Module {
  constructor (attributes: SVAttributes, onPort = false) {
    super({ name: 'one_attr' })
    this.IOs = {
      a: { direction: 'input', attributes: onPort ? attributes : undefined },
      y: { direction: 'output' }
    }
    this.addSignal('t', { attributes: onPort ? undefined : attributes })
    this.addBody('assign t = a;\nassign y = t;')
  }
}
const emit = (attributes: SVAttributes, onPort = false) => () => new OneAttr(attributes, onPort).writeSystemVerilog()

expectThrow('Test 3: name starting with a digit', emit({ '9lives': true }), 'not a legal SystemVerilog identifier')
expectThrow('Test 3: name with a hyphen', emit({ 'ram-style': 'block' }), 'not a legal SystemVerilog identifier')
expectThrow('Test 3: empty name', emit({ '': true }), 'not a legal SystemVerilog identifier')
expectThrow('Test 3: string value with a quote', emit({ note: 'say "hi"' }), 'contains a quote')
expectThrow('Test 3: string value with a newline', emit({ note: 'two\nlines' }), 'contains a quote')
expectThrow('Test 3: string value with a backslash', emit({ note: 'a\\b' }), 'contains a quote')
expectThrow('Test 3: non-integer number', emit({ ratio: 1.5 }), 'unsupported value')
expectThrow('Test 3: NaN', emit({ ratio: NaN }), 'unsupported value')
expectThrow('Test 3: false', emit({ keep: false as unknown as true }), 'unsupported value')
expectThrow('Test 3: error names the module and port', emit({ 'bad-name': true }, true), 'one_attr.a: attribute name')

// Timing-intent attributes (#99) go through the same emission as any other
check('Test 3: tssv_timing_* and ASYNC_REG emit like any other attribute',
  lines(emit({ tssv_timing_exception: 'cdc', ASYNC_REG: 'TRUE' })())
    .includes('(* tssv_timing_exception = "cdc", ASYNC_REG = "TRUE" *) logic t;'))

// ---- Test 4: addRegister's auto-named q ---------------------------------------------------
check('Test 4: vec_q is declared without vec\'s attributes', demoLines.includes('logic [7:0] vec_q;'),
  `expected the line 'logic [7:0] vec_q;' in:\n${demoSV}`)

// ---- Test 5: addSubmodule(createMissing) --------------------------------------------------
class Child extends Module {
  constructor () {
    super({ name: 'attr_child' })
    this.IOs = {
      din: { direction: 'input', width: 8, attributes: { mark_debug: 'true' } },
      dout: { direction: 'output', width: 8 }
    }
    this.addBody('assign dout = din;')
  }
}
class Parent extends Module {
  constructor () {
    super({ name: 'attr_parent' })
    this.IOs = { dout: { direction: 'output', width: 8 } }
    this.addSubmodule('u_child', new Child(), {}, true, true)
    this.addBody("assign din = 8'd5;")
  }
}
// One module per file, so each file lints clean of DECLFILENAME
const defined = new Set<string>()
const childSV = new Child().writeSystemVerilog({ defined })
const parentSV = new Parent().writeSystemVerilog({ exclude: defined })
writeFileSync(`${outDir}/attr_child.sv`, childSV)
writeFileSync(`${outDir}/attr_parent.sv`, parentSV)
writeLintFilelist(outDir, 'attr_parent', ['attr_child.sv', 'attr_parent.sv'], 'ts/test/test_signalAttributes.ts')
check('Test 5: the child keeps its port attribute',
  lines(childSV).includes('(* mark_debug = "true" *) input logic [7:0] din,'))
check('Test 5: the created parent signal has no attributes',
  lines(parentSV).includes('logic [7:0] din;') && !parentSV.includes('(*'),
  `parent module:\n${parentSV}`)

// ---- Test 6: interface signals ------------------------------------------------------------
class AttrBus extends Interface {
  constructor (role?: string) {
    super('attr_bus', {}, role, { req: { width: 1, attributes: { keep: true } } })
    this.modports = { inward: { req: 'input' }, outward: { req: 'output' } }
  }
}
class BusUser extends Module {
  constructor () {
    super({ name: 'bus_user' })
    this.IOs = { y: { direction: 'output' } }
    this.addInterface('bus', new AttrBus('inward'))
    this.addBody('assign y = bus.req;')
  }
}
expectThrow('Test 6: attributes on an interface signal throw', () => new BusUser().writeSystemVerilog(),
  'attr_bus.req: attributes are not supported on interface signals')

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
