import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
import * as fs from 'fs'

/**
 * contents of a ROM: the path of a file with one entry per line, an array of such entries, an
 * array of signed decimal numbers, or bytes
 */
export type ROM_Contents = string | string[] | number[] | Uint8Array

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
     * the ROM's contents, whose words set its depth. The constructor replaces the value with one
     * `'h` entry per word, so a derived module name holds a hash of the words, never a file path,
     * and the same words give the same name however they were given
     */
  ROMContents: ROM_Contents
  /**
     * macroConfig is a free form string parameter that allows selection of technology
     * specific ROM macro generator parameters such as high-speed, high-density,
     * mux configuration, leakage selection, etc.
     * This parameter has no influence on the behavior of the ROM behavioral model and
     * is meant only to choose macro generation settings that effect the size, speed, and
     * power performance of the resulting macro (default `'default'`)
     */
  macroConfig?: string
}

/**
 * Synchronous read-only memory. Its contents are fixed at elaboration time from `ROMContents`,
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
  declare rcf_path: string // rcf file directory, '' for none
  constructor (params: ROM_Parameters, rcf_path?: string) {
    // the contents, as one unsigned value per word, then as the 'h entries the parameter holds
    const w = params.dataWidth
    const endianness = params.endianness ?? 'big'
    const words = romWords(params.name === undefined ? 'ROM' : `ROM ${params.name}`, params.ROMContents, w, endianness)
    const hex = (word: bigint): string => word.toString(16).toUpperCase().padStart(Math.ceil(w / 4), '0')
    super({
      name: params.name,
      dataWidth: w,
      endianness,
      ROMContents: words.map(word => `'h${hex(word)}`),
      macroConfig: params.macroConfig || 'default'
    })
    this.rcf_path = rcf_path ?? ''
    const addrWidth = Math.max(1, this.bitWidth(words.length - 1))

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rd_en: { direction: 'input' },
      addr: { direction: 'input', width: addrWidth },
      data_out: { direction: 'output', width: w }
    }

    // the words as a case table; the read data holds while rd_en is low
    const rows = words.map((word, i) => `${addrWidth}'d${i}: data_out <= ${w}'h${hex(word)};`)
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

  // The contents are the case table, so the SV's parameter comment gives only their size
  protected override formatParametersForComment (
    params: TSSVParameters = this.params,
    opts?: { prefix?: string, skipName?: boolean }
  ): string {
    const contents = params.ROMContents
    const summary = Array.isArray(contents) ? { ...params, ROMContents: `${contents.length} words, in rom_read` } : params
    return super.formatParametersForComment(summary, opts)
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

// The ROM's words from its contents, each an unsigned value below 2^dataWidth. `who` starts
// every error message.
function romWords (who: string, contents: ROM_Contents, dataWidth: number, endianness: 'big' | 'little'): bigint[] {
  const values: bigint[] = []
  const where: string[] = [] // each value's entry, for error messages
  let firstText: string | undefined // the first entry of a file or string array
  if (contents instanceof Uint8Array) {
    contents.forEach((b, i) => { values.push(BigInt(b)); where.push(`entry ${i} (${b})`) })
  } else if (typeof contents === 'string' || contents.some(e => typeof e === 'string')) {
    let lines: string[]
    let label: (i: number) => string
    if (typeof contents === 'string') {
      try {
        lines = fs.readFileSync(contents, 'utf8').split(/\r?\n/)
      } catch (err) {
        throw Error(`${who}: can't read ROMContents file '${contents}': ${(err as Error).message}`)
      }
      label = i => `line ${i + 1}`
    } else {
      lines = contents.map(String)
      label = i => `entry ${i}`
    }
    lines.forEach((line, i) => {
      const text = line.replace(/[_\s]/g, '')
      if (text === '') return // blank entries, such as a file's last newline, are skipped
      const value = parseEntry(text)
      if (value === undefined) throw Error(`${who}: can't parse ROMContents ${label(i)}: '${line.trim()}'`)
      firstText ??= text
      values.push(value)
      where.push(`${label(i)} (${line.trim()})`)
    })
  } else {
    contents.forEach((n, i) => {
      if (!Number.isSafeInteger(n)) throw Error(`${who}: ROMContents entry ${i} must be an integer, got ${n}`)
      values.push(BigInt(n))
      where.push(`entry ${i} (${n})`)
    })
  }
  if (values.length === 0) throw Error(`${who}: ROMContents has no entries`)

  // Bytes are packed into words when a word holds more than one byte: a Uint8Array's, or a file's
  // or string array's whose first entry is 8-digit binary
  const packed = dataWidth % 8 === 0 && dataWidth > 8 &&
    (contents instanceof Uint8Array || /^-?\d*'b[01]{8}$/i.test(firstText ?? ''))
  // an entry fits if it's a value of this many bits, signed or unsigned
  const bits = packed ? 8 : dataWidth
  values.forEach((v, i) => {
    if (v < -(1n << BigInt(bits - 1)) || v >= 1n << BigInt(bits)) {
      throw Error(`${who}: ROMContents ${where[i]} doesn't fit in ${bits} bits${packed ? ', as a byte packed into a word' : ''}`)
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
