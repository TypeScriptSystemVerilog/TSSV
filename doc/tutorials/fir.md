# FIR Module Walkthrough

This document explains every function and construct used in the FIR module and its testbench, then walks through the full process of compiling TypeScript, generating SystemVerilog, and running a simulation. The module's behavior is specified in [`doc/modules/FIR/FIR-spec.md`](../modules/FIR/FIR-spec.md).

---

## Part 1 — The FIR Module (`ts/src/modules/FIR/FIR.ts`)

### What the module does

Implements a parameterized **Finite Impulse Response (FIR) digital filter**. Input samples arrive over an AXI4-Stream slave interface. Each one shifts into a delay line of taps, each tap is multiplied by a coefficient stored in a register block, and the products are accumulated, rounded, and saturated before being driven on an AXI4-Stream master interface. The number of taps is set by `numTaps` at instantiation time, and the coefficients can be rewritten at runtime over a Memory bus.

---

### Interfaces and types

#### `type inOutWidthType = TSSV.IntRange<1, 32>`
Defines a compile-time constrained integer type. `IntRange<1, 32>` means only values between 1 and 32 are valid TypeScript values for the input and output data widths.

#### `interface FIR_Parameters extends TSSV.TSSVParameters`
Declares the typed parameter bag passed to the FIR constructor:
- `numTaps: number` — number of filter taps and coefficient registers (required).
- `coefficients?: bigint[]` — reset value of each coefficient register. Taps past the end of the list reset to `0n`.
- `coefficientsWidth?: TSSV.IntRange<2,32>` — width of the signed coefficient registers (default 32).
- `inWidth?: inOutWidthType` — bit width of the input sample (default 8).
- `outWidth?: inOutWidthType` — bit width of the output sample (default 9).
- `rShift?: TSSV.IntRange<0,32>` — right shift, rounding half up, from the accumulator to the output (default 2). `0` doesn't round.
- `accumulatorWidth?: TSSV.IntRange<1,128>` — width of the accumulator. The default, `inWidth + coefficientsWidth + ⌊log2(numTaps)⌋`, holds the sum for any coefficients; a narrower one wraps.

#### `interface FIR_Ports extends TSSV.IOSignals`
Only flat clock and reset ports appear here (required by `addRegister`):
- `clk: { direction: 'input', isClock: 'posedge' }` — posedge clock.
- `rst_b: { direction: 'input', isReset: 'lowasync' }` — active-low asynchronous reset.

The AXI4-Stream and Memory bus interfaces are added via `addInterface` and do not appear in this type.

---

### Interface ports

Three interface ports are added in the constructor, each with a role, which makes it a port rather than a local bundle:

- **`s_axis` (inward/slave)** — receives signed input samples. `TDATA[inWidth-1:0]` carries the sample.
- **`m_axis` (outward/master)** — drives filtered output samples. `TDATA` is sign-extended to 32 bits.
- **`regs` (inward Memory)** — the coefficient registers' bus, bound to the register block inside FIR (below).

#### Backpressure adapter

The pipeline advances on `en`, and the tap line only on a transfer:

- `en = m_axis.TREADY || !valid_out_q` — the pipeline advances when the output can drain or the output stage is empty.
- `s_axis.TREADY = en` — upstream is backpressured when the pipeline stalls.
- `s_xfer = s_axis.TVALID && en` — a sample transfers, and shifts into the tap line.

One valid bit per stage tracks where real data is: `valid_tap_q` (the tap line holds a new sample), `valid_sum_q` (the accumulator holds its sum) and `valid_out_q` (the output register holds its output). `m_axis.TVALID = valid_out_q`.

**Latency:** a sample transferred in cycle c comes out on `m_axis` in cycle c + 3, unless `m_axis` stalls.

---

### Constructor internals

#### `super(normalizeFIRParams(paramsIn))`
Calls the base `Module` constructor with every parameter, defaults applied, in a fixed order. They are stored in `this.params` and make up the auto-generated module name, so leaving a parameter out and passing its default give the same module.

#### Parameter checks
Right after `super()`, the constructor throws on values the types can't rule out: a `numTaps` that isn't a positive integer, more `coefficients` than taps, a coefficient that doesn't fit `coefficientsWidth` bits signed, an `accumulatorWidth` outside `rShift + 1` to its default.

#### `this.IOs = { clk, rst_b }`
Only clock and reset appear as flat ports.

