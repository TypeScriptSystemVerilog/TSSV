import { Module, type TSSVParameters, Expr } from 'tssv/lib/core/TSSV'

/**
 * configuration parameters of the SRAM module
 */
export interface SRAM_Parameters extends TSSVParameters {
  /**
     * bit width of SRAM data
     */
  dataWidth: bigint
  /**
     * number of data words in the SRAM; at least 2
     */
  depth: bigint
  /**
     * SRAM port configuration
     */
  ports: '1rw' | '1r_1w' | '2rw'
  /**
     * select write enable mask control among 'none', 'bit', 'byte'
     * defaults to 'none'
     */
  writeEnableMask?: 'none' | 'bit' | 'byte'
  /**
     * define the behavior of the read data when writing during the same clock cycle
     * defaults to 'undefOnWrite' meaning the read data bus will be undefined after
     * writes until the next read. This gives the maximum flexibility for selecting
     * underlying SRAM macros and should be used in all cases unless the surrounding
     * logic requires simultaneous read of existing value and write of a new value
     * in the same clock cycle
     */
  readBehavior?: 'undefOnWrite' | 'readBeforeWrite'
  /**
     * macroConfig is a free form string parameter that allows selection of technology
     * specific SRAM macro generator parameters such as high-speed, high-density,
     * mux configuration,  leakage selection, etc.
     * This parameter has no influence on the behavior of the SRAM behavioral model and
     * is meant only to choose macro generation settings that effect the size, speed, and
     * power performance of the resulting macro
     *
     * TSSV will only write out an SRAM library of behavioral models for each SRAM for the
     * purpose of simulation and FPGA implementation. The user should run a separate SRAM
     * library generation tool for the ASIC target technology to create the necessary
     * ASIC view SRAM library for the design
     */
  macroConfig?: string

}

/**
 * Static Random Access Memory (SRAM) module
 * supports FPGA inference with generated behavioral model SRAM library
 * ASIC macro library can be swapped in for ASIC synthesis/implemenation
 *
 * @see doc/modules/SRAM/SRAM-spec.md
 */
