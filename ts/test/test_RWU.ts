import { RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { mkdirSync } from 'fs'
import { writeLintWrapped } from 'tssv/test/models/lintWrapper'

const OUT_DIR = 'sv-examples/test_RWU'
const GENERATOR = 'ts/test/test_RWU.ts'

// HW priority (default): hw_update wins when both assert in the same cycle
const regsHwPriority = {
  wordSize: 32 as const,
  addrMap: {
    ctrl: 0x0n,
    status: 0x4n
  },
  registers: {
    ctrl: {
      type: RegisterType.RW,
      width: 32 as const,
      reset: 0n,
      description: 'Software-controlled configuration register'
    },
    status: {
      type: RegisterType.RWU,
      width: 32 as const,
      reset: 0n,
      description: 'Hardware-updated status; SW can also write (e.g. to clear). HW wins on conflict.'
    }
  }
}

// SW priority: software write wins when both assert in the same cycle
const regsSwPriority = {
  wordSize: 32 as const,
  addrMap: {
    ctrl: 0x0n,
    status: 0x4n
  },
  registers: {
    ctrl: {
      type: RegisterType.RW,
      width: 32 as const,
      reset: 0n,
      description: 'Software-controlled configuration register'
    },
    status: {
      type: RegisterType.RWU,
      width: 32 as const,
      reset: 0n,
      updatePriority: 'sw' as const,
      description: 'Hardware-updated status; SW can also write (e.g. to clear). SW wins on conflict.'
    }
  }
}

mkdirSync(OUT_DIR, { recursive: true })

// Writes a block's SV, its Memory interface's, and a wrapper that instantiates the interface port
// to lint it through
function write (block: RegisterBlock<Record<string, bigint>>): void {
  writeLintWrapped(block, OUT_DIR, GENERATOR)
  console.log(`wrote ${OUT_DIR}/${block.name}.sv and ${block.name}_lint_top.sv`)
}

const blockHw = new RegisterBlock(
  { name: 'status_block_hw_priority', busAddressWidth: 32 },
  regsHwPriority,
  new Memory()
)
write(blockHw)

const blockSw = new RegisterBlock(
  { name: 'status_block_sw_priority', busAddressWidth: 32 },
  regsSwPriority,
  new Memory()
)
write(blockSw)
