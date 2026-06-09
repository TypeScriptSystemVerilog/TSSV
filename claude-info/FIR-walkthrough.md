# FIR Module Walkthrough

This document explains every function and construct used in the FIR module and its testbench, then walks through the full process of compiling TypeScript, generating SystemVerilog, and running a simulation.

---

## Part 1 — The FIR Module (`ts/src/modules/FIR.ts`)

### What the module does

Implements a parameterized **Finite Impulse Response (FIR) digital filter**. A FIR filter takes a stream of signed input samples, multiplies each delayed sample by a fixed coefficient, sums the products, rounds the result, and saturates it to fit the output width. The number of taps equals the number of coefficients.

---

### Interfaces and types

#### `type inWidthType = TSSV.IntRange<1, 32>`
Defines a compile-time constrained integer type. `IntRange<1, 32>` means only values between 1 and 32 are valid TypeScript values for the input data width. This prevents invalid bit-width configurations from ever compiling.

#### `interface FIR_Parameters extends TSSV.TSSVParameters`
Declares the typed parameter bag passed to the FIR constructor:
- `coefficients: bigint[]` — array of fixed tap coefficients (required). `bigint` is used because coefficients can be large and must be exact integers.
- `inWidth?: inWidthType` — bit width of the input sample (default 8).
- `outWidth?: TSSV.IntRange<1,32>` — bit width of the output sample (default 9).
- `rShift?: TSSV.IntRange<0,32>` — right-shift applied after summing products to scale down the result (default 2).

#### `interface FIR_Ports extends TSSV.IOSignals`
Declares the module's port list. The `@wavedrom` JSDoc tag above this interface causes TypeDoc to render the timing diagram when documentation is generated.
- `clk: { direction: 'input', isClock: 'posedge' }` — marks this as a posedge clock, which TSSV uses to build `always_ff @(posedge clk)` sensitivity lists.
- `rst_b: { direction: 'input', isReset: 'lowasync' }` — marks this as an active-low asynchronous reset, adding `or negedge rst_b` to all flip-flop sensitivity lists.
- `en` — clock enable; flip-flops only advance when this is high.
- `data_in` — signed input sample.
- `data_out` — signed filtered output sample.

---

### Constructor internals

#### `super({ name, coefficients, inWidth, outWidth, rShift })`
Calls the base `Module` constructor with the resolved parameter values (applying defaults where the caller left fields undefined). TSSV uses this parameter bag to auto-generate the module's unique name and to parameterize the generated SystemVerilog.

#### `this.IOs = { ... }`
Assigns the port map to the module instance. TSSV reads this at `writeSystemVerilog()` time to emit the port declaration list.

---

### Tap delay line loop

```typescript
let nextTapIn: TSSV.Sig = new TSSV.Sig('data_in')
for (let i = 0; i < this.params.coefficients.length; i++) { ... }
```

Iterates once per tap (coefficient). `nextTapIn` is a `Sig` handle that chains through the delay line — it starts pointing at `data_in` and is advanced to each new tap register in turn.

#### `new TSSV.Sig('data_in')`
Creates a signal reference object. `Sig` carries the signal name and metadata (width, signedness) and is used everywhere you need to pass a signal as an argument to an `add*()` method.

#### `this.addSignal(name, { width, isSigned })`
Declares a new internal wire/register. Returns a `Sig` handle. Generates `logic signed [N-1:0] tap_i;` in the SystemVerilog output. Here each `tap_i` is one stage of the delay line.

#### `this.addRegister({ d, clk, reset, en, q })`
Creates a D flip-flop. Generates an `always_ff` block with clock, async reset, and optional enable. Parameters:
- `d` — the input data (a `Sig` or `Expr`).
- `clk` — name of the clock signal.
- `reset` — name of the reset signal; TSSV checks its `isReset` metadata to determine polarity and synchrony.
- `en` — clock-enable signal name; when provided, TSSV wraps the flip-flop body in `if(en)`.
- `q` — output signal (a `Sig` or signal name string).

