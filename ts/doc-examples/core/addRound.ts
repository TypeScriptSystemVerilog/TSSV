// The example on Module.addRound(): a 16-bit value rounded to 9 bits, half to even.
// Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'RoundExample' }, {
  sum: { direction: 'input', width: 16, isSigned: true },
  rounded: { direction: 'output', width: 9, isSigned: true }
})
// #region example
// rounded has 16 - 8 + 1 bits, enough for every result
m.addRound({ in: 'sum', out: 'rounded', rShift: 8 }, 'rn')
// #endregion example

writeExample('addRound', m)
