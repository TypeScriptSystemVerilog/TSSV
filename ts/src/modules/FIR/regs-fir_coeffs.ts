import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'

/**
 * Register Block: firCoeffs
 *
 * | Register | Address    | Type | Width | Reset | Description            |
 * | -------- | ---------- | ---- | ----- | ----- | ---------------------- |
 * | COEFF_0  | 0x00000000 | RW   | 32    | -1    | FIR tap 0 coefficient  |
 * | COEFF_1  | 0x00000004 | RW   | 32    | 0     | FIR tap 1 coefficient  |
 * | COEFF_2  | 0x00000008 | RW   | 32    | 5     | FIR tap 2 coefficient  |
 * | COEFF_3  | 0x0000000C | RW   | 32    | -6    | FIR tap 3 coefficient  |
 * | COEFF_4  | 0x00000010 | RW   | 32    | -10   | FIR tap 4 coefficient  |
 * | COEFF_5  | 0x00000014 | RW   | 32    | 38    | FIR tap 5 coefficient  |
 * | COEFF_6  | 0x00000018 | RW   | 32    | 77    | FIR tap 6 coefficient  |
 * | COEFF_7  | 0x0000001C | RW   | 32    | 38    | FIR tap 7 coefficient  |
 * | COEFF_8  | 0x00000020 | RW   | 32    | -10   | FIR tap 8 coefficient  |
 * | COEFF_9  | 0x00000024 | RW   | 32    | -6    | FIR tap 9 coefficient  |
 * | COEFF_10 | 0x00000028 | RW   | 32    | 5     | FIR tap 10 coefficient |
 * | COEFF_11 | 0x0000002C | RW   | 32    | 0     | FIR tap 11 coefficient |
 * | COEFF_12 | 0x00000030 | RW   | 32    | -1    | FIR tap 12 coefficient |
 */
export const firCoeffsAddrMap = {
  COEFF_0 : BigInt('0x00000000'),
  COEFF_1 : BigInt('0x00000004'),
  COEFF_2 : BigInt('0x00000008'),
  COEFF_3 : BigInt('0x0000000C'),
  COEFF_4 : BigInt('0x00000010'),
  COEFF_5 : BigInt('0x00000014'),
  COEFF_6 : BigInt('0x00000018'),
  COEFF_7 : BigInt('0x0000001C'),
  COEFF_8 : BigInt('0x00000020'),
  COEFF_9 : BigInt('0x00000024'),
  COEFF_10: BigInt('0x00000028'),
  COEFF_11: BigInt('0x0000002C'),
  COEFF_12: BigInt('0x00000030'),
} as const

export const firCoeffsDef: RegisterBlockDef<typeof firCoeffsAddrMap> = {
  wordSize: 32,
  addrMap: firCoeffsAddrMap,
  registers: {
    COEFF_0: {
      type: 'RW',
      reset: -1n,
      description: 'FIR tap 0 coefficient',
      isSigned: true,
    },
    COEFF_1: {
      type: 'RW',
      reset: 0x00000000n,
      description: 'FIR tap 1 coefficient',
      isSigned: true,
    },
    COEFF_2: {
      type: 'RW',
      reset: 0x00000005n,
      description: 'FIR tap 2 coefficient',
      isSigned: true,
    },
    COEFF_3: {
      type: 'RW',
      reset: -6n,
      description: 'FIR tap 3 coefficient',
      isSigned: true,
    },
    COEFF_4: {
      type: 'RW',
      reset: -10n,
      description: 'FIR tap 4 coefficient',
      isSigned: true,
    },
    COEFF_5: {
      type: 'RW',
      reset: 0x00000026n,
      description: 'FIR tap 5 coefficient',
      isSigned: true,
    },
    COEFF_6: {
      type: 'RW',
      reset: 0x0000004Dn,
      description: 'FIR tap 6 coefficient',
      isSigned: true,
    },
    COEFF_7: {
      type: 'RW',
      reset: 0x00000026n,
      description: 'FIR tap 7 coefficient',
      isSigned: true,
    },
    COEFF_8: {
      type: 'RW',
      reset: -10n,
      description: 'FIR tap 8 coefficient',
      isSigned: true,
    },
    COEFF_9: {
      type: 'RW',
      reset: -6n,
      description: 'FIR tap 9 coefficient',
      isSigned: true,
    },
    COEFF_10: {
      type: 'RW',
      reset: 0x00000005n,
      description: 'FIR tap 10 coefficient',
      isSigned: true,
    },
    COEFF_11: {
      type: 'RW',
      reset: 0x00000000n,
      description: 'FIR tap 11 coefficient',
      isSigned: true,
    },
    COEFF_12: {
      type: 'RW',
      reset: -1n,
      description: 'FIR tap 12 coefficient',
      isSigned: true,
    },
  }
}

export const firCoeffs = new RegisterBlock<typeof firCoeffsAddrMap>(
  { name: 'firCoeffs', busAddressWidth: 32 },
  firCoeffsDef,
  new Memory()
)
