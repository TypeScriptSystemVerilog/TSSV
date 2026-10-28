// Generate the FIR configurations, the inputs for verilatorTB/tb_FIR.sv, and tb_lpFIR:
//
// 1. Each configuration in CONFIGS, one definition per file with a lint wrapper that includes it
//    (sv-examples/FIR/<name>/), checking its ports against the spec's IO tables and its
//    accumulator width against the accumulatorWidth default (TEST-2)
// 2. Parameter values the constructor must reject (PARAM-5), and parameters that must or mustn't
//    name the same module (PARAM-2)
// 3. sv-examples/FIR/tb/, the testbench inputs:
//    - FIR_tb_configs.svh: per-configuration DUT name, widths and reset coefficients
//    - FIR_tb_vectors.svh: the spec's timing diagram, one row per cycle
//    - configs.txt: "<config> <top .sv path>" per line, read by `make fir_sim`
// 4. tb_lpFIR in sv-examples/FIR/myFIR3/: the chirp testbench that doc/tutorials/fir.md simulates
//    and views in GTKWave. It checks nothing; tb_FIR.sv does
//
// Run `make -C verilatorTB fir_sim` to generate everything, lint each configuration with -Wall
// and simulate it.

import { FIR, type FIR_Parameters } from 'tssv/lib/modules/FIR'
import { Module, type Interface } from 'tssv/lib/core/TSSV'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { writeLintWrapped } from 'tssv/test/models/lintWrapper'
import { markTestbench } from 'tssv/test/models/testbench'

const GENERATOR = 'ts/test/test_FIR.ts'
const SPEC = 'doc/modules/FIR/FIR-spec.md'
const SOURCE = 'ts/src/modules/FIR/FIR.ts'
const DIAGRAM = 'FIR-timing-stream.svg'
const OUT = 'sv-examples/FIR'
const TB_DIR = `${OUT}/tb`

let passed = 0
let failed = 0

function check (label: string, ok: boolean, detail?: string): void {
  if (ok) {
    console.log(`PASS: ${label}`)
    passed++
  } else {
    console.error(`FAIL: ${label}${detail !== undefined ? `\n  ${detail}` : ''}`)
    failed++
  }
}

function expectThrow (label: string, fn: () => unknown, message: string): void {
  try {
    fn()
    check(label, false, 'did not throw')
  } catch (e) {
    const got = (e instanceof Error) ? e.message : String(e)
    check(label, got.includes(message), `expected a message containing '${message}', got '${got}'`)
  }
}

interface FirInternals {
  IOs: Record<string, unknown>
  interfaces: Record<string, Interface>
  signals: Record<string, { width?: number }>
  submodules: Record<string, { module: Module }>
}
const internals = (f: FIR): FirInternals => f as unknown as FirInternals

// ============================================ 1. configurations
interface Config {
  /** configuration name: the -DCFG_<cfg> macro and the simulation's obj_dir */
  cfg: string
  params: FIR_Parameters
  /** replay the spec's timing diagram (it's drawn for myFIR3's reset coefficients) */
  diagram: boolean
}

const CONFIGS: Config[] = [
  // the tutorial's 13-tap low-pass filter, and tb_lpFIR's DUT
  {
    cfg: 'lowpass13',
    params: {
      name: 'myFIR3',
      numTaps: 13,
      coefficients: [-1n, 0n, 5n, -6n, -10n, 38n, 77n, 38n, -10n, -6n, 5n, 0n, -1n],
      coefficientsWidth: 8,
      inWidth: 8,
      outWidth: 8,
      rShift: 7
    },
    diagram: true
  },
  // every default: 32-bit coefficients that reset to 0, so only a write over regs gives an output
  { cfg: 'defaults', params: { numTaps: 4 }, diagram: false },
  // rShift 0: no rounding, and an output wider than the accumulator, so nothing saturates
  { cfg: 'no_round', params: { numTaps: 3, coefficients: [-2n, 1n, 3n], coefficientsWidth: 4, inWidth: 4, outWidth: 12, rShift: 0 }, diagram: false },
  // an accumulator 4 bits narrower than the full width, which wraps
  { cfg: 'narrow_acc', params: { numTaps: 5, coefficients: [3n, -7n, 12n, -7n, 3n], coefficientsWidth: 6, inWidth: 6, outWidth: 6, rShift: 3, accumulatorWidth: 10 }, diagram: false },
  // one tap, every width at its maximum: a 64-bit accumulator and a 32-bit output
  { cfg: 'wide', params: { numTaps: 1, coefficients: [-(2n ** 31n)], coefficientsWidth: 32, inWidth: 32, outWidth: 32, rShift: 31 }, diagram: false },
  // every width at its minimum: 1-bit samples and 2-bit coefficients
  { cfg: 'narrowest', params: { numTaps: 2, coefficients: [-2n, 1n], coefficientsWidth: 2, inWidth: 1, outWidth: 2, rShift: 1 }, diagram: false }
]

