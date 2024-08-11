import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { Module, serialize, deserialize } from 'tssv/lib/core/TSSV'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { writeFileSync } from 'fs'
import { inspect } from 'util'
import diff from 'deep-diff'

const ramModule = new Module(
  { name: 'ram_32x32' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' },
    addr: { direction: 'input', width: 32 },
    we: { direction: 'input' },
    re: { direction: 'input' },
    wdata: { direction: 'input', width: 32 },
    rdata: { direction: 'output', width: 32 },
    ready: { direction: 'output' }
  },
  {},
`
  logic [31:0] mem [0:31];

  always_ff @(posedge clk or negedge rst_b) begin
      if (!rst_b) begin
          rdata <= 32'd0;
          ready <= 1'b0;
      end else if (we) begin
          mem[addr] <= wdata;
          ready <= 1'b1;
      end else if (re) begin
          rdata <= mem[addr];
          ready <= 1'b1;
      end else begin
          ready <= 1'b0;
      end
  end
`
)

const romModule = new Module(
  { name: 'rom_32x32' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' },
    addr: { direction: 'input', width: 32 },
    re: { direction: 'input' },
    rdata: { direction: 'output', width: 32 },
    ready: { direction: 'output' }
  },
  {},
`
  logic [31:0] mem [0:31];

  initial begin
      // Initialize ROM with some values
      mem[0] = 32'h00000001;
      mem[1] = 32'h00000002;
      mem[2] = 32'h00000003;
      mem[3] = 32'h00000004;
      // ...
  end

  always_ff @(posedge clk or negedge rst_b) begin
      if (!rst_b) begin
          rdata <= 32'd0;
          ready <= 1'b0;
      end else if (re) begin
          rdata <= mem[addr];
          ready <= 1'b1;
      end else begin
          ready <= 1'b0;
      end
  end
`
)

const myRegMap = {
  REG0: BigInt('0x00000000'),
  REG1: BigInt('0x00000004'),
  REG2: BigInt('0x00000008'),
  MEM0: BigInt('0x00000020'),
  MEM1: BigInt('0x00000040')
} as const

const myRegs: RegisterBlockDef<typeof myRegMap> = {
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
}

console.log(inspect(myRegs, { depth: null, colors: true }))
const serialized = serialize(myRegs)
console.log(serialized)

const revived = deserialize(serialized)
console.log(inspect(revived, { depth: null, colors: true }))

const differences = diff.diff(myRegs, revived)
if (!differences) {
  console.log('There are no differences.')
} else {
  console.log(differences)
}

const testRegBlock = new RegisterBlock<typeof myRegs.addrMap>(
  {
    name: 'testRegBlock',
    busAddressWidth: 32
  },
  myRegs,
  new Memory()
)

const tbBody =
`
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
`

