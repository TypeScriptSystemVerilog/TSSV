// Generate the ROM variants and the inputs for verilatorTB/tb_ROM.sv:
//
// 1. Every configuration below, each emitted to sv-examples/ROM/<name>/<name>.sv, its ports checked
//    against the spec, and its words against the ones the spec's parsing rules give. Then the init
//    data the constructor rejects.
// 2. sv-examples/ROM/tb/:
//    - ROM_tb_configs.svh: per-configuration DUT name, data width, depth and expected words
//    - configs.txt: "<config> <.sv files>" per line, read by `make rom_sim`
//
// Run `make -C verilatorTB rom_sim` to generate everything, lint each variant with -Wall and
// simulate each one.

import { ROM, type ROM_Parameters } from 'tssv/lib/modules/ROM'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { moduleSV } from '../models/emitted.js'

const OUT = 'sv-examples/ROM'
const TB_DIR = `${OUT}/tb`
const INIT_DIR = `${OUT}/init`

let failed = 0

function check (label: string, ok: boolean): void {
  if (ok) {
    console.log(`PASS: ${label}`)
  } else {
    console.error(`FAIL: ${label}`)
    failed++
  }
}

function expectThrow (label: string, fn: () => unknown, message: string): void {
  try {
    fn()
    check(`${label} (no error thrown)`, false)
  } catch (err) {
    const got = (err as Error).message
    check(`${label}: ${got}`, got.includes(message))
  }
}

// words of `bytes` packed `dataWidth / 8` to a word, the last word zero-filled (spec, Functional
// Description 2)
function pack (bytes: number[], dataWidth: number, endianness: 'big' | 'little'): bigint[] {
  const per = dataWidth / 8
  const words: bigint[] = []
  for (let i = 0; i < bytes.length; i += per) {
    const group = Array.from({ length: per }, (_, j) => BigInt(bytes[i + j] ?? 0))
    if (endianness === 'big') group.reverse()
    words.push(group.reduce((word, b, j) => word | (b << BigInt(8 * j)), 0n))
  }
  return words
}

// the module's ports as "name:width" in declaration order
function portsOf (rom: ROM): string {
  return Object.entries((rom as unknown as { IOs: Record<string, { width?: number }> }).IOs)
    .map(([name, io]) => `${name}:${io.width ?? 1}`).join(' ')
}

// the ports the spec lists for a ROM of this width and depth
function specPorts (dataWidth: number, depth: number): string {
  const addrWidth = Math.max(1, Math.ceil(Math.log2(depth)))
  return `clk:1 rd_en:1 addr:${addrWidth} data_out:${dataWidth}`
}

// writes an init file of these lines to sv-examples/ROM/init/<name>.txt and returns its path
function initFile (name: string, lines: string[]): string {
  mkdirSync(INIT_DIR, { recursive: true })
  writeFileSync(`${INIT_DIR}/${name}.txt`, lines.join('\n'))
  return `${INIT_DIR}/${name}.txt`
}

interface TbConfig { name: string, dataWidth: number, words: bigint[], file: string }
const tbConfigs: TbConfig[] = []

// Writes `rom` under sv-examples/ROM/<name>/, checks its file against the spec (its ports, its
// words in the case table, no `undefined` (#127)), and returns its SV.
function emitRom (rom: ROM, dataWidth: number, words: bigint[]): string {
  let file = ''
  let sv = ''
  try {
    file = rom.writeSystemVerilogFiles(`${OUT}/${rom.name}`).at(-1) ?? ''
    sv = readFileSync(file, 'utf8')
  } catch (err) {
    console.error(err)
    check(`${rom.name}: emitted`, false)
    return sv
  }
  check(`${rom.name}: no 'undefined' in the emitted SV`, !sv.includes('undefined'))
  check(`${rom.name}: ports match the spec`, portsOf(rom) === specPorts(dataWidth, words.length))
  const hex = (word: bigint): string => `${dataWidth}'h${word.toString(16).toUpperCase().padStart(Math.ceil(dataWidth / 4), '0')}`
  const missing = words.filter(word => !sv.includes(`data_out <= ${hex(word)};`))
  check(`${rom.name}: every word is in the case table`, missing.length === 0)
  tbConfigs.push({ name: rom.name, dataWidth, words, file })
  return sv
}

