import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'
import * as fs from 'fs'

/**
 * configuration parameters of the ROM module
 */
export interface ROM_Parameters extends TSSVParameters {
  /**
     * bit width of ROM data
     */
  dataWidth: IntRange<1, 256>
  /**
     * byte order of a word built from 8-bit entries, when `dataWidth` is a multiple of 8 above 8:
     * `'big'` puts the first byte in the word's top byte, `'little'` in its bottom byte
     * (default `'big'`)
     */
  endianness?: 'big' | 'little'
  /**
     * `'split2two'` builds the ROM from two ROM instances, split at its top address bit;
     * `'interal'` builds one (default `'interal'`)
     */
  split_setting?: 'interal' | 'split2two'
}

/**
 * initial contents of a ROM: the path of a file with one entry per line, an array of such
 * entries, an array of signed decimal numbers, or bytes
 */
export type ROM_InitData = string | string[] | number[] | Uint8Array

/**
 * Synchronous read-only memory. Its contents are fixed at elaboration time from `MemInitFile`,
 * and its depth is the number of words they make. Entries are binary (`'b`), hexadecimal
 * (`'h`, `0x`) or decimal (`'d`, or no prefix), with any `_` and spaces ignored. Bytes, or a file
 * of 8-digit binary entries, are packed into words when `dataWidth` is a multiple of 8 above 8.
 * Given `rcf_path`, it also writes the contents to `<rcf_path>/<name>.rcf`, one word per line in
 * binary.
 *
 * @see doc/modules/ROM/ROM-spec.md
 */
export class ROM extends Module {
  declare params: ROM_Parameters
  declare MemInitFile: ROM_InitData // initial data file path or array
  declare rcf_path: string // rcf file directory, '' for none
  constructor (params: ROM_Parameters, MemInitFile: ROM_InitData, rcf_path?: string) {
    // TSSV guide PARAM-2 deviation: the contents change the SV but aren't a parameter, so ROMs
    // that differ only in contents get the same derived name. Name each such ROM explicitly
    // until #123 makes the contents a parameter.
    super({
      name: params.name,
      dataWidth: params.dataWidth,
      endianness: params.endianness ?? 'big',
      split_setting: params.split_setting ?? 'interal'
    })
    this.rcf_path = rcf_path ?? ''
    this.MemInitFile = MemInitFile

    // contents, as one unsigned value per word
    const w = this.params.dataWidth
    const words = romWords(`ROM ${this.name}`, MemInitFile, w, this.params.endianness ?? 'big')
    const depth = words.length
    const split = this.params.split_setting === 'split2two'
    if (split && depth < 3) {
      throw Error(`ROM ${this.name}: split_setting 'split2two' needs at least 3 words, got ${depth}`)
    }
    const addrWidth = Math.max(1, this.bitWidth(depth - 1))
    const literal = (word: bigint): string => `${w}'h${word.toString(16).toUpperCase().padStart(Math.ceil(w / 4), '0')}`

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rd_en: { direction: 'input' },
      addr: { direction: 'input', width: addrWidth },
      data_out: { direction: 'output', width: w }
    }

    if (split) {
      // split2two: the lower ROM holds the words below the top address bit, the upper ROM the rest
      const lowerDepth = 2 ** (addrWidth - 1)
      const lowerAddrWidth = addrWidth - 1
      const upperAddrWidth = Math.max(1, this.bitWidth(depth - lowerDepth - 1))
      const top = `addr[${addrWidth - 1}]`
      // with a depth that isn't a power of 2, addresses past the last word read neither ROM
      const inRange = depth === 2 ** addrWidth ? '' : ` && (addr < ${addrWidth}'d${depth})`
      const low = (bits: number): string => bits === 1 ? 'addr[0]' : `addr[${bits - 1}:0]`
      this.addSignal('rd_en_l', {})
      this.addSignal('rd_en_u', {})
      this.addSignal('addr_l', { width: lowerAddrWidth })
      this.addSignal('addr_u', { width: upperAddrWidth })
      this.addAssign({ in: new Expr(`rd_en && !${top}`), out: 'rd_en_l' })
      this.addAssign({ in: new Expr(`rd_en && ${top}${inRange}`), out: 'rd_en_u' })
      this.addAssign({ in: new Expr(low(lowerAddrWidth)), out: 'addr_l' })
      this.addAssign({ in: new Expr(low(upperAddrWidth)), out: 'addr_u' })

      // which ROM the last read selected; data_out holds between reads, as in one ROM
      this.addSignal('sel_l_q', {})
      this.addSignal('sel_u_q', {})
      this.addRegister({ d: 'rd_en_l', clk: 'clk', en: 'rd_en', q: 'sel_l_q' })
      this.addRegister({ d: 'rd_en_u', clk: 'clk', en: 'rd_en', q: 'sel_u_q' })
      this.addSignal('data_out_l', { width: w })
      this.addSignal('data_out_u', { width: w })
      this.addAssign({ in: new Expr("sel_l_q ? data_out_l : (sel_u_q ? data_out_u : 'x)"), out: 'data_out' })

      // each half gets its words as 'h entries, so they're never packed from bytes again
      const half = (suffix: string, from: number, to?: number): ROM =>
        new ROM({ name: `${this.name}_${suffix}`, dataWidth: w }, words.slice(from, to).map(literal), this.rcf_path)
      this.addSubmodule('u_lower', half('lower', 0, lowerDepth),
        { clk: 'clk', rd_en: 'rd_en_l', addr: 'addr_l', data_out: 'data_out_l' })
      this.addSubmodule('u_upper', half('upper', lowerDepth),
        { clk: 'clk', rd_en: 'rd_en_u', addr: 'addr_u', data_out: 'data_out_u' })
    } else {
      // the words as a case table; the read data holds while rd_en is low
      const rows = words.map((word, i) => `${addrWidth}'d${i}: data_out <= ${literal(word)};`)
      this.addSequentialAlways({ clk: 'clk', outputs: ['data_out'] }, `
        begin : rom_read
          if (rd_en) begin
            case (addr)
              ${rows.join('\n              ')}
              default: data_out <= 'x;
            endcase
          end
        end
      `)
    }

