import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'
import { SRAM } from 'tssv/lib/modules/SRAM'

/**
 * configuration parameters of the SFIFO module
 */
export interface SFIFO_Parameters extends TSSVParameters {
  /**
   * bit width of SFIFO data
   */
  dataWidth: IntRange<1, 256>
  /**
   * number of data words in the SFIFO
   */
  depth: bigint
  /**
   * true (default): push and pop may occur in the same cycle; storage is a dual-port
   * (`1r_1w`) SRAM and the enables are `push_en`/`pop_en`.
   * false: push and pop are mutually exclusive; storage is a single-port (`1rw`) SRAM
   * and the enables are `en`/`push1_pop0`.
   */
  simultPushPop?: boolean
  /**
   * add the `almost_full_depth` input and `almost_full` output
   */
  inclAlmostFull?: boolean
  /**
   * add the `almost_empty_depth` input and `almost_empty` output
   */
  inclAlmostEmpty?: boolean
}

/**
 * Synchronous show-ahead (first-word fall-through) FIFO backed by an `SRAM`.
 * `pop_data` always presents the head of the queue while `empty` is low; a pop
 * discards the head and the next entry appears on the following cycle.
 *
 * @see doc/modules/SFIFO/SFIFO-spec.md
 */
export class SFIFO extends Module {
  declare params: SFIFO_Parameters
  constructor (params: SFIFO_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth,
      depth: params.depth,
      simultPushPop: params.simultPushPop ?? true,
      inclAlmostFull: params.inclAlmostFull ?? false,
      inclAlmostEmpty: params.inclAlmostEmpty ?? false
    })
    const depth = this.params.depth
    if (depth < 1n) throw Error(`SFIFO: depth must be at least 1, got ${depth}`)
    const simult = this.params.simultPushPop === true

    // fifo_cnt counts 0..depth; the SRAM address counts 0..depth-1
    const cntWidth = this.bitWidth(depth)
    const addrWidth = this.bitWidth(depth - 1n)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      push_data: { direction: 'input', width: this.params.dataWidth },
      pop_data: { direction: 'output', width: this.params.dataWidth },
      empty: { direction: 'output' },
      full: { direction: 'output' },
      curr_depth: { direction: 'output', width: cntWidth }
    }
    if (simult) {
      this.IOs.push_en = { direction: 'input' }
      this.IOs.pop_en = { direction: 'input' }
    } else {
      this.IOs.en = { direction: 'input' }
      this.IOs.push1_pop0 = { direction: 'input' }
    }
    if (this.params.inclAlmostFull === true) {
      this.IOs.almost_full_depth = { direction: 'input', width: cntWidth }
      this.IOs.almost_full = { direction: 'output' }
    }
    if (this.params.inclAlmostEmpty === true) {
      this.IOs.almost_empty_depth = { direction: 'input', width: cntWidth }
      this.IOs.almost_empty = { direction: 'output' }
    }

    // ---------------------------------------------------------------- push/pop requests
    this.addSignal('push_req', {})
    this.addSignal('pop_req', {})
    this.addSignal('push_fire', {})
    this.addSignal('pop_fire', {})
    if (simult) {
      this.addAssign({ in: new Expr('push_en'), out: 'push_req' })
      this.addAssign({ in: new Expr('pop_en'), out: 'pop_req' })
    } else {
      this.addAssign({ in: new Expr('en && push1_pop0'), out: 'push_req' })
      this.addAssign({ in: new Expr('en && !push1_pop0'), out: 'pop_req' })
    }
    // a push into a full FIFO, or a pop from an empty one, is ignored
    this.addAssign({ in: new Expr('push_req && !full'), out: 'push_fire' })
    this.addAssign({ in: new Expr('pop_req && !empty'), out: 'pop_fire' })

    // ---------------------------------------------------------------- fill count and flags
    this.addSignal('fifo_cnt_q', { width: cntWidth })
    this.addSignal('fifo_cnt_nxt', { width: cntWidth })
    this.addCombAlways({ outputs: ['fifo_cnt_nxt'] }, `
    begin : fifo_cnt_next
      fifo_cnt_nxt = fifo_cnt_q;
      if (push_fire && !pop_fire) begin
        fifo_cnt_nxt = ${cntWidth}'(fifo_cnt_q + ${cntWidth}'d1);
      end else if (pop_fire && !push_fire) begin
        fifo_cnt_nxt = ${cntWidth}'(fifo_cnt_q - ${cntWidth}'d1);
      end
    end
`)
    this.addRegister({ d: 'fifo_cnt_nxt', clk: 'clk', reset: 'rst_n', q: 'fifo_cnt_q' })

    this.addAssign({ in: new Expr(`fifo_cnt_q == ${cntWidth}'d${depth}`), out: 'full' })
    this.addAssign({ in: new Expr("fifo_cnt_q == '0"), out: 'empty' })
    this.addAssign({ in: new Expr('fifo_cnt_q'), out: 'curr_depth' })
    if (this.params.inclAlmostFull === true) {
      this.addAssign({ in: new Expr('fifo_cnt_q >= almost_full_depth'), out: 'almost_full' })
    }
    if (this.params.inclAlmostEmpty === true) {
      this.addAssign({ in: new Expr('fifo_cnt_q <= almost_empty_depth'), out: 'almost_empty' })
    }

    // ---------------------------------------------------------------- head of the queue
    // bypass_q catches a push that becomes the head at once: a push into an empty FIFO, or
    // (dual-port only) a push alongside the pop of the last entry. Every push is also
    // written to the SRAM, so the pointers never depend on where the head is shown from.
    this.addSignal('load_bypass', {})
    this.addSignal('bypass_q', { width: this.params.dataWidth })
    if (simult) {
      this.addAssign({ in: new Expr(`push_fire && (empty || (pop_fire && (fifo_cnt_q == ${cntWidth}'d1)))`), out: 'load_bypass' })
    } else {
      this.addAssign({ in: new Expr('push_fire && empty'), out: 'load_bypass' })
    }
    this.addRegister({ d: 'push_data', clk: 'clk', en: 'load_bypass', q: 'bypass_q' })

    if (depth === 1n) {
      // A one-entry FIFO only ever holds the head, so it needs no SRAM or pointers
      this.addAssign({ in: new Expr('bypass_q'), out: 'pop_data' })
      return
    }

    // ---------------------------------------------------------------- SRAM pointers
    const lastAddr = `${addrWidth}'d${depth - 1n}`
    this.addSignal('wr_addr_q', { width: addrWidth })
    this.addSignal('wr_addr_nxt', { width: addrWidth })
    this.addSignal('rd_addr_q', { width: addrWidth })
    this.addSignal('rd_addr_nxt', { width: addrWidth })
    this.addSignal('rd_addr_inc', { width: addrWidth })
    // rd_addr_q is the head entry; rd_addr_inc is the entry behind it, prefetched on a pop
    this.addAssign({ in: new Expr(`(rd_addr_q == ${lastAddr}) ? '0 : ${addrWidth}'(rd_addr_q + ${addrWidth}'d1)`), out: 'rd_addr_inc' })
    this.addCombAlways({ outputs: ['wr_addr_nxt', 'rd_addr_nxt'] }, `
    begin : addr_next
      wr_addr_nxt = wr_addr_q;
      rd_addr_nxt = rd_addr_q;
      if (push_fire) begin
        wr_addr_nxt = (wr_addr_q == ${lastAddr}) ? '0 : ${addrWidth}'(wr_addr_q + ${addrWidth}'d1);
      end
      if (pop_fire) begin
        rd_addr_nxt = rd_addr_inc;
      end
    end
`)
    this.addRegister({ d: 'wr_addr_nxt', clk: 'clk', reset: 'rst_n', q: 'wr_addr_q' })
    this.addRegister({ d: 'rd_addr_nxt', clk: 'clk', reset: 'rst_n', q: 'rd_addr_q' })

    // ---------------------------------------------------------------- SRAM prefetch
    // The SRAM read is registered, so the entry behind the head is read on the pop that
    // exposes it. Entries behind the head were written on earlier edges, so the read never
    // hits the address being written. The SRAM holds its read data while sram_re is low.
    this.addSignal('sram_re', {})
    this.addSignal('sram_rdata', { width: this.params.dataWidth })
    this.addAssign({ in: new Expr(`pop_fire && (fifo_cnt_q > ${cntWidth}'d1)`), out: 'sram_re' })

    this.addSignal('head_from_bypass_q', {})
    this.addSignal('head_from_bypass_nxt', {})
    this.addCombAlways({ outputs: ['head_from_bypass_nxt'] }, `
    begin : head_src_next
      head_from_bypass_nxt = head_from_bypass_q;
      if (load_bypass) begin
        head_from_bypass_nxt = 1'b1;
      end else if (sram_re) begin
        head_from_bypass_nxt = 1'b0;
      end
    end
`)
    this.addRegister({ d: 'head_from_bypass_nxt', clk: 'clk', reset: 'rst_n', q: 'head_from_bypass_q' })
    this.addAssign({ in: new Expr('head_from_bypass_q ? bypass_q : sram_rdata'), out: 'pop_data' })

    const sramName = `${this.name}_sram`
    if (simult) {
      this.addSubmodule(`u_${sramName}`,
        new SRAM({ name: sramName, dataWidth: this.params.dataWidth, depth, ports: '1r_1w' }),
        { clk: 'clk', a_re: 'sram_re', a_addr: 'rd_addr_inc', a_data_out: 'sram_rdata', b_we: 'push_fire', b_addr: 'wr_addr_q', b_data_in: 'push_data' })
    } else {
      // push and pop are exclusive, so a push write and a prefetch read never share a cycle
      this.addSignal('sram_addr', { width: addrWidth })
      this.addAssign({ in: new Expr('push_fire ? wr_addr_q : rd_addr_inc'), out: 'sram_addr' })
      this.addSubmodule(`u_${sramName}`,
        new SRAM({ name: sramName, dataWidth: this.params.dataWidth, depth, ports: '1rw' }),
        { clk: 'clk', a_re: 'sram_re', a_we: 'push_fire', a_addr: 'sram_addr', a_data_in: 'push_data', a_data_out: 'sram_rdata' })
    }
  }
}

export default SFIFO