// the words of ts/test/test_rom_init_file.txt, one per line, at 32 bits
const initFileWords = [0x0A0B0C0Dn, 0x01020304n, 0x0A0A0B0Bn, 0x0000FFFFn, 0xFFFF0001n,
  0x000000FFn, 0xFFFFFF01n, 0xAAAAAAAAn, 0x00000055n, 0x00559ABCn]
// ts/test/test_rom_init_file_32_4_binary.txt holds the bytes 0 to 15 in 8-digit binary
const binaryFileBytes = Array.from({ length: 16 }, (_, i) => i)
// a Uint8Array wraps -255 to 1 and 288 to 32
const bytes17 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 255, -255, 288]
const uint8Bytes17 = Array.from(new Uint8Array(bytes17))

// ================================================== test 1 =======================================================
// A file of binary, hexadecimal and decimal entries, with sizes, '_' and spaces; writes an RCF too
console.log('test 1')
mkdirSync(`${OUT}/rcf`, { recursive: true })
const testMem1 = new ROM({ dataWidth: 32, ROMContents: 'ts/test/test_rom_init_file.txt' }, `${OUT}/rcf`)
check(`${testMem1.name}: the derived name holds a hash of the contents`, /^ROM_[0-9a-z]{8}_32_big_default$/.test(testMem1.name))
emitRom(testMem1, 32, initFileWords)
const rcf1 = readFileSync(`${OUT}/rcf/${testMem1.name}.rcf`, 'utf8')
check(`${testMem1.name}: the RCF holds each word in binary, one per line`,
  rcf1 === initFileWords.map(w => w.toString(2).padStart(32, '0')).join('\n'))

// ================================================== tests 2, 3 ===================================================
// A file of 8-digit binary entries packed into 32-bit words, in each byte order
console.log('test 2')
emitRom(new ROM({ dataWidth: 32, endianness: 'little', ROMContents: 'ts/test/test_rom_init_file_32_4_binary.txt' }),
  32, pack(binaryFileBytes, 32, 'little'))
console.log('test 3')
emitRom(new ROM({ dataWidth: 32, endianness: 'big', ROMContents: 'ts/test/test_rom_init_file_32_4_binary.txt' }),
  32, pack(binaryFileBytes, 32, 'big'))

// ================================================== test 4 =======================================================
// A signed decimal array, negative values in two's complement
console.log('test 4')
emitRom(new ROM({ dataWidth: 16, ROMContents: [-5, -255, 0, 255, 32767, -32767] }),
  16, [0xFFFBn, 0xFF01n, 0x0000n, 0x00FFn, 0x7FFFn, 0x8001n])

// ================================================== tests 5, 9 ===================================================
// A Uint8Array packed into 32-bit words, in each byte order; its 17 bytes fill 4 words and 1 byte
// of a 5th, whose other bytes are zero (#127)
console.log('test 5')
const sv5 = emitRom(new ROM({ dataWidth: 32, endianness: 'little', ROMContents: new Uint8Array(bytes17) }),
  32, pack(uint8Bytes17, 32, 'little'))
check('17 little-endian bytes: partly filled last word is zero-padded', sv5.includes("3'd4: data_out <= 32'h00000020;"))
console.log('test 9')
const sv10 = emitRom(new ROM({ dataWidth: 32, endianness: 'big', ROMContents: new Uint8Array(bytes17) }),
  32, pack(uint8Bytes17, 32, 'big'))
check('17 big-endian bytes: partly filled last word is zero-padded', sv10.includes("3'd4: data_out <= 32'h20000000;"))

// ================================================== tests 6, 7 ===================================================
// With a width that isn't a multiple of 8, bytes aren't packed: each one is a word
console.log('test 6')
emitRom(new ROM({ dataWidth: 31, endianness: 'little', ROMContents: new Uint8Array(bytes17) }),
  31, uint8Bytes17.map(b => BigInt(b)))
console.log('test 7')
emitRom(new ROM({ dataWidth: 25, endianness: 'big', ROMContents: 'ts/test/test_rom_init_file_32_4_binary.txt' }),
  25, binaryFileBytes.map(b => BigInt(b)))