    if (this.rcf_path !== '') {
      fs.writeFileSync(`${this.rcf_path}/${this.name}.rcf`, words.map(word => word.toString(2).padStart(w, '0')).join('\n'))
    }
  }
}

// One entry of a file or a string array, with any '_' and spaces already removed:
// [-][size]'b<binary>, [-][size]'h<hex>, [-][size]'d<decimal>, [-]0x<hex>, or [-]<decimal>.
// The size is ignored. Returns undefined if the entry isn't one of these.
function parseEntry (text: string): bigint | undefined {
  const m = /^(-?)(?:\d*'([bhd])|0(x))?(.+)$/i.exec(text)
  if (m === null) return undefined
  const [, sign, quoted, ox, digits = ''] = m
  const base = (quoted ?? ox ?? 'd').toLowerCase()
  const valid = base === 'b' ? /^[01]+$/ : base === 'd' ? /^\d+$/ : /^[0-9a-f]+$/i
  if (!valid.test(digits)) return undefined
  const value = BigInt((base === 'b' ? '0b' : base === 'd' ? '' : '0x') + digits)
  return sign === '-' ? -value : value
}

// The ROM's words from its init data, each an unsigned value below 2^dataWidth. `who` starts
// every error message.
function romWords (who: string, init: ROM_InitData, dataWidth: number, endianness: 'big' | 'little'): bigint[] {
  const values: bigint[] = []
  const where: string[] = [] // each value's entry, for error messages
  let firstText: string | undefined // the first entry of a file or string array
  if (init instanceof Uint8Array) {
    init.forEach((b, i) => { values.push(BigInt(b)); where.push(`entry ${i} (${b})`) })
  } else if (typeof init === 'string' || init.some(e => typeof e === 'string')) {
    let lines: string[]
    let label: (i: number) => string
    if (typeof init === 'string') {
      try {
        lines = fs.readFileSync(init, 'utf8').split(/\r?\n/)
      } catch (err) {
        throw Error(`${who}: can't read MemInitFile '${init}': ${(err as Error).message}`)
      }
      label = i => `line ${i + 1}`
    } else {
      lines = init.map(String)
      label = i => `entry ${i}`
    }
    lines.forEach((line, i) => {
      const text = line.replace(/[_\s]/g, '')
      if (text === '') return // blank lines, such as a file's last newline, are skipped
      const value = parseEntry(text)
      if (value === undefined) throw Error(`${who}: can't parse MemInitFile ${label(i)}: '${line.trim()}'`)
      firstText ??= text
      values.push(value)
      where.push(`${label(i)} (${line.trim()})`)
    })
  } else {
    init.forEach((n, i) => {
      if (!Number.isSafeInteger(n)) throw Error(`${who}: MemInitFile entry ${i} must be an integer, got ${n}`)
      values.push(BigInt(n))
      where.push(`entry ${i} (${n})`)
    })
  }
  if (values.length === 0) throw Error(`${who}: MemInitFile has no entries`)

  // Bytes are packed into words when a word holds more than one byte: a Uint8Array's, or a file's
  // or string array's whose first entry is 8-digit binary
  const packed = dataWidth % 8 === 0 && dataWidth > 8 &&
    (init instanceof Uint8Array || /^-?\d*'b[01]{8}$/i.test(firstText ?? ''))
  // an entry fits if it's a value of this many bits, signed or unsigned
  const bits = packed ? 8 : dataWidth
  values.forEach((v, i) => {
    if (v < -(1n << BigInt(bits - 1)) || v >= 1n << BigInt(bits)) {
      throw Error(`${who}: MemInitFile ${where[i]} doesn't fit in ${bits} bits${packed ? ', as a byte packed into a word' : ''}`)
    }
  })
  const unsigned = (v: bigint, n: number): bigint => v & ((1n << BigInt(n)) - 1n)
  if (!packed) return values.map(v => unsigned(v, dataWidth))

  // a partly filled last word gets zero bytes
  const perWord = dataWidth / 8
  const words: bigint[] = []
  for (let i = 0; i < values.length; i += perWord) {
    let word = 0n
    for (let j = 0; j < perWord; j++) {
      const shift = 8 * (endianness === 'little' ? j : perWord - 1 - j)
      word |= unsigned(values[i + j] ?? 0n, 8) << BigInt(shift)
    }
    words.push(word)
  }
  return words
}

export default ROM
