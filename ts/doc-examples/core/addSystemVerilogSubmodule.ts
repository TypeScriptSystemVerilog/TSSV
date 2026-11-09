// The example on Module.addSystemVerilogSubmodule(): an existing SV adder, imported as a black box
// with its width parameter set. Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'SVImportExample' }, {
  x: { direction: 'input', width: 16 },
  z: { direction: 'input', width: 16 },
  sum: { direction: 'output', width: 16 }
})
// #region example
// The path starts with $TSSV_ROOT: a relative path throws
m.addSystemVerilogSubmodule('u_add', '$TSSV_ROOT/ts/doc-examples/core/sv/sat_add.sv',
  { W: 16n }, { a: 'x', b: 'z', y: 'sum' }, false, { moduleName: 'sat_add' })
// #endregion example

writeExample('addSystemVerilogSubmodule', m)
