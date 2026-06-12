import { SFIFO } from 'tssv/lib/modules/SFIFO'
import { writeFileSync, mkdirSync } from 'fs'

// ============================================test1=======================================================
console.log('test1')
const test_FIFO_1 = new SFIFO({ dataWidth: 8, depth: 1n })
try {
  mkdirSync(`sv-examples/SFIFO/${test_FIFO_1.name}`, { recursive: true })
  writeFileSync(`sv-examples/SFIFO/${test_FIFO_1.name}/${test_FIFO_1.name}.sv`, test_FIFO_1.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test2=======================================================
console.log('test2')
const test_FIFO_2 = new SFIFO({ dataWidth: 8, depth: 16n })
try {
  mkdirSync(`sv-examples/SFIFO/${test_FIFO_2.name}`, { recursive: true })
  writeFileSync(`sv-examples/SFIFO/${test_FIFO_2.name}/${test_FIFO_2.name}.sv`, test_FIFO_2.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test3=======================================================
console.log('test3')
const test_FIFO_3 = new SFIFO({ dataWidth: 9, depth: 25n, InclAlmostDepth: 'InclAlmostDepth' })
try {
  mkdirSync(`sv-examples/SFIFO/${test_FIFO_3.name}`, { recursive: true })
  writeFileSync(`sv-examples/SFIFO/${test_FIFO_3.name}/${test_FIFO_3.name}.sv`, test_FIFO_3.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test4=======================================================
console.log('test4')
const test_FIFO_4 = new SFIFO({ dataWidth: 9, depth: 25n, InclAlmostDepth: 'InclAlmostDepth', almost_empty_depth: 5n, almost_full_depth: 20n, rw_mode: '1rw' })
try {
  mkdirSync(`sv-examples/SFIFO/${test_FIFO_4.name}`, { recursive: true })
  writeFileSync(`sv-examples/SFIFO/${test_FIFO_4.name}/${test_FIFO_4.name}.sv`, test_FIFO_4.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test5=======================================================
console.log('test5')
const test_FIFO_5 = new SFIFO({ dataWidth: 9, depth: 25n, rw_mode: '1r_1w' })
try {
  mkdirSync(`sv-examples/SFIFO/${test_FIFO_5.name}`, { recursive: true })
  writeFileSync(`sv-examples/SFIFO/${test_FIFO_5.name}/${test_FIFO_5.name}.sv`, test_FIFO_5.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
