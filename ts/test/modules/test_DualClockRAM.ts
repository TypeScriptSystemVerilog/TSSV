import { DualClockRAM } from 'tssv/lib/modules/DualClockRAM'
import { writeFileSync, mkdirSync } from 'fs'

function emit (m: DualClockRAM): void {
  try {
    mkdirSync(`sv-examples/DualClockRAM/${m.name}`, { recursive: true })
    writeFileSync(`sv-examples/DualClockRAM/${m.name}/${m.name}.sv`, m.writeSystemVerilog())
  } catch (err) {
    console.error(err)
  }
}

console.log('test1')
emit(new DualClockRAM({ dataWidth: 8, depth: 8n }))

console.log('test2')
emit(new DualClockRAM({ dataWidth: 32, depth: 16n }))
