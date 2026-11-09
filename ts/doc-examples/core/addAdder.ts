// The example on Module.addAdder(): an 8-bit signal plus a literal, into an output of the same
// width. Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'AdderExample' }, {
  count: { direction: 'input', width: 8 },
  next: { direction: 'output', width: 8 }
})
// #region example
// next is narrower than the 9-bit natural width: the sum keeps its low 8 bits, with a warning
m.addAdder({ a: 'count', b: 1n, result: 'next' })
// #endregion example

writeExample('addAdder', m)