In the tap loop this creates `tap_0 <= data_in`, `tap_1 <= tap_0`, etc. on each clock edge when `en` is high.

#### `this.addMultiplier({ a, b })`
Creates a combinational multiplier. `a` is a `Sig` (the tap register), `b` is a `bigint` (the fixed coefficient). TSSV auto-computes the output bit width based on the operand widths and returns a `Sig` pointing to the product signal. Generates `assign prod_tapN_x_coeff = tap_N * $signed(coeff);`.

#### `this.bitWidth(coeffSum)`
A utility method on `Module` that returns the minimum number of bits needed to represent the given integer value. Used to calculate how wide the accumulator needs to be to hold the full-precision sum without overflow.

---

### Accumulator

#### `new TSSV.Expr(string)`
Wraps a raw SystemVerilog expression string. Unlike `Sig`, which refers to a single signal, `Expr` allows arbitrary arithmetic expressions as the `d` input to a register. Here it joins all the width-extended product terms with `+`.

```typescript
const productsExt = products.map((p) => `${sumWidth}'(${p.toString()})`)
```
Each product is cast to `sumWidth` bits using a SV cast `N'(expr)` to prevent overflow before the addition.

`this.addRegister({ d: new TSSV.Expr(...), ..., q: 'sum' })` — registers the full-precision sum into the `sum` signal on each enabled clock edge.

---

### Rounding and saturation

#### `this.addRound({ in, out, rShift })`
Inserts combinational rounding logic. Generates an `assign` statement that right-shifts `sum` by `rShift` bits, applying convergent (round-half-up) rounding to minimize DC bias. The output is one bit wider than `sum - rShift` to retain the sign bit.

#### `this.addSaturate({ in, out })`
Inserts combinational saturation logic. Generates `assign` logic that clamps the rounded value to the signed range `[-2^(outWidth-1), 2^(outWidth-1)-1]`. If `rounded` is too large for `outWidth` bits, the output is clamped to the max/min representable value instead of overflowing.

The final `addRegister({ d: 'saturated', ..., q: 'data_out' })` then registers the saturated result into the output port on each enabled clock edge.

---

## Part 2 — The FIR Testbench (`ts/test/test_FIR.ts`)

### Generating standalone SV files

```typescript
const myFir = new FIR({ name: 'myFIR', coefficients: [1n, 2n, 3n, 4n] })
writeFileSync('sv-examples/test_FIR_output/myFIR.sv', myFir.writeSystemVerilog())
```

#### `new FIR(params)`
Instantiates the FIR class. This runs the constructor which calls all the `add*()` methods and builds up the module's internal description — but does **not** yet emit any SystemVerilog.

#### `myFir.writeSystemVerilog()`
Triggers SV emission. Walks the module's accumulated state (IOs, signals, submodules, register blocks, always bodies) and serializes it to a string of valid SystemVerilog. **Side-effect warning:** this method appends generated `always_ff` blocks to `this.body`. Calling it twice on the same instance will duplicate those blocks. Always use a fresh instance for each call.

#### `writeFileSync(path, content)`
Node.js standard library — writes the SV string to disk synchronously.

---

### Testbench stimulus

```typescript
const tbBody = `
  always @(posedge clk or negedge rst_b) ...
`
```

A raw SystemVerilog string that sweeps a stepped-phase sinusoidal stimulus through `data_in`. The always block:
- Resets `en`, `data_in`, `count`, `phase`, and `step` on `rst_b`.
- On each clock: increments `count`, halves `step` every 128 cycles (progressively slower phase), advances `phase`, then sets `data_in` to +127, -127, or 0 depending on the phase value. This generates a chirp signal — a sweep of frequencies — useful for visually verifying filter frequency response in the waveform viewer.

---

### Building the testbench wrapper module

```typescript
const tb_lpFIR = new Module(
  { name: 'tb_lpFIR' },          // params
  { clk: {...}, rst_b: {...} },  // IOs
  { phase: {...}, count: {...}, step: {...} },  // internal signals
  tbBody                         // raw SV body string
)
```

