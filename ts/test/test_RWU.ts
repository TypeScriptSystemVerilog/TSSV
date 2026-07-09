import { RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { mkdirSync, writeFileSync } from 'fs'

const regs = {
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
      description: 'Hardware-updated status; software can also write (e.g. to clear)'
    }
  }
}

const block = new RegisterBlock(
  { name: 'status_block', busAddressWidth: 32 },
  regs,
  new Memory()
)

mkdirSync('sv-examples/test_RWU', { recursive: true })
writeFileSync('sv-examples/test_RWU/status_block.sv', block.writeSystemVerilog())
console.log('wrote sv-examples/test_RWU/status_block.sv')
