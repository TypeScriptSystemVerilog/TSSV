import TSSV from 'tssv/lib/core/TSSV'
import { inspect } from 'util'

export interface AXI4XBarParams extends TSSV.TSSVParameters {
  masters: Array<{
    name: string
    id: [ number, number ]
  }>
  beatBytes: 4 | 16 | 32 | 64 | 128
  addrBits: TSSV.IntRange<16, 64>
  idBits: TSSV.IntRange<1, 32>
  slaves: Array<{
    name: string
    address: {
      base: bigint
      mask: bigint
    }
    transferSizesWrite: [number, number]
    transferSizesRead: [number, number]
  }>
}

export class AXI4XBar extends TSSV.Module {
  declare params: AXI4XBarParams
  constructor (params: AXI4XBarParams) {
    super(params)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' }
    }

    console.log(inspect(params, { depth: null, colors: true }))
  }
}