// ================================================== test 8 =======================================================
// Entries at both ends of what fits 9 bits: -256 signed and 511 unsigned
console.log('test 8')
emitRom(new ROM({ dataWidth: 9, ROMContents: [-5, -256, 0, 255, 511] }),
  9, [0x1FBn, 0x100n, 0x000n, 0x0FFn, 0x1FFn])

// ================================================== tests 10 to 14 ===============================================
// Widths and depths the tests above don't reach (TSSV guide TEST-2)
console.log('tests 10 to 14')
// 40-bit words with a power-of-2 depth, so no address is past the last word
const words40 = Array.from({ length: 8 }, (_, i) => 0x1234567800n + BigInt(i) * 0x0101010101n)
emitRom(new ROM({ dataWidth: 40, ROMContents: words40.map(Number) }), 40, words40)
// 70 bytes packed big-endian into 64-bit words: 9 words, the last partly filled; with an RCF
const bytes70 = Array.from({ length: 70 }, (_, i) => (i * 37) % 256)
const testMem64 = new ROM({ dataWidth: 64, ROMContents: new Uint8Array(bytes70) }, `${OUT}/rcf`)
const words64 = pack(bytes70, 64, 'big')
emitRom(testMem64, 64, words64)
const rcf64 = readFileSync(`${OUT}/rcf/${testMem64.name}.rcf`, 'utf8')
check(`${testMem64.name}: the RCF holds each packed word, not each byte`,
  rcf64 === words64.map(w => w.toString(2).padStart(64, '0')).join('\n'))
// one word: the address is still 1 bit
emitRom(new ROM({ dataWidth: 8, ROMContents: [0x5A] }), 8, [0x5An])
// 1-bit words
emitRom(new ROM({ dataWidth: 1, ROMContents: [1, 0, -1, 0] }), 1, [1n, 0n, 1n, 0n])
// 256-bit words from entries beyond a double's 53-bit precision, in a file with blank lines
const max256 = (1n << 256n) - 1n
emitRom(new ROM({ dataWidth: 256, ROMContents: initFile('words_256', [`256'h${max256.toString(16)}`, '', "'d18446744073709551617", '-1', '']) }),
  256, [max256, 18446744073709551617n, max256])

// ================================================== test 15 ======================================================
// A string array of every entry format: the spec's mixed-format example
console.log('test 15')
emitRom(new ROM({ dataWidth: 16, ROMContents: ['0x1234', '0XDE AD', "16'hBEEF", "'b1010_0101", "'d100", '-1', '255'] }),
  16, [0x1234n, 0xDEADn, 0xBEEFn, 0x00A5n, 0x0064n, 0xFFFFn, 0x00FFn])

// ============================================ the module name holds the contents (TSSV guide PARAM-2)
console.log('module names')
const named = (p: Partial<ROM_Parameters>): string => new ROM({ dataWidth: 8, ROMContents: [1, 2], ...p }).name
check('different contents give different names', named({ ROMContents: [1, 2] }) !== named({ ROMContents: [1, 3] }))
check('the same words from a file and a number array give the same name',
  named({ ROMContents: initFile('words_5_6', ['0x05', "'d6"]) }) === named({ ROMContents: [5, 6] }))
check('the same file contents at two paths give the same name',
  named({ ROMContents: initFile('copy_a', ['0x07', '0x08']) }) === named({ ROMContents: initFile('copy_b', ['0x07', '0x08']) }))
check('macroConfig changes the name', named({}) !== named({ macroConfig: 'hd' }))
check("leaving macroConfig out is the same as 'default'", named({}) === named({ macroConfig: 'default' }))
check('a derived name is a legal SV identifier, without the file path',
  [named({}), testMem1.name].every(n => /^[A-Za-z_][A-Za-z0-9_$]*$/.test(n)))
check('every ROM above has its own derived name, with a hash of its contents',
  new Set(tbConfigs.map(c => c.name)).size === tbConfigs.length &&
  tbConfigs.every(c => /^ROM_[0-9a-z]{8}_\d+_(big|little)_default$/.test(c.name)))
