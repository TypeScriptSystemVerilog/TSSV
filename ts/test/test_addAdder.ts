import { Module } from 'tssv/lib/core/TSSV'
import { mkdirSync } from 'fs'
import { markTestbench } from 'tssv/test/models/testbench'

try {
  mkdirSync('sv-examples/Core/addAdder', { recursive: true })
} catch (e) {}

// test 1

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
        a <= 8'b00000001;
        b <= 4'b0001;
        assert(sum_axb == 9'd2) else $display("Assertion failed: sum_axb should be 2 at time %0t", $time);
    end
    'd1: begin
        a <= 8'b00000010;
        b <= 4'b0010;
        assert(sum_axb == 9'd4) else $display("Assertion failed: sum_axb should be 4 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd100;
        b <= 4'd5;
        assert(sum_axb == 9'd105) else $display("Assertion failed: sum_axb should be 105 at time %0t", $time);
    end
    'd3: begin
        a <= 8'd89;
        b <= 4'd11;
        assert(sum_axb == 9'd100) else $display("Assertion failed: sum_axb should be 100 at time %0t", $time);
    end
    'd4: begin 
        a <= 8'b11111111;
        b <= 4'b1111;
        assert(sum_axb == 9'd270) else $display("Assertion failed: sum_axb should be 270 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 4'b0000;
    end
    endcase
    end
`

const add_tb = markTestbench(new Module(
  { name: 'add_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
))
add_tb.addSignal('a', { width: 8, isSigned: false })
add_tb.addSignal('b', { width: 4, isSigned: false })
add_tb.addAdder({ a: 'a', b: 'b' })

try {
  add_tb.writeSystemVerilogFiles('sv-examples/Core/addAdder')
} catch (err) {
  console.error(err)
}

// test add signed

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
        a <= -8'd1;
        b <= 8'd1;
        assert(sum_axb == 9'sd0) else $display("Assertion failed: sum_axb should be 0 at time %0t", $time);
    end
    'd1: begin
        a <= -8'd47;
        b <= 8'd29;
        assert(sum_axb == -9'sd18) else $display("Assertion failed: sum_axb should be -18 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd115;
        b <= -8'd34;
        assert(sum_axb == 9'sd81) else $display("Assertion failed: sum_axb should be 81 at time %0t", $time);
    end
    'd3: begin
        a <= -8'd50;
        b <= 8'd50;
        assert(sum_axb == 9'sd0) else $display("Assertion failed: sum_axb should be 0 at time %0t", $time);
    end
    'd4: begin 
        a <= -8'd128;
        b <= -8'd128;
        assert(sum_axb == -9'sd256) else $display("Assertion failed: sum_axb should be -256 at time %0t", $time);
    end
    default: begin
        a <= 8'd0;
        b <= 8'd0;
    end
    endcase
    end
`

const addS_tb = markTestbench(new Module(
  { name: 'addS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyS
))
addS_tb.addSignal('a', { width: 8, isSigned: true })
addS_tb.addSignal('b', { width: 8, isSigned: true })
addS_tb.addAdder({ a: 'a', b: 'b' })

try {
  addS_tb.writeSystemVerilogFiles('sv-examples/Core/addAdder')
} catch (err) {
  console.error(err)
}

// test unsigned and signed

const tbBodyUS =
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
      a <= 8'd1;
      b <= 8'd1;
      assert(sum_axb == 10'sd2) else $display("Assertion failed: sum_axb should be 2 at time %0t", $time);
  end
  'd1: begin
      a <= 8'd47;
      b <= -8'd29;
      assert(sum_axb == 10'sd18) else $display("Assertion failed: sum_axb should be 18 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd115;
      b <= -8'd34;
      assert(sum_axb == 10'sd81) else $display("Assertion failed: sum_axb should be 81 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd50;
      b <= -8'd50;
      assert(sum_axb == 10'sd0) else $display("Assertion failed: sum_axb should be 0 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'd127;
      b <= -8'd128;
      assert(sum_axb == -10'sd1) else $display("Assertion failed: sum_axb should be -1 at time %0t", $time);
  end
  default: begin
      a <= 8'd0;
      b <= 8'd0;
  end
  endcase
  end
`

const addUS_tb = markTestbench(new Module(
  { name: 'addUS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyUS
))
addUS_tb.addSignal('a', { width: 8, isSigned: false })
addUS_tb.addSignal('b', { width: 8, isSigned: true })
addUS_tb.addAdder({ a: 'a', b: 'b' })

try {
  addUS_tb.writeSystemVerilogFiles('sv-examples/Core/addAdder')
} catch (err) {
  console.error(err)
}

// add signed unsigned

const tbBodySU =
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
      a <= 8'd1;
      b <= 8'd1;
      assert(sum_axb == 10'sd2) else $display("Assertion failed: sum_axb should be 2 at time %0t", $time);
  end
  'd1: begin
      a <= -8'd47;
      b <= 8'd29;
      assert(sum_axb == -10'sd18) else $display("Assertion failed: sum_axb should be -18 at time %0t", $time);
  end
  'd2: begin
      a <= -8'd115;
      b <= 8'd34;
      assert(sum_axb == -10'sd81) else $display("Assertion failed: sum_axb should be -81 at time %0t", $time);
  end
  'd3: begin
      a <= -8'd50;
      b <= 8'd50;
      assert(sum_axb == 10'sd0) else $display("Assertion failed: sum_axb should be 0 at time %0t", $time);
  end
  'd4: begin 
      a <= -8'd128;
      b <= 8'd127;
      assert(sum_axb == -10'sd1) else $display("Assertion failed: sum_axb should be -1 at time %0t", $time);
  end
  default: begin
      a <= 8'd0;
      b <= 8'd0;
  end
  endcase
  end
`

const addSU_tb = markTestbench(new Module(
  { name: 'addSU_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodySU
))
addSU_tb.addSignal('a', { width: 8, isSigned: true })
addSU_tb.addSignal('b', { width: 8, isSigned: false })
addSU_tb.addAdder({ a: 'a', b: 'b' })

try {
  addSU_tb.writeSystemVerilogFiles('sv-examples/Core/addAdder')
} catch (err) {
  console.error(err)
}

// large numbers test

const tbBodyB =
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
    a <= 16'd7641;
    b <= 16'd4611;
    assert(sum == 18'sd12252) else $display("Assertion failed: sum should be 12252 at time %0t", $time);
end
'd1: begin
    a <= -16'd20785;
    b <= -16'd6903;
    assert(sum == -18'sd27688) else $display("Assertion failed: sum should be -27688 at time %0t", $time);
end
'd2: begin
    a <= 16'd20025;
    b <= -16'd11168;
    assert(sum == 18'sd8857) else $display("Assertion failed: sum should be 8857 at time %0t", $time);
end
'd3: begin
    a <= -16'd30974;
    b <= 16'd26651;
    assert(sum == -18'sd4323) else $display("Assertion failed: sum should be -4323 at time %0t", $time);
end
'd4: begin 
    a <= 16'd15349;
    b <= -16'd6500;
    assert(sum == 18'sd8849) else $display("Assertion failed: sum should be 8849 at time %0t", $time);
end
default: begin
    a <= 16'd0;
    b <= 16'd0;
end
endcase
end
`

const addB_tb = markTestbench(new Module(
  { name: 'addB_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyB
))
addB_tb.addSignal('a', { width: 16, isSigned: true })
addB_tb.addSignal('b', { width: 16, isSigned: true })
addB_tb.addSignal('sum', { width: 18, isSigned: true })
addB_tb.addAdder({ a: 'a', b: 'b', result: 'sum' })

try {
  addB_tb.writeSystemVerilogFiles('sv-examples/Core/addAdder')
} catch (err) {
  console.error(err)
}
