import { RegisterBlock } from 'tssv/lib/core/Registers';
import { Module, serialize, deserialize, Memory } from 'tssv/lib/core/TSSV';
import { writeFileSync } from 'fs';
import { inspect } from 'util';
import diff from 'deep-diff';
const myRegMap = {
    REG0: BigInt('0x00000000'),
    REG1: BigInt('0x00000004'),
    REG2: BigInt('0x00000008'),
    MEM0: BigInt('0x00000020'),
    MEM1: BigInt('0x00000040')
};
const myRegs = {
    wordSize: 32,
    addrMap: myRegMap,
    registers: {
        REG0: {
            type: 'RW',
            reset: 0n,
            description: 'Register 0'
        },
        REG1: {
            type: 'RO',
            reset: 1n,
            description: 'Register 1',
            width: 16,
            isSigned: true
        },
        REG2: {
            type: 'RW',
            description: 'Register 2',
            fields: {
                REG2_field0: {
                    bitRange: [15, 0],
                    reset: BigInt('0x10')
                },
                REG2_field1: {
                    bitRange: [31, 16],
                    reset: BigInt('0x20')
                }
            }
        },
        MEM0: {
            type: 'RAM',
            size: 8n
        },
        MEM1: {
            type: 'ROM',
            size: 8n
        }
    }
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
               $stop;
            end
            default: ;
         endcase
      end
    end
`;
const tb_testRegBlock = new Module({ name: 'tb_testRegBlock' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, tbBody);
tb_testRegBlock.addSubmodule('dut', testRegBlock, {}, true, true);
// const temp = 'REG0'
// console.log(myRegMap[temp])
try {
    writeFileSync('sv-examples/tb_testRegBlock.sv', tb_testRegBlock.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
