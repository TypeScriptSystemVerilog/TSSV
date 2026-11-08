// The example on Module.addSaturate(): a signed 12-bit value clamped to 8 bits.
// Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'SaturateExample' }, {
  wide: { direction: 'input', width: 12, isSigned: true },
  narrow: { direction: 'output', width: 8, isSigned: true }
})
// #region example
m.addSaturate({ in: 'wide', out: 'narrow' })
// #endregion example

writeExample('addSaturate', m)
