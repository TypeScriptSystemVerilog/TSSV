import { ROM } from 'tssv/lib/modules/ROM'
import { writeFileSync } from 'fs'

// Read hex file as ROM initial data
const testMem1 = new ROM({ dataWidth: 16, depth: 6n }, 'ts/test/test_rom_init_file.txt')
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem1.name}.sv`, testMem1.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// Convert the array to hexadecimal and read it as ROM initial data. Require initial information to be a hexadecimal number
const test_array_dec: number [] = [1111, 5555, 43690, 65535]
const test_array_hex: string [] = test_array_dec.map(decimal => decimal.toString(16).toUpperCase())

const testMem2 = new ROM({ name: 'myROM', dataWidth: 16, depth: 4n }, test_array_hex)
try {
  writeFileSync(`sv-examples/test_ROM_output/${testMem2.name}.sv`, testMem2.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
