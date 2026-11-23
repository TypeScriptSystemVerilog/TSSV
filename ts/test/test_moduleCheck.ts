import { type ModuleTable, checkModule } from 'tssv/lib/core/ModuleCheck'

// Unit test of the SV-guide checks emission runs on each module (issues #166, #231), for
// cases a module built with the builders can't easily reach: resets wired through interfaces and
// chains, a cycle of assignments, flops that are interface members, and an error that lists
// several violations.
// ts/test/rtl_style/test_rtl_style_builders.ts checks each rule through writeSystemVerilogFiles().

let failures = 0
function checkPasses (what: string, fn: () => void): void {
  try {
    fn()
  } catch (e) {
    failures++
    console.error(`FAIL ${what}: threw ${String(e)}`)
  }
}
function checkThrows (what: string, fn: () => void, pattern: RegExp): void {
  try {
    fn()
    failures++
    console.error(`FAIL ${what}: did not throw`)
  } catch (e) {
    if (!pattern.test(String(e))) {
      failures++
      console.error(`FAIL ${what}: threw ${String(e)}`)
    }
  }
}

const table = (signals: ModuleTable['signals'], extra: Partial<ModuleTable> = {}): ModuleTable => ({
  name: 'm', signals, interfaces: [], resetBindings: [], resetWaivers: [], testbench: false, ...extra
})
const sv = (items: string): string => `module m;\n${items}\nendmodule\n`
const flop = (rst: string): string => `
  always_ff @(posedge clk or negedge ${rst}) begin : q_reg
    if (!${rst}) q <= 1'b0;
    else q <= d;
  end`
const clocked = { clk: { direction: 'input' }, d: { direction: 'input' }, q: { direction: 'output' } }