#### `new Module(params, IOs, signals, body)`
The base TSSV `Module` constructor. The 4th argument `body` is a raw SV string that is appended verbatim to the generated module body — useful for stimulus logic that is too complex to express with the `add*()` API.

#### `tb_lpFIR.addSubmodule('dut', myFir3, {}, true, true)`
Instantiates `myFir3` inside the testbench with instance name `'dut'`.
- 3rd arg `{}` — explicit bindings (empty here; autoBind handles them all).
- 4th arg `true` — **autoBind**: matches the DUT's ports to signals in the testbench by name (`clk` → `clk`, `rst_b` → `rst_b`, `en` → `en`, etc.).
- 5th arg `true` — **createMissing**: for any DUT port that doesn't already exist in the testbench, automatically declares a new internal signal (e.g. `data_in`, `data_out`). This is what makes `data_in` and `data_out` visible in the waveform.

---

## Part 3 — Full flow: TypeScript → SystemVerilog → Simulation

### Step 1: Compile TypeScript

```bash
cd ~/TSSV
npx tsc
```

Compiles all `.ts` files under `ts/` to JavaScript in `out/`, following the rules in `tsconfig.json`. Must be run after any change to source TypeScript. Output is ES2020 CommonJS modules targeting Node.js.

---

### Step 2: Run the test script to generate SystemVerilog

```bash
node out/test/test_FIR.js
```

Executes the compiled test script. This instantiates the FIR filter and testbench, calls `writeSystemVerilog()`, and writes the `.sv` files to `sv-examples/test_FIR_output/`:

| File | Contents |
|---|---|
| `myFIR.sv` | 4-tap FIR, coefficients [1,2,3,4] |
| `myFIR2.sv` (auto-named) | 5-tap FIR, alternating coefficients |
| `myFIR3.sv` | 13-tap low-pass FIR |
| `tb_lpFIR.sv` | Testbench wrapping myFIR3 with chirp stimulus |

---

### Step 3: Compile and simulate with Verilator

```bash
cd verilatorTB
make
```

The `Makefile` chains four steps automatically:

1. **`npx tsc`** — recompiles TypeScript if sources are newer than outputs (via the `tsc` target).
2. **`node out/test/test_FIR.js`** — regenerates the SV files if the TypeScript outputs are newer.
3. **`verilator --cc tb_lpFIR.sv --exe --trace sim_main.cpp`** — compiles the SV through Verilator's C++ code generator, linking against `sim_main.cpp` (the C++ driver that toggles the clock, manages reset, and opens the VCD file).
4. **`make -C obj_dir -f Vtb_lpFIR.mk Vtb_lpFIR`** — builds the C++ simulation binary.
5. **`obj_dir/Vtb_lpFIR`** — runs the simulation and writes `Vtb_lpFIR.vcd`.

To target a different module:
```bash
make TOP_MODULE=Vtb_my_module VERILOG_FILE=../sv-examples/my_output/tb_my_module.sv
```

---

### Step 4: View waveforms in GTKWave

```bash
./rungtkwave.sh Vtb_lpFIR.vcd
```

Opens the generated VCD in the native GTKWave binary. In the waveform viewer:
1. Expand `tb_lpFIR` in the SST panel on the left.
2. Double-click signals to add them to the wave view (`clk`, `rst_b`, `en`, `data_in`, `data_out`).
3. Press **Ctrl+Shift+F** (Mac: use **View → Zoom → Zoom to Fit**) to see the full simulation time range.

For `myFIR3`, you should see `data_out` respond with a smoothed, low-frequency version of the chirp `data_in` — high-frequency components are attenuated by the filter coefficients.

---

### Quick reference: run everything from scratch

```bash
cd ~/TSSV
npx tsc                          # compile TypeScript
node out/test/test_FIR.js        # generate SV files

cd verilatorTB
make clean                       # remove previous build artifacts
make                             # compile, simulate, produce VCD
./rungtkwave.sh Vtb_lpFIR.vcd   # open waveforms
```
