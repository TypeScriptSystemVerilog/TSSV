// The example on Module.addResetWaiver(): a small memory with a registered read and no reset port,
// whose memory and read data both go without a reset. Run by `npm run docs:examples`.
import { Module, Expr } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'ResetWaiverExample' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  we: { direction: 'input' },
  addr: { direction: 'input', width: 2 },
  wdata: { direction: 'input', width: 8 },
  rdata: { direction: 'output', width: 8 }
})
m.addSignal('mem', { width: 8, isArray: 4n })
m.addSequentialAlways({ clk: 'clk', outputs: ['mem'] }, `
  begin : mem_write
    if (we) mem[addr] <= wdata;
  end
`)
m.addRegister({ d: new Expr('mem[addr]'), clk: 'clk', q: 'rdata' })
// #region example
// Neither flop has a reset: a memory, and its read data
m.addResetWaiver('mem', 'memory')
m.addResetWaiver('rdata', 'memory read data')
// #endregion example

writeExample('addResetWaiver', m)
