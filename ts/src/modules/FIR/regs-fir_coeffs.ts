import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'

/**
 * Register Block Factory: firCoeffs
 *
 * Generates one register per numTaps. Template (repeated `numTaps` times):
 *
 * | Register  | Address         | Type | Width | Description             |
 * | --------- | --------------- | ---- | ----- | ----------------------- |
 * | COEFF_{i} | 0x0000000 + i*4 | RW   | 32    | FIR tap {i} coefficient |
 *
 * @param numTaps   Number of registers to generate
 * @param resetValues  Optional reset value per register (defaults to 0n)
 */
export function createFirCoeffsDef(numTaps: number, resetValues?: bigint[]) {
  const addrMap: Record<string, bigint> = {}
  const registers: RegisterBlockDef<Record<string, bigint>>['registers'] = {}
  for (let i = 0; i < numTaps; i++) {
    const regName = 'COEFF_' + i
    addrMap[regName] = BigInt(i * 4)
    registers[regName] = {
      type: 'RW',
      isSigned: true,
      width: 32,
      reset: resetValues?.[i] ?? 0n,
      description: 'FIR tap ' + i + ' coefficient'
    }
  }
  return {
    addrMap,
    def: { wordSize: 32 as const, addrMap, registers } as RegisterBlockDef<Record<string, bigint>>
  }
}
