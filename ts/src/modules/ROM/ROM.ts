import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
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
}

/**
 * initial contents of a ROM: the path of a file with one entry per line, an array of signed
 * decimal numbers, or bytes
 */
export type ROM_InitData = string | number[] | Uint8Array

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
      endianness: params.endianness ?? 'big'
    })
    this.rcf_path = rcf_path ?? ''
    this.MemInitFile = MemInitFile

    // contents, as one unsigned value per word
    const w = this.params.dataWidth
    const words = romWords(`ROM ${this.name}`, MemInitFile, w, this.params.endianness ?? 'big')
    const addrWidth = Math.max(1, this.bitWidth(words.length - 1))
    const literal = (word: bigint): string => `${w}'h${word.toString(16).toUpperCase().padStart(Math.ceil(w / 4), '0')}`

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rd_en: { direction: 'input' },
      addr: { direction: 'input', width: addrWidth },
      data_out: { direction: 'output', width: w }
    }

    // the words as a case table; the read data holds while rd_en is low
    const rows = words.map((word, i) => `${addrWidth}'d${i}: data_out <= ${literal(word)};`)
    this.addSequentialAlways({ clk: 'clk', outputs: ['data_out'] }, `
      begin : rom_read
        if (rd_en) begin
          case (addr)
            ${rows.join('\n            ')}
            default: data_out <= 'x;
          endcase
        end
      end
    `)

    if (this.rcf_path !== '') {
      fs.writeFileSync(`${this.rcf_path}/${this.name}.rcf`, words.map(word => word.toString(2).padStart(w, '0')).join('\n'))
    }
  }
}

// One entry of a file, with any '_' and spaces already removed:
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
  let firstText: string | undefined // the first entry of a file
  if (init instanceof Uint8Array) {
    init.forEach((b, i) => { values.push(BigInt(b)); where.push(`entry ${i} (${b})`) })
  } else if (typeof init === 'string') {
    let lines: string[]
    try {
      lines = fs.readFileSync(init, 'utf8').split(/\r?\n/)
    } catch (err) {
      throw Error(`${who}: can't read MemInitFile '${init}': ${(err as Error).message}`)
    }
    lines.forEach((line, i) => {
      const text = line.replace(/[_\s]/g, '')
      if (text === '') return // blank lines, such as the last newline, are skipped
      const value = parseEntry(text)
      if (value === undefined) throw Error(`${who}: can't parse MemInitFile line ${i + 1}: '${line.trim()}'`)
      firstText ??= text
      values.push(value)
      where.push(`line ${i + 1} (${line.trim()})`)
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
  // whose first entry is 8-digit binary
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
