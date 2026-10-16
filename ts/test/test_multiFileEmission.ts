/**
 * Self-checking test for emitting one design across several files via SVEmitOptions.
 *
 * An emission defines every module and interface it reaches, and each top-level call used to
 * start from nothing — so emitting a DUT and then a testbench that instantiates it defined the
 * whole DUT twice, once in each file. `exclude` carries one emission's definitions into the
 * next; `defined` collects them.
 *
 * The invariant worth testing is that the result is a genuine partition. Two ways it can break:
 * a definition landing in both files, which the simulator rejects as a duplicate; and one
 * landing in neither, which leaves an instantiation unresolved. Test 2 asserts both directions
 * against the single-file emission of the same design.
 *
 * Test 1: without options, emission is unchanged and repeatable
 * Test 2: dut-then-tb is a partition of the single-file emission
 * Test 3: `defined` includes the emitted module's own name
 * Test 4: the shared interface lands in whichever file is emitted first
 * Test 5: excluding a module from its own emission throws
 */
import { Module, Expr, type TSSVParameters } from 'tssv/lib/core/TSSV'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { mkdirSync, writeFileSync } from 'fs'
import { writeLintFilelist } from 'tssv/test/models/lintFilelist'
import { markTestbench } from 'tssv/test/models/testbench'

try { mkdirSync('sv-examples/Core/multiFileEmission', { recursive: true }) } catch (e) {}

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

/** Every top-level module/interface DEFINED in `sv` - not those merely instantiated. */
function definitions (sv: string): Set<string> {
  const names = new Set<string>()
  for (const line of sv.split('\n')) {
    const m = /^(?:module|interface)\s+([A-Za-z_][A-Za-z0-9_$]*)/.exec(line)
    if (m !== null) names.add(m[1])
  }
  return names
}

const sorted = (s: Set<string>): string => [...s].sort().join(', ')

// ---- A DUT and a testbench that share an interface --------------------------------------
// The leaf returns each address as its data, a cycle after the read. The agent reads successive
// addresses and checks the data, so every signal of the bus is driven and used.
const MEMORY = { type: 'rd_only' } as const

class Leaf extends Module {
  constructor (params: TSSVParameters = {}) {
    super({ name: 'leaf', ...params })
    this.IOs = { clk: { direction: 'input', isClock: 'posedge' } }
    this.addInterface('mem', new Memory(MEMORY, 'inward'))
    this.addRegister({ d: 'mem.ADDR', clk: 'clk', en: 'mem.RE', q: 'mem.DATA_RD' })
    this.addAssign({ in: new Expr("1'b1"), out: 'mem.READY' })
  }
}

class Dut extends Module {
  constructor (params: TSSVParameters = {}) {
    super({ name: 'dut', ...params })
    this.IOs = { clk: { direction: 'input', isClock: 'posedge' } }
    this.addInterface('mem', new Memory(MEMORY, 'inward'))
    this.addSubmodule('u_leaf', new Leaf(), { clk: 'clk', mem: 'mem' }, false)
  }
}

class Agent extends Module {
  constructor (params: TSSVParameters = {}) {
    super({ name: 'agent', ...params }, { clk: { direction: 'input', isClock: 'posedge' } }, {}, `
  logic [31:0] addr_q;
  logic re_q;
  initial begin
    mem.ADDR = 32'd0;
    mem.RE = 1'b0;
    re_q = 1'b0;
  end
  always @(posedge clk) begin
    mem.RE <= 1'b1;
    mem.ADDR <= mem.ADDR + 32'd4;
    re_q <= mem.RE;
    addr_q <= mem.ADDR;
    if (re_q && mem.READY)
      assert (mem.DATA_RD == addr_q) else $fatal(1, "Assertion failed: DATA_RD should be %0d at time %0t", addr_q, $time);
  end
`)
    this.addInterface('mem', new Memory(MEMORY, 'outward'))
    markTestbench(this)
  }
}

