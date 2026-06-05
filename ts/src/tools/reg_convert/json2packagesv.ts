import * as fs from 'fs'
import { getCommitId, type RegWoFdsUnfoldRep, type Field, type Register, padZeroes, HEX2BIN } from 'tssv/lib/tools/shared'
import * as path from 'path'

const commitId = getCommitId()
const registersFilePath = process.argv[2]
const outputSvFilePath = process.argv[3]
const outputJsonFilePath = process.argv[4]
const WORD_SIZE = Number(process.argv[5] ?? 32)

if (!registersFilePath || !outputSvFilePath || !outputJsonFilePath) {
  console.error('Please provide the paths for registers JSON file, SV output file, and JSON output file.')
  process.exit(1)
}
const BITS_OF_BYTE = 8
const regs = JSON.parse(fs.readFileSync(registersFilePath, 'utf8')) as Record<string, Register>
const svFile = fs.createWriteStream(outputSvFilePath)
const pkgName = path.basename(outputSvFilePath, path.extname(outputSvFilePath))
svFile.write(`package ${pkgName};

`)
svFile.write('// =============================================================================\n')
svFile.write('// Register bit field definition\n')
svFile.write(`// Commit ID: ${commitId}\n`)
svFile.write('// =============================================================================\n\n')

const regs_wofields: Record<string, RegWoFdsUnfoldRep> = {}
/*
  * Generates a packed SystemVerilog struct for a given register.
  * @param registerName - The name of the register.
  * @param register - The register object containing fields and their properties.
  * @returns A string representing the packed SystemVerilog struct.

function genPackedSV (registerName: string, register: Register): string {
  const fields = register.fields
  let resSV = 'typedef struct packed {\n'
  // 按 bit 从高到低排序
  const sortedFields = Object.entries(fields).sort((a, b) => b[1].bitRange[0] - a[1].bitRange[0])
  let resCount = register.resCount
  let lastBit = WORD_SIZE
  let resetBinStr = ''
  let fieldBinStr = ''
  let reservedBinStr = ''
  const reservedRanges: Array<[number, number]> = []

  lastBit = WORD_SIZE
  sortedFields.forEach(([name, field]) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      resSV += `  logic [${lastBit - msb - 2}:0] res_${resCount--};\n`
      reservedBinStr = '0'.repeat(lastBit - msb - 1)
      resetBinStr += reservedBinStr
    }
    fieldBinStr = padZeroes(Number(field.reset).toString(2), msb - lsb + 1)
    resetBinStr += fieldBinStr
    if (msb === lsb) {
      resSV += `  logic ${name};\n`
    } else {
      resSV += `  logic [${msb - lsb}: 0] ${name};\n`
    }
    lastBit = lsb
  })
  if (lastBit > 0) {
    if (resCount <= 0) {
      throw new Error(`Error in register ${registerName}: Counts of reserved is wrong.`)
    }
    if (lastBit - 1 === 0) {
      resSV += '  logic res_0;\n'
    } else {
      resSV += `  logic [${lastBit - 1}:0] res_${resCount--};\n`
    }
    reservedBinStr = '0'.repeat(lastBit)
    resetBinStr += reservedBinStr
    reservedRanges.push([lastBit - 1, 0]) // 存储最后的 reserved
  }
  resSV += `} ${registerName}_t;\n`
  return resSV
}
  */

function genPackTypeName (registerName: string): string {
  return `${registerName}_t`
}

