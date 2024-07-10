import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'
// import * as fs from 'fs'
import { IpXactComponent } from 'tssv/lib/modules/IpXactComponent'
import { FIR } from 'tssv/lib/modules/FIR'

try {
  mkdirSync('sv-examples/test_addSubmodule_output')
} catch (e) {}

// test 1: width extension, general

export interface Adder_Parameters extends TSSVParameters {
  aWidth?: IntRange<1, 32>
  bWidth?: IntRange<1, 32>
}
export class Adder extends Module {
  declare params: Adder_Parameters
  constructor (params: Adder_Parameters) {
    super({
      // define the default parameter values
      aWidth: params.aWidth || 8,
      bWidth: params.bWidth || 8
    })

    // define IO signals
    this.IOs = {
      a: { direction: 'input', width: this.params.aWidth, isSigned: true },
      b: { direction: 'input', width: this.params.bWidth, isSigned: true },
      sum: { direction: 'output', width: Math.max((this.params.aWidth || 1), (this.params.bWidth || 1)) + 1, isSigned: true }
    }
    this.addAdder({ a: 'a', b: 'b', result: 'sum' })
  }
}

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
    a <= 16'd7641;
    b <= 16'd4611;
    assert(sum == 17'd12252) else $display("Assertion failed: sum should be 2 at time %0t", $time);
end
'd1: begin
    a <= -16'd20785;
    b <= -16'd6903;
    assert(sum == -17'd27688) else $display("Assertion failed: sum should be 4 at time %0t", $time);
end
'd2: begin
    a <= 16'd20025;
    b <= -16'd11168;
    assert(sum == 17'd8857) else $display("Assertion failed: sum should be 105 at time %0t", $time);
end
'd3: begin
    a <= -16'd30974;
    b <= 16'd26651;
    assert(sum == -17'd4323) else $display("Assertion failed: sum should be 100 at time %0t", $time);
end
'd4: begin 
    a <= 16'd15349;
    b <= -16'd6500;
    assert(sum == 17'd8849) else $display("Assertion failed: sum should be 270 at time %0t", $time);
end
default: begin
    a <= 16'd0;
    b <= 16'd0;
end
endcase
end
`

const sub_tb = new Module(
  { name: 'sub_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
sub_tb.addSignal('a', { width: 16, isSigned: true })
sub_tb.addSignal('b', { width: 16, isSigned: true })
sub_tb.addSignal('sum', { width: 18, isSigned: true })
sub_tb.addSubmodule('add', new Adder({ aWidth: 17, bWidth: 17 }), { a: 'a', b: 'b', sum: 'sum' }, false, false, true)

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${sub_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubmodule_output/sub_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// test 2: autobinding, createMissing, no width extension

export interface Subber_Parameters extends TSSVParameters {
  aWidth?: IntRange<1, 32>
  bWidth?: IntRange<1, 32>
}
export class Subber extends Module {
  declare params: Adder_Parameters
  constructor (params: Adder_Parameters) {
    super({
    // define the default parameter values
      aWidth: params.aWidth || 8,
      bWidth: params.bWidth || 8
    })

    // define IO signals
    this.IOs = {
      a: { direction: 'input', width: this.params.aWidth, isSigned: true },
      b: { direction: 'input', width: this.params.bWidth, isSigned: true },
      sum: { direction: 'output', width: Math.max((this.params.aWidth || 1), (this.params.bWidth || 1)) + 1, isSigned: true }
    }
    this.addSubtractor({ a: 'a', b: 'b', result: 'sum' })
  }
}

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
    a <= 8'd7;
    b <= -8'd49;
    assert(sum == 9'd56) else $display("Assertion failed: sum should be 2 at time %0t", $time);
end
'd1: begin
    a <= -8'd3;
    b <= -8'd24;
    assert(sum == 9'd21) else $display("Assertion failed: sum should be 4 at time %0t", $time);
end
'd2: begin
    a <= -8'd13;
    b <= -8'd22;
    assert(sum == 9'd9) else $display("Assertion failed: sum should be 105 at time %0t", $time);
end
'd3: begin
    a <= -8'd108;
    b <= 8'd28;
    assert(sum == -9'd136) else $display("Assertion failed: sum should be 100 at time %0t", $time);
end
'd4: begin 
    a <= 8'd98;
    b <= 16'd63;
    assert(sum == 9'd35) else $display("Assertion failed: sum should be 270 at time %0t", $time);
end
default: begin
    a <= 16'd0;
    b <= 16'd0;
end
endcase
end
`

const subA_tb = new Module(
  { name: 'subA_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyA
)
subA_tb.addSignal('a', { width: 8, isSigned: true })
subA_tb.addSignal('b', { width: 8, isSigned: true })
// subA_tb.addSignal('sum', { width: 18, isSigned: true })
subA_tb.addSubmodule('subtract', new Subber({ aWidth: 8, bWidth: 8 }), { a: 'a' }, true, true, false)

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${subA_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubmodule_output/subA_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// unsigned test

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
    a <= 8'd213;
    b <= 8'd181;
    assert(sum == 9'd32) else $display("Assertion failed: sum should be 2 at time %0t", $time);
end
'd1: begin
    a <= 8'd46;
    b <= 8'd155;
    assert(sum == -9'd109) else $display("Assertion failed: sum should be 4 at time %0t", $time);
end
'd2: begin
    a <= 8'd135;
    b <= 8'd228;
    assert(sum == -9'd93) else $display("Assertion failed: sum should be 105 at time %0t", $time);
end
'd3: begin
    a <= 8'd108;
    b <= 8'd80;
    assert(sum == 9'd28) else $display("Assertion failed: sum should be 100 at time %0t", $time);
end
'd4: begin 
    a <= 8'd181;
    b <= 8'd98;
    assert(sum == 9'd8) else $display("Assertion failed: sum should be 270 at time %0t", $time);
end
default: begin
    a <= 16'd0;
    b <= 16'd0;
end
endcase
end
`

const subU_tb = new Module(
  { name: 'subU_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyU
)
subU_tb.addSignal('a', { width: 8, isSigned: false })
subU_tb.addSignal('b', { width: 8, isSigned: false })
// subA_tb.addSignal('sum', { width: 18, isSigned: true })
subU_tb.addSubmodule('sub', new Subber({ aWidth: 9, bWidth: 9 }), {}, true, true, true)

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${subU_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubmodule_output/subU_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// adding component
const tbBodyC =
`
`
const subC_tb = new Module(
  { name: 'subC_t' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyC
)
subC_tb.addSubmodule('FIR', new FIR({ coefficients: [1n, 2n] }), {}, true, true, true)

try {
  const TB =
`
    // verilator lint_off DECLFILENAME
    // verilator lint_off UNUSED
    ${subC_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubmodule_output/subI_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// adding IpXactComponent
/*
// const fileContent = fs.readFileSync(
//   '/Users/bennettva/amba-interface-parser/torus/torus_4x3_nodes_2024-06-05_08.50.40_Specification.Architecture.Structure_xml_2024-06-05_08.50.40_ipxact/Specification.Architecture.Structure.xml',
//   'utf-8')
const subI_tb = new IpXactComponent(
  {
    name: 'newComponent',
    xmlDataPath: '/Users/bennettva/amba-interface-parser/torus/torus_4x3_nodes_2024-06-05_08.50.40_Specification.Architecture.Structure_xml_2024-06-05_08.50.40_ipxact/Specification.Architecture.Structure.xml',
    svFilePath: '/Users/bennettva/amba-interface-parser/Specification_Architecture_Structure.stub.v'
  })

try {
  const TB =
`
    // verilator lint_off DECLFILENAME
    // verilator lint_off UNUSED
    ${subI_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubmodule_output/subI_tb.sv', TB)
} catch (err) {
  console.error(err)
}
*/