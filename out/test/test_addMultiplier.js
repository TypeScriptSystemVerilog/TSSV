import { Module } from 'tssv/lib/core/TSSV';
import { writeFileSync, mkdirSync } from 'fs';
try {
    mkdirSync('sv-examples/test_addMultiplier_output');
}
catch (e) { }
// test 1
const tbBody = `
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
        assert(prod_axb == 12'd1) else $display("Assertion failed: prod_axb should be 1 at time %0t", $time);
    end
    'd1: begin
        a <= 8'b00000010;
        b <= 4'b0010;
        assert(prod_axb == 12'd4) else $display("Assertion failed: prod_axb should be 4 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd100;
        b <= 4'd5;
        assert(prod_axb == 12'd500) else $display("Assertion failed: prod_axb should be 500 at time %0t", $time);
    end
    'd3: begin
        a <= 8'd89;
        b <= 4'd11;
        assert(prod_axb == 12'd979) else $display("Assertion failed: prod_axb should be 979 at time %0t", $time);
    end
    'd4: begin 
        a <= 8'b11111111;
        b <= 4'b1111;
        assert(prod_axb == 12'd3825) else $display("Assertion failed: prod_axb should be 3825 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 4'b0000;
    end
    endcase
    end
`;
const mult_tb = new Module({ name: 'mult_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody);
mult_tb.addSignal('a', { width: 8, isSigned: false });
mult_tb.addSignal('b', { width: 4, isSigned: false });
mult_tb.addMultiplier({ a: 'a', b: 'b' });
try {
    const TB = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${mult_tb.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addMultiplier_output/mult_tb.sv', TB);
}
catch (err) {
    console.error(err);
}
// test 2 signed numbers
const tbBodyS = `
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
        assert(prod_axb == 16'd1) else $display("Assertion failed: prod_axb should be 1 at time %0t", $time);
    end
    'd1: begin
        a <= 8'd25;
        b <= -8'd1;
        assert(prod_axb == -16'd25) else $display("Assertion failed: prod_axb should be -25 at time %0t", $time);
    end
    'd2: begin
        a <= -8'd100;
        b <= 8'd20;
        assert(prod_axb == -16'd2000) else $display("Assertion failed: prod_axb should be -2000 at time %0t", $time);
    end
    'd3: begin
        a <= -8'd73;
        b <= -8'd59;
        assert(prod_axb == 16'd4307) else $display("Assertion failed: prod_axb should be 4307 at time %0t", $time);
    end
    'd4: begin 
        a <= -8'd128;
        b <= 8'd127;
        assert(prod_axb == -16'd16256) else $display("Assertion failed: prod_axb should be -16256 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 4'b0000;
    end
    endcase
    end
`;
const multS_tb = new Module({ name: 'multS_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBodyS);
multS_tb.addSignal('a', { width: 8, isSigned: true });
multS_tb.addSignal('b', { width: 8, isSigned: true });
multS_tb.addMultiplier({ a: 'a', b: 'b' });
try {
    const TB = `
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      ${multS_tb.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addMultiplier_output/multS_tb.sv', TB);
}
catch (err) {
    console.error(err);
}
// test 3 unsigned and signed
const tbBodyUS = `
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
      assert(prod_axb == 16'd1) else $display("Assertion failed: prod_axb should be 1 at time %0t", $time);
  end
  'd1: begin
      a <= 8'd25;
      b <= -8'd1;
      assert(prod_axb == -16'd25) else $display("Assertion failed: prod_axb should be -25 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd100;
      b <= -8'd20;
      assert(prod_axb == 16'd2000) else $display("Assertion failed: prod_axb should be -2000 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd197;
      b <= -8'd73;
      assert(prod_axb == -16'd14381) else $display("Assertion failed: prod_axb should be -14381 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'd127;
      b <= -8'd128;
      assert(prod_axb == -16'd16256) else $display("Assertion failed: prod_axb should be -16256 at time %0t", $time);
  end
  'd5: begin
      a <= 8'd255;
      b <= -8'd128;
      assert(prod_axb == -16'd32640) else $display("Assertion failed: prod_axb should be -32640 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
      b <= 4'b0000;
  end
  endcase
  end
`;
const multUS_tb = new Module({ name: 'multUS_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBodyUS);
multUS_tb.addSignal('a', { width: 8, isSigned: false });
multUS_tb.addSignal('b', { width: 8, isSigned: true });
multUS_tb.addMultiplier({ a: 'a', b: 'b' });
try {
    const TB = `
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      ${multUS_tb.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addMultiplier_output/multUS_tb.sv', TB);
}
catch (err) {
    console.error(err);
}
// test 4 signed and unsigned
const tbBodySU = `
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
      assert(prod_axb == 16'd1) else $display("Assertion failed: prod_axb should be 1 at time %0t", $time);
  end
  'd1: begin
      a <= -8'd25;
      b <= 8'd1;
      assert(prod_axb == -16'd25) else $display("Assertion failed: prod_axb should be -25 at time %0t", $time);
  end
  'd2: begin
      a <= -8'd100;
      b <= 8'd20;
      assert(prod_axb == -16'd2000) else $display("Assertion failed: prod_axb should be -2000 at time %0t", $time);
  end
  'd3: begin
      a <= -8'd73;
      b <= 8'd59;
      assert(prod_axb == -16'd4307) else $display("Assertion failed: prod_axb should be -4307 at time %0t", $time);
  end
  'd4: begin 
      a <= -8'd128;
      b <= 8'd127;
      assert(prod_axb == -16'd16256) else $display("Assertion failed: prod_axb should be -16256 at time %0t", $time);
  end
  'd5: begin
      a <= -8'd128;
      b <= 8'd255;
      assert(prod_axb == -16'd32640) else $display("Assertion failed: prod_axb should be -32640 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
      b <= 4'b0000;
  end
  endcase
  end
`;
const multSU_tb = new Module({ name: 'multSU_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBodySU);
multSU_tb.addSignal('a', { width: 8, isSigned: true });
multSU_tb.addSignal('b', { width: 8, isSigned: false });
multSU_tb.addMultiplier({ a: 'a', b: 'b' });
try {
    const TB = `
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      ${multSU_tb.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addMultiplier_output/multSU_tb.sv', TB);
}
catch (err) {
    console.error(err);
}
// big int test
const tbBodyB = `
  always @(posedge clk or negedge rst_b) begin
    if (!rst_b) begin
      // Reset logic if needed
    end
    else begin
      if (!(prod_6d20x4d7 == 8'd140)) begin
        $display("Assertion failed: prod_6d20x4d7 should be 140 at time %0t", $time);
      end
      if (!(prod_m8d120xm6d19 == 14'd2280)) begin
        $display("Assertion failed: prod_m8d120xm6d19 should be 2280 at time %0t", $time);
      end
      if (!(prod_7d57xm6d23 == -12'd1311)) begin
        $display("Assertion failed: prod_7d57xm6d23 should be -1311 at time %0t", $time);
      end
      if (!(prod_m8d91x9d200 == -16'd18200)) begin
        $display("Assertion failed: prod_m8d91x9d200 should be -18200 at time %0t", $time);
      end
    end
  end
`;
const multB_tb = new Module({ name: 'multB_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBodyB);
multB_tb.addMultiplier({ a: 20n, b: 7n });
multB_tb.addMultiplier({ a: -120n, b: -19n });
multB_tb.addMultiplier({ a: 57n, b: -23n });
multB_tb.addMultiplier({ a: -91n, b: 200n });
try {
    const TB = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${multB_tb.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addMultiplier_output/multB_tb.sv', TB);
}
catch (err) {
    console.error(err);
}
// unsigned and big int
const tbBodyUB = `
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
      assert(prod_ax7d50 == 13'd50) else $display("Assertion failed: prod_ax7d50 should be 50 at time %0t", $time);
  end
  'd1: begin
      a <= 8'd25;
      assert(prod_ax7d50 == 13'd1250) else $display("Assertion failed: prod_ax7d50 should be 1250 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd100;
      assert(prod_ax7d50 == 13'd5000) else $display("Assertion failed: prod_ax7d50 should be 5000 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd197;
      assert(prod_ax7d50 == 13'd9850) else $display("Assertion failed: prod_ax7d50 should be 9850 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'd127;
      assert(prod_ax7d50 == 13'd6350) else $display("Assertion failed: prod_ax7d50 should be 6350 at time %0t", $time);
  end
  'd5: begin
      a <= 8'd255;
      assert(prod_ax7d50 == 13'd12750) else $display("Assertion failed: prod_ax7d50 should be 12750 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
  end
  endcase
  end
`;
const multUB_tb = new Module({ name: 'multUB_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBodyUB);
multUB_tb.addSignal('a', { width: 8, isSigned: false });
multUB_tb.addMultiplier({ a: 'a', b: 50n });
try {
    const TB = `
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      ${multUB_tb.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addMultiplier_output/multUB_tb.sv', TB);
}
catch (err) {
    console.error(err);
}
// signed and big int
const tbBodySB = `
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
      assert(prod_axm7d50 == 13'd50) else $display("Assertion failed: prod_axm7d50 should be 50 at time %0t", $time);
  end
  'd1: begin
      a <= -8'd25;
      assert(prod_axm7d50 == 13'd1250) else $display("Assertion failed: prod_axm7d50 should be 1250 at time %0t", $time);
  end
  'd2: begin
      a <= -8'd100;
      assert(prod_axm7d50 == 13'd5000) else $display("Assertion failed: prod_axm7d50 should be 5000 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd59;
      assert(prod_axm7d50 == -13'd2950) else $display("Assertion failed: prod_axm7d50 should be 9850 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'd127;
      assert(prod_axm7d50 == -13'd6350) else $display("Assertion failed: prod_axm7d50 should be 6350 at time %0t", $time);
  end
  'd5: begin
      a <= 8'd255;
      assert(prod_axm7d50 == 13'd12750) else $display("Assertion failed: prod_axm7d50 should be 12750 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
  end
  endcase
  end
`;
const multSB_tb = new Module({ name: 'multUB_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBodySB);
multSB_tb.addSignal('a', { width: 8, isSigned: true });
multSB_tb.addMultiplier({ a: 'a', b: -50n });
try {
    const TB = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${multSB_tb.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addMultiplier_output/multSB_tb.sv', TB);
}
catch (err) {
    console.error(err);
}
