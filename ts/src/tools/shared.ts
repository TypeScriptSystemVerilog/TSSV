import { type IntRange } from 'tssv/lib/core/TSSV'
import { execSync } from 'child_process'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const HEX2BIN = 4

// shared project version control functions
const __dirname = dirname(fileURLToPath(import.meta.url))
export const getCommitId = () => {
  try {
    const tssvDir = __dirname
    return execSync('git rev-parse HEAD', { cwd: tssvDir }).toString().trim()
  } catch (err) {
    if (err instanceof Error) {
      console.error('Failed to get Git commit ID:', err.message)
      return 'unknown_commit'
    } else {
      console.error('Unknown error:', err)
    }
  }
}

// AIGCStr definition
export const AIGCStr = `
begin
  reg_wr = psel && penable && pwrite;
  reg_rd = psel && !penable && !pwrite;
  reg_addr = paddr;
  reg_wdata = pwdata;
  prdata = reg_rdata;
  
  pready = 1'b1;
end
`

// AIGC2APB4 mapping
export const AIGC2APB4 = {
  psel: 'regs.PSELx',
  penable: 'regs.PENABLE',
  pwrite: 'regs.PWRITE',
  paddr: 'regs.PADDR',
  pwdata: 'regs.PWDATA',
  prdata: 'regs.PRDATA',
  pready: 'regs.PREADY',
  pslverr: 'regs.PSLVERR'
}

export class Casex {
  private readonly casexStr: string
  constructor (casexStrOrCond: string, readSignal?: string, readyStr?: string) {
    if (readSignal !== undefined && readyStr !== undefined) {
      this.casexStr = `     ${casexStrOrCond}: begin
            regs.DATA_RD <= ${readSignal};
            regs.READY <= 1'b1;
        end\n`
    } else {
      this.casexStr = casexStrOrCond
    }
  }

  toString (): string {
    return this.casexStr
  }
}

// ... existing code
// Shared interfaces
export interface Field {
  bitRange: [IntRange<0, 63>, IntRange<0, 63>]
  reset?: bigint
  fieldDescription?: string
  isSigned?: boolean
}

export type RegisterType = 'RO' | 'RW' | 'WO' | 'RAM' | 'ROM' | 'W1C' | 'W1T' | 'W0C' | 'W0T' | 'RWU' | string

// interface Register {
//   type: RegisterType
//   reset?: bigint
//   description?: string
//   size?: bigint
//   width?: IntRange<1, 64>
//   isSigned?: boolean
//   fields?: Record<string, Field>
//   repeat?: number
//   hardUpdate?: number

// }

/* JSON.stringify does not support bigint, so we need to convert it to string */
interface BaseRegister {
  startAddr: string
  type: RegisterType
  description?: string
  reset: string
  resetBinStr?: string
  reserved?: Array<[number, number]>
  weOut?: boolean
  useBuf?: boolean
  fieldOut?: boolean
}

export interface Register extends BaseRegister {
  fields: Record<string, Field>
  repeat?: number
  hardUpdate?: number
  resCount?: number
}

export interface RegisterConstructor {
  type: RegisterType
  reset: bigint
  description?: string
  weOut?: boolean
  useBuf?: boolean
  fieldOut?: boolean
}

export interface RegWoFdsUnfoldRep extends BaseRegister {
  packName?: string
}

export interface Origination {
  module: string
  width: number
  depth: bigint
  type: string
  number: number
  adr_mask?: string
  en_ptn?: string
}

export interface OriginationUnfold extends Origination {
  instName: string
  bitBig: number
}

export interface SramConfig {
  name: string
  output_dir: string
  sram_type: string
  suffix: string
  muxBankCd: string
  width: number
  depth: bigint
  split_direction: 'depth' | 'width'
  origination: Origination[]
  originationUnfold: OriginationUnfold[]
}

// Shared functions
export function parseBitRange (bitRange: string): [number, number] {
  if (bitRange.includes(':')) {
    const parts = bitRange.split(':').map(part => parseInt(part.trim(), 10))
    if (parts[0] < parts[1]) {
      parts.reverse() // Ensure the first part is always greater than the second
    }
    return [parts[0], parts[1]]
  } else {
    const singleValue = parseInt(bitRange.trim(), 10)
    return [singleValue, singleValue]
  }
}
export function replaceZerosWithX (binaryStr: string): string {
  // Replace all '0's with 'X's
  let modifiedStr = binaryStr.replace(/0/g, 'X')

  // Check if there is no '1' in the string
  if (!modifiedStr.includes('1')) {
    modifiedStr += 'X'
  }

  return modifiedStr
}

export function padZeroes (value: string, width: number): string {
  return value.padStart(width, '0')
}

export function padZeroesRight (address: string, width: number): string {
  const padLength = width - address.length
  if (padLength <= 0) return address
  return address + '0'.repeat(padLength)
}

export function generateAPBStr (AIGCStr: string, mappings: Record<string, string> | undefined = {}): string {
  if (mappings === undefined) {
    return AIGCStr
  } else {
    let APBStr = AIGCStr
    for (const [key, value] of Object.entries(mappings)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g')
      APBStr = APBStr.replace(regex, value)
    }
    return APBStr
  }
}

export function calculateDecMask (size?: bigint): string {
  if (size === undefined) return '0'
  const sizeBits = size.toString(2).length
  return `${sizeBits}'b${'1'.repeat(sizeBits / 2).padEnd(sizeBits, '0')}`
}

export function calculatePassMask (size?: bigint): string {
  if (size === undefined) return '0'
  const sizeBits = size.toString(2).length
  return `${sizeBits}'b${'0'.repeat(sizeBits / 2).padEnd(sizeBits, '1')}`
}