check('an explicit name is used as given', new ROM({ name: 'my_rom', dataWidth: 8, ROMContents: [1, 2] }).name === 'my_rom')
const rebuilt = new ROM({ ...testMem1.params, name: undefined })
check('a ROM rebuilt from its params gets the same name and SV',
  rebuilt.name === testMem1.name && moduleSV(rebuilt) === moduleSV(testMem1))
const svHd = moduleSV(new ROM({ name: 'ROM_hd', dataWidth: 8, ROMContents: [1, 2, 3], macroConfig: 'hd' }))
check('the parameter comment gives macroConfig, and the word count for the contents',
  svHd.includes('// macroConfig = hd') && /\/\/ ROMContents = 3 words, hash [0-9a-z]{8}, in rom_read/.test(svHd))
const hash1 = testMem1.name.split('_')[1] ?? ''
check(`${testMem1.name}: the parameter comment gives the hash in the derived name`,
  moduleSV(testMem1).includes(`// ROMContents = 10 words, hash ${hash1}, in rom_read`))

// ============================================ contents the constructor rejects (TSSV guide PARAM-5)
console.log('rejected contents')
expectThrow('no entries', () => new ROM({ name: 'r', dataWidth: 8, ROMContents: [] }), 'ROMContents has no entries')
expectThrow('only blank lines', () => new ROM({ name: 'r', dataWidth: 8, ROMContents: initFile('blank', ['', ' _ ', '']) }), 'ROMContents has no entries')
expectThrow('a missing file', () => new ROM({ name: 'r', dataWidth: 8, ROMContents: 'ts/test/no_such_rom_file.txt' }), "can't read ROMContents file 'ts/test/no_such_rom_file.txt'")
expectThrow('an entry that is no literal', () => new ROM({ name: 'r', dataWidth: 8, ROMContents: initFile('bad_literal', ['0x12', '0xZZ']) }), "can't parse ROMContents line 2: '0xZZ'")
expectThrow('a decimal above 9 bits', () => new ROM({ name: 'r', dataWidth: 9, ROMContents: [0, 512] }), 'ROMContents entry 1 (512) doesn\'t fit in 9 bits')
expectThrow('a decimal below 9 bits', () => new ROM({ name: 'r', dataWidth: 9, ROMContents: [-257] }), 'ROMContents entry 0 (-257) doesn\'t fit in 9 bits')
expectThrow('a hex entry wider than the word', () => new ROM({ name: 'r', dataWidth: 8, ROMContents: initFile('wide_hex', ["'h1FF"]) }), "ROMContents line 1 ('h1FF) doesn't fit in 8 bits")
expectThrow('a packed entry wider than a byte', () => new ROM({ name: 'r', dataWidth: 32, ROMContents: initFile('wide_byte', ["8'b00000001", "'h1FF"]) }), "ROMContents line 2 ('h1FF) doesn't fit in 8 bits, as a byte")
expectThrow('a fraction', () => new ROM({ name: 'r', dataWidth: 8, ROMContents: [1.5] }), 'ROMContents entry 0 must be an integer, got 1.5')

// ============================================ testbench inputs
mkdirSync(TB_DIR, { recursive: true })
let svh = '// Generated by ts/test/modules/test_ROM.ts: per-configuration DUT and expected words for tb_ROM.sv\n'
tbConfigs.forEach((c, i) => {
  const words = c.words.map(w => `${c.dataWidth}'h${w.toString(16)}`).join(', ')
  svh += `${i === 0 ? '`ifdef' : '`elsif'} CFG_${c.name}\n`
  svh += `  \`define ROM_DUT ${c.name}\n  \`define DATA_WIDTH ${c.dataWidth}\n  \`define DEPTH ${c.words.length}\n`
  svh += `  \`define ROM_WORDS '{${words}}\n`
})
svh += '`else\n  `error "define one of the CFG_<config> macros"\n`endif\n'
writeFileSync(`${TB_DIR}/ROM_tb_configs.svh`, svh)
writeFileSync(`${TB_DIR}/configs.txt`, tbConfigs.map(c => `${c.name} ${c.file}`).join('\n') + '\n')
console.log(`${tbConfigs.length} testbench configurations written to ${TB_DIR}/`)

if (failed > 0) process.exit(1)
