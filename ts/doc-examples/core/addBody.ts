// The example on Module.addBody(): a parity function in raw SV, and an assign that calls it.
// Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'BodyExample' }, {
  data: { direction: 'input', width: 8 },
  parity: { direction: 'output' }
})
// #region example
// The template literal's own indentation is stripped, and the text re-indented
m.addBody(`
    function automatic logic parity_of(input logic [7:0] d);
      return ^d;
    endfunction

    assign parity = parity_of(data);
`)
// #endregion example

writeExample('addBody', m)
