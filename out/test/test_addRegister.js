// import { Module, addRegister } from 'tssv/lib/core/TSSV'
import { Module } from 'tssv/lib/core/TSSV';
import { writeFileSync, mkdirSync } from 'fs';
try {
    mkdirSync('sv-examples/test_addRegister_output');
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
      dSig <= 0;
      assert(dSig_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd1: begin
      dSig <= 1;
      assert(dSig_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
    end
    'd2: begin
      dSig <= 0;
      assert(dSig_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd3: begin
      dSig <= 1;
      assert(dSig_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
    end
    'd4: begin 
      dSig <= 1;
      assert(dSig_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
    end
    default: dSig <= 0;
    endcase
    end
`;
const regMod = new Module({ name: 'addRegister_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody);
regMod.addSignal('dSig', {});
regMod.addRegister({
    d: 'dSig',
    clk: 'clk'
});
try {
    const TB = `
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  ${regMod.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addRegister_output/regMod.sv', TB);
}
catch (err) {
    console.error(err);
}
// test 2
const tbBody2 = `
    logic [15:0] count;
    
    always @(posedge clk or negedge rst_b)
      if (!rst_b)
        count <= 'd0;
      else begin
        count <= count + 1'b1;

    case (count)
    'd0: begin
      dSig2 <= 4'b0000;
      assert(dSig2_q == 4'b0000) else $fatal("Assertion failed: dSig2_q should be 4'b0000 at count %0d", count);
    end
    'd1: begin
      dSig2 <= 4'b0001;
      assert(dSig2_q == 4'b0000) else $fatal("Assertion failed: dSig2_q should be 4'b0000 at count %0d", count);
    end
    'd2: begin
      dSig2 <= 4'b0010;
      assert(dSig2_q == 4'b0001) else $fatal("Assertion failed: dSig2_q should be 4'b0001 at count %0d", count);
    end
    'd3: begin
      dSig2 <= 4'b0011;
      assert(dSig2_q == 4'b0010) else $fatal("Assertion failed: dSig2_q should be 4'b0010 at count %0d", count);
    end
    'd4: begin
      dSig2 <= 4'b0100;
      assert(dSig2_q == 4'b0011) else $fatal("Assertion failed: dSig2_q should be 4'b0011 at count %0d", count);
    end
    default: begin
      dSig2 <= 4'b0000;
      assert(dSig2_q == 4'b0100) else $fatal("Assertion failed: dSig2_q should be 4'b0100 at count %0d", count);
    end
    endcase
    end
`;
const regMod2 = new Module({ name: 'addRegisterWidth_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody2);
regMod2.addSignal('dSig2', { width: 4 });
regMod2.addRegister({
    d: 'dSig2',
    clk: 'clk'
});
try {
    const TB2 = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${regMod2.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addRegister_output/regMod2.sv', TB2);
}
catch (err) {
    console.error(err);
}
// test 3
const tbBody3 = `
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
  dSig3 <= 0;
  assert(dSig3_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
end
'd1: begin
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
end
'd2: begin
  dSig3 <= 0;
  assert(dSig3_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
end
'd3: begin
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
end
'd4: begin 
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
end
default: dSig3 <= 0;
endcase
end
`;
const regMod3 = new Module({ name: 'addRegisterReset_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody3);
regMod3.addSignal('dSig3', {});
regMod3.addRegister({
    d: 'dSig3',
    clk: 'clk',
    reset: 'rst_b',
    resetVal: 0n
});
try {
    const TB3 = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${regMod3.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addRegister_output/regMod3.sv', TB3);
}
catch (err) {
    console.error(err);
}
// test 4
const tbBody4 = `
    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
      count <= 'd0;
    end
    else
    begin
      count <= count + 1'b1;

    case (count)
      'd0: begin
        dSig4 <= 8'b00000000;
        en <= 1;
        assert(q == 8'b00001000) else $fatal("Assertion failed: q should be 8'b00001000 at count %0d", count);
      end
      'd1: begin
        dSig4 <= 8'b00000001;
        en <= 1;
        assert(q == 8'b00000000) else $fatal("Assertion failed: q should be 8'b00000000 at count %0d", count);
      end
      'd2: begin
        dSig4 <= 8'b00000010;
        en <= 0;
        assert(q == 8'b00000001) else $fatal("Assertion failed: q should be 8'b00000001 at count %0d", count);
      end
      'd3: begin
        dSig4 <= 8'b00000011;
        en <= 1;
        assert(q == 8'b00000001) else $fatal("Assertion failed: q should be 8'b00000001 at count %0d", count);
      end
      'd4: begin
        dSig4 <= 8'b00000100;
        en <= 1;
        assert(q == 8'b00000011) else $fatal("Assertion failed: q should be 8'b00000011 at count %0d", count);
      end
      default: begin
        dSig4 <= 8'b00000000;
        en <= 0;
        assert(q == 8'b00000100) else $fatal("Assertion failed: q should be 8'b00000100 at count %0d", count);
      end
    endcase
    end
`;
const regMod4 = new Module({ name: 'addRegisterEn_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody4);
regMod4.addSignal('dSig4', { width: 8 });
regMod4.addSignal('en', {});
regMod4.addSignal('q', { width: 8 });
regMod4.addRegister({
    d: 'dSig4',
    clk: 'clk',
    reset: 'rst_b',
    resetVal: 8n,
    en: 'en',
    q: 'q'
});
try {
    const TB4 = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${regMod4.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addRegister_output/regMod4.sv', TB4);
}
catch (err) {
    console.error(err);
}
// test 5 high reset asynchronous with neg clock edge
const tbBody5 = `
    always_comb begin
        rst = ~rst_b;
    end
    
    logic [15:0] count;
    always @(negedge clk or posedge rst) begin
    if(!rst_b)
      begin
        count <= 'd0;
      end
      else
      begin
        count <= count + 1'b1;

    case (count)
    'd0: begin
      dSig5 <= 0;
      assert(dSig5_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
    end
    'd1: begin
      dSig5 <= 1;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd2: begin
      dSig5 <= 0;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd3: begin
      dSig5 <= 1;
      assert(dSig5_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
    end
    'd4: begin
      dSig5 <= 1;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    default: dSig5 <= 0;
    endcase
    end
    end
`;
const regMod5 = new Module({ name: 'addRegisterH_tb' }, {
    clk: { direction: 'input', isClock: 'negedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody5);
regMod5.addSignal('dSig5', {});
regMod5.addSignal('rst', { isReset: 'highasync' });
regMod5.addRegister({
    d: 'dSig5',
    clk: 'clk',
    reset: 'rst',
    resetVal: 1n
});
try {
    const TB5 = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${regMod5.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addRegister_output/regMod5.sv', TB5);
}
catch (err) {
    console.error(err);
}
// test 6 low syncronous reset and positive edge clock
const tbBody6 = `

logic [15:0] count;
always @(posedge clk or negedge rst_b) begin // remove or negedge rst
if(!rst_b) // changed to rst_b from rst
begin
  count <= 'd0;
  reset_sync <= 1'b0;
end
else
begin
  count <= count + 1'b1;
  reset_sync <= 1'b1;
  case (count)
  'd0: begin
  d <= 0;
  assert(d_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd1: begin
  d <= 1;
  assert(d_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd2: begin
  d <= 0;
  assert(d_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
  end
  'd3: begin
  d <= 1;
  assert(d_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd4: begin
  d <= 1;
  assert(d_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
  end
  default: d <= 0;
  endcase
  end
end
`;
const regMod6 = new Module({ name: 'addRegisterSync_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody6);
regMod6.addSignal('reset_sync', { isReset: 'lowsync' });
regMod6.addSignal('d', {});
regMod6.addRegister({
    d: 'd',
    clk: 'clk',
    reset: 'reset_sync',
    resetVal: 0n
});
try {
    const TB6 = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${regMod6.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addRegister_output/regMod6.sv', TB6);
}
catch (err) {
    console.error(err);
}
// test 7 high synchronous reset with positive clk edge
const tbBody7 = `
    logic [15:0] count;
    initial begin
      count = 'd0;
      rst =1'b1;
    end
    always @(posedge clk or negedge rst_b) begin // remove or negedge rst
    if(!rst_b) // changed to rst_b from rst
    begin
      rst <= 1'b1;
      count <= count + 1'b1;
      case (count)
      'd0: begin
      d <= 0;
      assert(d_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
      end
      'd1: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
      end
      'd2: begin
      d <= 0;
      assert(d_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
      end
      'd3: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
      end
      'd4: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
      end
      default: d <= 0;
      endcase
    end
    else
    begin
      rst <= 1'b0;
      end
    end
`;
const regMod7 = new Module({ name: 'addRegisterSyncH_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody7);
regMod7.addSignal('d', {});
regMod7.addSignal('rst', { isReset: 'highsync' });
regMod7.addRegister({
    d: 'd',
    clk: 'clk',
    reset: 'rst',
    resetVal: 1n
});
try {
    const TB7 = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${regMod7.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addRegister_output/regMod7.sv', TB7);
}
catch (err) {
    console.error(err);
}
// test 8 check bitwidth in register by having larger d then register
const tbBody8 = `
    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
      count <= 'd0;
    end
    else
    begin
      count <= count + 1'b1;

    case (count)
      'd0: begin
        d <= 8'b00000000;
        assert(q == 4'b0000) else $fatal("Assertion failed: q should be 8'b0000 at count %0d", count);
      end
      'd1: begin
        d <= 8'b00000001;
        assert(q == 8'b0000) else $fatal("Assertion failed: q should be 8'b00000 at count %0d", count);
      end
      'd2: begin
        d <= 8'b00010010;
        assert(q == 8'b0001) else $fatal("Assertion failed: q should be 8'b0001 at count %0d", count);
      end
      'd3: begin
        d <= 8'b10000011;
        assert(q == 8'b0010) else $fatal("Assertion failed: q should be 8'b0010 at count %0d", count);
      end
      'd4: begin
        d <= 8'b00100100;
        assert(q == 8'b0011) else $fatal("Assertion failed: q should be 8'b0011 at count %0d", count);
      end
      default: begin
        d <= 8'b00000000;
        assert(q == 8'b0100) else $fatal("Assertion failed: q should be 8'b0100 at count %0d", count);
      end
    endcase
    end
`;
const regMod8 = new Module({ name: 'addRegisterBW_tb' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {}, tbBody8);
regMod8.addSignal('d', { width: 8 });
regMod8.addSignal('q', { width: 4 });
regMod8.addRegister({
    d: 'd',
    clk: 'clk',
    q: 'q'
});
try {
    const TB8 = `
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${regMod8.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_addRegister_output/regMod8.sv', TB8);
}
catch (err) {
    console.error(err);
}
