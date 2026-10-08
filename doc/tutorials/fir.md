# FIR Module Walkthrough

This document explains every function and construct used in the FIR module and its testbench, then walks through the full process of compiling TypeScript, generating SystemVerilog, and running a simulation.

---

## Part 1 — The FIR Module (`ts/src/modules/FIR/FIR.ts`)

### What the module does

Implements a parameterized **Finite Impulse Response (FIR) digital filter**. Input samples arrive over an AXI4-Stream slave interface; each is delayed through a tap chain, multiplied by a per-tap coefficient stored in a register block, and the products are accumulated, rounded, and saturated before being driven on an AXI4-Stream master interface. The number of taps is set by `numTaps` at instantiation time.

---

### Interfaces and types

#### `type inWidthType = TSSV.IntRange<1, 32>`
Defines a compile-time constrained integer type. `IntRange<1, 32>` means only values between 1 and 32 are valid TypeScript values for the input data width.

#### `interface FIR_Parameters extends TSSV.TSSVParameters`
Declares the typed parameter bag passed to the FIR constructor:
- `numTaps: number` — number of filter taps and coefficient registers (required).
- `coefficients?: bigint[]` — optional reset values for each coefficient register. Defaults to `0n` per tap if omitted. Also drives the worst-case accumulator width calculation.
- `inWidth?: inWidthType` — bit width of the input sample (default 8).
- `outWidth?: TSSV.IntRange<1,32>` — bit width of the output sample (default 9).
- `rShift?: TSSV.IntRange<0,32>` — right-shift applied after summing products to scale down the result (default 2).

#### `interface FIR_Ports extends TSSV.IOSignals`
Only flat clock and reset ports appear here (required by `addRegister`):
- `clk: { direction: 'input', isClock: 'posedge' }` — posedge clock.
- `rst_b: { direction: 'input', isReset: 'lowasync' }` — active-low asynchronous reset.

The AXI4-Stream and Memory bus interfaces are added via `addInterface` and do not appear in this type.

---

### AXI4-Stream interfaces

Two `AXI4Stream` interface instances are added in the constructor:

- **`s_axis` (inward/slave)** — receives signed input samples. `TDATA[inWidth-1:0]` carries the sample.
- **`m_axis` (outward/master)** — drives filtered output samples. `TDATA` is sign-extended to 32 bits.

#### Backpressure adapter

A 2-stage valid shift register (`valid_pipe_0`, `valid_pipe_1`) tracks which pipeline stages hold real data:

- `en = m_axis.TREADY || !valid_pipe_1` — the pipeline advances when output can drain or output stage is empty.
- `s_axis.TREADY = en` — upstream is backpressured when the pipeline stalls.
- `m_axis.TVALID = valid_pipe_1` — output is valid when the second stage holds real data.

**Latency:** 2 clock cycles from accepted `s_axis` sample to `m_axis.TVALID`.

---

### Constructor internals

#### `super({ name, numTaps, coefficients, inWidth, outWidth, rShift })`
Calls the base `Module` constructor. All parameters including `numTaps` are stored in `this.params` and contribute to the auto-generated module name.

#### `this.IOs = { clk, rst_b }`
Only clock and reset appear as flat ports.

#### `createFirCoeffsDef(numTaps, coefficients?)`
Calls the factory function imported from `regs-fir_coeffs.ts` (generated from `fir_coeffs.yaml`). Returns `{ addrMap, def }` — the `RegisterBlockDef` for a coefficient register block with exactly `numTaps` RW registers. Reset values come from `coefficients` or default to `0n`. See Part 4 for full details.

---

### Tap delay line loop

```typescript
const numTaps = this.params.numTaps as number
let nextTapIn: TSSV.Sig = new TSSV.Sig('data_in')  // internal signal driven from s_axis.TDATA
for (let i = 0; i < numTaps; i++) { ... }
```

Iterates once per tap. `nextTapIn` chains through the delay line.

#### `this.addSignal(name, { width, isSigned })`
Declares an internal signal. Returns a `Sig` handle. Generates `logic signed [N-1:0] tap_i;` in SV.

#### `this.addRegister({ d, clk, reset, en, q })`
Creates a D flip-flop. All registers with the same `(clk, reset, en)` triple merge into a single `always_ff` block. The `en` here is the internal combinational signal derived from the AXI handshake.

#### `this.addMultiplier({ a, b })`
Creates a combinational multiplier. `a` is a `Sig` (the tap register), `b` is a `Sig` pointing to the coefficient register output (`coeff_i`). Generates `assign prod_tapN_x_coeffN = tap_N * coeff_N;`. Because `b` is a signal, coefficients can be updated at runtime over the Memory bus.

#### `this.bitWidth(coeffSum)`
Returns the minimum number of bits needed to represent `coeffSum`. Used to size the accumulator.

---

### Accumulator

#### `new TSSV.Expr(string)`
Wraps a raw SystemVerilog expression. Used here to join all sign-extended product terms with `+` as the `d` input to the sum register. Each product is cast to `sumWidth` bits: `N'(prod_tapN_x_coeffN)`.

---

### Rounding and saturation

#### `this.addRound({ in, out, rShift })`
Generates combinational round-half-up logic: right-shifts `sum` by `rShift` bits.

#### `this.addSaturate({ in, out })`
Generates combinational saturation: clamps `rounded` to `[-2^(outWidth-1), 2^(outWidth-1)-1]`.

The final `addRegister({ d: 'saturated', ..., q: 'data_out' })` registers the result into the internal `data_out` signal, which is then assigned to `m_axis.TDATA` (sign-extended to 32 bits).

---

## Part 2 — The FIR Testbench (`ts/test/test_FIR.ts`)