#### `createFirCoeffsDef(numTaps, coefficientsWidth, coefficients)`
Calls the factory function imported from `regs-fir_coeffs.ts` (generated from `fir_coeffs.yaml`). Returns `{ addrMap, def }` — the `RegisterBlockDef` for a coefficient register block with exactly `numTaps` RW registers of `coefficientsWidth` bits. Reset values come from `coefficients`. See Part 4 for full details.

---

### Tap delay line loop

```typescript
const taps: string[] = []
for (let i = 0; i < numTaps; i++) {
  const tap = `tap_${i}_q`
  this.addSignal(tap, { width: inWidth, isSigned: true })
  this.addRegister({ d: taps[i - 1] ?? 'data_in', clk: 'clk', reset: 'rst_b', en: 's_xfer', q: tap })
  taps.push(tap)
}
```

Iterates once per tap. Tap 0 loads `data_in`, the sample from `s_axis.TDATA`, and each later tap loads the one before it.

#### `this.addSignal(name, { width, isSigned })`
Declares an internal signal. Returns a `Sig` handle. Generates `logic signed [N-1:0] tap_i_q;` in SV.

#### `this.addRegister({ d, clk, reset, en, q })`
Creates a D flip-flop. All registers with the same `(clk, reset, en)` triple merge into a single `always_ff` block. The taps are enabled by `s_xfer`, so they shift only when a sample transfers.

#### `this.addMultiplier({ a, b, result })`
Creates a combinational multiplier. `a` is the tap register, `b` the coefficient register's output (`coeff_i`), and `result` the product signal, `inWidth + coefficientsWidth` bits wide so no bit is lost. Generates `assign prod_i = tap_i_q * coeff_i;`. Because `b` is a signal, coefficients can be updated at runtime over the `regs` bus.

---

### Coefficient registers

```typescript
const coeffRegBlock = new RegisterBlock<Record<string, bigint>>(
  { name: `${this.name}_coeffRegs`, busAddressWidth: REGS_ADDR_WIDTH },
  coeffDef,
  new Memory()
)
this.addSubmodule('u_coeff_regs', coeffRegBlock, coeffBindings)
```

`coeffBindings` binds the block's `clk`, `rst_b`, its `regs` bus to FIR's own `regs` port, and each `COEFF_i` output to the signal `coeff_i`. The block is named after the FIR, so two FIRs with different coefficients get different blocks.

---

### Accumulator

