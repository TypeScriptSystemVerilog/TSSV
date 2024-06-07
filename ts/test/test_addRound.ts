import { Module } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_addRound_output')
} catch (e) {}

// test 1 with static right shift

const tbBody =
`
    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
      count <= 'd0;
    end
    else
    begin
      count <= count + 1'b1;

    case(count)
    'd0: begin
        in <= 8'b00000000;
        assert(rounded == 7'b0000000) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 8'b00000001;
       assert(rounded == 7'b0000000) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00000010;
        assert(rounded == 7'b0000001) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd3: begin
        in <= 8'b00100000;
        assert(rounded == 7'b0010000) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'b10000000;
        assert(rounded == 7'b1000000) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
`

const round_tb = new Module(
  { name: 'round_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
round_tb.addSignal('in', { width: 8, isSigned: false })
round_tb.addSignal('rounded', { width: 7, isSigned: false })
round_tb.addRound({ in: 'in', out: 'rounded', rShift: 1 })

try {
  const TB =
`
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  ${round_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addRound_output/round_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// test 2 signed numbers

const tbBodyS =
`
    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
    count <= 'd0;
    end
    else
    begin
    count <= count + 1'b1;

    case(count)
    'd0: begin
        in <= 4'd0;
        assert(rounded == 8'd0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 4'd1;
        assert(rounded == 8'd1) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd2: begin
        in <= -4'd1;
        assert(rounded == -8'd1) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd3: begin
        in <= -4'd8;
        assert(rounded == -8'd15) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd4: begin 
        in <= 4'd7;
        assert(rounded == 8'd8) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    default: in <= 4'd0;
    endcase
    end
`

const roundS_tb = new Module(
  { name: 'roundS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyS
)
roundS_tb.addSignal('in', { width: 4, isSigned: true })
roundS_tb.addSignal('rounded', { width: 8, isSigned: true })
roundS_tb.addRound({ in: 'in', out: 'rounded', rShift: 0 })

try {
  const TB =
`
/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */
${roundS_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addRound_output/roundS_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// using a shift with a signal and round up mode

const tbBodyRS =
`
    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
    count <= 'd0;
    end
    else
    begin
    count <= count + 1'b1;

    case(count)
    'd0: begin
        in <= 5'b00000;
        shift <= 4'd0;
        assert(rounded == 8'b00000000) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 5'b00011;
        shift <= 4'd1;
        assert(rounded == 8'b00000010) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd2: begin
        in <= 5'd12; // 01100 >> 3 = 00001.1 = 1.5 rounds up to 2
        shift <= 4'd3;
        assert(rounded == 8'd3) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd3: begin
        in <= 5'b01001;
        shift <= 4'd2;
        assert(rounded == 8'b00000010) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd4: begin  // 10110 is 22 shifted by 2 becomes 00101.1 which is 5.5 which rounds up to 6
        in <= 5'd22; 
        shift <= 4'd2;
        assert(rounded == 8'd6) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    default: begin
        in <= 4'd0;
        shift <= 4'd0;
    end
    endcase
    end
`

const roundRS_tb = new Module(
  { name: 'roundRS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyRS
)
roundRS_tb.addSignal('in', { width: 5 })
roundRS_tb.addSignal('rounded', { width: 8 })
roundRS_tb.addSignal('shift', { width: 4 })
roundRS_tb.addRound({ in: 'in', out: 'rounded', rShift: 'shift' }, 'roundUp')

try {
  const TB =
`
/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */
${roundRS_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addRound_output/roundRS_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// ROUNDING UP DOES NOT OCCUR FOR NUMBERS LIKE 17, 9, 6, or at all

// can put precomputed hard coded rounded value for addRound
// test signed and unsigned for round
// bitwidth - rshift# + 1 = outputwidth
// only round up can be used in roundmode

// binary rounding where 12 will become 3 when shifted

// fork tssv in personal github account
// all the work i've done move it into that fork then submit merge requests into that fork

// 2 factor, key pair
