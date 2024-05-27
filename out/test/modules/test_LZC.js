import { LZC } from 'tssv/lib/modules/LZC';
import { writeFileSync } from 'fs';
// ============================================test1=======================================================
console.log('test1');
const test_1 = new LZC({ dataWidth: 64 });
try {
    writeFileSync(`sv-examples/test_LZC_output/${test_1.name}.sv`, test_1.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
// ============================================test2=======================================================
console.log('test2');
const test_2 = new LZC({ dataWidth: 28 });
try {
    writeFileSync(`sv-examples/test_LZC_output/${test_2.name}.sv`, test_2.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
// ============================================test3=======================================================
console.log('test3');
const test_3 = new LZC({ dataWidth: 21 });
try {
    writeFileSync(`sv-examples/test_LZC_output/${test_3.name}.sv`, test_3.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