// RST-4: a reset wired from an interface signal, or through a chain of aliases, is wiring
checkPasses('a reset from an interface signal', () => {
  checkModule(table({ ...clocked, rst_n: { isReset: 'lowasync' } }, { interfaces: ['bus'] }),
    sv(`assign rst_n = bus.PRESETn;${flop('rst_n')}`))
})
checkPasses('a reset through two aliases, one inverted', () => {
  checkModule(table({ ...clocked, rst: { direction: 'input' }, mid: {}, rst_n: { isReset: 'lowasync' } }),
    sv(`assign mid = ~rst;\nassign rst_n = (mid);${flop('rst_n')}`))
})
checkThrows('a chain that ends in logic', () => {
  checkModule(table({ ...clocked, a: { direction: 'input' }, b: { direction: 'input' }, mid: {}, rst_n: { isReset: 'lowasync' } }),
    sv(`assign mid = a | b;\nassign rst_n = !mid;${flop('rst_n')}`))
}, /reset rst_n is generated in logic: mid is assigned a \| b \(RST-4/)
checkPasses('a cycle of aliases ends the search', () => {
  checkModule(table({ ...clocked, x: {}, rst_n: { isReset: 'lowasync' } }),
    sv(`assign x = rst_n;\nassign rst_n = x;${flop('rst_n')}`))
})
checkThrows('a submodule reset bound to an expression', () => {
  checkModule(table({ ...clocked, rst_n: { direction: 'input', isReset: 'lowasync' } },
    { resetBindings: [{ instance: 'u', port: 'rst_n', binding: 'rst_n & d' }] }), sv(''))
}, /reset u\.rst_n is bound to rst_n & d, an expression \(RST-4/)

// SEQ-6: an interface signal is a signal
checkThrows('a reset to an interface signal', () => {
  checkModule(table({ ...clocked, rst_n: { direction: 'input', isReset: 'lowasync' } }, { interfaces: ['bus'] }),
    sv(`always_ff @(posedge clk or negedge rst_n) begin : q_reg
    if (!rst_n) q <= bus.init;
    else q <= d;
  end`))
}, /q resets to bus, a signal \(SEQ-6/)

// RST-5: every flop has an async reset, unless a waiver names it
const rst5 = /\(RST-5: give every flop an async reset, or waive it with addResetWaiver\)$/
const asyncReset = { ...clocked, rst_n: { direction: 'input', isReset: 'lowasync' as const } }
const unreset = sv(`
  always_ff @(posedge clk) begin : q_reg
    q <= d;
  end`)
const waive = (register: string): Partial<ModuleTable> => ({ resetWaivers: [{ register, reason: 'datapath' }] })
checkThrows('a flop in a block with no reset', () => {
  checkModule(table(asyncReset), unreset)
}, new RegExp(`^Error: m: always_ff @\\(posedge clk\\) begin : q_reg: q has no reset ${rst5.source}`))
checkPasses('a waiver for it', () => { checkModule(table(asyncReset, waive('q')), unreset) })
checkThrows('a flop the reset branch leaves out', () => {
  checkModule(table({ ...asyncReset, p: {} }), sv(`
  always_ff @(posedge clk or negedge rst_n) begin : q_reg
    if (!rst_n) q <= 1'b0;
    else begin
      q <= d;
      p[3:0] <= d;
    end
  end`))
}, new RegExp(`p isn't assigned in the reset branch of rst_n ${rst5.source}`))
checkThrows('a flop reset only by a sync reset', () => {
  checkModule(table({ ...clocked, srst: { direction: 'input', isReset: 'highsync' } }), sv(`
  always_ff @(posedge clk) begin : q_reg
    if (srst) q <= 1'b0;
    else q <= d;
  end`))
}, new RegExp(`q is reset only by srst, a sync reset \\(highsync\\) ${rst5.source}`))
checkPasses('a memory, waived', () => {
  checkModule(table({ ...asyncReset, mem: {}, a: {} }, waive('mem')), sv(`
  always_ff @(posedge clk) begin : mem_write
    mem[a] <= d;
  end`))
})
// An interface member is a flop of its own: resetting bus.a doesn't reset bus.b
const busFlops = sv(`
  always_ff @(posedge clk or negedge rst_n) begin : bus_reg
    if (!rst_n) bus.a <= 1'b0;
    else begin
      bus.a <= d;
      bus.b <= d;
    end
  end`)
checkThrows('an interface member the reset branch leaves out', () => {
  checkModule(table(asyncReset, { interfaces: ['bus'] }), busFlops)
}, /bus\.b isn't assigned in the reset branch of rst_n \(RST-5/)
checkPasses('a waiver for the member', () => {
  checkModule(table(asyncReset, { interfaces: ['bus'], ...waive('bus.b') }), busFlops)
})
checkPasses('a waiver for the interface covers its members', () => {
  checkModule(table(asyncReset, { interfaces: ['bus'], ...waive('bus') }), sv(`
  always_ff @(posedge clk) begin : bus_reg
    bus.a <= d;
    bus.b <= d;
  end`))
})
checkThrows('a waiver for a flop with an async reset', () => {
  checkModule(table(asyncReset, waive('q')), sv(flop('rst_n')))
}, /^Error: m: reset waiver for q names no flop without an async reset \(RST-5: remove the waiver\)$/)
checkThrows('a waiver that names nothing', () => {
  checkModule(table(asyncReset, { resetWaivers: [{ register: 'q', reason: 'datapath' }, { register: 'nothing', reason: 'typo' }] }), unreset)
}, /^Error: m: reset waiver for nothing names no flop without an async reset \(RST-5: remove the waiver\)$/)
checkPasses('a testbench needs no reset', () => {
  checkModule(table(asyncReset, { testbench: true }), unreset)
})
checkThrows('a waiver in a testbench', () => {
  checkModule(table(asyncReset, { testbench: true, ...waive('q') }), unreset)
}, /reset waiver for q, but the module is a testbench, which RST-5 doesn't check \(remove the waiver\)/)
checkPasses('a block local is not a flop', () => {
  checkModule(table(asyncReset), sv(`
  always_ff @(posedge clk or negedge rst_n) begin : q_reg
    automatic logic t;
    t = d;
    if (!rst_n) q <= 1'b0;
    else q <= t;
  end`))
})

// One error lists every violation, each with its block's header
checkThrows('several violations', () => {
  checkModule(table({ ...clocked, rst_n: { direction: 'input', isReset: 'lowasync' } }), sv(`
  always_comb begin : y_comb
    y <= d;
  end
  always_ff @(posedge clk) begin : q_reg
    if (!rst_n) q = 1'b0;
    else q = d;
  end`))
}, /^Error: m: 3 SV-guide violations:\n {2}always_comb begin : y_comb: nonblocking assignment to y \(COMB-3[^\n]*\n {2}always_ff @\(posedge clk\) begin : q_reg: blocking assignment to q \(SEQ-1[^\n]*\n {2}always_ff @\(posedge clk\) begin : q_reg: rst_n is lowasync, but it isn't in the event control/)

if (failures > 0) {
  throw Error(`${failures} moduleCheck check(s) failed`)
}
console.log('moduleCheck: all checks passed')
