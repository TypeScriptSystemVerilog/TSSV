import { Module, Expr, type TSSVParameters } from 'tssv/lib/core/TSSV'
import { CDCSynchronizer } from 'tssv/lib/modules/CDCSynchronizer'

/**
 * configuration parameters of the GrayPointer module
 */
export interface GrayPointer_Parameters extends TSSVParameters {
  /**
   * pointer width in bits: the pointer counts from 0 to 2**width - 1, then wraps to 0
   */
  width: bigint
  /**
   * flops in the CDCSynchronizer that carries the pointer into the far domain, at least 2
   */
  syncStages?: bigint
}

/**
 * A counter in one clock domain that another clock domain can read. It advances by one when
 * `inc` is high, and its value is available in binary in both domains: as `bin_ptr` in its
 * own, and as `far_bin_ptr` in the far domain, `syncStages` far-domain edges late. It crosses
 * in Gray code, so a sample taken mid-change is the old value or the new one, never a third.
 * The Gray code stays inside the module.
 *
 * @see doc/modules/GrayPointer/GrayPointer-spec.md
 */
export class GrayPointer extends Module {
  declare params: GrayPointer_Parameters
  constructor (params: GrayPointer_Parameters) {
    super({
      name: params.name,
      width: params.width,
      syncStages: params.syncStages ?? 2n
    })
    const syncStages = this.params.syncStages ?? 2n
    if (this.params.width < 1n) throw Error(`GrayPointer: width must be at least 1, got ${this.params.width}`)
    if (syncStages < 2n) throw Error(`GrayPointer: syncStages must be at least 2, got ${syncStages}`)
    // signal widths are numbers in the framework; convert once here
    const w = Number(this.params.width)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      inc: { direction: 'input' },
      bin_ptr: { direction: 'output', width: w },
      far_clk: { direction: 'input', isClock: 'posedge' },
      far_rst_n: { direction: 'input', isReset: 'lowasync' },
      far_bin_ptr: { direction: 'output', width: w }
    }

    // ---------------------------------------------------------------- own domain
    // The counter wraps at 2**width. gray_q loads the Gray code of the same next value, so it
    // is always the Gray code of bin_ptr, and it's a flop: the synchronizer's input has to come
    // straight from one.
    this.addSignal('bin_ptr_nxt', { width: w })
    this.addSignal('gray_q', { width: w })
    this.addAssign({ in: new Expr(`${w}'(bin_ptr + ${w}'(inc))`), out: 'bin_ptr_nxt' })
    this.addRegister({ d: 'bin_ptr_nxt', clk: 'clk', reset: 'rst_n', q: 'bin_ptr' })
    this.addRegister({ d: new Expr('bin_ptr_nxt ^ (bin_ptr_nxt >> 1)'), clk: 'clk', reset: 'rst_n', q: 'gray_q' })

    // ---------------------------------------------------------------- crossing
    // No explicit name: identical pointers share one CDCSynchronizer module
    this.addSignal('gray_far', { width: w })
    this.addSubmodule('u_sync', new CDCSynchronizer({ width: this.params.width, stages: syncStages }),
      { clk: 'far_clk', rst_n: 'far_rst_n', d: 'gray_q', q: 'gray_far' })

    // ---------------------------------------------------------------- far domain
    // Gray to binary: bit i is the XOR of gray_far's bits i and up. A 1-bit pointer is its own
    // Gray code (and a 1-bit signal is declared without a range, so it can't be bit-selected).
    const bits: string[] = []
    for (let i = w - 1; i >= 0; i--) bits.push(i === w - 1 ? `gray_far[${i}]` : `^gray_far[${w - 1}:${i}]`)
    this.addAssign({ in: new Expr(w === 1 ? 'gray_far' : `{${bits.join(', ')}}`), out: 'far_bin_ptr' })
  }
}

export default GrayPointer
