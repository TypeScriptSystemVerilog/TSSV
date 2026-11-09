// The example on Module.addSequentialAlways(): a 4-bit counter with an active-low asynchronous
// reset. Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'SequentialAlwaysExample' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_b: { direction: 'input', isReset: 'lowasync' },
  count: { direction: 'output', width: 4 }
})
// #region example
// The builder writes the header, always_ff @(posedge clk or negedge rst_b)
m.addSequentialAlways({ clk: 'clk', reset: 'rst_b', outputs: ['count'] }, `
  begin : count_up
    if (!rst_b) count <= '0;
    else        count <= count + 4'd1;
  end
`)
// #endregion example

writeExample('addSequentialAlways', m)