const tb_testRegBlock = new Module(
  { name: 'tb_testRegBlock' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody)
tb_testRegBlock.addSubmodule(
  'ram_inst',
  ramModule,
  {},
  true,
  true
)
tb_testRegBlock.addSubmodule(
  'rom_inst',
  romModule,
  {},
  true,
  true
)
tb_testRegBlock.addSubmodule(
  'dut',
  testRegBlock,
  {},
  true,
  true
)
// const temp = 'REG0'

// console.log(myRegMap[temp])

try {
  writeFileSync('sv-examples/tb_testRegBlock.sv', tb_testRegBlock.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

const tbBody2 =
`
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
          regs.ADDR <= 32'h00000008;
          regs.DATA_WR <= 32'h87654321;
          regs.WE <= 1;
        end
        'd2: begin
          regs.ADDR <= 32'h00000020;
          regs.DATA_WR <= 32'hAABBCCDD;
          regs.WE <= 1;
        end
        'd3: begin
          regs.WE <= 0;
        end
        'd4: begin
          regs.ADDR <= 32'h00000000;
          regs.RE <= 1;
        end
        'd5: begin
          regs.RE <= 0;
        end
        'd6: begin
          regs.ADDR <= 32'h00000008;
          regs.RE <= 1;
        end
        'd7: begin
          regs.RE <= 0;
        end
        'd8: begin
          regs.ADDR <= 32'h00000020;
          regs.RE <= 1;
        end
        'd9: begin
          regs.RE <= 0;
          // End of test
          $finish;
        end
        default: ;
    endcase
  end
  end
`

const tb_testRegBlock2 = new Module(
  { name: 'tb_testRegBlock2' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody2)
tb_testRegBlock2.addSubmodule(
  'ram_inst',
  ramModule,
  {},
  true,
  true
)
tb_testRegBlock2.addSubmodule(
  'rom_inst',
  romModule,
  {},
  true,
  true
)
// const testRegBlock2 = new RegisterBlock<typeof myRegs.addrMap>(
//   {
//     name: 'testRegBlock',
//     busAddressWidth: 32
//   },
//   myRegs,
//   new Memory()
// )
tb_testRegBlock2.addSubmodule(
  'dut',
  testRegBlock,
  {},
  true,
  true
)

try {
  writeFileSync('sv-examples/tb_testRegBlock2.sv', tb_testRegBlock2.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

const tbBody3 =
`
logic [15:0] count;

always @(posedge clk or negedge rst_b) begin
  if (!rst_b) begin
    count <= 'd0;
  end else begin
    count <= count + 1'b1;

    case (count)
      'd0: begin
        regs.ADDR <= 32'h00000004;
        regs.DATA_WR <= 32'hDEADBEEF;
        regs.WE <= 1;
      end
      'd1: begin
        regs.WE <= 0;
        regs.RE <= 1;
      end
      'd2: begin
        regs.RE <= 0;
        regs.ADDR <= 32'h00000010;
        regs.DATA_WR <= 32'hCAFEFEED;
        regs.WE <= 1;
      end
      'd3: begin
        regs.WE <= 0;
        regs.RE <= 1;
      end
      'd4: begin
        regs.RE <= 0;
        regs.ADDR <= 32'h00000020;
        regs.DATA_WR <= 32'hBADC0DE;
        regs.WE <= 1;
      end
      'd5: begin
        regs.WE <= 0;
        MEM1_rdata <= 32'hBADC0DE;
        regs.RE <= 1;
      end
      'd6: begin
        regs.RE <= 0;
        regs.ADDR <= 32'h00000000;
        regs.DATA_WR <= 32'hFEEDBEEF;
        regs.WE <= 1;
      end
      'd7: begin
        regs.WE <= 0;
        regs.RE <= 1;
      end
      'd8: begin
        regs.RE <= 0;
      end
      'd9: begin
        regs.ADDR <= 32'h00000004;
        regs.RE <= 1;
      end
      'd10: begin
        regs.RE <= 0;
        // End of test
        $finish;
      end
      default: ;
    endcase
  end
end
`

const tb_testRegBlock3 = new Module(
  { name: 'tb_testRegBlock3' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody3)
tb_testRegBlock3.addSubmodule(
  'ram_inst',
  ramModule,
  {},
  true,
  true
)
tb_testRegBlock3.addSubmodule(
  'rom_inst',
  romModule,
  {},
  true,
  true
)
tb_testRegBlock3.addSubmodule(
  'dut',
  testRegBlock,
  {},
  true,
  true
)

try {
  writeFileSync('sv-examples/tb_testRegBlock3.sv', tb_testRegBlock3.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

const tbBody4 =
`
logic [15:0] count;

always @(posedge clk or negedge rst_b) begin
  if (!rst_b) begin
    count <= 'd0;
  end else begin
    count <= count + 1'b1;

    case (count)
      'd0: begin
        regs.ADDR <= 32'h00000000;
        regs.DATA_WR <= 32'hFADE1819;
        regs.WE <= 1;
      end
      'd1: begin
        regs.RE <= 0;
        regs.ADDR <= 32'h00000008;
        regs.DATA_WR <= 32'h12345678;
        regs.WE <= 1;
      end
      'd2: begin
        regs.RE <= 0;
        regs.ADDR <= 32'h00000021;
        regs.DATA_WR <= 32'h1BADC0DE;
        regs.WE <= 1;
      end
      'd3: begin
        regs.RE <= 0;
        regs.ADDR <= 32'h0000005F;
        regs.DATA_WR <= 32'hACCEDED1;
        regs.WE <= 1;
      end
      'd4: begin
        regs.ADDR <= 32'h00000000;
        regs.WE <= 0;
        regs.RE <= 1;
      end
      'd5: begin
        regs.ADDR <= 32'h00000008;
        regs.WE <= 0;
        regs.RE <= 1;
      end
      'd6: begin
        regs.ADDR <= 32'h0000003F;
        regs.WE <= 0;
        regs.RE <= 1;
      end
      'd7: begin
        regs.ADDR <= 32'h000000040;
        regs.WE <= 0;
        regs.RE <= 1;
      end
      'd8: begin
        $finish;
      end
      default: ;
    endcase
  end
end
`

const tb_testRegBlock4 = new Module(
  { name: 'tb_testRegBlock4' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody4)
tb_testRegBlock4.addSubmodule(
  'ram_inst',
  ramModule,
  {},
  true,
  true
)
tb_testRegBlock4.addSubmodule(
  'rom_inst',
  romModule,
  {},
  true,
  true
)
tb_testRegBlock4.addSubmodule(
  'dut',
  testRegBlock,
  {},
  true,
  true
)

try {
  writeFileSync('sv-examples/tb_testRegBlock4.sv', tb_testRegBlock4.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
