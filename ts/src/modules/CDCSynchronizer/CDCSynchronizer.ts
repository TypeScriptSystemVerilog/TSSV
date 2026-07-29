/*
 * CDCSynchronizer
 *
 * Generic N-bit, multi-stage flip-flop synchronizer for safely moving a value
 * from a source clock domain into a destination clock domain. Intended for
 * Gray-coded (single-bit-change) buses, where any bit sampled mid-transition
 * resolves to either the old or new value and never a corrupt intermediate.
 *
 * The value is registered `stages` deep in the destination domain (clk/rst_n).
 * A minimum of 2 stages is required to resolve metastability.
 */
import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'

export interface CDCSynchronizer_Parameters extends TSSVParameters {
  /**
   * bit width of the synchronized bus
   */
  width: IntRange<1, 256>
  /**
   * number of destination-domain flops in the synchronizer chain (>= 2)
   */
  stages?: bigint
}

export class CDCSynchronizer extends Module {
  declare params: CDCSynchronizer_Parameters
  constructor (params: CDCSynchronizer_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      width: params.width,
      stages: params.stages || 2n
    })

    const stages = Number(this.params.stages)
    if (stages < 2) console.log('Error: CDCSynchronizer stages must be >= 2')

    // define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      d: { direction: 'input', width: this.params.width },
      q: { direction: 'output', width: this.params.width }
    }

    // build the flop chain: d -> sync_stage_0 -> ... -> q
    let prev: string = 'd'
    for (let i = 0; i < stages; i++) {
      const isLast = (i === stages - 1)
      const qName = isLast ? 'q' : `sync_stage_${i}`
      if (!isLast) this.addSignal(qName, { width: this.params.width })
      this.addRegister({ d: prev, clk: 'clk', reset: 'rst_n', resetVal: 0n, q: qName })
      prev = qName
    }
  }
}

export default CDCSynchronizer