### Instantiating the FIR

```typescript
const myFir3 = new FIR({
  name: 'myFIR3',
  numTaps: 13,
  coefficients: [-1n, 0n, 5n, -6n, -10n, 38n, 77n, 38n, -10n, -6n, 5n, 0n, -1n],
  inWidth: 8,
  outWidth: 8,
  rShift: 7
})
mkdirSync('sv-examples/FIR/myFIR3', { recursive: true })
writeFileSync('sv-examples/FIR/myFIR3/myFIR3.sv', myFir3.writeSystemVerilog())
```

`numTaps: 13` sets the tap count and how many coefficient registers are generated. `coefficients` provides the reset values and drives accumulator sizing. Both are independent — any tap count works:

```typescript
new FIR({ numTaps: 4, coefficients: [1n, 2n, 3n, 4n] })
new FIR({ numTaps: 64 })  // all coefficients default to 0n
```

---

### Testbench stimulus

The testbench drives the AXI4-Stream slave interface (`s_axis`) rather than flat ports:

```typescript
const tbBody = `
    assign m_axis.TREADY = 1'b1;    // always accept output
    assign s_axis.ACLK    = clk;
    assign s_axis.ARESETn = rst_b;

    always @(posedge clk or negedge rst_b)
      if(!rst_b) begin
        s_axis.TVALID <= 1'b0;
        s_axis.TDATA  <= '0;
        count <= 'd0; phase <= 'd0; step <= 'd16;
      end else begin
        s_axis.TVALID <= 1'b1;
        ...
        s_axis.TDATA <= (phase == 5'd16) ? -8'sd127 : ((phase == 5'd0) ? 8'sd127 : 8'sd0);
      end
`
```

The chirp sweeps through frequencies to visually verify frequency response.

---

### Building the testbench wrapper

```typescript
const tb_lpFIR = new Module(
  { name: 'tb_lpFIR' },
  { clk: {...}, rst_b: {...} },
  { phase: {...}, count: {...}, step: {...} },
  tbBody
)
tb_lpFIR.addSubmodule('dut', myFir3, {}, true, true)
```

The 5th arg `true` (**createMissing**) promotes `s_axis`, `m_axis`, and `regs` from the DUT to the testbench level as internal interface instances, making all their signals visible in the waveform.

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

Writes to `sv-examples/FIR/myFIR3/`:

| File | Contents |
|---|---|
| `myFIR3.sv` | 13-tap FIR with AXI4-Stream ports and `coeff_block` submodule |
| `tb_lpFIR.sv` | Testbench with chirp stimulus driving `s_axis` |

### Step 3: Compile and simulate with Verilator

```bash
cd verilatorTB
make
```

Chains: `npx tsc` → `node out/test/test_FIR.js` → `verilator` → C++ build → simulation → `Vtb_lpFIR.vcd`.

### Step 4: View waveforms in GTKWave

```bash
./rungtkwave.sh Vtb_lpFIR.vcd
```

In GTKWave, expand `tb_lpFIR → dut` and look for:
- `s_axis.TVALID` / `s_axis.TDATA` — chirp input
- `m_axis.TVALID` / `m_axis.TDATA` — filtered output (2-cycle latency)

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
  namePrefix: COEFF_        # registers named COEFF_0, COEFF_1, ...
  countParam: numTaps       # name of the TypeScript parameter in the generated function
  addressStride: 4          # bytes between registers
  type: RW
  isSigned: true
  width: 32
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
| `repeatedRegister.addressStride` | yes | Byte offset between consecutive registers |
| `repeatedRegister.type` | yes | `RW`, `RO`, `WO`, `RAM`, or `ROM` |
| `repeatedRegister.isSigned` | no | Whether the register output is signed |
| `repeatedRegister.width` | no | Register bit width (defaults to `wordSize`) |
| `repeatedRegister.description` | no | Description template; `{i}` is replaced with the index at runtime |

> **Static registers:** Files with a `registers:` key (not `repeatedRegister:`) use the original static path and generate `export const` consts — right for fixed register maps on other modules.

**Regenerate:**
```bash
./scripts/gen_regblock.sh ts/src/modules/FIR/fir_coeffs.yaml
```

---

### What the script generates (`regs-fir_coeffs.ts`)

```typescript
export function createFirCoeffsDef(numTaps: number, resetValues?: bigint[]) {
  const addrMap: Record<string, bigint> = {}
  const registers: RegisterBlockDef<Record<string, bigint>>['registers'] = {}
  for (let i = 0; i < numTaps; i++) {
    const regName = 'COEFF_' + i
    addrMap[regName] = BigInt(i * 4)
    registers[regName] = {
      type: 'RW',
      isSigned: true,
      width: 32,
      reset: resetValues?.[i] ?? 0n,
      description: 'FIR tap ' + i + ' coefficient'
    }
  }
  return {
    addrMap,
    def: { wordSize: 32 as const, addrMap, registers } as RegisterBlockDef<Record<string, bigint>>
  }
}
```

---

### How FIR.ts uses the factory

```typescript
import { createFirCoeffsDef } from './regs-fir_coeffs.js'

// In constructor:
const numTaps = this.params.numTaps as number
const { def: coeffDef } = createFirCoeffsDef(numTaps, this.params.coefficients)

const coeffRegBlock = new RegisterBlock<Record<string, bigint>>(
  { name: `${this.params.name ?? 'fir'}_coeffRegs`, busAddressWidth: 32 },
  coeffDef,
  new Memory()
)
this.addSubmodule('coeff_block', coeffRegBlock, coeffBindings, true, true)
```

The tap count is fully dynamic — `numTaps: 4` and `numTaps: 64` both work with the same module class and the same YAML.

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
