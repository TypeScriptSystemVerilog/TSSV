import { LZC } from 'tssv/lib/modules/LZC'
import { writeFileSync, mkdirSync } from 'fs'

// ============================================test1=======================================================
console.log('test1')
const test_1 = new LZC({ dataWidth: 64 })
try {
  mkdirSync(`sv-examples/LZC/${test_1.name}`, { recursive: true })
  writeFileSync(`sv-examples/LZC/${test_1.name}/${test_1.name}.sv`, test_1.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test2=======================================================
console.log('test2')
const test_2 = new LZC({ dataWidth: 28 })
try {
  mkdirSync(`sv-examples/LZC/${test_2.name}`, { recursive: true })
  writeFileSync(`sv-examples/LZC/${test_2.name}/${test_2.name}.sv`, test_2.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ============================================test3=======================================================
console.log('test3')
const test_3 = new LZC({ dataWidth: 21 })
try {
  mkdirSync(`sv-examples/LZC/${test_3.name}`, { recursive: true })
  writeFileSync(`sv-examples/LZC/${test_3.name}/${test_3.name}.sv`, test_3.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
