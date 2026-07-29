/*
 * AFIFO — dual-clock asynchronous FIFO
 *
 * Data is enqueued in the wr_clk domain and dequeued in the rd_clk domain with
 * no assumed relationship between the two clocks. Clock-domain crossing is made
 * safe with Gray-coded pointers (only one bit changes per increment) passed
 * through two-flop synchronizers, so status flags are conservative: wr_full may
 * assert early and rd_empty may assert while data is in flight, but the FIFO
 * never reports more space or data than physically exists.
 *
 * Full/empty use the Cummings (log2depth + 1)-bit dual-pointer scheme:
 *   empty : read Gray pointer == synchronized write Gray pointer
 *   full  : write Gray pointer == synchronized read Gray pointer with its top
 *           two bits inverted
 *
 * Inspired by bespoke-silicon-group/basejump_stl bsg_async_fifo.
 */
import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'
import { GrayPointer } from 'tssv/lib/modules/GrayPointer'
import { DualClockRAM } from 'tssv/lib/modules/DualClockRAM'

export interface AFIFO_Parameters extends TSSVParameters {
  /**
   * bit width of AFIFO data
   */
  dataWidth: IntRange<1, 256>
  /**
   * log2 of the FIFO depth; the FIFO holds 2**log2depth words (power-of-2 only)
   */
  log2depth: bigint
  /**
   * output 'wr_almost_full' and 'rd_almost_empty'
   */
  InclAlmostDepth?: boolean
  /**
   * occupancy at/below which 'rd_almost_empty' asserts
   */
  almost_empty_depth?: bigint
  /**
   * occupancy at/above which 'wr_almost_full' asserts
   */
  almost_full_depth?: bigint
  /**
   * number of flops in each CDC synchronizer (>= 2)
   */
  syncStages?: bigint
}

/**
 * Gray-to-binary (prefix XOR) as a concatenation expression string.
 * bin[i] = ^gray[W-1:i], emitted MSB-first so the concat width is W.
 */
function gray2bin (g: string, width: number): string {
  const bits: string[] = []
  for (let i = width - 1; i >= 0; i--) {
    bits.push(`^(${g}[${width - 1}:${i}])`)
  }
  return `{${bits.join(', ')}}`
}

