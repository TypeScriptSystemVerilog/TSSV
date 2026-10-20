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
     * the fewest bits (depth * dataWidth) the SRAM needs to be implemented as a macro in an
     * ASIC flow; at least 32, default 1024. A smaller SRAM is meant to be flip-flops. It doesn't
     * change the emitted SV yet: the attribute that marks it comes with the ASIC macro
     * generator. A readBeforeWrite SRAM must be smaller
     */
  minMacroBits?: bigint
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
      macroConfig: params.macroConfig || 'default',
      minMacroBits: params.minMacroBits ?? 1024n
    })
    const depth = this.params.depth
    const ports = this.params.ports
    const mask = this.params.writeEnableMask ?? 'none'
    const minMacroBits = this.params.minMacroBits ?? 1024n
    const bits = depth * this.params.dataWidth
    if (this.params.dataWidth < 1n) throw Error(`SRAM: dataWidth must be at least 1, got ${this.params.dataWidth}`)
    // one word would need a 0-bit address
    if (depth < 2n) throw Error(`SRAM: depth must be at least 2, got ${depth}`)
    if (mask === 'byte' && this.params.dataWidth % 8n !== 0n) {
      throw Error(`SRAM: dataWidth must be a multiple of 8 for a byte write mask, got ${this.params.dataWidth}`)
    }
    if (minMacroBits < 32n) throw Error(`SRAM: minMacroBits must be at least 32, got ${minMacroBits}`)
    // most macros can't return the old word, so readBeforeWrite is only built from flip-flops
    if (this.params.readBehavior === 'readBeforeWrite' && bits >= minMacroBits) {
      throw Error(`SRAM: readBeforeWrite is built from flip-flops, so depth * dataWidth must be below minMacroBits (${minMacroBits}), got ${depth} * ${this.params.dataWidth} = ${bits}`)
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
    if (ports === '2rw') {
      // both ports write one word, whatever their masks
      this.addSignal('w_collision', {})
      this.addAssign({ in: new Expr('a_we & b_we & addr_a_equal_b'), out: 'w_collision' })
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

    // mem and the read data are written in clocked blocks with their enables and addresses
    // inline, the form synthesis tools map to a RAM. Computing them in an always_comb first (SV guide
    // SEQ-2) would make the array read combinational.

    // ---------------------------------------------------------------- writes
    // One process per write port. With more than one lane, an SV loop over the lanes inside it
    // is the byte-enable RAM template synthesis tools recognize, so the lanes aren't unrolled in
    // TypeScript (TSSV guide BUILD-6).
    // laneWe(p): port p writes lane i
    const laneWe = (p: string): string => mask === 'none' ? `${p}_we` : `${p}_we & ${p}_wmask${lanes > 1 ? '[i]' : ''}`
    // lane i of a word; the whole word when there is one lane
    const lane = lanes === 1 ? '' : laneWidth === 1 ? '[i]' : `[i*${laneWidth} +: ${laneWidth}]`
    // the block that writes port p's lanes; a 2rw write collision writes neither port
    const writeBlock = (label: string, p: string, tail = ''): string => {
      const laneWrite = `
        if (${laneWe(p)}${ports === '2rw' ? ' & ~w_collision' : ''}) begin
          mem[${p}_addr]${lane} <= ${p}_data_in${lane};
        end`
      return `begin : ${label}${lanes > 1
        ? `
      for (int i = 0; i < ${lanes}; i++) begin${laneWrite}
      end`
        : laneWrite}${tail}
    end`
    }
    if (ports === '2rw') {
      // Vivado infers a true-dual-port RAM only when each process writes one port (UG901's
      // templates; it built #150's single-process form from flip-flops). always_ff can't have
      // two processes write one variable (IEEE 1800 9.2.2.4), so these are plain always blocks,
      // emitted with addBody since the builder only writes always_ff. Both write mem, so the SV
      // guide's COMB-5 is waived for it, in a comment in the SV next to them
      const collisionX = `
\`ifndef SYNTHESIS
      // both ports write one word: it becomes X
      if (w_collision) begin
        mem[a_addr] <= 'x;
      end
\`endif`
      this.addBody(`
        // SV guide COMB-5 waived for mem: a true-dual-port RAM has one write port per process,
        // the form Vivado infers (UG901), and always_ff doesn't allow two processes to write mem
        always @(posedge clk) ${writeBlock('a_write', 'a', collisionX)}
        always @(posedge clk) ${writeBlock('b_write', 'b')}
      `)
    } else {
      this.addSequentialAlways({ clk: 'clk', outputs: ['mem'] }, `
    ${writeBlock('mem_write', ports === '1rw' ? 'a' : 'b')}
`)
    }

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

    // ---------------------------------------------------------------- assertions
    // On unless NOASSERT_SRAM_RW_CONFLICT or NOASSERT_SRAM_W_COLLISION is defined, for a
    // testbench that conflicts or collides on purpose. No action blocks: the SV guide's SYN-1
    // bans system tasks in RTL. A readBeforeWrite read may conflict, so it has no check
    const asserts: string[] = []
    if (undefOnWrite) {
      asserts.push('`ifndef NOASSERT_SRAM_RW_CONFLICT', '// undefOnWrite: no read may conflict with a write')
      for (const p of readPorts) asserts.push(`${p}_no_rw_conflict: assert property (@(posedge clk) !(${p}_re && ${p}_rw_conflict));`)
      asserts.push('`endif')
    }
    if (ports === '2rw') {
      asserts.push('`ifndef NOASSERT_SRAM_W_COLLISION', '// the two ports may not write one word in the same cycle',
        'no_w_collision: assert property (@(posedge clk) !w_collision);', '`endif')
    }
    if (asserts.length > 0) this.addBody(['`ifndef SYNTHESIS', ...asserts, '`endif'].join('\n'))
  }
}

export default SRAM