#### `this.addAssign({ in: new TSSV.Expr(sum), out: 'sum_nxt' })`
`new TSSV.Expr(string)` wraps a raw SystemVerilog expression. Here it's all the products joined with `+`, written plain: `assign sum_nxt = prod_0 + prod_1 + ...;`. `sum_nxt` is `accumulatorWidth` bits, and the products are sign-extended to it. With an `accumulatorWidth` narrower than its default, the sum gets one outer cast, `10'(prod_0 + ...)`, which marks the wrap (SV guide WIDTH-2). `addRegister` then registers `sum_nxt` into `sum_q`.

---

### Rounding and saturation

#### `this.addRound({ in, out, rShift })`
Generates combinational round-half-up logic: shifts `sum_q` right by `rShift` bits into `rounded`. With `rShift: 0` the constructor skips it.

#### `this.addSaturate({ in, out })`
Generates combinational saturation: clamps `rounded` to `[-2^(outWidth-1), 2^(outWidth-1)-1]`.

The final `addRegister({ d: 'saturated', ..., q: 'data_out_q' })` registers the result into `data_out_q`, which drives `m_axis.TDATA` sign-extended to 32 bits: `assign m_axis.TDATA = $unsigned(32'(data_out_q));`.

---

## Part 2 — The FIR Testbenches (`ts/test/test_FIR.ts`)

`test_FIR.ts` generates FIR in several configurations, and two testbenches: `tb_lpFIR`, a chirp to look at in GTKWave, described here, and the self-checking `verilatorTB/tb_FIR.sv` that `make fir_sim` runs (the spec's Test Plan).

### Instantiating the FIR

```typescript
const myFir3 = new FIR({
  name: 'myFIR3',
  numTaps: 13,
  coefficients: [-1n, 0n, 5n, -6n, -10n, 38n, 77n, 38n, -10n, -6n, 5n, 0n, -1n],
  coefficientsWidth: 8,
  inWidth: 8,
  outWidth: 8,
  rShift: 7
})
writeLintWrapped(myFir3, 'sv-examples/FIR/myFIR3', GENERATOR)
```

`numTaps: 13` sets the tap count and how many coefficient registers are generated. `coefficients` provides the reset values. Both are independent — any tap count works:

```typescript
new FIR({ numTaps: 4, coefficients: [1n, 2n, 3n, 4n] })
new FIR({ numTaps: 64 })  // all coefficients default to 0n
```

`writeLintWrapped` writes the design with `writeSystemVerilogFiles()`, one definition per file, then a lint wrapper `myFIR3_lint_top.sv` that instantiates the interface ports. Each file includes the files it needs under `USE_INCLUDES`, and so does the wrapper, so the wrapper alone is what gets linted: `verilator --lint-only +define+USE_INCLUDES +incdir+sv-examples/FIR/myFIR3 sv-examples/FIR/myFIR3/myFIR3_lint_top.sv`.

---

### Testbench stimulus

The testbench drives the AXI4-Stream slave interface (`s_axis`) rather than flat ports, and holds the coefficient bus idle:

```typescript
const tbBody = `
    assign m_axis.TREADY = 1'b1;    // always accept output
    assign s_axis.ACLK    = clk;
    ...
    assign regs.WE        = 1'b0;   // the coefficients keep their reset values
    ...
    always_ff @(posedge clk or negedge rst_b)
      if (!rst_b) begin
        s_axis.TVALID <= 1'b0;
        s_axis.TDATA  <= '0;
        count <= '0; phase <= '0; step <= 5'd16;
      end else begin
        s_axis.TVALID <= 1'b1;
        ...
        s_axis.TDATA  <= (phase == 5'd16) ? $unsigned(-32'sd127) : (phase == 5'd0) ? 32'd127 : '0;
      end
`
```

The chirp sweeps through frequencies to visually verify frequency response.

---

### Building the testbench wrapper

```typescript
const tbLpFIR = markTestbench(new Module(
  { name: 'tb_lpFIR' },
  { clk: {...}, rst_b: {...} },
  { phase: {...}, count: {...}, step: {...} },
  tbBody
))
tbLpFIR.addSubmodule('dut', myFir3, {}, true, true)
tbLpFIR.writeSystemVerilogFiles('sv-examples/FIR/myFIR3')
```

The 5th arg `true` (**createMissing**) gives the testbench a local bundle for each of the DUT's interface ports, `s_axis`, `m_axis` and `regs`, bound to it, making all their signals visible in the waveform. `markTestbench` marks the module as simulation-only for the style checks, and `writeSystemVerilogFiles` writes `tb_lpFIR.sv`, which includes `myFIR3.sv` and the interfaces, so the simulation builds from it alone.

---

## Part 3 — Full flow: TypeScript → SystemVerilog → Simulation

### Step 1: Compile TypeScript

```bash
cd ~/TSSV
npx tsc
```

### Step 2: Run the test script to generate SystemVerilog

```bash
node out/test/test_FIR.js
```

Writes to `sv-examples/FIR/myFIR3/`, among others:

| File | Contents |
|---|---|
| `myFIR3.sv` | 13-tap FIR with AXI4-Stream and `regs` ports and the `u_coeff_regs` submodule |
| `myFIR3_coeffRegs.sv` | The coefficient register block |
| `AXI4Stream_32_4_0_4.sv`, `memory_bidi_32_32.sv` | The interfaces |
| `tb_lpFIR.sv` | Testbench with chirp stimulus driving `s_axis`; it includes the files above |

### Step 3: Compile and simulate with Verilator

```bash
cd verilatorTB
make
```

Chains: `npx tsc` → `node out/test/test_FIR.js` → `verilator +define+USE_INCLUDES +incdir+../sv-examples/FIR/myFIR3/ ../sv-examples/FIR/myFIR3/tb_lpFIR.sv` → C++ build → simulation → `Vtb_lpFIR.vcd`.

### Step 4: View waveforms in GTKWave

```bash
./rungtkwave.sh Vtb_lpFIR.vcd
```

In GTKWave, expand `tb_lpFIR → dut` and look for:
- `s_axis.TVALID` / `s_axis.TDATA` — chirp input
- `m_axis.TVALID` / `m_axis.TDATA` — filtered output (3-cycle latency)

The output should show `m_axis.TDATA` as a smoothed, low-frequency version of the chirp input — high-frequency components attenuated by the low-pass coefficients.

---

### Quick reference: run everything from scratch

```bash
cd ~/TSSV
npx tsc
node out/test/test_FIR.js

cd verilatorTB
make clean
make
./rungtkwave.sh Vtb_lpFIR.vcd

make fir_sim   # the self-checking testbench, every configuration
```

---

## Part 4 — Parameterized Register Block via `repeatedRegister` YAML

Coefficient registers are defined via a YAML file using `repeatedRegister`. This tells `gen_regblock.sh` to generate a **factory function** rather than static consts, so the register count is a runtime parameter rather than fixed at generation time.

---

### The YAML (`ts/src/modules/FIR/fir_coeffs.yaml`)

```yaml
name: firCoeffs
wordSize: 32
busInterface: Memory
busAddressWidth: 32
repeatedRegister:
  namePrefix: COEFF_              # registers named COEFF_0, COEFF_1, ...
  countParam: numTaps             # name of the count parameter in the generated function
  widthParam: coefficientsWidth   # name of the width parameter in the generated function
  addressStride: 4                # bytes between registers
  type: RW
  isSigned: true
  description: "FIR tap {i} coefficient"
```

**YAML field reference:**

| Field | Required | Description |
|---|---|---|
| `name` | yes | Base name for the generated function (`createFirCoeffsDef`) |
| `wordSize` | yes | Bus word width — `32` or `64` |
| `busInterface` | no | `Memory` (default) or `TL_UL` |
| `busAddressWidth` | no | Address bus width in bits (default 32) |
| `repeatedRegister.namePrefix` | yes | Prefix for register names (`COEFF_` → `COEFF_0`, `COEFF_1`, …) |
| `repeatedRegister.countParam` | yes | TypeScript parameter name in the generated function |
| `repeatedRegister.widthParam` | no | Makes the register width the generated function's second parameter (default `wordSize`) |
| `repeatedRegister.addressStride` | yes | Byte offset between consecutive registers |
| `repeatedRegister.type` | yes | `RW`, `RO`, `WO`, `RAM`, or `ROM` |
| `repeatedRegister.isSigned` | no | Whether the register output is signed |
| `repeatedRegister.width` | no | Fixed register bit width when there's no `widthParam` (defaults to `wordSize`) |
| `repeatedRegister.description` | no | Description template; `{i}` is replaced with the index at runtime |

> **Static registers:** Files with a `registers:` key (not `repeatedRegister:`) use the original static path and generate `export const` consts — right for fixed register maps on other modules.

**Regenerate:**
```bash
./scripts/gen_regblock.sh ts/src/modules/FIR/fir_coeffs.yaml
```

---

### What the script generates (`regs-fir_coeffs.ts`)

```typescript
export function createFirCoeffsDef (numTaps: number, coefficientsWidth: IntRange<1, 64> = 32, resetValues?: bigint[]): { addrMap: Record<string, bigint>, def: RegisterBlockDef<Record<string, bigint>> } {
  const addrMap: Record<string, bigint> = {}
  const registers: RegisterBlockDef<Record<string, bigint>>['registers'] = {}
  for (let i = 0; i < numTaps; i++) {
    const regName = 'COEFF_' + i
    addrMap[regName] = BigInt(i * 4)
    registers[regName] = {
      type: RegisterType.RW,
      isSigned: true,
      width: coefficientsWidth,
      reset: resetValues?.[i] ?? 0n,
      description: 'FIR tap ' + i + ' coefficient'
    }
  }
  const def: RegisterBlockDef<Record<string, bigint>> = { wordSize: 32, addrMap, registers }
  return { addrMap, def }
}
```

---

### How FIR.ts uses the factory

```typescript
import { createFirCoeffsDef } from './regs-fir_coeffs.js'

// In constructor:
const { def: coeffDef } = createFirCoeffsDef(numTaps, coefficientsWidth, coefficients)
```

The resulting `coeffDef` builds the `RegisterBlock` bound as `u_coeff_regs` (Part 1, "Coefficient registers"). The tap count is fully dynamic — `numTaps: 4` and `numTaps: 64` both work with the same module class and the same YAML.

---

### Quick reference: register block generation

```bash
# 1. Edit the YAML (lives alongside the module)
#    ts/src/modules/FIR/fir_coeffs.yaml

# 2. Regenerate the factory TypeScript
./scripts/gen_regblock.sh ts/src/modules/FIR/fir_coeffs.yaml
#    → ts/src/modules/FIR/regs-fir_coeffs.ts

# 3. Recompile and regenerate SV
npx tsc && node out/test/test_FIR.js
```
