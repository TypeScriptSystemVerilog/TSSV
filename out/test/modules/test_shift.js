import { shift } from 'tssv/lib/modules/shift';
import { writeFileSync, mkdirSync } from 'fs';
// ============================================test1=======================================================
console.log('test1');
const test_1 = new shift({ dataWidth: 16, shift_val: 5 });
try {
    mkdirSync(`sv-examples/shift/${test_1.name}`, { recursive: true });
    writeFileSync(`sv-examples/shift/${test_1.name}/${test_1.name}.sv`, test_1.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
// ============================================test2=======================================================
console.log('test2');
const test_2 = new shift({ dataWidth: 16, shift_direct: 'left', shift_val: 5 });
try {
    mkdirSync(`sv-examples/shift/${test_2.name}`, { recursive: true });
    writeFileSync(`sv-examples/shift/${test_2.name}/${test_2.name}.sv`, test_2.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
// ============================================test3=======================================================
console.log('test3');
const test_3 = new shift({ dataWidth: 5, shift_direct: 'right', shift_val: 3 });
try {
    mkdirSync(`sv-examples/shift/${test_3.name}`, { recursive: true });
    writeFileSync(`sv-examples/shift/${test_3.name}/${test_3.name}.sv`, test_3.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
// ============================================test4=======================================================
console.log('test4');
const test_4 = new shift({ dataWidth: 16, shift_val: 5, shift_direct: 'right', isSigned: 'signed' });
try {
    mkdirSync(`sv-examples/shift/${test_4.name}`, { recursive: true });
    writeFileSync(`sv-examples/shift/${test_4.name}/${test_4.name}.sv`, test_4.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
