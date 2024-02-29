"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FIR_1 = require("./FIR");
const fs_1 = require("fs");
let myFir = new FIR_1.FIR({ name: 'myFIR', numTaps: 4, coefficients: [1n, 2n, 3n, 4n] });
try {
    (0, fs_1.writeFileSync)('sv-examples/test_FIR_output/myFIR.sv', myFir.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
let myFir2 = new FIR_1.FIR({ numTaps: 5, coefficients: [2n, -2n, 4n, -4n, 8n] });
try {
    (0, fs_1.writeFileSync)(`sv-examples/test_FIR_output/${myFir2.name}.sv`, myFir2.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
let myFir3 = new FIR_1.FIR({ name: 'myFIR3', numTaps: 10, inWidth: 6, outWidth: 10, coefficients: [1n, -2n, 3n, -4n, 5n, -6n, 7n, -8n, 9n, -10n], rShift: 3 });
try {
    (0, fs_1.writeFileSync)('sv-examples/test_FIR_output/myFIR3.sv', myFir3.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
console.log();
