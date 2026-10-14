import { Module, Expr, type TSSVParameters } from 'tssv/lib/core/TSSV'
import { GrayPointer } from 'tssv/lib/modules/GrayPointer'
import { TwoClockRegFile } from 'tssv/lib/modules/TwoClockRegFile'

/**
 * configuration parameters of the AFIFO module
 */
export interface AFIFO_Parameters extends TSSVParameters {
  /**
   * bit width of AFIFO data, with no upper limit
   */
  dataWidth: bigint
  /**
   * number of data words: 4, 8, 16 or 32
   */
  depth: bigint
  /**
   * flops in each pointer synchronizer, at least 2
   */
  syncStages?: bigint
  /**
   * add the `almost_full_depth` input and `almost_full` output, in the write domain
   */
  inclAlmostFull?: boolean
  /**
   * add the `almost_empty_depth` input and `almost_empty` output, in the read domain
   */
  inclAlmostEmpty?: boolean
  /**
   * how Vivado implements the storage, passed to the TwoClockRegFile. Unset lets Vivado
   * choose; ASIC flows ignore it.
   */
  fpgaRamStyle?: 'distributed' | 'block'
}

const DEPTHS = [4n, 8n, 16n, 32n]
const FPGA_RAM_STYLES = ['distributed', 'block']

/**
 * Dual-clock show-ahead FIFO: `SFIFO` with its clock split in two. Words are pushed on
 * `wr_clk` and popped on `rd_clk`, with no assumed relationship between the clocks.
 * `pop_data` presents the head of the queue whenever `empty` is low; a pop discards it.
 *
 * The data crosses through a `TwoClockRegFile`. Only the pointers cross through
 * synchronizers, in Gray code, inside two `GrayPointer`s. Each side sees the other's pointer
 * a few cycles late, so `full` and `empty` are conservative.
 *
 * @see doc/modules/AFIFO/AFIFO-spec.md
 */
