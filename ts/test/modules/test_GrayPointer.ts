import { GrayPointer } from 'tssv/lib/modules/GrayPointer'
import { writeFileSync, mkdirSync } from 'fs'

function emit (m: GrayPointer): void {
  try {
    mkdirSync(`sv-examples/GrayPointer/${m.name}`, { recursive: true })
    writeFileSync(`sv-examples/GrayPointer/${m.name}/${m.name}.sv`, m.writeSystemVerilog())
  } catch (err) {
    console.error(err)
  }
}

// depth 8 (log2depth = 3), default 2 sync stages
console.log('test1')
emit(new GrayPointer({ log2depth: 3n }))

// depth 16 (log2depth = 4), 3 sync stages
console.log('test2')
emit(new GrayPointer({ log2depth: 4n, syncStages: 3n }))
