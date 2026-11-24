// The examples on Module.activeViews: a harness's check() that records which checks only a
// simulation build has, and the conditions activeViews holds at each level of nesting.
// Run by `npm run docs:examples`.
import { Expr, Module, type ViewCondition } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const CLK = { direction: 'input', isClock: 'posedge' } as const
const RST = { direction: 'input', isReset: 'lowasync' } as const
const BYTE_IN = { direction: 'input', width: 8 } as const
const BYTE_OUT = { direction: 'output', width: 8 } as const
const BIT_OUT = { direction: 'output' } as const

/** Flags a value over a limit, a cycle later */
const check = new Module({ name: 'LimitCheck' }, { clk: CLK, rst_b: RST, value: BYTE_IN, limit: BYTE_IN, fail: BIT_OUT })
check.addSignal('over', {})
check.addAssign({ in: new Expr('value > limit'), out: 'over' })
check.addRegister({ d: 'over', clk: 'clk', reset: 'rst_b', q: 'fail' })

const m = new Module({ name: 'ActiveViewsExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, fail: BIT_OUT, sim_fail: BIT_OUT })
m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
// #region example
// A harness's check() records each check it adds, and whether only a simulation build has it
const checks: Array<{ name: string, simOnly: boolean }> = []
function addCheck (name: string, value: string, limit: bigint, fail: string): void {
  const simOnly = m.activeViews.some(c => 'anyOf' in c && c.anyOf.includes('TSSV_SIM'))
  checks.push({ name, simOnly })
  m.addSubmodule(`u_${name}`, check, { value, limit, fail })
}

addCheck('d_limit', 'd', 200n, 'fail')
m.views({
  TSSV_SIM: () => { addCheck('q_limit', 'q', 100n, 'sim_fail') },
  default: () => { m.addAssign({ in: new Expr("1'b0"), out: 'sim_fail' }) }
})
// checks: [{ name: 'd_limit', simOnly: false }, { name: 'q_limit', simOnly: true }]
// #endregion example
const wantChecks = [{ name: 'd_limit', simOnly: false }, { name: 'q_limit', simOnly: true }]
if (JSON.stringify(checks) !== JSON.stringify(wantChecks)) throw Error(`activeViews example: checks are ${JSON.stringify(checks)}`)
writeExample('activeViews', m)

const n = new Module({ name: 'ActiveViewsNestedExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
// #region values
const seen: Record<string, readonly ViewCondition[]> = {}
seen.top = n.activeViews
n.addSignal('d_q', { width: 8 })
n.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'd_q' })
n.views({
  TSSV_XILINX: () => {
    n.addSignal('x_q', { width: 8 })
    n.addRegister({ d: 'd_q', clk: 'clk', reset: 'rst_b', q: 'x_q' })
    n.views({
      TSSV_ULTRASCALE: () => {
        seen.ultrascale = n.activeViews
        n.addRegister({ d: 'x_q', clk: 'clk', reset: 'rst_b', q: 'q' })
      },
      default: () => {
        seen.otherXilinx = n.activeViews
        n.addAssign({ in: new Expr('x_q'), out: 'q' })
      }
    })
  },
  default: () => {
    seen.generic = n.activeViews
    n.addAssign({ in: new Expr('d_q'), out: 'q' })
  }
})
// seen.top:         []
// seen.ultrascale:  [{ anyOf: ['TSSV_XILINX'] }, { anyOf: ['TSSV_ULTRASCALE'] }]
// seen.otherXilinx: [{ anyOf: ['TSSV_XILINX'] }, { noneOf: ['TSSV_ULTRASCALE'] }]
// seen.generic:     [{ noneOf: ['TSSV_XILINX'] }]
// #endregion values
const wantSeen = {
  top: [],
  ultrascale: [{ anyOf: ['TSSV_XILINX'] }, { anyOf: ['TSSV_ULTRASCALE'] }],
  otherXilinx: [{ anyOf: ['TSSV_XILINX'] }, { noneOf: ['TSSV_ULTRASCALE'] }],
  generic: [{ noneOf: ['TSSV_XILINX'] }]
}
if (JSON.stringify(seen) !== JSON.stringify(wantSeen)) throw Error(`activeViews example: seen is ${JSON.stringify(seen)}`)
writeExample('activeViews', n)