export class AFIFO extends Module {
  declare params: AFIFO_Parameters
  constructor (params: AFIFO_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth,
      log2depth: params.log2depth,
      InclAlmostDepth: params.InclAlmostDepth || false,
      syncStages: params.syncStages || 2n
    })

    if (this.params.dataWidth <= 0) console.log('Error: AFIFO dataWidth must be > 0')
    if (this.params.log2depth <= 0n) console.log('Error: AFIFO log2depth must be > 0')

    const L = Number(this.params.log2depth) // address width
    const ptrWidth = L + 1 // pointer width (extra MSB for full/empty)
    const depth = 1n << this.params.log2depth

    const almost_full_depth = this.params.almost_full_depth || (depth - 1n)
    const almost_empty_depth = this.params.almost_empty_depth || 1n

    if (this.params.InclAlmostDepth) {
      if (almost_full_depth >= depth) {
        console.log(`Error: almost_full_depth ${almost_full_depth} cannot be >= depth ${depth}`)
      }
      if (almost_empty_depth >= depth) {
        console.log(`Error: almost_empty_depth ${almost_empty_depth} cannot be >= depth ${depth}`)
      }
    }

    // ============================ IO ============================
    this.IOs = {
      wr_clk: { direction: 'input', isClock: 'posedge' },
      wr_rst_n: { direction: 'input', isReset: 'lowasync' },
      wr_en: { direction: 'input' },
      wr_data_in: { direction: 'input', width: this.params.dataWidth },
      wr_full: { direction: 'output' },
      wr_curr_depth: { direction: 'output', width: ptrWidth },
      rd_clk: { direction: 'input', isClock: 'posedge' },
      rd_rst_n: { direction: 'input', isReset: 'lowasync' },
      rd_en: { direction: 'input' },
      rd_data_out: { direction: 'output', width: this.params.dataWidth },
      rd_empty: { direction: 'output' },
      rd_curr_depth: { direction: 'output', width: ptrWidth }
    }
    if (this.params.InclAlmostDepth) {
      this.IOs.wr_almost_full = { direction: 'output' }
      this.IOs.rd_almost_empty = { direction: 'output' }
    }

    // ======================= internal wires =======================
    // write-pointer domain
    this.addSignal('wr_bin', { width: ptrWidth })
    this.addSignal('wr_gray', { width: ptrWidth })
    this.addSignal('wr_gray_rsync', { width: ptrWidth }) // write Gray synced into read domain
    // read-pointer domain
    this.addSignal('rd_bin', { width: ptrWidth })
    this.addSignal('rd_gray', { width: ptrWidth })
    this.addSignal('rd_gray_wsync', { width: ptrWidth }) // read Gray synced into write domain
    // converted-back binary of the synchronized pointers (for occupancy)
    this.addSignal('rd_bin_wsync', { width: ptrWidth }) // read ptr in write domain
    this.addSignal('wr_bin_rsync', { width: ptrWidth }) // write ptr in read domain
    // glue
    this.addSignal('inc_wr', {})
    this.addSignal('inc_rd', {})
    this.addSignal('wr_addr', { width: L })
    this.addSignal('rd_addr', { width: L })

    // ======================= write pointer =======================
    this.addSubmodule(
      `u_${this.params.name}_wptr`,
      new GrayPointer({ name: `${this.params.name}_wptr`, log2depth: this.params.log2depth, syncStages: this.params.syncStages }),
      {
        clk: 'wr_clk',
        rst_n: 'wr_rst_n',
        inc: 'inc_wr',
        far_clk: 'rd_clk',
        far_rst_n: 'rd_rst_n',
        bin_ptr: 'wr_bin',
        gray_ptr: 'wr_gray',
        gray_ptr_far: 'wr_gray_rsync'
      }
    )

    // ======================= read pointer =======================
    this.addSubmodule(
      `u_${this.params.name}_rptr`,
      new GrayPointer({ name: `${this.params.name}_rptr`, log2depth: this.params.log2depth, syncStages: this.params.syncStages }),
      {
        clk: 'rd_clk',
        rst_n: 'rd_rst_n',
        inc: 'inc_rd',
        far_clk: 'wr_clk',
        far_rst_n: 'wr_rst_n',
        bin_ptr: 'rd_bin',
        gray_ptr: 'rd_gray',
        gray_ptr_far: 'rd_gray_wsync'
      }
    )

    // ======================= storage =======================
    this.addSubmodule(
      `u_${this.params.name}_ram`,
      new DualClockRAM({ name: `${this.params.name}_ram`, dataWidth: this.params.dataWidth, depth }),
      {
        w_clk: 'wr_clk',
        w_en: 'inc_wr',
        w_addr: 'wr_addr',
        w_data: 'wr_data_in',
        r_clk: 'rd_clk',
        r_en: 'inc_rd',
        r_addr: 'rd_addr',
        r_data: 'rd_data_out'
      }
    )

    // ======================= glue logic =======================
    // RAM addresses are the low L bits of the binary pointers
    this.addAssign({ in: new Expr(`wr_bin[${L - 1}:0]`), out: 'wr_addr' })
    this.addAssign({ in: new Expr(`rd_bin[${L - 1}:0]`), out: 'rd_addr' })

    // empty: read Gray pointer has caught up to the synchronized write Gray pointer
    this.addAssign({ in: new Expr('rd_gray == wr_gray_rsync'), out: 'rd_empty' })

    // full: write Gray pointer == synchronized read Gray pointer, top two bits inverted
    const fullRHS = (ptrWidth >= 3)
      ? `{~rd_gray_wsync[${ptrWidth - 1}:${ptrWidth - 2}], rd_gray_wsync[${ptrWidth - 3}:0]}`
      : '~rd_gray_wsync'
    this.addAssign({ in: new Expr(`wr_gray == ${fullRHS}`), out: 'wr_full' })

    // enqueue / dequeue strobes (writes/reads are suppressed when full/empty)
    this.addAssign({ in: new Expr('wr_en && !wr_full'), out: 'inc_wr' })
    this.addAssign({ in: new Expr('rd_en && !rd_empty'), out: 'inc_rd' })

    // occupancy: convert the synchronized Gray pointers back to binary and diff
    this.addAssign({ in: new Expr(gray2bin('rd_gray_wsync', ptrWidth)), out: 'rd_bin_wsync' })
    this.addAssign({ in: new Expr(gray2bin('wr_gray_rsync', ptrWidth)), out: 'wr_bin_rsync' })
    this.addAssign({ in: new Expr('wr_bin - rd_bin_wsync'), out: 'wr_curr_depth' })
    this.addAssign({ in: new Expr('wr_bin_rsync - rd_bin'), out: 'rd_curr_depth' })

    // almost flags
    if (this.params.InclAlmostDepth) {
      this.addAssign({ in: new Expr(`(wr_curr_depth >= ${ptrWidth}'d${almost_full_depth}) ? 1'b1 : 1'b0`), out: 'wr_almost_full' })
      this.addAssign({ in: new Expr(`(rd_curr_depth <= ${ptrWidth}'d${almost_empty_depth}) ? 1'b1 : 1'b0`), out: 'rd_almost_empty' })
    }
  }
}

export default AFIFO
