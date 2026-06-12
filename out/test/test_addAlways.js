import { addAlways } from 'tssv/test/modules/addAlways';
import { writeFileSync, mkdirSync } from 'fs';
const my_addAlways_test = new addAlways({ name: 'comb_seq_test', data_Width: 5 });
mkdirSync('sv-examples/Core/addAlways', { recursive: true });
try {
    writeFileSync(`sv-examples/Core/addAlways/${my_addAlways_test.name}.sv`, my_addAlways_test.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