/** Instantiates the DUT and an agent, wired by a shared interface instance. */
function makeTb (dut: Dut): Module {
  const tb = new (class extends Module {
    constructor () {
      super({ name: 'tb' })
      this.IOs = { clk: { direction: 'input', isClock: 'posedge' } }
      this.addInterface('w_mem', new Memory(MEMORY))
      this.addSubmodule('u_dut', dut, { clk: 'clk', mem: 'w_mem' }, false)
      this.addSubmodule('u_agent', new Agent(), { clk: 'clk', mem: 'w_mem' }, false)
    }
  })()
  return markTestbench(tb)
}

// ---- Test 1: no options - unchanged and repeatable ---------------------------------------
const baseline = makeTb(new Dut()).writeSystemVerilog()
const baselineAgain = makeTb(new Dut()).writeSystemVerilog()
check('emission without options is repeatable', baseline === baselineAgain)
check('single-file emission defines the whole design',
  definitions(baseline).has('dut') && definitions(baseline).has('leaf') &&
  definitions(baseline).has('agent') && definitions(baseline).has('tb') &&
  definitions(baseline).has('memory_rd_only_32_32'),
  `defined: ${sorted(definitions(baseline))}`)

// ---- Test 2: dut-then-tb partitions that emission -----------------------------------------
const dut = new Dut()
const tb = makeTb(dut)
const defined = new Set<string>()
const dutSV = dut.writeSystemVerilog({ defined })
const tbSV = tb.writeSystemVerilog({ exclude: defined })

writeFileSync('sv-examples/Core/multiFileEmission/dut.sv', dutSV)
writeFileSync('sv-examples/Core/multiFileEmission/tb.sv', tbSV)
// Each file holds several definitions: that is the partition this test checks. So DECLFILENAME
// is waived for the first definition in each, the one Verilator reports (SV guide, section 8).
writeFileSync('sv-examples/Core/multiFileEmission/tb_waivers.vlt', `\`verilator_config
// Lint waivers for ts/test/test_multiFileEmission.ts, which checks that dut.sv and tb.sv partition
// one design. Each file holds several definitions, so neither can be named after all of them.
lint_off -rule DECLFILENAME -file "*/multiFileEmission/dut.sv" -match "*IFACE name: 'memory_rd_only_32_32'"
lint_off -rule DECLFILENAME -file "*/multiFileEmission/tb.sv" -match "*MODULE name: 'agent'"
`)
writeLintFilelist('sv-examples/Core/multiFileEmission', 'tb', ['tb_waivers.vlt', 'dut.sv', 'tb.sv'], 'ts/test/test_multiFileEmission.ts')

const inDut = definitions(dutSV)
const inTb = definitions(tbSV)
const both = [...inDut].filter(n => inTb.has(n))
check('no definition appears in both files', both.length === 0, `in both: ${both.join(', ')}`)

const union = new Set([...inDut, ...inTb])
const missing = [...definitions(baseline)].filter(n => !union.has(n))
check('together the files define everything the single file did', missing.length === 0,
  `missing: ${missing.join(', ')}`)

check('the testbench file still instantiates the excluded DUT',
  /^\s+dut\s+\S*\s*u_dut/m.test(tbSV))

// ---- Test 3: `defined` reports the emitted module itself ----------------------------------
check('`defined` includes the emitted module\'s own name', defined.has('dut'),
  `defined: ${sorted(defined)}`)
check('`defined` includes its submodules and interfaces',
  defined.has('leaf') && defined.has('memory_rd_only_32_32'), `defined: ${sorted(defined)}`)
check('the testbench file does not redefine the DUT', !inTb.has('dut') && !inTb.has('leaf'))

// ---- Test 4: emission order decides where a shared definition lands -----------------------
check('the shared interface is defined in the first file emitted',
  inDut.has('memory_rd_only_32_32') && !inTb.has('memory_rd_only_32_32'))

const tbFirstDefined = new Set<string>()
const tbFirst = makeTb(new Dut())
tbFirst.writeSystemVerilog({ defined: tbFirstDefined })
check('emitting the testbench first would instead define it there',
  tbFirstDefined.has('memory_rd_only_32_32'))

// ---- Test 5: excluding a module from its own emission is an error -------------------------
let threw = false
try {
  new Dut().writeSystemVerilog({ exclude: new Set(['dut']) })
} catch (e) {
  threw = true
}
check('excluding a module from its own emission throws', threw)

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
