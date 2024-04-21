import { ROM } from 'tssv/lib/modules/ROM';
import { writeFileSync } from 'fs';
// Read hex file as ROM initial data, the data can be 0xbeefcafe, 0Xbeefcafe, 32'hbeefcafe, 'hbeefcafe, 'dbeefcafe and beefcafe(Without identifiers, default to decimal), where decimal numbers support negative values
// rom_width:32 initial_data_width:32 initial_data_depth:6
const testMem1 = new ROM({ dataWidth: 32 }, 'ts/test/test_rom_init_file.txt', 'sv-examples/test_ROM_output');
try {
    writeFileSync(`sv-examples/test_ROM_output/${testMem1.name}.sv`, testMem1.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
// rom_width:32 initial_data_width:8 initial_data_depth:16 Binary
const testMem2 = new ROM({ name: 'ROM_32_4_little_InitialFile', dataWidth: 9, endianness: 'little' }, 'ts/test/test_rom_init_file_32_4_binary.txt');
try {
    writeFileSync(`sv-examples/test_ROM_output/${testMem2.name}.sv`, testMem2.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
// If you need an RCF file, simply add the output path of the RCF file in the parameter list
const rcf_file_path = 'sv-examples/test_ROM_output';
// rom_width:16    array_data_width:less than 16    array_data_depth:4 decimal
const test_array_dec = [-5, -255, 0, 32767, -32767];
const testMem3 = new ROM({ name: 'ROM_16_5_normal_array', dataWidth: 16 }, test_array_dec, rcf_file_path);
try {
    writeFileSync(`sv-examples/test_ROM_output/${testMem3.name}.sv`, testMem3.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
// rom_width:16    array_data_width:less than 16    array_data_depth:4 decimal
const test_unit8array_dec = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 255, -255]);
const testMem4 = new ROM({ name: 'ROM_32_4_unit8_array', dataWidth: 32, endianness: 'big' }, test_unit8array_dec, rcf_file_path);
try {
    writeFileSync(`sv-examples/test_ROM_output/${testMem4.name}.sv`, testMem4.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
