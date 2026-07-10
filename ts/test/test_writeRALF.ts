import { type RegisterBlockDef, RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { writeFileSync, mkdirSync } from 'fs'

interface MyRegs extends Record<string, bigint> {
  UNIT_ID: bigint
  CTRL: bigint
  STATUS: bigint
  WO_REG: bigint
}

const regDefs: RegisterBlockDef<MyRegs> = {
  wordSize: 32,
  addrMap: {
    UNIT_ID: 0x0n,
    CTRL: 0x4n,
    STATUS: 0x8n,
    WO_REG: 0xCn
  },
  registers: {
    UNIT_ID: {
      type: RegisterType.RO,
      reset: 0x1n,
      fields: {
        ID: { bitRange: [31, 0], reset: 0x1n }
      }
    },
    CTRL: {
      type: RegisterType.RW,
      fields: {
        enable: { bitRange: [0, 0], reset: 0x0n },
        mode: { bitRange: [2, 1], reset: 0x0n },
        divisor: { bitRange: [15, 8], reset: 0x1n }
      }
    },
    STATUS: {
      type: RegisterType.RO,
      reset: 0x0n
    },
    WO_REG: {
      type: RegisterType.WO,
      reset: 0x0n,
      fields: {
        cmd: { bitRange: [7, 0], reset: 0x0n }
      }
    }
  }
}

const block = new RegisterBlock<MyRegs>(
  { name: 'MyRegBlock', busAddressWidth: 32 },
  regDefs,
  new Memory({ DATA_WIDTH: 32, ADDR_WIDTH: 32 })
)

const ralf = block.writeRALF()
console.log(ralf)

mkdirSync('sv-examples/test_writeRALF', { recursive: true })
writeFileSync('sv-examples/test_writeRALF/MyRegBlock.ralf', ralf)
console.log('wrote sv-examples/test_writeRALF/MyRegBlock.ralf')
