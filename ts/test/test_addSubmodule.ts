import { Module, Expr, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
import { mkdirSync } from 'fs'
// import * as fs from 'fs'
import { Q_Channel } from 'tssv/lib/interfaces/AMBA/AMBA4/Q-Channel/r0p0_0/Q-Channel'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { markTestbench } from 'tssv/test/models/testbench'
import { emitSplit } from 'tssv/test/models/emitSplit'

const GENERATOR = 'ts/test/test_addSubmodule.ts'
const OUT = 'sv-examples/Core/addSubmodule'

try {
  mkdirSync(OUT, { recursive: true })
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

const sub_tb = markTestbench(new Module(
  { name: 'sub_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
))
sub_tb.addSignal('a', { width: 16, isSigned: true })
sub_tb.addSignal('b', { width: 16, isSigned: true })
sub_tb.addSignal('sum', { width: 18, isSigned: true })
sub_tb.addSubmodule('add', new Adder({ aWidth: 17, bWidth: 17 }), { a: 'a', b: 'b', sum: 'sum' }, false, false, true)

try {
  emitSplit(sub_tb, OUT, GENERATOR)
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
    assert(sum == 9'sd56) else $display("Assertion failed: sum should be 56 at time %0t", $time);
end
'd1: begin
    a <= -8'd3;
    b <= -8'd24;
    assert(sum == 9'sd21) else $display("Assertion failed: sum should be 21 at time %0t", $time);
end
'd2: begin
    a <= -8'd13;
    b <= -8'd22;
    assert(sum == 9'sd9) else $display("Assertion failed: sum should be 9 at time %0t", $time);
end
'd3: begin
    a <= -8'd108;
    b <= 8'd28;
    assert(sum == -9'sd136) else $display("Assertion failed: sum should be -136 at time %0t", $time);
end
'd4: begin 
    a <= 8'd98;
    b <= 8'd63;
    assert(sum == 9'sd35) else $display("Assertion failed: sum should be 35 at time %0t", $time);
end
default: begin
    a <= 8'd0;
    b <= 8'd0;
end
endcase
end
`

const subA_tb = markTestbench(new Module(
  { name: 'subA_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyA
))
subA_tb.addSignal('a', { width: 8, isSigned: true })
subA_tb.addSignal('b', { width: 8, isSigned: true })
// subA_tb.addSignal('sum', { width: 18, isSigned: true })
subA_tb.addSubmodule('subtract', new Subber({ aWidth: 8, bWidth: 8 }), { a: 'a' }, true, true, false)

try {
  emitSplit(subA_tb, OUT, GENERATOR)
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
    assert(sum == 10'sd32) else $display("Assertion failed: sum should be 32 at time %0t", $time);
end
'd1: begin
    a <= 8'd46;
    b <= 8'd155;
    assert(sum == -10'sd109) else $display("Assertion failed: sum should be -109 at time %0t", $time);
end
'd2: begin
    a <= 8'd135;
    b <= 8'd228;
    assert(sum == -10'sd93) else $display("Assertion failed: sum should be -93 at time %0t", $time);
end
'd3: begin
    a <= 8'd108;
    b <= 8'd80;
    assert(sum == 10'sd28) else $display("Assertion failed: sum should be 28 at time %0t", $time);
end
'd4: begin 
    a <= 8'd181;
    b <= 8'd98;
    assert(sum == 10'sd83) else $display("Assertion failed: sum should be 83 at time %0t", $time);
end
default: begin
    a <= 8'd0;
    b <= 8'd0;
end
endcase
end
`

const subU_tb = markTestbench(new Module(
  { name: 'subU_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyU
))
subU_tb.addSignal('a', { width: 8, isSigned: false })
subU_tb.addSignal('b', { width: 8, isSigned: false })
// subA_tb.addSignal('sum', { width: 18, isSigned: true })
subU_tb.addSubmodule('sub', new Subber({ aWidth: 9, bWidth: 9 }), {}, true, true, true)

try {
  emitSplit(subU_tb, OUT, GENERATOR)
} catch (err) {
  console.error(err)
}

// test 4: a submodule with an interface port. autoBind binds clk and rst_b, and createMissing
// creates the bundle q for the device's Q-Channel port. The testbench toggles QREQn and checks
// that the device accepts each change a cycle later, and never denies one

const qDevice = new Module(
  { name: 'QDevice' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  ''
)
qDevice.addInterface('q', new Q_Channel({}, 'inward'))
qDevice.addRegister({ d: 'q.QREQn', clk: 'clk', reset: 'rst_b', resetVal: 1n, q: 'q.QACCEPTn' })
qDevice.addAssign({ in: new Expr("1'b0"), out: 'q.QDENY' })
qDevice.addAssign({ in: new Expr("1'b1"), out: 'q.QACTIVE' })

const tbBodyI =
`
logic req_n_q;
always @(posedge clk or negedge rst_b)
if (!rst_b) begin
  q.QREQn <= 1'b1;
  req_n_q <= 1'b1;
end else begin
  q.QREQn <= ~q.QREQn;
  req_n_q <= q.QREQn;
  assert (q.QACCEPTn == req_n_q && !q.QDENY && q.QACTIVE)
  else $fatal(1, "Assertion failed: QACCEPTn should be %b, QDENY 0 and QACTIVE 1 at time %0t", req_n_q, $time);
end
`
const subI_tb = markTestbench(new Module(
  { name: 'subI_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyI
))
subI_tb.addSubmodule('device', qDevice, {}, true, true, true)

try {
  emitSplit(subI_tb, OUT, GENERATOR)
} catch (err) {
  console.error(err)
}

const expectThrow = (what: string, fn: () => void, match: string): void => {
  try {
    fn()
  } catch (e) {
    const msg = (e as Error).message
    if (!msg.includes(match)) throw Error(`${what}: threw "${msg}", expected it to mention "${match}"`)
    console.log(`PASS: ${what}`)
    return
  }
  throw Error(`${what}: did not throw`)
}

// interface port binding: the parent instance must be the same SV interface type
// (class name plus parameter values) as the child's port, and must exist
{
  const memChild = (dataWidth: 32 | 64): Module => {
    const m = new Module({ name: `memChild_${dataWidth}` }, {}, {}, '')
    m.addInterface('mem', new Memory({ DATA_WIDTH: dataWidth }, 'inward'))
    return m
  }

  const okParent = new Module({ name: 'ifBindOk' }, {}, {}, '')
  okParent.addInterface('bus', new Memory({ DATA_WIDTH: 32 }))
  okParent.addSubmodule('u', memChild(32), { mem: 'bus' }, false)
  console.log('PASS: matching interface type binds')

  const badParent = new Module({ name: 'ifBindWidth' }, {}, {}, '')
  badParent.addInterface('bus', new Memory({ DATA_WIDTH: 64 }))
  expectThrow('mismatched interface parameters', () => {
    badParent.addSubmodule('u', memChild(32), { mem: 'bus' }, false)
  }, 'interface type mismatch on memChild_32: memory_bidi_64_32 vs memory_bidi_32_32')

  // A Memory's type sets which signals it has, so it is part of the SV interface type
  const typeParent = new Module({ name: 'ifBindType' }, {}, {}, '')
  typeParent.addInterface('bus', new Memory({ type: 'rd_only', DATA_WIDTH: 32 }))
  expectThrow('mismatched Memory type', () => {
    typeParent.addSubmodule('u', memChild(32), { mem: 'bus' }, false)
  }, 'interface type mismatch on memChild_32: memory_rd_only_32_32 vs memory_bidi_32_32')

  expectThrow('unknown Memory type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Memory({ type: 'ro' as any })
  }, "Memory: unknown type 'ro'")

  const missingParent = new Module({ name: 'ifBindMissing' }, {}, {}, '')
  expectThrow('binding to an interface that does not exist', () => {
    missingParent.addSubmodule('u', memChild(32), { mem: 'nope' }, false)
  }, "mem: interface 'nope' not found in ifBindMissing")

  const roleParent = new Module({ name: 'ifBindRole' }, {}, {}, '')
  roleParent.addInterface('bus', new Memory({ DATA_WIDTH: 32 }, 'outward'))
  expectThrow('role mismatch is still checked', () => {
    roleParent.addSubmodule('u', memChild(32), { mem: 'bus' }, false)
  }, 'interface role mismatch')
}

// a repeated instance name throws instead of replacing the first instance (#84),
// through addSubmodule and through addSystemVerilogSubmodule, which calls it
{
  const leaf = new Module({ name: 'dupLeaf' }, { a: { direction: 'input', width: 4 } })
  const dupParent = new Module({ name: 'dupInstance' }, { a: { direction: 'input', width: 4 } })
  dupParent.addSubmodule('u0', leaf, { a: 'a' }, false)
  expectThrow('repeated instance name', () => {
    dupParent.addSubmodule('u0', leaf, { a: 'a' }, false)
  }, 'submodule with instance name u0 already exists')

  const svParent = new Module({ name: 'dupSVInstance' }, {
    a: { direction: 'input', width: 8 },
    en: { direction: 'input' },
    y: { direction: 'output', width: 8 }
  })
  svParent.addSystemVerilogSubmodule('u_leaf', '$TSSV_ROOT/ts/test/importParse/leaf.sv', { W: 8 }, { a: 'a', en: 'en', y: 'y' }, false, { moduleName: 'leaf' })
  expectThrow('repeated instance name through addSystemVerilogSubmodule', () => {
    svParent.addSystemVerilogSubmodule('u_leaf', '$TSSV_ROOT/ts/test/importParse/leaf.sv', { W: 8 }, { a: 'a', en: 'en', y: 'y' }, false, { moduleName: 'leaf' })
  }, 'submodule with instance name u_leaf already exists')
}
