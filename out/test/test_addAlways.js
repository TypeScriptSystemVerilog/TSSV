import { addAlways } from 'TSSV/lib/modules/addAlways';
import { writeFileSync } from 'fs';
const my_addAlways_test = new addAlways({ name: 'comb_seq_test', data_Width: 5 });
try {
    writeFileSync(`sv-examples/${my_addAlways_test.name}.sv`, my_addAlways_test.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
