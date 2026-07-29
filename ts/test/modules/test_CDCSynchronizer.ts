import { CDCSynchronizer } from 'tssv/lib/modules/CDCSynchronizer'
import { writeFileSync, mkdirSync } from 'fs'

function emit (m: CDCSynchronizer): void {
  try {
    mkdirSync(`sv-examples/CDCSynchronizer/${m.name}`, { recursive: true })
    writeFileSync(`sv-examples/CDCSynchronizer/${m.name}/${m.name}.sv`, m.writeSystemVerilog())
  } catch (err) {
    console.error(err)
  }
}

// default 2-stage, 4-bit
console.log('test1')
emit(new CDCSynchronizer({ width: 4 }))

// 3-stage, 8-bit
console.log('test2')
emit(new CDCSynchronizer({ width: 8, stages: 3n }))
