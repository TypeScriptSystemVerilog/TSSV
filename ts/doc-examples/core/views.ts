// The examples on Module.views(): a check's fail tied to 0 in every build but simulation, a
// group with no default, a view nested in another, a constant two scopes bind, and the include
// lines of files reached through views. Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const CLK = { direction: 'input', isClock: 'posedge' } as const
const RST = { direction: 'input', isReset: 'lowasync' } as const
const BYTE_IN = { direction: 'input', width: 8 } as const
const BYTE_OUT = { direction: 'output', width: 8 } as const
const BIT_OUT = { direction: 'output' } as const

/** Flags a value over a limit, a cycle later: the kind of check #232 keeps out of synthesis */
const check = new Module({ name: 'LimitCheck' }, { clk: CLK, rst_b: RST, value: BYTE_IN, limit: BYTE_IN, fail: BIT_OUT })
check.addSignal('over', {})
check.addAssign({ in: new Expr('value > limit'), out: 'over' })
check.addRegister({ d: 'over', clk: 'clk', reset: 'rst_b', q: 'fail' })

/** Reports a value of 255 when it is clocked: a check with no output, for simulation */
const monitor = new Module({ name: 'SaturationMonitor' }, { clk: CLK, value: BYTE_IN })
monitor.addBody(`
    always_ff @(posedge clk)
      if (value == 8'hff) $error("value saturated");
`)

const m = new Module({ name: 'ViewsExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, fail: BIT_OUT })
m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
// #region example
// check is a LimitCheck, with ports clk, rst_b, value, limit and fail. A simulation build
// drives fail from it; every other build ties fail to 0
m.views({
  TSSV_SIM: () => {
    m.addSubmodule('u_chk', check, { value: 'q', limit: 200n, fail: 'fail' })
  },
  default: () => {
    m.addAssign({ in: new Expr("1'b0"), out: 'fail' })
  }
})
// #endregion example
writeExample('views', m)

const noDefault = new Module({ name: 'ViewsNoDefaultExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
noDefault.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
// #region no-default
// A simulation build compiles a monitor, a formal build an assertion, any other build neither
noDefault.views({
  TSSV_SIM: () => {
    noDefault.addSubmodule('u_mon', monitor, { value: 'q' })
  },
  TSSV_FPV: () => {
    noDefault.addBody("assert property (@(posedge clk) q != 8'hff);")
  }
})
// #endregion no-default
writeExample('views', noDefault)

const nested = new Module({ name: 'NestedViewsExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
// #region nested
// Every build registers d. A Xilinx build registers it again, and an UltraScale part, one of
// Xilinx's, a third time
nested.addSignal('d_q', { width: 8 })
nested.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'd_q' })
nested.views({
  TSSV_XILINX: () => {
    nested.addSignal('x_q', { width: 8 })
    nested.addRegister({ d: 'd_q', clk: 'clk', reset: 'rst_b', q: 'x_q' })
    nested.views({
      TSSV_ULTRASCALE: () => {
        nested.addRegister({ d: 'x_q', clk: 'clk', reset: 'rst_b', q: 'q' })
      },
      default: () => {
        nested.addAssign({ in: new Expr('x_q'), out: 'q' })
      }
    })
  },
  default: () => {
    nested.addAssign({ in: new Expr('d_q'), out: 'q' })
  }
})
// #endregion nested
writeExample('views', nested)

const shared = new Module({ name: 'SharedConstantExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, fail: BIT_OUT, sim_fail: BIT_OUT })
shared.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
// #region shared-constant
// A bigint binding declares a constant, const_w8u200. The view binds 200 first, so the
// constant is declared in the view. Then the top level binds 200 too, and the constant
// moves out to the top level, where the view can still see it
shared.views({
  TSSV_SIM: () => {
    shared.addSubmodule('u_sim_chk', check, { value: 'q', limit: 200n, fail: 'sim_fail' })
  },
  default: () => {
    shared.addAssign({ in: new Expr("1'b0"), out: 'sim_fail' })
  }
})
shared.addSubmodule('u_chk', check, { value: 'd', limit: 200n, fail: 'fail' })
// #endregion shared-constant
writeExample('views', shared)

const sibling = new Module({ name: 'SiblingConstantExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, fail: BIT_OUT, vendor_fail: BIT_OUT })
sibling.addSubmodule('u_chk', check, { value: 'd', limit: 100n, fail: 'fail' })
// #region sibling-constant
// Two views beside each other bind 50. Each gets its own constant: const_w8u50 and
// const_w8u50_v2
sibling.views({
  TSSV_XILINX: () => {
    sibling.addSubmodule('u_x_chk', check, { value: 'd', limit: 50n, fail: 'vendor_fail' })
  },
  TSSV_ALTERA: () => {
    sibling.addSubmodule('u_a_chk', check, { value: 'd', limit: 50n, fail: 'vendor_fail' })
  },
  default: () => {
    sibling.addAssign({ in: new Expr("1'b0"), out: 'vendor_fail' })
  }
})
// #endregion sibling-constant
writeExample('views', sibling)

const inc = new Module({ name: 'ViewIncludesExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, fail: BIT_OUT })
inc.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
// #region includes
// LimitCheck is used at the top level and in TSSV_SIM; SaturationMonitor in TSSV_SIM and in
// TSSV_FPV, and nowhere else
inc.addSubmodule('u_chk', check, { value: 'd', limit: 200n, fail: 'fail' })
inc.inView(['TSSV_SIM'], () => {
  inc.addSignal('q_fail', {})
  inc.addSubmodule('u_q_chk', check, { value: 'q', limit: 200n, fail: 'q_fail' })
  inc.addBody('always_ff @(posedge clk) if (q_fail) $error("q over 200");')
  inc.addSubmodule('u_mon', monitor, { value: 'q' })
})
inc.inView(['TSSV_FPV'], () => {
  inc.addSubmodule('u_fpv_mon', monitor, { value: 'q' })
})
// #endregion includes
writeExample('views', inc)
