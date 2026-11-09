// The example on Module.addLatchAlways(): a latch, transparent while en is high.
// Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'LatchAlwaysExample' }, {
  en: { direction: 'input' },
  d: { direction: 'input', width: 8 },
  q: { direction: 'output', width: 8 }
})
// #region example
m.addLatchAlways({ outputs: ['q'] }, `
  begin : hold
    if (en) q = d;
  end
`)
// #endregion example

writeExample('addLatchAlways', m)
