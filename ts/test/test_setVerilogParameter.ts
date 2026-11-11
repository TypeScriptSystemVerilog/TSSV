import assert from 'node:assert/strict'
import { Module, type TSSVParameters } from 'tssv/lib/core/TSSV'
import { moduleSV } from 'tssv/test/models/emitted'

// Regression for #85: existence and supported type are independent of truthiness.
for (const value of [0, 0n, '', 4, 4n, 'text']) {
  const m = new Module({ name: 'parameter_value', P: value })
  assert.doesNotThrow(() => { m.setVerilogParameter('P') })
}

const missing = new Module({ name: 'missing_parameter' })
assert.throws(() => { missing.setVerilogParameter('P') }, /^Error: P does not exist!$/)
assert.throws(() => { missing.setVerilogParameter('toString') }, /^Error: toString does not exist!$/)

for (const value of [false, true, undefined, null, [], {}, () => 0]) {
  // Include values supplied by JavaScript callers as well as typed TS callers.
  const params = { name: 'unsupported_parameter', P: value } as unknown as TSSVParameters
  const m = new Module(params)
  assert.throws(() => { m.setVerilogParameter('P') },
    /^Error: unsupported type of parameter P in setVerilogParameter\(\)$/)
}

const parent = new Module({ name: 'zero_parameter_import' })
parent.addSystemVerilogSubmodule('u_leaf', '$TSSV_ROOT/ts/test/importParse/parameter_zero.sv',
  { P: 0 }, {}, false, { moduleName: 'parameter_zero' })
assert.match(moduleSV(parent).replace(/\s+/g, ''), /parameter_zero#\(\.P\(0\)\)u_leaf\(/)

console.log('setVerilogParameter: PASS')
