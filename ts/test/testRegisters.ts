import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { Module } from 'tssv/lib/core/TSSV'
import { TL_UL } from 'tssv/lib/interfaces/TL_UL'
import { writeFileSync } from 'fs'

const myRegMap = {
  REG0: BigInt('0x00000000'),
  REG1: BigInt('0x00000004'),
  MEM0: BigInt('0x00000020'),
  MEM1: BigInt('0x00000040')
} as const

const myRegs: RegisterBlockDef<typeof myRegMap> = {
  wordSize: 32,
  addrMap: myRegMap,
  registers: {
    REG0: {
      type: 'RW',
      reset: 0n,
      description: 'Register 0'
    },
    REG1: {
      type: 'RO',
      reset: 1n,
      description: 'Register 1'
    },
    MEM0: {
      type: 'RAM',
      size: 8n
    },
    MEM1: {
      type: 'RAM',
      size: 8n
    }
  }
}

console.log(myRegs)

const testRegBlock = new RegisterBlock<typeof myRegMap>(
  {
    name: 'testRegBlock'
  },
  myRegs)

const tb_testRegBlock = new Module({name: 'tb_testRegBlock'})
tb_testRegBlock.addSignal('clk', { isClock: 'posedge'})
tb_testRegBlock.addSignal('rst_b', { isReset: 'lowasync'})
tb_testRegBlock.addInterface('regs', new TL_UL())
tb_testRegBlock.addSubmodule(
  'dut',
  testRegBlock,
  {},
  true
)

try {
  writeFileSync('sv-examples/tb_testRegBlock.sv', tb_testRegBlock.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
