import { Module, type TSSVParameters } from 'tssv/lib/core/TSSV'

/**
 * configuration parameters of the TwoClockRegFile module
 */
export interface TwoClockRegFile_Parameters extends TSSVParameters {
  /**
   * bit width of each word
   */
  dataWidth: bigint
  /**
   * number of words, from 2 to 32
   */
  depth: bigint
  /**
   * how Vivado implements the storage: sets the `ram_style` attribute on `mem`.
   * Unset (the default) emits no attribute, so Vivado chooses. Nothing else in the RTL
   * changes, and ASIC flows ignore it.
   */
  fpgaRamStyle?: 'distributed' | 'block'
}

const FPGA_RAM_STYLES = ['distributed', 'block']

/**
 * Flop-based register file with a write port on `a_clk` and a synchronous read port on
 * `b_clk`. It synchronizes nothing: the caller keeps the two ports off the same word and
 * synchronizes every handoff of a word between them, as the AFIFO's Gray-coded pointers do.
 *
 * @see doc/modules/TwoClockRegFile/TwoClockRegFile-spec.md
 */
export class TwoClockRegFile extends Module {
  declare params: TwoClockRegFile_Parameters
  constructor (params: TwoClockRegFile_Parameters) {
    super({
      name: params.name,
      dataWidth: params.dataWidth,
      depth: params.depth,
      fpgaRamStyle: params.fpgaRamStyle
    })
    const depth = this.params.depth
    const style = this.params.fpgaRamStyle
    if (this.params.dataWidth < 1n) throw Error(`TwoClockRegFile: dataWidth must be at least 1, got ${this.params.dataWidth}`)
    if (depth < 2n || depth > 32n) throw Error(`TwoClockRegFile: depth must be 2 to 32, got ${depth}`)
    if (style !== undefined && !FPGA_RAM_STYLES.includes(style)) {
      throw Error(`TwoClockRegFile: fpgaRamStyle must be ${FPGA_RAM_STYLES.map(s => `'${s}'`).join(' or ')}, got '${String(style)}'`)
    }
    // signal widths are numbers in the framework; convert once here
    const dataWidth = Number(this.params.dataWidth)
    const addrWidth = this.bitWidth(depth - 1n)

    this.IOs = {
      a_clk: { direction: 'input', isClock: 'posedge' },
      a_we: { direction: 'input' },
      a_addr: { direction: 'input', width: addrWidth },
      a_data_in: { direction: 'input', width: dataWidth },
      b_clk: { direction: 'input', isClock: 'posedge' },
      b_re: { direction: 'input' },
      b_addr: { direction: 'input', width: addrWidth },
      b_data_out: { direction: 'output', width: dataWidth }
    }

    this.addSignal('mem', {
      width: dataWidth,
      isArray: depth,
      attributes: (style !== undefined) ? { ram_style: style } : undefined
    })

    // write port: a_clk domain
    this.addSequentialAlways({ clk: 'a_clk', outputs: ['mem'] }, `
    begin
        if (a_we) mem[a_addr] <= a_data_in;
    end
    `)

    // read port: b_clk domain, registered
    this.addSequentialAlways({ clk: 'b_clk', outputs: ['b_data_out'] }, `
    begin
        if (b_re) b_data_out <= mem[b_addr];
    end
    `)
  }
}

export default TwoClockRegFile
