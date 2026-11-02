import TSSV from 'tssv/lib/core/TSSV'
import { type RecordLayout } from './patternRecord.js'

/**
 * How a pattern memory gets its content:
 *
 *   - `preloaded`: from its pattern file at configuration, with `initial $readmemh` (or
 *     `$readmemb`), as FPGA block RAM can be. New content means a rebuild.
 *   - `reloaded`: through a load port that a host writes between testcases or batches, so one
 *     build serves every testcase of a DUT configuration.
 */
export type PatternMemoryMode = 'preloaded' | 'reloaded'

export interface PatternMemory_Parameters extends TSSV.TSSVParameters {
  /** The record each word holds (patternRecord.ts): one output per field. */
  layout: RecordLayout
  /** Records the memory holds. At least 2. */
  depth: number
  mode: PatternMemoryMode
  /**
   * Preloaded only: the pattern file `$readmem` loads, as written in the SV. A relative path is
   * relative to the directory the simulator or synthesis tool runs in.
   */
  file?: string
}

/** The module's own signals besides its ports, which a field can't be named */
const INTERNAL = ['mem']

// An SV string's contents with no escapes needed: no double quote, backslash or line break
const PLAIN_PATH = /^[^"\\\n]+$/

/**
 * PatternMemory — holds a test's content, a record per word, so the content isn't compiled into
 * the RTL (doc/framework/pattern-files.md). One module serves every injector, checker and cycle
 * table.
 *
 * Ports: `clk` and `rd_addr` in; one output per field of the layout, out. In reloaded mode also
 * `load_en`, `load_addr` and `load_data` in. A preloaded build has no load port.
 *
 * The read is synchronous, the block-RAM form: the fields show the record at `rd_addr` from the
 * rising edge after it is presented. `load_data` is a whole word, as one line of a pattern file
 * holds it; the edge on which `load_en` is high writes it to `load_addr`.
 *
 * The memory has no reset. In preloaded mode its contents come from the file at configuration.
 * Each field output is a register that holds whatever it read last.
 */
export class PatternMemory extends TSSV.Module {
  declare params: PatternMemory_Parameters
  constructor (params: PatternMemory_Parameters) {
    super({ name: params.name, layout: params.layout, depth: params.depth, mode: params.mode, file: params.file })
    const { layout, depth, mode, file } = params
    const what = params.name ?? 'PatternMemory'
    if (!Number.isInteger(depth) || depth < 2) throw Error(`${what}: depth must be an integer of at least 2, got ${depth}`)
    if (mode === 'preloaded' && file === undefined) throw Error(`${what}: a preloaded memory needs a file`)
    if (mode === 'reloaded' && file !== undefined) throw Error(`${what}: a reloaded memory loads through its load port, not from ${file}`)
    if (file !== undefined && !PLAIN_PATH.test(file)) throw Error(`${what}: the file path ${JSON.stringify(file)} has a quote, a backslash or a line break`)
    const addrWidth = this.bitWidth(depth - 1)
    const w = layout.wordWidth

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rd_addr: { direction: 'input', width: addrWidth }
    }
    if (mode === 'reloaded') {
      this.IOs.load_en = { direction: 'input' }
      this.IOs.load_addr = { direction: 'input', width: addrWidth }
      this.IOs.load_data = { direction: 'input', width: w }
    }
    for (const f of layout.fields) {
      if (f.name in this.IOs || INTERNAL.includes(f.name)) throw Error(`${what}: field ${f.name} has the name of one of the memory's own signals`)
      this.IOs[f.name] = { direction: 'output', width: f.width }
    }

    // Storage, filled from the pattern file or through the load port
    this.addSignal('mem', { width: w, isArray: BigInt(depth) })
    if (mode === 'preloaded') {
      this.addBody(`
        // Loaded from the pattern file at configuration: the SV guide's one exception to SYN-1,
        // which FPGA tools build as block RAM contents
        initial $readmem${layout.radix}("${file}", mem);
      `)
    } else {
      this.addSequentialAlways({ clk: 'clk', outputs: ['mem'] }, `
        begin : load
          if (load_en) begin
            mem[load_addr] <= load_data;
          end
        end
      `)
    }

    // The read: each field registered straight from the word at rd_addr, with the address inline
    // in a clocked block, the form synthesis tools map to block RAM (as in SRAM; an always_comb
    // read first would make the array read combinational). A field's pad bits are never read
    const reads = layout.fields.map(f => {
      const bits = w === f.width ? '' : f.width === 1 ? `[${f.lo}]` : `[${f.lo + f.width - 1}:${f.lo}]`
      return `${f.name} <= mem[rd_addr]${bits};`
    })
    this.addSequentialAlways({ clk: 'clk', outputs: layout.fields.map(f => f.name) }, `
      begin : read
        ${reads.join('\n        ')}
      end
    `)
  }
}

export default PatternMemory
