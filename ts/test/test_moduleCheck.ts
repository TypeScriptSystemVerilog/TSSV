import { type ModuleTable, checkModule } from 'tssv/lib/core/ModuleCheck'

// Unit test of the SV-guide checks emission runs on each module (issue #166), for
// cases a module built with the builders can't easily reach: resets wired through interfaces and
// chains, a cycle of assignments, and an error that lists several violations.
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
  name: 'm', signals, interfaces: [], resetBindings: [], ...extra
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
