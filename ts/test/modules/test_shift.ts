import { shift } from 'tssv/lib/modules/shift'
import { writeFileSync } from 'fs'

// ============================================test1=======================================================
console.log('test1')
const test_1 = new shift({ dataWidth: 16, shift_val: 5 })
try {
  writeFileSync(`sv-examples/test_shift_output/${test_1.name}.sv`, test_1.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test2=======================================================
console.log('test2')
const test_2 = new shift({ dataWidth: 16, shift_direct: 'left', shift_val: 5 })
try {
  writeFileSync(`sv-examples/test_shift_output/${test_2.name}.sv`, test_2.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test3=======================================================
console.log('test3')
const test_3 = new shift({ dataWidth: 5, shift_direct: 'right', shift_val: 3 })
try {
  writeFileSync(`sv-examples/test_shift_output/${test_3.name}.sv`, test_3.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test4=======================================================
console.log('test4')
const test_4 = new shift({ dataWidth: 16, shift_val: 5, shift_direct: 'right', isSigned: 'signed' })
try {
  writeFileSync(`sv-examples/test_shift_output/${test_4.name}.sv`, test_4.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
