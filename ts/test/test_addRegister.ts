// import { Module, addRegister } from 'tssv/lib/core/TSSV'
import { Module, Expr } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'
import { markTestbench } from 'tssv/test/models/testbench'

try {
  mkdirSync('sv-examples/Core/addRegister', { recursive: true })
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
`

const regMod = markTestbench(new Module(
  { name: 'addRegister_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
))
regMod.addSignal('dSig', {})
regMod.addRegister(
  {
    d: 'dSig',
    clk: 'clk'
  }
)

try {
  writeFileSync(`sv-examples/Core/addRegister/${regMod.name}.sv`, regMod.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// test 2

const tbBody2 =
`
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
`

const regMod2 = markTestbench(new Module(
  { name: 'addRegisterWidth_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody2
))
regMod2.addSignal('dSig2', { width: 4 })
regMod2.addRegister(
  {
    d: 'dSig2',
    clk: 'clk'
  }
)

try {
  writeFileSync(`sv-examples/Core/addRegister/${regMod2.name}.sv`, regMod2.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// test 3

const tbBody3 =
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
  dSig3 <= 0;
  assert(dSig3_q == 0) else $fatal("Assertion failed: dSig3_q should be 0 at time %0t", $time);
end
'd1: begin
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig3_q should be 1 at time %0t", $time);
end
'd2: begin
  dSig3 <= 0;
  assert(dSig3_q == 0) else $fatal("Assertion failed: dSig3_q should be 0 at time %0t", $time);
end
'd3: begin
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig3_q should be 1 at time %0t", $time);
end
'd4: begin 
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig3_q should be 1 at time %0t", $time);
end
default: dSig3 <= 0;
endcase
end
`

const regMod3 = markTestbench(new Module(
  { name: 'addRegisterReset_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody3
))
regMod3.addSignal('dSig3', {})
regMod3.addRegister(
  {
    d: 'dSig3',
    clk: 'clk',
    reset: 'rst_b',
    resetVal: 0n
  }
)

try {
  writeFileSync(`sv-examples/Core/addRegister/${regMod3.name}.sv`, regMod3.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// test 4

const tbBody4 =
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
`

const regMod4 = markTestbench(new Module(
  { name: 'addRegisterEn_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody4
))
regMod4.addSignal('dSig4', { width: 8 })
regMod4.addSignal('en', {})
regMod4.addSignal('q', { width: 8 })
regMod4.addRegister(
  {
    d: 'dSig4',
    clk: 'clk',
    reset: 'rst_b',
    resetVal: 8n,
    en: 'en',
    q: 'q'
  }
)

try {
  writeFileSync(`sv-examples/Core/addRegister/${regMod4.name}.sv`, regMod4.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// test 5 high reset asynchronous with neg clock edge

// The testbench resets like the register it tests, on rst (RST-2), and rst is rst_b inverted:
// a reset generated in logic is an RST-4 error, but an inversion is wiring
const tbBody5 =
`
    assign rst = ~rst_b;

    logic [15:0] count;
    always @(negedge clk or posedge rst) begin
    if(rst)
      begin
        count <= 'd0;
      end
      else
      begin
        count <= count + 1'b1;

    case (count)
    'd0: begin
      dSig5 <= 0;
      assert(dSig5_q == 1) else $fatal("Assertion failed: dSig5_q should be 1 at time %0t", $time);
    end
    'd1: begin
      dSig5 <= 1;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig5_q should be 0 at time %0t", $time);
    end
    'd2: begin
      dSig5 <= 0;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig5_q should be 0 at time %0t", $time);
    end
    'd3: begin
      dSig5 <= 1;
      assert(dSig5_q == 1) else $fatal("Assertion failed: dSig5_q should be 1 at time %0t", $time);
    end
    'd4: begin
      dSig5 <= 1;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig5_q should be 0 at time %0t", $time);
    end
    default: dSig5 <= 0;
    endcase
    end
    end
`

const regMod5 = markTestbench(new Module(
  { name: 'addRegisterH_tb' },
  {
    clk: { direction: 'input', isClock: 'negedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody5
))
regMod5.addSignal('dSig5', {})
regMod5.addSignal('rst', { isReset: 'highasync' })
regMod5.addRegister(
  {
    d: 'dSig5',
    clk: 'clk',
    reset: 'rst',
    resetVal: 1n
  }
)

try {
  writeFileSync(`sv-examples/Core/addRegister/${regMod5.name}.sv`, regMod5.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// test 6 low syncronous reset and positive edge clock

// The testbench resets like the register it tests: rst_b is lowsync too (RST-2)
const tbBody6 =
`

logic [15:0] count;
always @(posedge clk) begin
if(!rst_b)
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
  assert(d_q == 0) else $fatal("Assertion failed: d_q should be 0 at time %0t", $time);
  end
  'd1: begin
  d <= 1;
  assert(d_q == 0) else $fatal("Assertion failed: d_q should be 0 at time %0t", $time);
  end
  'd2: begin
  d <= 0;
  assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
  end
  'd3: begin
  d <= 1;
  assert(d_q == 0) else $fatal("Assertion failed: d_q should be 0 at time %0t", $time);
  end
  'd4: begin
  d <= 1;
  assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
  end
  default: d <= 0;
  endcase
  end
end
`

const regMod6 = markTestbench(new Module(
  { name: 'addRegisterSync_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowsync' }
  },
  {},
  tbBody6
))
regMod6.addSignal('reset_sync', { isReset: 'lowsync' })
regMod6.addSignal('d', {})
regMod6.addRegister(
  {
    d: 'd',
    clk: 'clk',
    reset: 'reset_sync',
    resetVal: 0n
  }
)

try {
  writeFileSync(`sv-examples/Core/addRegister/${regMod6.name}.sv`, regMod6.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// test 7 high synchronous reset with positive clk edge

// The testbench resets like the register it tests, on tb_rst, which is rst_b inverted (RST-2,
// RST-4). rst holds the register in reset throughout, so q keeps its reset value, 1, whatever d is.
const tbBody7 =
`
    assign tb_rst = ~rst_b;

    logic [15:0] count;
    always @(posedge clk) begin
    if(tb_rst)
    begin
      count <= 'd0;
      rst <= 1'b1;
    end
    else
    begin
      rst <= 1'b1;
      count <= count + 1'b1;
      case (count)
      'd0: begin
      d <= 0;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      'd1: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      'd2: begin
      d <= 0;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      'd3: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      'd4: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      default: d <= 0;
      endcase
    end
    end
`

const regMod7 = markTestbench(new Module(
  { name: 'addRegisterSyncH_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody7
))
regMod7.addSignal('d', {})
regMod7.addSignal('rst', { isReset: 'highsync' })
regMod7.addSignal('tb_rst', { isReset: 'highsync' })
regMod7.addRegister(
  {
    d: 'd',
    clk: 'clk',
    reset: 'rst',
    resetVal: 1n
  }
)

try {
  writeFileSync(`sv-examples/Core/addRegister/${regMod7.name}.sv`, regMod7.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// test 8 check bitwidth in register by having larger d then register

const tbBody8 =
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

    case (count)
      'd0: begin
        d <= 8'b00000000;
        assert(q == 4'b0000) else $fatal("Assertion failed: q should be 4'b0000 for d = %b at count %0d", d, count);
      end
      'd1: begin
        d <= 8'b00000001;
        assert(q == 4'b0000) else $fatal("Assertion failed: q should be 4'b0000 for d = %b at count %0d", d, count);
      end
      'd2: begin
        d <= 8'b00010010;
        assert(q == 4'b0001) else $fatal("Assertion failed: q should be 4'b0001 for d = %b at count %0d", d, count);
      end
      'd3: begin
        d <= 8'b10000011;
        assert(q == 4'b0010) else $fatal("Assertion failed: q should be 4'b0010 for d = %b at count %0d", d, count);
      end
      'd4: begin
        d <= 8'b00100100;
        assert(q == 4'b0011) else $fatal("Assertion failed: q should be 4'b0011 for d = %b at count %0d", d, count);
      end
      default: begin
        d <= 8'b00000000;
        assert(q == 4'b0100) else $fatal("Assertion failed: q should be 4'b0100 for d = %b at count %0d", d, count);
      end
    endcase
    end
`

const regMod8 = markTestbench(new Module(
  { name: 'addRegisterBW_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody8
))
regMod8.addSignal('d', { width: 8 })
regMod8.addSignal('q', { width: 4 })
// q keeps d's low bits: the slice says so (WIDTH-7), and the messages print all of d
regMod8.addRegister(
  {
    d: new Expr('d[3:0]'),
    clk: 'clk',
    q: 'q'
  }
)

try {
  writeFileSync(`sv-examples/Core/addRegister/${regMod8.name}.sv`, regMod8.writeSystemVerilog())
} catch (err) {
  console.error(err)
}
