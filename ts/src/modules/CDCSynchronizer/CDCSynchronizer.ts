import { Module, Expr, type TSSVParameters } from 'tssv/lib/core/TSSV'

/**
 * configuration parameters of the CDCSynchronizer module
 */
export interface CDCSynchronizer_Parameters extends TSSVParameters {
  /**
   * width of the synchronized signal, in bits
   */
  width: bigint
  /**
   * flops in the chain, at least 2. Each extra stage lowers the chance that a metastable value
   * reaches `q`, and adds a cycle of latency.
   */
  stages?: bigint
}

/**
 * Multi-flop synchronizer: a chain of `stages` flops on `clk` that brings `d`, from another
 * clock domain, into this one as `q`. Every stage carries `ASYNC_REG`.
 *
 * Safe only for an input that comes straight from a source-domain flop and changes one bit at
 * a time, such as a Gray-coded counter. The module can't check either rule.
 *
 * @see doc/modules/CDCSynchronizer/CDCSynchronizer-spec.md
 */
export class CDCSynchronizer extends Module {
  declare params: CDCSynchronizer_Parameters
  constructor (params: CDCSynchronizer_Parameters) {
    super({
      name: params.name,
      width: params.width,
      stages: params.stages ?? 2n
    })
    const stages = this.params.stages ?? 2n
    if (this.params.width < 1n) throw Error(`CDCSynchronizer: width must be at least 1, got ${this.params.width}`)
    if (stages < 2n) throw Error(`CDCSynchronizer: stages must be at least 2, got ${stages}`)
    // signal widths are numbers in the framework; convert once here
    const width = Number(this.params.width)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      d: { direction: 'input', width },
      q: { direction: 'output', width }
    }

    // The chain: sync_0 samples d and can go metastable; each later stage samples the one
    // before. Every stage is an internal signal declared with ASYNC_REG, so Vivado keeps the
    // chain's flops together and out of a shift-register LUT.
    let prev = 'd'
    for (let i = 0n; i < stages; i++) {
      const stage = `sync_${i}`
      this.addSignal(stage, { width, attributes: { ASYNC_REG: 'TRUE' } })
      this.addRegister({ d: prev, clk: 'clk', reset: 'rst_n', q: stage })
      prev = stage
    }
    this.addAssign({ in: new Expr(prev), out: 'q' })
  }
}

export default CDCSynchronizer
