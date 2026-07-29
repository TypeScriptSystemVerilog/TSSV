/*
 * GrayPointer
 *
 * Owns one FIFO pointer for a single clock domain and exposes it, Gray-coded,
 * to the opposite (far) clock domain for asynchronous FIFO status generation.
 *
 * The pointer is a (log2depth + 1)-bit binary counter; the extra MSB lets the
 * consuming logic distinguish full from empty (Cummings' scheme). Each cycle it
 * advances by `inc`, produces a registered Gray-coded copy (bin ^ (bin >> 1)),
 * and forwards that Gray value into the far domain through a CDCSynchronizer.
 */
import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'
import { CDCSynchronizer } from 'tssv/lib/modules/CDCSynchronizer'

export interface GrayPointer_Parameters extends TSSVParameters {
  /**
   * log2 of the FIFO depth; the pointer is (log2depth + 1) bits wide
   */
  log2depth: bigint
  /**
   * number of flops in the far-domain CDC synchronizer (>= 2)
   */
  syncStages?: bigint
}

export class GrayPointer extends Module {
  declare params: GrayPointer_Parameters
  constructor (params: GrayPointer_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      log2depth: params.log2depth,
      syncStages: params.syncStages || 2n
    })

    if (this.params.log2depth <= 0n) console.log('Error: GrayPointer log2depth must be > 0')

    // pointer width = log2depth + 1 (extra MSB for full/empty disambiguation)
    const ptrWidth = Number(this.params.log2depth) + 1

    // define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      inc: { direction: 'input' },
      far_clk: { direction: 'input', isClock: 'posedge' },
      far_rst_n: { direction: 'input', isReset: 'lowasync' },
      bin_ptr: { direction: 'output', width: ptrWidth },
      gray_ptr: { direction: 'output', width: ptrWidth },
      gray_ptr_far: { direction: 'output', width: ptrWidth }
    }

    // binary counter: next = current + inc (wraps naturally at 2**ptrWidth)
    this.addRegister({
      d: new Expr('bin_ptr + inc'),
      clk: 'clk',
      reset: 'rst_n',
      resetVal: 0n,
      q: 'bin_ptr'
    })

    // registered binary-to-Gray of the *next* binary value
    this.addRegister({
      d: new Expr('(bin_ptr + inc) ^ ((bin_ptr + inc) >> 1)'),
      clk: 'clk',
      reset: 'rst_n',
      resetVal: 0n,
      q: 'gray_ptr'
    })

    // synchronize the Gray pointer into the far clock domain
    this.addSubmodule(
      `u_${this.params.name}_sync`,
      new CDCSynchronizer({
        name: `${this.params.name}_sync`,
        width: ptrWidth as IntRange<1, 256>,
        stages: this.params.syncStages
      }),
      { clk: 'far_clk', rst_n: 'far_rst_n', d: 'gray_ptr', q: 'gray_ptr_far' }
    )
  }
}

export default GrayPointer