/** the accumulatorWidth default the spec gives: inWidth + coefficientsWidth + floor(log2(numTaps)) */
function specAccumulatorWidth (p: FIR_Parameters): number {
  return (p.inWidth ?? 8) + (p.coefficientsWidth ?? 32) + Math.floor(Math.log2(p.numTaps))
}

// The spec's IO tables: two plain ports, and three interface ports with their roles
const SPEC_PORTS = 'clk rst_b'
const SPEC_INTERFACES = 'm_axis:AXI4Stream_32_4_0_4.outward regs:memory_bidi_32_32.inward s_axis:AXI4Stream_32_4_0_4.inward'

const tbConfigs: string[] = []
const configList: string[] = []
const firs = new Map<string, FIR>()
for (const c of CONFIGS) {
  const fir = new FIR(c.params)
  firs.set(c.cfg, fir)
  const { IOs, interfaces, signals } = internals(fir)
  check(`${c.cfg}: ports match the spec`, Object.keys(IOs).sort().join(' ') === SPEC_PORTS, Object.keys(IOs).join(' '))
  const intfs = Object.entries(interfaces).filter(([, i]) => i.role !== undefined)
    .map(([port, i]) => `${port}:${i.interfaceName()}.${String(i.role)}`).sort().join(' ')
  check(`${c.cfg}: interface ports match the spec`, intfs === SPEC_INTERFACES, intfs)
  const accWidth = c.params.accumulatorWidth ?? specAccumulatorWidth(c.params)
  check(`${c.cfg}: sum_q is ${accWidth} bits`, signals.sum_q?.width === accWidth, `sum_q is ${signals.sum_q?.width} bits`)

  const dir = `${OUT}/${fir.name}`
  const design = writeLintWrapped(fir, dir, GENERATOR)
  check(`${c.cfg}: no WIDTH waiver (LINT-3)`, design.every(f => !readFileSync(f, 'utf8').includes('lint_off WIDTH')))
  configList.push(`${c.cfg} ${design[design.length - 1] ?? ''}`)

  const p = fir.params
  const literal = (v: bigint): string => `${v < 0n ? '-' : ''}64'sd${v < 0n ? -v : v}`
  tbConfigs.push([
    `\`${tbConfigs.length === 0 ? 'ifdef' : 'elsif'} CFG_${c.cfg}`,
    `  \`define CFG_NAME "${c.cfg}"`,
    `  \`define FIR_DUT ${fir.name}`,
    `  \`define AXIS_IF ${interfaces.s_axis?.interfaceName() ?? ''}`,
    `  \`define REGS_IF ${interfaces.regs?.interfaceName() ?? ''}`,
    `  \`define NUM_TAPS ${p.numTaps}`,
    `  \`define IN_W ${p.inWidth}`,
    `  \`define OUT_W ${p.outWidth}`,
    `  \`define COEFF_W ${p.coefficientsWidth}`,
    `  \`define RSHIFT ${p.rShift}`,
    `  \`define ACC_W ${p.accumulatorWidth}`,
    `  \`define RESET_COEFFS '{${p.coefficients.map(literal).join(', ')}}`,
    ...(c.diagram ? ['  `define DIAGRAM'] : [])
  ].join('\n'))
  console.log(`${fir.name}: testbench config ${c.cfg}`)
}

// ============================================ 2. parameter checks
expectThrow('numTaps 0 is rejected', () => new FIR({ numTaps: 0 }), 'numTaps must be a positive integer, got 0')
expectThrow('numTaps 2.5 is rejected', () => new FIR({ numTaps: 2.5 }), 'numTaps must be a positive integer, got 2.5')
expectThrow('more coefficients than taps are rejected', () => new FIR({ numTaps: 2, coefficients: [1n, 2n, 3n] }),
  'coefficients has 3 values for 2 taps')
expectThrow('a coefficient of 128 doesn\'t fit 8 bits, signed', () => new FIR({ numTaps: 1, coefficients: [128n], coefficientsWidth: 8 }),
  'coefficients[0] = 128 doesn\'t fit in 8 bits, signed')
