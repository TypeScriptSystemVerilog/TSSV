import { RegisterBlock } from 'tssv/lib/core/Registers'
import { type Register, type RegWoFdsUnfoldRep, type RegisterConstructor, getCommitId } from 'tssv/lib/tools/shared'
import { trimLines, generateVerilogHeader, splitWdataByRes, replaceSignalTypes, outRegField } from 'tssv/lib/tools/verilogProcessor'
import * as fs from 'fs'
const commitId = getCommitId()

const WORD_SIZE = Number(process.argv[5] ?? 32)

function parseRegWoFdsUnfoldRep (regsPath: string): Record<string, RegWoFdsUnfoldRep> {
  return JSON.parse(fs.readFileSync(regsPath, 'utf8')) as Record<string, RegWoFdsUnfoldRep>
}

function parseRegister (regsPath: string): Record<string, Register> {
  return JSON.parse(fs.readFileSync(regsPath, 'utf8')) as Record<string, Register>
}

function createRegisterMap (regs: Record<string, RegWoFdsUnfoldRep>): Record<string, bigint> {
  return Object.entries(regs).reduce<Record<string, bigint>>((acc, [regName, regDetails]) => {
    acc[regName] = BigInt(regDetails.startAddr)
    return acc
  }, {})
}

function createRegConstruts (regs: Record<string, RegWoFdsUnfoldRep>): Record<string, RegisterConstructor> {
  return Object.entries(regs).reduce<Record<string, RegisterConstructor>>((acc, [regName, regData]) => {
    acc[regName] = {
      ...regData,
      reset: BigInt(regData.reset)
    }
    return acc
  }, {})
}

function generateSVerilog (regBlock: RegisterBlock<any>, outSvFilePath: string, regs: Record<string, RegWoFdsUnfoldRep>, regsFieldOut: Record<string, Register>): void {
  const rawVerilog = regBlock.writeSystemVerilog()
  let adjustedVerilog = replaceSignalTypes(rawVerilog, WORD_SIZE, regs)
  adjustedVerilog = splitWdataByRes(adjustedVerilog, WORD_SIZE, regs)
  adjustedVerilog = outRegField(adjustedVerilog, WORD_SIZE, regsFieldOut)
  adjustedVerilog = trimLines(adjustedVerilog)
  const header = generateVerilogHeader(regBlock.name, '3.0', commitId)
  adjustedVerilog = `${header}
${adjustedVerilog} : ${regBlock.name}
`
  fs.writeFileSync(outSvFilePath, adjustedVerilog)
}

function generateVerilog (regBlock: RegisterBlock<any>, outVFilePath: string, regs: Record<string, RegWoFdsUnfoldRep>): void {
  let rawVerilog = regBlock.writeVerilog()
  rawVerilog = trimLines(rawVerilog)
  let adjustedVerilog = splitWdataByRes(rawVerilog, WORD_SIZE, regs)
  const header = generateVerilogHeader(regBlock.name, '3.0', commitId)

  adjustedVerilog = `${header}${adjustedVerilog} : ${regBlock.name}
`
  fs.writeFileSync(outVFilePath, adjustedVerilog)
}

function main (): void {
  const regsPath = process.argv[2]
  const outputSvFilePath = process.argv[3]
  const busAddrW = parseInt(process.argv[4] ?? '32', 10) // Default to 32 if not provided
  const name = outputSvFilePath.split('/').pop()?.replace(/\.sv$/, '') || ''
  const outVFilePath = outputSvFilePath.replace('.sv', '.v')

  const regs = parseRegWoFdsUnfoldRep(regsPath)
  const regsFieldOut = parseRegister(regsPath.replace('_wofld_repUnfold.json', '.json'))
  // console.log(regsFieldOut)
  const myRegMap = createRegisterMap(regs)
  const regConstruts = createRegConstruts(regs)
  const myRegs = {
    wordSize: WORD_SIZE as 32 | 64,
    addrMap: myRegMap,
    registers: regConstruts
  }
  /*
export interface RegisterBlockDef<T extends Record<string, bigint>> {
  wordSize: 32 | 64
  addrMap: T
  baseAddress?: bigint
  registers: { [name in keyof T]?: Register }
}
*/
  if (busAddrW !== 32 && busAddrW !== 12 && busAddrW !== 16) {
    throw new Error('busAddrW must be 32 or 12 or 16 bits')
  }
  const regBlock = new RegisterBlock<typeof myRegs.addrMap>(
    {
      name: name || '',
      busAddressWidth: busAddrW as 12 | 16 | 32
    },
    myRegs,
    {}
  )
  const regBlockV = new RegisterBlock<typeof myRegs.addrMap>(
    {
      name: name || '',
      busAddressWidth: busAddrW as 32
    },
    myRegs,
    {}
  )

  try {
    generateSVerilog(regBlock, outputSvFilePath, regs, regsFieldOut)
    generateVerilog(regBlockV, outVFilePath, regs)
    console.log(`SystemVerilog file generated successfully: ${outputSvFilePath}`)
    console.log(`Verilog file generated successfully: ${outVFilePath}`)
  } catch (err) {
    console.error('Error generating Verilog file:', err)
  }
}

main()
