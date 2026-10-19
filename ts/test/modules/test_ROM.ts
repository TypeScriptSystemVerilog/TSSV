// Generate the ROM variants and the inputs for verilatorTB/tb_ROM.sv:
//
// 1. Every configuration below, each emitted one module per file under sv-examples/ROM/<name>/
//    (a split2two ROM with a lint filelist), its ports checked against the spec, and its words
//    against the ones the spec's parsing rules give. Then the init data the constructor rejects.
// 2. sv-examples/ROM/tb/:
//    - ROM_tb_configs.svh: per-configuration DUT name, data width, depth and expected words
//    - configs.txt: "<config> <.sv files>" per line, read by `make rom_sim`
//
// Run `make -C verilatorTB rom_sim` to generate everything, lint each variant with -Wall and
// simulate each one.

import { ROM } from 'tssv/lib/modules/ROM'
import { emitSplit } from 'tssv/test/models/emitSplit'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'

const OUT = 'sv-examples/ROM'
const TB_DIR = `${OUT}/tb`
const GENERATOR = 'ts/test/modules/test_ROM.ts'

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

interface TbConfig { name: string, dataWidth: number, words: bigint[], files: string[] }
const tbConfigs: TbConfig[] = []

// Emits `rom` under sv-examples/ROM/<name>/, one module per file, and checks it against the spec:
// its ports, its words in the case table of every module it emits, and no `undefined` (#127).
function emitRom (rom: ROM, dataWidth: number, words: bigint[]): string[] {
  let files: string[] = []
  try {
    files = emitSplit(rom, `${OUT}/${rom.name}`, GENERATOR)
  } catch (err) {
    console.error(err)
    check(`${rom.name}: emitted`, false)
    return files
  }
  const sv = files.map(f => readFileSync(f, 'utf8')).join('\n')
  check(`${rom.name}: no 'undefined' in the emitted SV`, !sv.includes('undefined'))
  check(`${rom.name}: ports match the spec`, portsOf(rom) === specPorts(dataWidth, words.length))
  const hex = (word: bigint): string => `${dataWidth}'h${word.toString(16).toUpperCase().padStart(Math.ceil(dataWidth / 4), '0')}`
  const missing = words.filter(word => !sv.includes(`data_out <= ${hex(word)};`))
  check(`${rom.name}: every word is in a case table`, missing.length === 0)
  tbConfigs.push({ name: rom.name, dataWidth, words, files })
  return files
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
mkdirSync(`${OUT}/ROM_32_big_interal`, { recursive: true })
const testMem1 = new ROM({ dataWidth: 32 }, 'ts/test/test_rom_init_file.txt', `${OUT}/ROM_32_big_interal`)
emitRom(testMem1, 32, initFileWords)
const rcf1 = readFileSync(`${OUT}/ROM_32_big_interal/ROM_32_big_interal.rcf`, 'utf8')
check(`${testMem1.name}: the RCF holds each word in binary, one per line`,
  rcf1 === initFileWords.map(w => w.toString(2).padStart(32, '0')).join('\n'))

// ================================================== tests 2, 3 ===================================================
// A file of 8-digit binary entries packed into 32-bit words, in each byte order
console.log('test 2')
emitRom(new ROM({ name: 'ROM_32_4_little_InitialFile8_test', dataWidth: 32, endianness: 'little' }, 'ts/test/test_rom_init_file_32_4_binary.txt'),
  32, pack(binaryFileBytes, 32, 'little'))
console.log('test 3')
emitRom(new ROM({ name: 'ROM_32_4_big_InitialFile8_test', dataWidth: 32, endianness: 'big' }, 'ts/test/test_rom_init_file_32_4_binary.txt'),
  32, pack(binaryFileBytes, 32, 'big'))

// ================================================== test 4 =======================================================
// A signed decimal array, negative values in two's complement
console.log('test 4')
emitRom(new ROM({ name: 'ROM_16_6_normal_array_test', dataWidth: 16 }, [-5, -255, 0, 255, 32767, -32767]),
  16, [0xFFFBn, 0xFF01n, 0x0000n, 0x00FFn, 0x7FFFn, 0x8001n])

// ================================================== tests 5, 10 ==================================================
// A Uint8Array packed into 32-bit words, in each byte order; its 17 bytes fill 4 words and 1 byte
// of a 5th, whose other bytes are zero (#127)
console.log('test 5')
const sv5 = emitRom(new ROM({ name: 'ROM_32_4_uint8array_little_test', dataWidth: 32, endianness: 'little' }, new Uint8Array(bytes17)),
  32, pack(uint8Bytes17, 32, 'little'))
check('ROM_32_4_uint8array_little_test: partly filled last word is zero-padded',
  sv5.some(f => readFileSync(f, 'utf8').includes("3'd4: data_out <= 32'h00000020;")))
console.log('test 10')
const sv10 = emitRom(new ROM({ name: 'ROM_32_5_uint8array_big_test', dataWidth: 32, endianness: 'big' }, new Uint8Array(bytes17)),
  32, pack(uint8Bytes17, 32, 'big'))
check('ROM_32_5_uint8array_big_test: partly filled last word is zero-padded',
  sv10.some(f => readFileSync(f, 'utf8').includes("3'd4: data_out <= 32'h20000000;")))

// ================================================== tests 6, 7 ===================================================
// With a width that isn't a multiple of 8, bytes aren't packed: each one is a word
console.log('test 6')
emitRom(new ROM({ name: 'ROM_31_16_uint8array_NonMul8_test', dataWidth: 31, endianness: 'little' }, new Uint8Array(bytes17)),
  31, uint8Bytes17.map(b => BigInt(b)))
console.log('test 7')
emitRom(new ROM({ name: 'ROM_25_4_big_InitialFile8_NonMul8_test', dataWidth: 25, endianness: 'big' }, 'ts/test/test_rom_init_file_32_4_binary.txt'),
  25, binaryFileBytes.map(b => BigInt(b)))

// ================================================== test 8 =======================================================
// Entries at both ends of what fits 9 bits: -256 signed and 511 unsigned
console.log('test 8')
emitRom(new ROM({ name: 'ROM_9_5_normal_array_test', dataWidth: 9 }, [-5, -256, 0, 255, 511]),
  9, [0x1FBn, 0x100n, 0x000n, 0x0FFn, 0x1FFn])

// ================================================== test 9 =======================================================
// The file of test 1 split into two ROMs: 8 words below addr[3], 2 above, addresses 10 to 15 unused
console.log('test 9')
emitRom(new ROM({ dataWidth: 32, split_setting: 'split2two' }, 'ts/test/test_rom_init_file.txt'), 32, initFileWords)

// ================================================== tests 11 to 16 ===============================================
// The configurations that change the structure (TSSV guide TEST-2), at widths that aren't 32
console.log('tests 11 to 16')
// split2two from packed bytes: 20 bytes make 5 words, 4 in the lower ROM and 1 in the upper
const bytes20 = Array.from({ length: 20 }, (_, i) => 0x10 + i)
emitRom(new ROM({ name: 'ROM_32_5_uint8array_little_split', dataWidth: 32, endianness: 'little', split_setting: 'split2two' }, new Uint8Array(bytes20)),
  32, pack(bytes20, 32, 'little'))
// split2two at its smallest depth, 3, with 8-bit words
emitRom(new ROM({ name: 'ROM_8_3_split', dataWidth: 8, split_setting: 'split2two' }, [1, -2, 127]), 8, [0x01n, 0xFEn, 0x7Fn])
// split2two with a power-of-2 depth (no address is out of range) and 40-bit words, from a string array
const words40 = Array.from({ length: 8 }, (_, i) => 0x1234567800n + BigInt(i) * 0x0101010101n)
emitRom(new ROM({ name: 'ROM_40_8_split', dataWidth: 40, split_setting: 'split2two' }, words40.map(w => `0x${w.toString(16)}`)), 40, words40)
// split2two from a string array of 8-digit binary bytes packed big-endian into 64-bit words: 70 bytes
// make 9 words, the last partly filled, so the upper ROM holds 1 word
const bytes70 = Array.from({ length: 70 }, (_, i) => (i * 37) % 256)
mkdirSync(`${OUT}/ROM_64_9_binary_split`, { recursive: true })
const testMem64 = new ROM({ name: 'ROM_64_9_binary_split', dataWidth: 64, split_setting: 'split2two' },
  bytes70.map(b => `8'b${b.toString(2).padStart(8, '0')}`), `${OUT}/ROM_64_9_binary_split`)
const words64 = pack(bytes70, 64, 'big')
emitRom(testMem64, 64, words64)
const rcf64 = readFileSync(`${OUT}/ROM_64_9_binary_split/ROM_64_9_binary_split.rcf`, 'utf8')
check('ROM_64_9_binary_split: the RCF holds each packed word, not each byte',
  rcf64 === words64.map(w => w.toString(2).padStart(64, '0')).join('\n'))
// one word: the address is still 1 bit
emitRom(new ROM({ name: 'ROM_8_1', dataWidth: 8 }, [0x5A]), 8, [0x5An])
// 1-bit words
emitRom(new ROM({ name: 'ROM_1_4', dataWidth: 1 }, [1, 0, -1, 0]), 1, [1n, 0n, 1n, 0n])
// 256-bit words from entries beyond a double's 53-bit precision
const max256 = (1n << 256n) - 1n
emitRom(new ROM({ name: 'ROM_256_3', dataWidth: 256 }, [`256'h${max256.toString(16)}`, "'d18446744073709551617", '-1']),
  256, [max256, 18446744073709551617n, max256])

// ============================================ init data the constructor rejects (TSSV guide PARAM-5)
console.log('rejected init data')
expectThrow('no entries', () => new ROM({ name: 'r', dataWidth: 8 }, []), 'MemInitFile has no entries')
expectThrow('only blank lines', () => new ROM({ name: 'r', dataWidth: 8 }, ['', ' _ ']), 'MemInitFile has no entries')
expectThrow('a missing file', () => new ROM({ name: 'r', dataWidth: 8 }, 'ts/test/no_such_rom_file.txt'), "can't read MemInitFile 'ts/test/no_such_rom_file.txt'")
expectThrow('an entry that is no literal', () => new ROM({ name: 'r', dataWidth: 8 }, ['0x12', '0xZZ']), "can't parse MemInitFile entry 1: '0xZZ'")
expectThrow('a decimal above 9 bits', () => new ROM({ name: 'r', dataWidth: 9 }, [0, 512]), 'MemInitFile entry 1 (512) doesn\'t fit in 9 bits')
expectThrow('a decimal below 9 bits', () => new ROM({ name: 'r', dataWidth: 9 }, [-257]), 'MemInitFile entry 0 (-257) doesn\'t fit in 9 bits')
expectThrow('a hex entry wider than the word', () => new ROM({ name: 'r', dataWidth: 8 }, ["'h1FF"]), "doesn't fit in 8 bits")
expectThrow('a packed entry wider than a byte', () => new ROM({ name: 'r', dataWidth: 32 }, ["8'b00000001", "'h1FF"]), "MemInitFile entry 1 ('h1FF) doesn't fit in 8 bits, as a byte")
expectThrow('a fraction', () => new ROM({ name: 'r', dataWidth: 8 }, [1.5]), 'MemInitFile entry 0 must be an integer, got 1.5')
expectThrow('split2two with 2 words', () => new ROM({ name: 'r', dataWidth: 8, split_setting: 'split2two' }, [1, 2]),
  "split_setting 'split2two' needs at least 3 words, got 2")

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
writeFileSync(`${TB_DIR}/configs.txt`, tbConfigs.map(c => `${c.name} ${c.files.join(' ')}`).join('\n') + '\n')
console.log(`${tbConfigs.length} testbench configurations written to ${TB_DIR}/`)

if (failed > 0) process.exit(1)
