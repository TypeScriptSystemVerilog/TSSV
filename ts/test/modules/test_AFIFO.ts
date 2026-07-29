import { AFIFO } from 'tssv/lib/modules/AFIFO'
import { writeFileSync, mkdirSync } from 'fs'

function emit (m: AFIFO): void {
  try {
    mkdirSync(`sv-examples/AFIFO/${m.name}`, { recursive: true })
    writeFileSync(`sv-examples/AFIFO/${m.name}/${m.name}.sv`, m.writeSystemVerilog())
  } catch (err) {
    console.error(err)
  }
}

// depth 4 (log2depth = 2), 8-bit data
console.log('test1')
emit(new AFIFO({ dataWidth: 8, log2depth: 2n }))

// depth 8 (log2depth = 3), 16-bit data
console.log('test2')
emit(new AFIFO({ dataWidth: 16, log2depth: 3n }))

// with almost-full / almost-empty thresholds
console.log('test3')
emit(new AFIFO({ dataWidth: 8, log2depth: 3n, InclAlmostDepth: true, almost_full_depth: 6n, almost_empty_depth: 2n }))

// 3-stage synchronizers
console.log('test4')
emit(new AFIFO({ dataWidth: 32, log2depth: 4n, syncStages: 3n }))
