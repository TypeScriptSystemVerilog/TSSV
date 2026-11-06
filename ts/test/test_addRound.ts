import { Module } from 'tssv/lib/core/TSSV'
import { mkdirSync } from 'fs'
import { markTestbench } from 'tssv/lib/tb/testbench'

try {
  mkdirSync('sv-examples/Core/addRound', { recursive: true })
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
        assert(rounded == 7'b0000000) else $fatal("Assertion failed: rounded should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 8'b00000001;
       assert(rounded == 7'b0000000) else $fatal("Assertion failed: rounded should be 0 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00000010;
        assert(rounded == 7'b0000001) else $fatal("Assertion failed: rounded should be 1 at time %0t", $time);
    end
    'd3: begin
        in <= 8'b00100000;
        assert(rounded == 7'b0010000) else $fatal("Assertion failed: rounded should be 16 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'b10000000;
        assert(rounded == 7'b1000000) else $fatal("Assertion failed: rounded should be 64 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
`

const round_tb = markTestbench(new Module(
  { name: 'round_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
))
round_tb.addSignal('in', { width: 8, isSigned: false })
round_tb.addSignal('rounded', { width: 7, isSigned: false })
round_tb.addRound({ in: 'in', out: 'rounded', rShift: 1 })

try {
  round_tb.writeSystemVerilogFiles('sv-examples/Core/addRound')
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
        assert(rounded == 8'sd0) else $fatal("Assertion failed: rounded should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 4'd1;
        assert(rounded == 8'sd1) else $fatal("Assertion failed: rounded should be 1 at time %0t", $time);
    end
    'd2: begin
        in <= -4'd1;
        assert(rounded == -8'sd1) else $fatal("Assertion failed: rounded should be -1 at time %0t", $time);
    end
    'd3: begin
        in <= -4'd8;
        assert(rounded == -8'sd8) else $fatal("Assertion failed: rounded should be -8 at time %0t", $time);
    end
    'd4: begin 
        in <= 4'd7;
        assert(rounded == 8'sd7) else $fatal("Assertion failed: rounded should be 7 at time %0t", $time);
    end
    default: in <= 4'd0;
    endcase
    end
`

const roundS_tb = markTestbench(new Module(
  { name: 'roundS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyS
))
roundS_tb.addSignal('in', { width: 4, isSigned: true })
roundS_tb.addSignal('rounded', { width: 8, isSigned: true })
roundS_tb.addRound({ in: 'in', out: 'rounded', rShift: 0 })

try {
  roundS_tb.writeSystemVerilogFiles('sv-examples/Core/addRound')
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
        assert(rounded == 8'b00000000) else $fatal("Assertion failed: rounded should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 5'b00011;
        shift <= 4'd1;
        assert(rounded == 8'b00000010) else $fatal("Assertion failed: rounded should be 2 at time %0t", $time);
    end
    'd2: begin
        in <= 5'd12; // 01100 >> 3 = 00001.1 = 1.5 rounds up to 2
        shift <= 4'd3;
        assert(rounded == 8'd3) else $fatal("Assertion failed: rounded should be 3 at time %0t", $time);
    end
    'd3: begin
        in <= 5'b01001;
        shift <= 4'd2;
        assert(rounded == 8'b00000010) else $fatal("Assertion failed: rounded should be 2 at time %0t", $time);
    end
    'd4: begin  // 10110 is 22 shifted by 2 becomes 00101.1 which is 5.5 which rounds up to 6
        in <= 5'd22; 
        shift <= 4'd2;
        assert(rounded == 8'd6) else $fatal("Assertion failed: rounded should be 6 at time %0t", $time);
    end
    default: begin
        in <= 5'd0;
        shift <= 4'd0;
    end
    endcase
    end
`

const roundRS_tb = markTestbench(new Module(
  { name: 'roundRS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyRS
))
roundRS_tb.addSignal('in', { width: 5 })
roundRS_tb.addSignal('rounded', { width: 8 })
roundRS_tb.addSignal('shift', { width: 4 })
roundRS_tb.addRound({ in: 'in', out: 'rounded', rShift: 'shift' }, 'rp')

try {
  roundRS_tb.writeSystemVerilogFiles('sv-examples/Core/addRound')
} catch (err) {
  console.error(err)
}

// test 4 round down mode

const tbBodyD =
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
    in <= 8'd3;
    shift <= 4'd1;
    assert(rounded == 9'sd1) else $fatal("Assertion failed: rounded should be 1 at time %0t", $time);
end
'd1: begin
    in <= 8'd22;
    shift <= 4'd2;
    assert(rounded == 9'sd5) else $fatal("Assertion failed: rounded should be 5 at time %0t", $time);
end
'd2: begin
    in <= -8'd22; 
    shift <= 4'd2;
    assert(rounded == -9'sd6) else $fatal("Assertion failed: rounded should be -6 at time %0t", $time);
end
'd3: begin
    in <= 8'd124;
    shift <= 4'd3;
    assert(rounded == 9'sd15) else $fatal("Assertion failed: rounded should be 15 at time %0t", $time);
end
'd4: begin 
    in <= -8'd124; 
    shift <= 4'd3;
    assert(rounded == -9'sd16) else $fatal("Assertion failed: rounded should be -16 at time %0t", $time);
end
default: begin
    in <= 8'd0;
    shift <= 4'd0;
end
endcase
end
`

const roundD_tb = markTestbench(new Module(
  { name: 'roundD_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyD
))
roundD_tb.addSignal('in', { width: 8, isSigned: true })
roundD_tb.addSignal('rounded', { width: 9, isSigned: true })
roundD_tb.addSignal('shift', { width: 4 })
roundD_tb.addRound({ in: 'in', out: 'rounded', rShift: 'shift' }, 'rm')

try {
  roundD_tb.writeSystemVerilogFiles('sv-examples/Core/addRound')
} catch (err) {
  console.error(err)
}

// test 5 round to zero mode

const tbBodyZ =
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
    in <= 8'd3;
    shift <= 4'd1;
    assert(rounded == 9'sd1) else $fatal("Assertion failed: rounded should be 1 at time %0t", $time);
end
'd1: begin
    in <= 8'd22;
    shift <= 4'd2;
    assert(rounded == 9'sd5) else $fatal("Assertion failed: rounded should be 5 at time %0t", $time);
end
'd2: begin
    in <= -8'd22; 
    shift <= 4'd2;
    assert(rounded == -9'sd6) else $fatal("Assertion failed: rounded should be -6 at time %0t", $time);
end
'd3: begin
    in <= 8'd124;
    shift <= 4'd3;
    assert(rounded == 9'sd15) else $fatal("Assertion failed: rounded should be 15 at time %0t", $time);
end
'd4: begin  
    in <= -8'd124; 
    shift <= 4'd3;
    assert(rounded == -9'sd15) else $fatal("Assertion failed: rounded should be -15 at time %0t", $time);
end
default: begin
    in <= 8'd0;
    shift <= 4'd0;
end
endcase
end
`

const roundZ_tb = markTestbench(new Module(
  { name: 'roundZ_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyZ
))
roundZ_tb.addSignal('in', { width: 8, isSigned: true })
roundZ_tb.addSignal('rounded', { width: 9, isSigned: true })
roundZ_tb.addSignal('shift', { width: 4 })
roundZ_tb.addRound({ in: 'in', out: 'rounded', rShift: 'shift' }, 'rz')

try {
  roundZ_tb.writeSystemVerilogFiles('sv-examples/Core/addRound')
} catch (err) {
  console.error(err)
}

// test 6 round up with signed

const tbBodyU =
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
    in <= 8'd3;
    shift <= 4'd1;
    assert(rounded == 9'sd2) else $fatal("Assertion failed: rounded should be 2 at time %0t", $time);
end
'd1: begin
    in <= 8'd22;
    shift <= 4'd2;
    assert(rounded == 9'sd6) else $fatal("Assertion failed: rounded should be 6 at time %0t", $time);
end
'd2: begin
    in <= -8'd22; 
    shift <= 4'd2;
    assert(rounded == -9'sd5) else $fatal("Assertion failed: rounded should be -5 at time %0t", $time);
end
'd3: begin
    in <= 8'd124;
    shift <= 4'd3;
    assert(rounded == 9'sd16) else $fatal("Assertion failed: rounded should be 16 at time %0t", $time);
end
'd4: begin  
    in <= -8'd124; 
    shift <= 4'd3;
    assert(rounded == -9'sd15) else $fatal("Assertion failed: rounded should be -15 at time %0t", $time);
end
default: begin
    in <= 8'd0;
    shift <= 4'd0;
end
endcase
end
`

const roundU_tb = markTestbench(new Module(
  { name: 'roundU_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyU
))
roundU_tb.addSignal('in', { width: 8, isSigned: true })
roundU_tb.addSignal('rounded', { width: 9, isSigned: true })
roundU_tb.addSignal('shift', { width: 4 })
roundU_tb.addRound({ in: 'in', out: 'rounded', rShift: 'shift' }, 'rp')

try {
  roundU_tb.writeSystemVerilogFiles('sv-examples/Core/addRound')
} catch (err) {
  console.error(err)
}

// round to nearest even
const tbBodyE =
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
    in <= 8'd3;
    shift <= 3'd1;
    assert(rounded == 9'sd2) else $fatal("Assertion failed: rounded should be 2 at time %0t", $time);
end
'd1: begin
    in <= 8'd22;
    shift <= 3'd2;
    assert(rounded == 9'sd6) else $fatal("Assertion failed: rounded should be 6 at time %0t", $time);
end
'd2: begin
    in <= -8'd22; 
    shift <= 3'd2;
    assert(rounded == -9'sd6) else $fatal("Assertion failed: rounded should be -6 at time %0t", $time);
end
'd3: begin
    in <= 8'd124;
    shift <= 3'd3;
    assert(rounded == 9'sd16) else $fatal("Assertion failed: rounded should be 16 at time %0t", $time);
end
'd4: begin  
    in <= -8'd124; 
    shift <= 3'd3;
    assert(rounded == -9'sd16) else $fatal("Assertion failed: rounded should be -16 at time %0t", $time);
end
'd5: begin
    in <= 8'd25;
    shift <= 3'd1;
    assert(rounded == 9'sd12) else $fatal("Assertion failed: rounded should be 12 at time %0t", $time);
end
'd6: begin
    in <= -8'd25;
    shift <= 3'd1;
    assert(rounded == -9'sd12) else $fatal("Assertion failed: rounded should be -12 at time %0t", $time);
end
default: begin
    in <= 8'd0;
    shift <= 3'd0;
end
endcase
end
`

const roundE_tb = markTestbench(new Module(
  { name: 'roundE_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyE
))
roundE_tb.addSignal('in', { width: 8, isSigned: true })
roundE_tb.addSignal('rounded', { width: 9, isSigned: true })
roundE_tb.addSignal('shift', { width: 3 })
roundE_tb.addRound({ in: 'in', out: 'rounded', rShift: 'shift' }, 'rn')

try {
  roundE_tb.writeSystemVerilogFiles('sv-examples/Core/addRound')
} catch (err) {
  console.error(err)
}

// round away from 0

const tbBodyA =
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
    in <= 8'd3;
    shift <= 4'd1;
    assert(rounded == 9'sd2) else $fatal("Assertion failed: rounded should be 2 at time %0t", $time);
end
'd1: begin
    in <= 8'd22;
    shift <= 4'd2;
    assert(rounded == 9'sd6) else $fatal("Assertion failed: rounded should be 6 at time %0t", $time);
end
'd2: begin
    in <= -8'd22; 
    shift <= 4'd2;
    assert(rounded == -9'sd6) else $fatal("Assertion failed: rounded should be -6 at time %0t", $time);
end
'd3: begin
    in <= 8'd124;
    shift <= 4'd3;
    assert(rounded == 9'sd16) else $fatal("Assertion failed: rounded should be 16 at time %0t", $time);
end
'd4: begin  
    in <= -8'd124; 
    shift <= 4'd3;
    assert(rounded == -9'sd16) else $fatal("Assertion failed: rounded should be -16 at time %0t", $time);
end
'd5: begin
    in <= 8'd25;
    shift <= 4'd1;
    assert(rounded == 9'sd13) else $fatal("Assertion failed: rounded should be 13 at time %0t", $time);
end
'd6: begin
    in <= -8'd25;
    shift <= 4'd1;
    assert(rounded == -9'sd13) else $fatal("Assertion failed: rounded should be -13 at time %0t", $time);
end
default: begin
    in <= 8'd0;
    shift <= 4'd0;
end
endcase
end
`

const roundA_tb = markTestbench(new Module(
  { name: 'roundA_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyA
))
roundA_tb.addSignal('in', { width: 8, isSigned: true })
roundA_tb.addSignal('rounded', { width: 9, isSigned: true })
roundA_tb.addSignal('shift', { width: 4 })
roundA_tb.addRound({ in: 'in', out: 'rounded', rShift: 'shift' }, 'rna')

try {
  roundA_tb.writeSystemVerilogFiles('sv-examples/Core/addRound')
} catch (err) {
  console.error(err)
}
