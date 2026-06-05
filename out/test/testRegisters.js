import { RegisterBlock } from 'tssv/lib/core/Registers';
import { Module, serialize, deserialize } from 'tssv/lib/core/TSSV';
import { Memory } from 'tssv/lib/interfaces/Memory';
import * as fs from 'fs';
import * as path from 'path';
import { inspect } from 'util';
import diff from 'deep-diff';
const regMapFilePath = path.join('/home/runzhe.liu/TSSV/sv-examples/reg_convert', 'regMap.json');
const registersFilePath = path.join('/home/runzhe.liu/TSSV/sv-examples/reg_convert', 'registers.json');
const rawRegMap = JSON.parse(fs.readFileSync(regMapFilePath, 'utf8'));
const myRegMap = Object.fromEntries(rawRegMap.map(([key, value]) => {
    return [key, BigInt(value)];
}));
const rawRegisters = JSON.parse(fs.readFileSync(registersFilePath, 'utf8'));
// 将 reset 和 bitRange 转换为 BigInt
function convertToBigInt(obj) {
    if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
                obj[key] = convertToBigInt(value);
            }
            else if (typeof value === 'string' && /^-?\d+n$/.test(value)) {
                obj[key] = BigInt(value.slice(0, -1));
            }
            else if (Array.isArray(value)) {
                obj[key] = value.map(item => (typeof item === 'string' && /^-?\d+$/.test(item) ? BigInt(item) : item));
            }
        }
    }
    return obj;
}
const myRegs = {
    wordSize: 32, // definition and width definition
    addrMap: myRegMap,
    registers: convertToBigInt(rawRegisters)
};
console.log(inspect(myRegs, { depth: null, colors: true }));
const serialized = serialize(myRegs);
console.log(serialized);
const revived = deserialize(serialized);
console.log(inspect(revived, { depth: null, colors: true }));
const differences = diff.diff(myRegs, revived);
if (!differences) {
    console.log('There are no differences.');
}
else {
    console.log(differences);
}
const testRegBlock = new RegisterBlock({
    name: 'testRegBlock',
    busAddressWidth: 32
}, myRegs, new Memory());
const tbBody = `
    logic [15:0] count;

    always @(posedge clk or negedge rst_b) begin
      if (!rst_b) begin
         count <= 'd0;
      end else begin
         count <= count + 1'b1;

         case (count)
            'd0: begin
               regs.ADDR <= 32'h00000000;
               regs.DATA_WR <= 32'h12345678;
               regs.WE <= 1;
            end
            'd1: begin
               regs.WE <= 0;
               regs.RE <= 1;
            end
            'd2: begin
               regs.RE <= 0;
            end
            'd3: begin
               regs.ADDR <= 32'h00000008;
               regs.DATA_WR <= 32'h87654321;
               regs.WE <= 1;
            end
            'd4: begin
               regs.WE <= 0;
               regs.RE <= 1;
            end
            'd5: begin
               regs.RE <= 0;
            end
            'd6: begin
               regs.ADDR <= 32'h00000020;
               regs.DATA_WR <= 32'hAABBCCDD;
               regs.WE <= 1;
            end
            'd7: begin
               regs.WE <= 0;
               MEM0_rdata <= 32'hAABBCCDD;
               regs.RE <= 1;
            end
            'd8: begin
               regs.RE <= 0;
            end
            'd9: begin
               // End of test
               $finish;
            end
            default: ;
         endcase
      end
    end
`;
const tb_testRegBlock = new Module({ name: 'tb_testRegBlock' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody);
tb_testRegBlock.addSubmodule('dut', testRegBlock, {}, true, true);
try {
    fs.writeFileSync('sv-examples/tb_testRegBlock.sv', tb_testRegBlock.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
