/*
 * DualClockRAM
 *
 * Simple dual-port RAM with independent write and read clocks: one write port
 * clocked by w_clk, one read port clocked by r_clk. There is no same-address
 * read/write collision handling — this is intended as the storage array of an
 * asynchronous FIFO, where the Gray-coded pointers guarantee the reader and
 * writer never access the same location at the same time.
 *
 * Read data is registered (one r_clk of latency).
 */
import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'

export interface DualClockRAM_Parameters extends TSSVParameters {
  /**
   * bit width of RAM data
   */
  dataWidth: IntRange<1, 256>
  /**
   * number of data words in the RAM
   */
  depth: bigint
}

export class DualClockRAM extends Module {
  declare params: DualClockRAM_Parameters
  constructor (params: DualClockRAM_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth,
      depth: params.depth
    })

    if (this.params.dataWidth <= 0) console.log('Error: DualClockRAM dataWidth must be > 0')
    if (this.params.depth <= 0n) console.log('Error: DualClockRAM depth must be > 0')

    const addrWidth = this.bitWidth(this.params.depth - 1n)

    // storage array
    this.addSignal('mem', { width: this.params.dataWidth, isArray: this.params.depth })

    // define IO signals
    this.IOs = {
      w_clk: { direction: 'input', isClock: 'posedge' },
      w_en: { direction: 'input' },
      w_addr: { direction: 'input', width: addrWidth },
      w_data: { direction: 'input', width: this.params.dataWidth },
      r_clk: { direction: 'input', isClock: 'posedge' },
      r_en: { direction: 'input' },
      r_addr: { direction: 'input', width: addrWidth },
      r_data: { direction: 'output', width: this.params.dataWidth }
    }

    // write port (w_clk domain)
    const write_body =
    `
    begin
        if (w_en) begin
            mem[w_addr] <= w_data;
        end
    end
    `
    this.addSequentialAlways({ clk: 'w_clk', outputs: ['mem'] }, write_body)

    // read port (r_clk domain)
    const read_body =
    `
    begin
        if (r_en) begin
            r_data <= mem[r_addr];
        end
    end
    `
    this.addSequentialAlways({ clk: 'r_clk', outputs: ['r_data'] }, read_body)
  }
}

export default DualClockRAM
