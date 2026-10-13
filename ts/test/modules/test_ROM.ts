import { ROM } from 'tssv/lib/modules/ROM'
import { writeFileSync, mkdirSync } from 'fs'

let failed = 0

function check (label: string, ok: boolean): void {
  if (ok) {
    console.log(`PASS: ${label}`)
  } else {
    console.error(`FAIL: ${label}`)
    failed++
  }
}

// Write a ROM's SV under sv-examples/ROM/<name>/ and return it. Any 'undefined' in the output
// means the generator read past its init data.
function writeRom (rom: ROM): string {
  let sv = ''
  try {
    sv = rom.writeSystemVerilog()
    mkdirSync(`sv-examples/ROM/${rom.name}`, { recursive: true })
    writeFileSync(`sv-examples/ROM/${rom.name}/${rom.name}.sv`, sv)
  } catch (err) {
    console.error(err)
    failed++
  }
  check(`${rom.name}: no 'undefined' in the emitted SV`, !sv.includes('undefined'))
  return sv
}

// ================================================== test 1 =======================================================
// Input binary, decimal (including positive and negative numbers), and hexadecimal initial files, requiring the ability to output system verilog and RCF normally
// Read hex file as ROM initial data, the data can be 0xbeefcafe, 0Xbeefcafe, 32'hbeefcafe, 'hbeefcafe, 'dbeefcafe and beefcafe(Without identifiers, default to decimal), where decimal numbers support negative values
// rom_width:32 initial_data_width:32 initial_data_depth:10
console.log('test 1')
mkdirSync('sv-examples/ROM/ROM_32_big_interal', { recursive: true })
const testMem1 = new ROM({ dataWidth: 32 }, 'ts/test/test_rom_init_file.txt', 'sv-examples/ROM/ROM_32_big_interal')
writeRom(testMem1)

// ================================================== test 2 =======================================================
// Input a binary initial file with a bit width of 8 bits, test the endian's 'little' sorting function, and output the correct system verilog file
// rom_width:32, initial_data_width:8, initial_data_depth:16, Binary, endianness:little
console.log('test 2')
const testMem2 = new ROM({ name: 'ROM_32_4_little_InitialFile8_test', dataWidth: 32, endianness: 'little' }, 'ts/test/test_rom_init_file_32_4_binary.txt')
writeRom(testMem2)

// ================================================== test 3 =======================================================
// Input a binary initial file with a bit width of 8 bits, test the endian's 'big' sorting function, and output the correct system verilog file
// rom_width:32, initial_data_width:8, initial_data_depth:16, Binary, endianness:big
console.log('test 3')
const testMem3 = new ROM({ name: 'ROM_32_4_big_InitialFile8_test', dataWidth: 32, endianness: 'big' }, 'ts/test/test_rom_init_file_32_4_binary.txt')
writeRom(testMem3)

// ================================================== test 4 =======================================================
// Input a normal array containing positive and negative numbers, and it is required to be able to output system verilog normally
// rom_width:16    array_data_width:less than 16    array_data_depth:6    signed decimal
console.log('test 4')
const test_array_dec: number [] = [-5, -255, 0, 255, 32767, -32767]
const testMem4 = new ROM({ name: 'ROM_16_6_normal_array_test', dataWidth: 16 }, test_array_dec)
writeRom(testMem4)

// ================================================== test 5 =======================================================
// Input the uint8array array and test the endian's' little 'sorting function. The correct system verilog file should be output. Negative numbers should be represented in binary complement form with a bit width of 8
// rom_width:32    array_data_width:less than 16    array_data_depth:4    signed decimal     Uint8Array   endiness:little
console.log('test 5')
const test_uint8array_dec = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 255, -255, 288])
const testMem5 = new ROM({ name: 'ROM_32_4_uint8array_little_test', dataWidth: 32, endianness: 'little' }, test_uint8array_dec)
const sv5 = writeRom(testMem5)
// 17 bytes fill 4 words and 1 byte of a 5th; the missing high bytes are zero
check(`${testMem5.name}: partly filled last word is zero-padded`, sv5.includes("3'd4: data_out <= 32'h00000020;"))

// ================================================== test 6 =======================================================
// The input is a uint8array array, but the ROM bit width is a non integer multiple of 8. Check if the initial data is expanded in the generated ROM
// rom_width:31    array_data_width:less than 32    array_data_depth:4    signed decimal     Uint8Array   endiness:little
console.log('test 6')
const testMem6 = new ROM({ name: 'ROM_31_16_uint8array_NonMul8_test', dataWidth: 31, endianness: 'little' }, test_uint8array_dec)
writeRom(testMem6)

// ================================================== test 7 =======================================================
// Input a binary initial file with a bit width of 8 bits, but the ROM bit width is a non integer multiple of 8. Check if the generated ROM expands the initial data
// rom_width:25, initial_data_width:8, initial_data_depth:16, Binary, endianness:big
console.log('test 7')
const testMem7 = new ROM({ name: 'ROM_25_4_big_InitialFile8_NonMul8_test', dataWidth: 25, endianness: 'big' }, 'ts/test/test_rom_init_file_32_4_binary.txt')
writeRom(testMem7)

// ================================================== test 8 =======================================================
// The bit width of the input data in the array is greater than the ROM bit width. Check if an error can be reported
// rom_width:9    array_data_width:bigger than 9    array_data_depth:5    signed decimal
console.log('test 8')
const array_item_ExceedRomWidth: number [] = [-5, -255, 0, 255, 511]
const testMem8 = new ROM({ name: 'ROM_9_5_normal_array_test', dataWidth: 9 }, array_item_ExceedRomWidth)
writeRom(testMem8)

// ================================================== test 9 =======================================================
// Test the function of generating ROMs that are divided into lower and upper ROMs based on depth segmentation
// rom_width:32 initial_data_width:32 initial_data_depth:10         Split into two ROMs
console.log('test 9')
const testMem9 = new ROM({ dataWidth: 32, split_setting: 'split2two' }, 'ts/test/test_rom_init_file.txt')
writeRom(testMem9)

// ================================================== test 10 ======================================================
// The same partly filled Uint8Array as test 5 with endianness 'big': the last word's missing low bytes are zero
// rom_width:32    array_data_depth:5    Uint8Array   endiness:big
console.log('test 10')
const testMem10 = new ROM({ name: 'ROM_32_5_uint8array_big_test', dataWidth: 32, endianness: 'big' }, test_uint8array_dec)
const sv10 = writeRom(testMem10)
check(`${testMem10.name}: partly filled last word is zero-padded`, sv10.includes("3'd4: data_out <= 32'h20000000;"))

if (failed > 0) process.exit(1)