export class AFIFO extends Module {
  declare params: AFIFO_Parameters
  constructor (params: AFIFO_Parameters) {
    super({
      name: params.name,
      dataWidth: params.dataWidth,
      depth: params.depth,
      syncStages: params.syncStages ?? 2n,
      inclAlmostFull: params.inclAlmostFull ?? false,
      inclAlmostEmpty: params.inclAlmostEmpty ?? false,
      fpgaRamStyle: params.fpgaRamStyle
    })
    const depth = this.params.depth
    const syncStages = this.params.syncStages ?? 2n
    const style = this.params.fpgaRamStyle
    if (this.params.dataWidth < 1n) throw Error(`AFIFO: dataWidth must be at least 1, got ${this.params.dataWidth}`)
    if (!DEPTHS.includes(depth)) throw Error(`AFIFO: depth must be 4, 8, 16 or 32, got ${depth}`)
    if (syncStages < 2n) throw Error(`AFIFO: syncStages must be at least 2, got ${syncStages}`)
    if (style !== undefined && !FPGA_RAM_STYLES.includes(style)) {
      throw Error(`AFIFO: fpgaRamStyle must be ${FPGA_RAM_STYLES.map(s => `'${s}'`).join(' or ')}, got '${String(style)}'`)
    }
    // signal widths are numbers in the framework; convert once here
    const dataWidth = Number(this.params.dataWidth)
    // the storage address, and the pointer: one more bit, to tell full from empty
    const addrWidth = this.bitWidth(depth - 1n)
    const ptrWidth = addrWidth + 1

    this.IOs = {
      wr_clk: { direction: 'input', isClock: 'posedge' },
      wr_rst_n: { direction: 'input', isReset: 'lowasync' },
      push_en: { direction: 'input' },
      push_data: { direction: 'input', width: dataWidth },
      full: { direction: 'output' },
      wr_curr_depth: { direction: 'output', width: ptrWidth },
      rd_clk: { direction: 'input', isClock: 'posedge' },
      rd_rst_n: { direction: 'input', isReset: 'lowasync' },
      pop_en: { direction: 'input' },
      pop_data: { direction: 'output', width: dataWidth },
      empty: { direction: 'output' },
      rd_curr_depth: { direction: 'output', width: ptrWidth }
    }
    if (this.params.inclAlmostFull === true) {
      this.IOs.almost_full_depth = { direction: 'input', width: ptrWidth }
      this.IOs.almost_full = { direction: 'output' }
    }
    if (this.params.inclAlmostEmpty === true) {
      this.IOs.almost_empty_depth = { direction: 'input', width: ptrWidth }
      this.IOs.almost_empty = { direction: 'output' }
    }

    // ---------------------------------------------------------------- pointers
    // Each GrayPointer counts one domain's pushes or pops and gives the count in binary in
    // both domains. No explicit names: the two have the same parameters, so they share one
    // GrayPointer module.
    this.addSignal('push_fire', {})
    this.addSignal('pop_fire', {})
    this.addSignal('wr_ptr_q', { width: ptrWidth })
    this.addSignal('wr_ptr_rsync', { width: ptrWidth })
    this.addSignal('rd_ptr_q', { width: ptrWidth })
    this.addSignal('rd_ptr_wsync', { width: ptrWidth })
    const pointer = (): GrayPointer => new GrayPointer({ width: BigInt(ptrWidth), syncStages })
    this.addSubmodule('u_wr_ptr', pointer(), {
      clk: 'wr_clk',
      rst_n: 'wr_rst_n',
      inc: 'push_fire',
      bin_ptr: 'wr_ptr_q',
      far_clk: 'rd_clk',
      far_rst_n: 'rd_rst_n',
      far_bin_ptr: 'wr_ptr_rsync'
    })
    this.addSubmodule('u_rd_ptr', pointer(), {
      clk: 'rd_clk',
      rst_n: 'rd_rst_n',
      inc: 'pop_fire',
      bin_ptr: 'rd_ptr_q',
      far_clk: 'wr_clk',
      far_rst_n: 'wr_rst_n',
      far_bin_ptr: 'rd_ptr_wsync'
    })

    // ---------------------------------------------------------------- write side
    // A push into a full FIFO is ignored. full: the pointers are exactly depth apart, that is,
    // equal apart from the top bit, which needs no subtractor in the path to push_fire.
    this.addAssign({ in: new Expr('push_en && !full'), out: 'push_fire' })
    this.addAssign({ in: new Expr(`${ptrWidth}'(wr_ptr_q - rd_ptr_wsync)`), out: 'wr_curr_depth' })
    this.addAssign({
      in: new Expr(`wr_ptr_q == {~rd_ptr_wsync[${ptrWidth - 1}], rd_ptr_wsync[${ptrWidth - 2}:0]}`),
      out: 'full'
    })
    if (this.params.inclAlmostFull === true) {
      this.addAssign({ in: new Expr('wr_curr_depth >= almost_full_depth'), out: 'almost_full' })
    }

    // ---------------------------------------------------------------- read side (show-ahead)
    // The storage's read is registered, so the head is loaded into b_data_out ahead of time:
    // when the current head is popped, or when there isn't one, as soon as the word at
    // rd_ptr_nxt has crossed. empty is a flop that tracks whether a head is loaded.
    this.addSignal('rd_ptr_nxt', { width: ptrWidth })
    this.addSignal('head_vld_nxt', {})
    this.addSignal('head_load', {})
    this.addAssign({ in: new Expr('pop_en && !empty'), out: 'pop_fire' })
    this.addAssign({ in: new Expr(`${ptrWidth}'(rd_ptr_q + ${ptrWidth}'(pop_fire))`), out: 'rd_ptr_nxt' })
    this.addAssign({ in: new Expr('rd_ptr_nxt != wr_ptr_rsync'), out: 'head_vld_nxt' })
    this.addAssign({ in: new Expr('head_vld_nxt && (pop_fire || empty)'), out: 'head_load' })
    this.addRegister({ d: new Expr('!head_vld_nxt'), clk: 'rd_clk', reset: 'rd_rst_n', resetVal: 1n, q: 'empty' })
    this.addAssign({ in: new Expr(`empty ? '0 : ${ptrWidth}'(wr_ptr_rsync - rd_ptr_q)`), out: 'rd_curr_depth' })
    if (this.params.inclAlmostEmpty === true) {
      this.addAssign({ in: new Expr('rd_curr_depth <= almost_empty_depth'), out: 'almost_empty' })
    }

    // ---------------------------------------------------------------- storage
    // Written on wr_clk at the write pointer, read on rd_clk at the next head's address. The
    // pointers keep the two ports off the same word (the spec's storage access rules).
    this.addSignal('wr_addr', { width: addrWidth })
    this.addSignal('rd_addr', { width: addrWidth })
    this.addAssign({ in: new Expr(`wr_ptr_q[${addrWidth - 1}:0]`), out: 'wr_addr' })
    this.addAssign({ in: new Expr(`rd_ptr_nxt[${addrWidth - 1}:0]`), out: 'rd_addr' })
    this.addSubmodule('u_storage', new TwoClockRegFile({ dataWidth: this.params.dataWidth, depth, fpgaRamStyle: style }), {
      a_clk: 'wr_clk',
      a_we: 'push_fire',
      a_addr: 'wr_addr',
      a_data_in: 'push_data',
      b_clk: 'rd_clk',
      b_re: 'head_load',
      b_addr: 'rd_addr',
      b_data_out: 'pop_data'
    })
  }
}

export default AFIFO