expectThrow('a coefficient of -129 doesn\'t fit 8 bits, signed', () => new FIR({ numTaps: 2, coefficients: [0n, -129n], coefficientsWidth: 8 }),
  'coefficients[1] = -129 doesn\'t fit in 8 bits, signed')
expectThrow('an accumulator no wider than rShift is rejected', () => new FIR({ numTaps: 4, rShift: 5, accumulatorWidth: 5 }),
  'accumulatorWidth must be an integer from 6 to 42, got 5')
expectThrow('an accumulator wider than the full width is rejected', () => new FIR({ numTaps: 4, coefficientsWidth: 8, accumulatorWidth: 19 }),
  'accumulatorWidth must be an integer from 3 to 18, got 19')
expectThrow('coefficientsWidth 1 from JavaScript is rejected', () => new FIR({ numTaps: 1, coefficientsWidth: 1 as unknown as 2 }),
  'coefficientsWidth must be an integer from 2 to 32, got 1')
try {
  // the extremes of an 8-bit signed coefficient
  void new FIR({ numTaps: 2, coefficients: [-128n, 127n], coefficientsWidth: 8 })
  check('coefficients -128 and 127 fit 8 bits, signed', true)
} catch (e) {
  check('coefficients -128 and 127 fit 8 bits, signed', false, String(e))
}

const nameOf = (p: FIR_Parameters): string => new FIR(p).name
check('a short coefficient list names the same module as its zero-padded form',
  nameOf({ numTaps: 3, coefficients: [1n] }) === nameOf({ numTaps: 3, coefficients: [1n, 0n, 0n] }))
check('the order parameters are passed in doesn\'t change the name',
  nameOf({ rShift: 3, numTaps: 3 }) === nameOf({ numTaps: 3, rShift: 3 }))
check('the default accumulatorWidth names the same module as passing it',
  nameOf({ numTaps: 4 }) === nameOf({ numTaps: 4, accumulatorWidth: 42 }))
check('a narrower accumulator names a different module',
  nameOf({ numTaps: 4 }) !== nameOf({ numTaps: 4, accumulatorWidth: 41 }))
const coeffBlock = (f: FIR): string => internals(f).submodules.u_coeff_regs?.module.name ?? ''
check('two unnamed FIRs get different coefficient blocks',
  coeffBlock(new FIR({ numTaps: 2 })) !== coeffBlock(new FIR({ numTaps: 3 })))

// ============================================ 3. testbench inputs
mkdirSync(TB_DIR, { recursive: true })
const header = '// Generated by ts/test/test_FIR.ts. Do not edit.\n'
writeFileSync(`${TB_DIR}/FIR_tb_configs.svh`,
  header + tbConfigs.join('\n') + '\n`else\n  `error "define one of the CFG_<config> macros"\n`endif\n')
writeFileSync(`${TB_DIR}/configs.txt`, configList.join('\n') + '\n')

interface Lane { name: string, wave: string, data?: string[] }

/** the spec's timing diagram, and the copy in FIR_Ports's JSDoc, which must match it */
const specJson = readFileSync(SPEC, 'utf8').match(new RegExp(`<!-- wavedrom ${DIAGRAM}\\n([\\s\\S]*?)\\n-->`))?.[1]
if (specJson === undefined) throw Error(`${SPEC} has no ${DIAGRAM} diagram`)
const lanes = (JSON.parse(specJson) as { signal: Lane[] }).signal
const jsdocJson = readFileSync(SOURCE, 'utf8').match(/@wavedrom\n \* ```json\n([\s\S]*?)\n \* ```/)?.[1]
  ?.split('\n').map(l => l.replace(/^ \* ?/, '')).join('\n')
check(`the JSDoc diagram in ${SOURCE} matches ${SPEC}'s`,
  jsdocJson !== undefined && JSON.stringify(JSON.parse(jsdocJson)) === JSON.stringify(JSON.parse(specJson)))

/**
 * A lane's value in each cycle. A 0/1 lane gives 0 or 1. A data lane gives the number in its
 * label (3 for "i3"), or -1 for 'x'.
 */
