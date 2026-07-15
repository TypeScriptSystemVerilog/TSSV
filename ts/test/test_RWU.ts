import { RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { mkdirSync, writeFileSync } from 'fs'

// HW priority (default): hw_update wins when both assert in the same cycle
const regsHwPriority = {
  wordSize: 32 as const,
  addrMap: {
    ctrl:   0x0n,
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
    ctrl:   0x0n,
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

mkdirSync('sv-examples/test_RWU', { recursive: true })

const blockHw = new RegisterBlock(
  { name: 'status_block_hw_priority', busAddressWidth: 32 },
  regsHwPriority,
  new Memory()
)
writeFileSync('sv-examples/test_RWU/status_block_hw_priority.sv', blockHw.writeSystemVerilog())
console.log('wrote sv-examples/test_RWU/status_block_hw_priority.sv')

const blockSw = new RegisterBlock(
  { name: 'status_block_sw_priority', busAddressWidth: 32 },
  regsSwPriority,
  new Memory()
)
writeFileSync('sv-examples/test_RWU/status_block_sw_priority.sv', blockSw.writeSystemVerilog())
console.log('wrote sv-examples/test_RWU/status_block_sw_priority.sv')
