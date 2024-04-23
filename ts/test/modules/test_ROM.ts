import { ROM } from 'tssv/lib/modules/ROM'
import { writeFileSync } from 'fs'

// If you need an RCF file, just add the output path of the RCF file in the parameter list
const rcf_file_path: string = 'sv-examples/test_ROM_output'

// ================================================== test 1 =======================================================
// Input binary, decimal (including positive and negative numbers), and hexadecimal initial files, requiring the ability to output system verilog and RCF normally
// Read hex file as ROM initial data, the data can be 0xbeefcafe, 0Xbeefcafe, 32'hbeefcafe, 'hbeefcafe, 'dbeefcafe and beefcafe(Without identifiers, default to decimal), where decimal numbers support negative values
// rom_width:32 initial_data_width:32 initial_data_depth:10
console.log('test 1')
const testMem1 = new ROM({ dataWidth: 32 }, 'ts/test/test_rom_init_file.txt', rcf_file_path)
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem1.name}.sv`, testMem1.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ================================================== test 2 =======================================================
// Input a binary initial file with a bit width of 8 bits, test the endian's 'little' sorting function, and output the correct system verilog file
// rom_width:32, initial_data_width:8, initial_data_depth:16, Binary, endianness:little
console.log('test 2')
const testMem2 = new ROM({ name: 'ROM_32_4_little_InitialFile8_test', dataWidth: 32, endianness: 'little' }, 'ts/test/test_rom_init_file_32_4_binary.txt')
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem2.name}.sv`, testMem2.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ================================================== test 3 =======================================================
// Input a binary initial file with a bit width of 8 bits, test the endian's 'big' sorting function, and output the correct system verilog file
// rom_width:32, initial_data_width:8, initial_data_depth:16, Binary, endianness:big
console.log('test 3')
const testMem3 = new ROM({ name: 'ROM_32_4_big_InitialFile8_test', dataWidth: 32, endianness: 'big' }, 'ts/test/test_rom_init_file_32_4_binary.txt')
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem3.name}.sv`, testMem3.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ================================================== test 4 =======================================================
// Input a normal array containing positive and negative numbers, and it is required to be able to output system verilog normally
// rom_width:16    array_data_width:less than 16    array_data_depth:6    signed decimal
console.log('test 4')
const test_array_dec: number [] = [-5, -255, 0, 255, 32767, -32767]
const testMem4 = new ROM({ name: 'ROM_16_6_normal_array_test', dataWidth: 16 }, test_array_dec)
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem4.name}.sv`, testMem4.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ================================================== test 5 =======================================================
// Input the uint8array array and test the endian's' little 'sorting function. The correct system verilog file should be output. Negative numbers should be represented in binary complement form with a bit width of 8
// rom_width:32    array_data_width:less than 16    array_data_depth:4    signed decimal     Uint8Array   endiness:little
console.log('test 5')
const test_unit8array_dec = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 255, -255, 288])
const testMem5 = new ROM({ name: 'ROM_32_4_unit8array_little_test', dataWidth: 32, endianness: 'little' }, test_unit8array_dec)
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem5.name}.sv`, testMem5.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ================================================== test 6 =======================================================
// The input is a uint8array array, but the ROM bit width is a non integer multiple of 8. Check if the initial data is expanded in the generated ROM
// rom_width:31    array_data_width:less than 32    array_data_depth:4    signed decimal     Uint8Array   endiness:little
console.log('test 6')
const testMem6 = new ROM({ name: 'ROM_31_16_unit8array_NonMul8_test', dataWidth: 31, endianness: 'little' }, test_unit8array_dec)
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem6.name}.sv`, testMem6.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ================================================== test 7 =======================================================
// Input a binary initial file with a bit width of 8 bits, but the ROM bit width is a non integer multiple of 8. Check if the generated ROM expands the initial data
// rom_width:25, initial_data_width:8, initial_data_depth:16, Binary, endianness:big
console.log('test 7')
const testMem7 = new ROM({ name: 'ROM_25_4_big_InitialFile8_NonMul8_test', dataWidth: 25, endianness: 'big' }, 'ts/test/test_rom_init_file_32_4_binary.txt')
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem7.name}.sv`, testMem7.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ================================================== test 8 =======================================================
// The bit width of the input data in the array is greater than the ROM bit width. Check if an error can be reported
// rom_width:9    array_data_width:bigger than 9    array_data_depth:5    signed decimal
console.log('test 8')
const array_item_ExceedRomWidth: number [] = [-5, -255, 0, 255, 511]
const testMem8 = new ROM({ name: 'ROM_9_5_normal_array_test', dataWidth: 9 }, array_item_ExceedRomWidth)
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem8.name}.sv`, testMem8.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// ================================================== test 9 =======================================================
// Test the function of generating ROMs that are divided into lower and upper ROMs based on depth segmentation
// rom_width:32 initial_data_width:32 initial_data_depth:10         Split into two ROMs
console.log('test 9')
const testMem9 = new ROM({ dataWidth: 32, split_setting: 'split2two' }, 'ts/test/test_rom_init_file.txt')
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem9.name}.sv`, testMem9.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