function genPackedAndCalReset (registerName: string, register: Register): string {
  const packName = genPackTypeName(registerName)
  const fields = register.fields
  let resSV = 'typedef struct packed {\n'
  // 按 bit 从高到低排序
  const sortedFields = Object.entries(fields).sort((a, b) => b[1].bitRange[0] - a[1].bitRange[0])
  let resCount = -1
  let lastBit = WORD_SIZE
  let resetBinStr = ''
  let fieldBinStr = ''
  let reservedBinStr = ''
  const reservedRanges: Array<[number, number]> = []
  sortedFields.forEach(([, field]) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      resCount++
      reservedRanges.push([lastBit - 1, msb + 1]) // 存储 reserved 的 [lsb, msb]
    }
    lastBit = lsb
  })
  if (lastBit > 0) {
    resCount++
  }

  lastBit = WORD_SIZE
  sortedFields.forEach(([name, field]) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      resSV += `  logic [${lastBit - msb - 2}:0] res_${resCount--};\n`
      reservedBinStr = '0'.repeat(lastBit - msb - 1)
      resetBinStr += reservedBinStr
    }
    fieldBinStr = padZeroes(Number(field.reset).toString(2), msb - lsb + 1)
    resetBinStr += fieldBinStr
    if (msb === lsb) {
      resSV += `  logic ${name};\n`
    } else {
      resSV += `  logic [${msb - lsb}: 0] ${name};\n`
    }
    lastBit = lsb
  })
  if (lastBit > 0) {
    if (resCount <= 0) {
      throw new Error(`Error in register ${registerName}: Counts of reserved is wrong.`)
    }
    if (lastBit - 1 === 0) {
      resSV += '  logic res_0;\n'
    } else {
      resSV += `  logic [${lastBit - 1}:0] res_${resCount--};\n`
    }
    reservedBinStr = '0'.repeat(lastBit)
    resetBinStr += reservedBinStr
    reservedRanges.push([lastBit - 1, 0]) // 存储最后的 reserved
  }
  resSV += `} ${packName};\n`
  if (reservedRanges.length > 0) {
    register.reserved = reservedRanges
  }
  if (resetBinStr.length !== WORD_SIZE) {
    throw new Error(`Error in register ${registerName}: Reset binary string length is not equal to WORD_SIZE (${WORD_SIZE}).`)
  } else {
    register.resetBinStr = resetBinStr
  }
  register.reset = `0x${padZeroes(parseInt(resetBinStr, 2).toString(16).toUpperCase(), WORD_SIZE / HEX2BIN)}`
  return resSV
}

function genAllStructsSV (registers: Record<string, Register>): string {
  let result = ''
  for (const [registerName, register] of Object.entries(registers)) {
    result += genPackedAndCalReset(registerName, register)
    result += '\n'
  }
  return result
}

// function unfoldRep (repeat: number): RegWoFdsUnfoldRep {
//   if (repeat && repeat > 1) {
//     for (let i = 0; i < repeat; i++) {
//       // const unfoldRepName = `${key}_${i}`
//       const unfoldRepName = `${key}_${i}`
//       startAddr = `0x${(registerStartAddr + i * WORD_SIZE / BITS_OF_BYTE).toString(16)}`
//       regs_wofields[unfoldRepName] = { startAddr, packName, ...rest }
//     }
//   } else {
//     regs_wofields[key] = { startAddr, packName, ...rest }
//   }
// }

function genRegsRepUnfoldAndWofields (registers: Record<string, Register>): void {
  Object.keys(registers).forEach(key => {
    let { startAddr, repeat, fields, ...rest } = registers[key]
    const registerStartAddr = parseInt(startAddr, 16)
    const packName = genPackTypeName(key)
    if (repeat && repeat > 1) {
      for (let i = 0; i < repeat; i++) {
        // const unfoldRepName = `${key}_${i}`
        const unfoldRepName = `${key}_${i}`
        startAddr = `0x${(registerStartAddr + i * WORD_SIZE / BITS_OF_BYTE).toString(16)}`
        regs_wofields[unfoldRepName] = { startAddr, packName, ...rest }
      }
    } else {
      regs_wofields[key] = { startAddr, packName, ...rest }
    }
  })
}

const structsCode = genAllStructsSV(regs)
genRegsRepUnfoldAndWofields(regs)
svFile.write(structsCode, 'utf8', () => {
  console.log(`Packed Written successfully to ${outputSvFilePath}`)
})
svFile.write(`endpackage : ${pkgName}\n`)
svFile.end()

fs.writeFileSync(outputJsonFilePath, JSON.stringify(regs_wofields, null, 2))
console.log('Updated regs_repunfold_wofields JSON with reset values')
