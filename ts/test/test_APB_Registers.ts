import { type RegisterBlockDef, RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import { mkdirSync } from 'fs'
import { writeLintWrapped } from 'tssv/test/models/lintWrapper'

const GENERATOR = 'ts/test/test_APB_Registers.ts'

const apbRegMap = {
  CTRL: BigInt('0x00000000'),
  STATUS: BigInt('0x00000004'),
  DATA: BigInt('0x00000008')
} as const

const apbRegs: RegisterBlockDef<typeof apbRegMap> = {
  wordSize: 32,
  addrMap: apbRegMap,
  registers: {
    CTRL: {
      type: RegisterType.RW,
      reset: 0n,
      description: 'Control register'
    },
    STATUS: {
      type: RegisterType.RO,
      reset: 0n,
      description: 'Status register (read-only)'
    },
    DATA: {
      type: RegisterType.RW,
      reset: 0n,
      description: 'Data register'
    }
  }
}

const apbRegBlock = new RegisterBlock<typeof apbRegMap>(
  {
    name: 'apb_reg_block',
    busAddressWidth: 32
  },
  apbRegs,
  new APB4({ DATA_WIDTH: 32, ADDR_WIDTH: 32 })
)

// The block is linted through a wrapper that brings its APB port out to ports of its own. A
// testbench that runs an APB RegisterBlock and checks it is verilatorTB/tb_APB_to_Memory.sv
// (`make -C verilatorTB apb_to_memory_sim`).
const outDir = 'sv-examples/test_APB_Registers_output'
mkdirSync(outDir, { recursive: true })

try {
  writeLintWrapped(apbRegBlock, outDir, GENERATOR)
  console.log(`Generated ${outDir}/${apbRegBlock.name}.sv and ${apbRegBlock.name}_lint_top.sv`)
} catch (err) {
  console.error(err)
}