function expandLane (name: string): number[] {
  const lane = lanes.find(l => l.name === name)
  if (lane === undefined) throw Error(`${DIAGRAM} has no lane ${name}`)
  const labels = [...(lane.data ?? [])]
  const values: number[] = []
  for (const ch of lane.wave) {
    if (ch === '.') {
      values.push(values[values.length - 1] ?? -1)
    } else if (ch === '0' || ch === '1') {
      values.push(Number(ch))
    } else if (ch === 'x') {
      values.push(-1)
    } else if (/[2-9=]/.test(ch)) {
      const label = labels.shift()
      const n = label?.match(/^[io](\d+)$/)?.[1]
      if (n === undefined) throw Error(`${DIAGRAM}: lane ${name}: label ${label} isn't i<N> or o<N>`)
      values.push(Number(n))
    } else {
      throw Error(`${DIAGRAM}: lane ${name}: unexpected wave character '${ch}'`)
    }
  }
  return values
}

// tb_FIR.sv's diag_t field order: inputs first, then the outputs it checks
const FIELDS = ['s_axis.TVALID', 's_axis.TDATA', 'm_axis.TREADY', 's_axis.TREADY', 'm_axis.TVALID', 'm_axis.TDATA']
const columns = FIELDS.map(expandLane)
const cycles = columns[0]?.length ?? 0
check(`every lane of ${DIAGRAM} is ${cycles} cycles`, columns.every(c => c.length === cycles))
const rows = Array.from({ length: cycles }, (_, i) => `    '{${columns.map(c => c[i]).join(', ')}}`)
writeFileSync(`${TB_DIR}/FIR_tb_vectors.svh`, `${header}// ${DIAGRAM} in ${SPEC}, one row per cycle: ${FIELDS.join(', ')}.
// TDATA is the sample or output number (i3 or o3 is 3), or -1 where the diagram shows x.
localparam int DIAG_CYCLES = ${cycles};
localparam int DIAG [DIAG_CYCLES][${FIELDS.length}] = '{
${rows.join(',\n')}
  };
`)
console.log(`${DIAGRAM} from ${SPEC} written to ${TB_DIR}/FIR_tb_vectors.svh`)

// ============================================ 4. tb_lpFIR
const tbBody = `
    // always accept output
    assign m_axis.TREADY = 1'b1;
    // tie each stream's clock, reset and clock enable to the testbench's
    assign s_axis.ACLK    = clk;
    assign s_axis.ACLKEN  = 1'b1;
    assign s_axis.ARESETn = rst_b;
    assign m_axis.ACLK    = clk;
    assign m_axis.ACLKEN  = 1'b1;
    assign m_axis.ARESETn = rst_b;
    // the coefficient bus stays idle, so the coefficients keep their reset values
    assign regs.ADDR    = '0;
    assign regs.DATA_WR = '0;
    assign regs.WSTRB   = '0;
    assign regs.WE      = 1'b0;
    assign regs.RE      = 1'b0;

    // a chirp: a +127, -127 impulse pair every 32 / step samples, step halving every 256 samples
    always_ff @(posedge clk or negedge rst_b)
      if (!rst_b) begin
        s_axis.TVALID <= 1'b0;
        s_axis.TDATA  <= '0;
        count         <= '0;
        phase         <= '0;
        step          <= 5'd16;
      end else begin
        s_axis.TVALID <= 1'b1;
        count         <= 8'(count + 8'd1);
        if ((step > 5'd1) && (count == 8'd127)) step <= step >> 1;
        phase         <= 5'(phase + step);
        s_axis.TDATA  <= (phase == 5'd16) ? $unsigned(-32'sd127) : (phase == 5'd0) ? 32'd127 : '0;
      end

    // GTKWave shows the output stream and the bus's responses; nothing here reads them
    /* verilator lint_off UNUSEDSIGNAL */
    logic outputs_unused;
    /* verilator lint_on UNUSEDSIGNAL */
    assign outputs_unused = ^{m_axis.TDATA, m_axis.TSTRB, m_axis.TKEEP, m_axis.TLAST, m_axis.TID,
                              m_axis.TDEST, m_axis.TWAKEUP, regs.DATA_RD, regs.READY};
`
const tbLpFIR = markTestbench(new Module(
  { name: 'tb_lpFIR' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {
    phase: { width: 5 },
    count: { width: 8 },
    step: { width: 5 }
  },
  tbBody
))
const myFir3 = firs.get('lowpass13')
if (myFir3 === undefined) throw Error('no lowpass13 configuration')
// createMissing: the testbench gets a local s_axis, m_axis and regs bundle to drive the DUT's
tbLpFIR.addSubmodule('dut', myFir3, {}, true, true)
const tbFiles = tbLpFIR.writeSystemVerilogFiles(`${OUT}/${myFir3.name}`)
console.log(`tb_lpFIR: ${tbFiles.join(' ')}`)

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