export class SRAM extends Module {
  declare params: SRAM_Parameters
  constructor (params: SRAM_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth,
      depth: params.depth,
      ports: params.ports,
      writeEnableMask: params.writeEnableMask || 'none',
      readBehavior: params.readBehavior || 'undefOnWrite',
      macroConfig: params.macroConfig || 'default'
    })
    const depth = this.params.depth
    const ports = this.params.ports
    const mask = this.params.writeEnableMask ?? 'none'
    if (this.params.dataWidth < 1n) throw Error(`SRAM: dataWidth must be at least 1, got ${this.params.dataWidth}`)
    // one word would need a 0-bit address
    if (depth < 2n) throw Error(`SRAM: depth must be at least 2, got ${depth}`)
    if (mask === 'byte' && this.params.dataWidth % 8n !== 0n) {
      throw Error(`SRAM: dataWidth must be a multiple of 8 for a byte write mask, got ${this.params.dataWidth}`)
    }
    // signal widths are numbers in the framework; convert once here
    const dataWidth = Number(this.params.dataWidth)
    const addrWidth = this.bitWidth(depth - 1n)
    const undefOnWrite = this.params.readBehavior === 'undefOnWrite'
    // port a reads in every configuration, and port b only in 2rw. Port a writes in 1rw and
    // 2rw, and port b in 1r_1w and 2rw
    const readPorts = ports === '2rw' ? ['a', 'b'] : ['a']
    const writePorts = ports === '1rw' ? ['a'] : ports === '1r_1w' ? ['b'] : ['a', 'b']
    // a write mask splits each word into lanes, one per mask bit; without a mask the word is one lane
    const laneWidth = mask === 'bit' ? 1 : mask === 'byte' ? 8 : dataWidth
    const lanes = dataWidth / laneWidth

    this.IOs = { clk: { direction: 'input', isClock: 'posedge' } }
    for (const p of ['a', 'b']) {
      const reads = readPorts.includes(p)
      const writes = writePorts.includes(p)
      if (reads) this.IOs[`${p}_re`] = { direction: 'input' }
      if (writes) {
        this.IOs[`${p}_we`] = { direction: 'input' }
        this.IOs[`${p}_data_in`] = { direction: 'input', width: dataWidth }
      }
      if (reads) this.IOs[`${p}_data_out`] = { direction: 'output', width: dataWidth }
      if (reads || writes) this.IOs[`${p}_addr`] = { direction: 'input', width: addrWidth }
      if (writes && mask !== 'none') this.IOs[`${p}_wmask`] = { direction: 'input', width: lanes }
    }

    // ---------------------------------------------------------------- storage
    this.addSignal('mem', { width: dataWidth, isArray: depth })

    // ---------------------------------------------------------------- port collisions
    // 2rw: both ports writing one address collide. 1r_1w with undefOnWrite: a write to the
    // address being read makes the read undefined
    if (ports === '2rw' || (ports === '1r_1w' && undefOnWrite)) {
      this.addSignal('addr_a_equal_b', {})
      this.addAssign({ in: new Expr('a_addr == b_addr'), out: 'addr_a_equal_b' })
    }
    if (undefOnWrite) {
      // <p>_rw_conflict: a write, on either port, to the address read port p reads
      const conflicts: Record<string, string> = ports === '1rw'
        ? { a: 'a_we' }
        : ports === '1r_1w'
          ? { a: 'b_we & addr_a_equal_b' }
          : { a: 'a_we | (b_we & addr_a_equal_b)', b: 'b_we | (a_we & addr_a_equal_b)' }
      for (const [p, conflict] of Object.entries(conflicts)) {
        this.addSignal(`${p}_rw_conflict`, {})
        this.addAssign({ in: new Expr(conflict), out: `${p}_rw_conflict` })
      }
    }

    // mem and the read data are written in always_ff with their enables and addresses inline,
    // the form synthesis tools map to a RAM. Computing them in an always_comb first (SV guide
    // SEQ-2) would make the array read combinational.

    // ---------------------------------------------------------------- writes
    // One block writes mem from every write port (SV guide COMB-5). With more than one lane,
    // an SV loop over the lanes inside it is the byte-enable RAM template synthesis tools
    // recognize, so the lanes aren't unrolled in TypeScript (TSSV guide BUILD-6).
    // laneWe(p): port p writes lane i
    const laneWe = (p: string): string => mask === 'none' ? `${p}_we` : `${p}_we & ${p}_wmask${lanes > 1 ? '[i]' : ''}`
    // lane i of a word; the whole word when there is one lane
    const lane = lanes === 1 ? '' : laneWidth === 1 ? '[i]' : `[i*${laneWidth} +: ${laneWidth}]`
    let laneWrites: string
    if (ports === '2rw') {
      // both ports writing one lane of one address: neither write happens, and in simulation
      // the lane becomes X
      laneWrites = `
        if (${laneWe('a')} & ~(${laneWe('b')} & addr_a_equal_b)) begin
          mem[a_addr]${lane} <= a_data_in${lane};
        end
        if (${laneWe('b')} & ~(${laneWe('a')} & addr_a_equal_b)) begin
          mem[b_addr]${lane} <= b_data_in${lane};
        end
\`ifndef SYNTHESIS
        // both ports write this lane of one address: it becomes X
        if (${laneWe('a')} & ${laneWe('b')} & addr_a_equal_b) begin
          mem[a_addr]${lane} <= 'x;
        end
\`endif`
    } else {
      const p = ports === '1rw' ? 'a' : 'b'
      laneWrites = `
        if (${laneWe(p)}) begin
          mem[${p}_addr]${lane} <= ${p}_data_in${lane};
        end`
    }
    this.addSequentialAlways({ clk: 'clk', outputs: ['mem'] }, `
    begin : mem_write${lanes > 1
      ? `
      for (int i = 0; i < ${lanes}; i++) begin${laneWrites}
      end`
      : laneWrites}
    end
`)

    // ---------------------------------------------------------------- reads
    // A read port registers mem[<p>_addr] while <p>_re is high, and holds it otherwise.
    // undefOnWrite: a read that conflicts with a write doesn't load, and in simulation the
    // read data becomes X until the next read
    for (const p of readPorts) {
      const read = undefOnWrite
        ? `
      if (${p}_re & ~${p}_rw_conflict) begin
        ${p}_data_out <= mem[${p}_addr];
      end
\`ifndef SYNTHESIS
      if (${p}_re & ${p}_rw_conflict) begin
        ${p}_data_out <= 'x;
      end
\`endif`
        : `
      if (${p}_re) begin
        ${p}_data_out <= mem[${p}_addr];
      end`
      this.addSequentialAlways({ clk: 'clk', outputs: [`${p}_data_out`] }, `
    begin : ${p}_read${read}
    end
`)
    }
  }
}

export default SRAM
