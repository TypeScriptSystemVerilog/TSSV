import { SRAM } from 'tssv/lib/modules/SRAM';
import { writeFileSync, mkdirSync } from 'fs';
const testMem_1rw = new SRAM({ dataWidth: 8, depth: 32n, ports: '1rw', writeEnableMask: 'bit', readBehavior: 'undefOnWrite' });
try {
    mkdirSync(`sv-examples/SRAM/${testMem_1rw.name}`, { recursive: true });
    writeFileSync(`sv-examples/SRAM/${testMem_1rw.name}/${testMem_1rw.name}.sv`, testMem_1rw.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
const testMem_2rw = new SRAM({ dataWidth: 8, depth: 32n, ports: '2rw', writeEnableMask: 'bit', readBehavior: 'undefOnWrite' });
try {
    mkdirSync(`sv-examples/SRAM/${testMem_2rw.name}`, { recursive: true });
    writeFileSync(`sv-examples/SRAM/${testMem_2rw.name}/${testMem_2rw.name}.sv`, testMem_2rw.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
const testMem_1r_1w = new SRAM({ dataWidth: 32, depth: 256n, ports: '1r_1w', writeEnableMask: 'byte', readBehavior: 'readBeforeWrite' });
try {
    mkdirSync(`sv-examples/SRAM/${testMem_1r_1w.name}`, { recursive: true });
    writeFileSync(`sv-examples/SRAM/${testMem_1r_1w.name}/${testMem_1r_1w.name}.sv`, testMem_1r_1w.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
