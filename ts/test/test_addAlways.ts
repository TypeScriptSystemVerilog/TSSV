import { addAlways } from 'tssv/test/addAlwaysModule'
import { mkdirSync } from 'fs'

const my_addAlways_test = new addAlways({ name: 'comb_seq_test', data_Width: 5 })
mkdirSync('sv-examples/Core/addAlways', { recursive: true })
try {
  my_addAlways_test.writeSystemVerilogFiles('sv-examples/Core/addAlways')
} catch (err) {
  console.error(err)
}
