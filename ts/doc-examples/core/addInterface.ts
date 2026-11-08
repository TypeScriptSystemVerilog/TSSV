// The example on Module.addInterface(): a Memory bus port, seen from the responder's side.
// Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'InterfaceExample' }, {
  addr: { direction: 'output', width: 32 }
})
// #region example
// With a role ('inward'), the instance is a port of the module
m.addInterface('regs', new Memory({ DATA_WIDTH: 32, ADDR_WIDTH: 32 }, 'inward'))
// Logic names a member as <instance>.<SIGNAL>
m.addAssign({ in: new Expr('regs.ADDR'), out: 'addr' })
// #endregion example

writeExample('addInterface', m)
