import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { Module } from 'tssv/lib/core/TSSV'
import { writeFileSync } from 'fs'
import { inspect } from 'util'
import diff from 'deep-diff'

const myRegMap = {
  REG0: BigInt('0x00000000'),
  REG1: BigInt('0x00000004'),
  REG2: BigInt('0x00000008'),
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
      description: 'Register 1',
      width: 16,
      isSigned: true
    },
    REG2: {
      type: 'RW',
      description: 'Register 2',
      fields: {
        REG2_field0: {
          bitRange: [15, 0],
          reset: BigInt('0x10')
        },
        REG2_field1: {
          bitRange: [31, 16],
          reset: BigInt('0x20')
        }
      }
    },
    MEM0: {
      type: 'RAM',
      size: 8n
    },
    MEM1: {
      type: 'ROM',
      size: 8n
    }
  }
}

console.log(inspect(myRegs, { depth: null, colors: true }))
const serialized = JSON.stringify(myRegs, function (key, value) {
  if (typeof value === 'bigint') {
    return `0x${value.toString(16)}n`
  }
  return value
}, 2)
console.log(serialized)

const revived = JSON.parse(serialized, (key, value) => {
  const hexPattern = /^0x[0-9a-fA-F]+n$/
  if (typeof value === 'string' && hexPattern.test(value)) {
    return BigInt(value.slice(0, -1))
  }
  return value
})

console.log(inspect(revived, { depth: null, colors: true }))

const differences = diff.diff(myRegs, revived)
if (!differences) {
  console.log('There are no differences.')
} else {
  console.log(differences)
}

const testRegBlock = new RegisterBlock<typeof myRegs.addrMap>(
  {
    name: 'testRegBlock'
  },
  myRegs)

const tb_testRegBlock = new Module({ name: 'tb_testRegBlock' })
tb_testRegBlock.addSubmodule(
  'dut',
  testRegBlock,
  {},
  true,
  true
)

try {
  writeFileSync('sv-examples/tb_testRegBlock.sv', tb_testRegBlock.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
