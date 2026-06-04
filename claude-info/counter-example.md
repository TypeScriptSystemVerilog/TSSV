# Example: Counter Module — From Waveform to Verified Simulation

This document walks through a real session where Claude was used to create a new TSSV module from a timing diagram, build a testbench, run a Verilator simulation, and verify the output waveforms in GTKWave. It is intended as a reference example for the team on how to incorporate Claude into the TSSV development workflow.

---

## What We Started With

A timing diagram image showing a 4-bit counter with the following behavior:

- `clk`: regular posedge clock
- `reset`: active-high synchronous reset (a brief pulse resets the counter to 0)
- `q`: 4-bit output counting up, wrapping naturally from `0xF` → `0x0`

The sequence shown in the image was: `5, 6, 7, 8, 9, a, b, c, d, e, f, 0, 1, 2, 0, 1` — with the second `0` caused by a reset pulse.

---

## Step 1: Creating the Counter Module

**Prompt:**
> *"Can you create a new module being a 4 bit counter that will exist in `~/TSSV/ts/src/modules` and make it have a wavedrom figure matching this picture. make sure to use TSSV by the way"*
> *(accompanied by a timing diagram image showing clk, reset, and q counting 5→6→…→f→0→1→2→0→1)*

Claude was given the waveform image and asked to implement a 4-bit counter in TSSV. Key decisions made:

- Reset type: `highsync` (active-high synchronous) — inferred from the clean, clock-aligned reset pulse in the image
- Width: parameterized via `Counter_Parameters`, defaulting to 4
- The counter increment `q + 4'd1` is passed as a TSSV `Expr`, which lets natural 4-bit wraparound handle the `0xF → 0x0` transition

**Output file:** [`ts/src/modules/Counter.ts`](../ts/src/modules/Counter.ts)

```typescript
import TSSV from 'tssv/lib/core/TSSV'

export interface Counter_Parameters extends TSSV.TSSVParameters {
  width?: TSSV.IntRange<1, 32>
}

/**
 * Counter Interface
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "   clk", "wave": "p..............."},
 *     {"name": " reset", "wave": "0............10."},
 *     {"name": "     q", "wave": "2323232323232323",
 *      "data": ["5","6","7","8","9","a","b","c","d","e","f","0","1","2","0","1"]}
 *   ]
 * }
 * ```
 */
export interface Counter_Ports extends TSSV.IOSignals {
  clk:   { direction: 'input',  isClock: 'posedge' }
  reset: { direction: 'input',  isReset: 'highsync' }
  q:     { direction: 'output', width: number }
}

export class Counter extends TSSV.Module {
  declare params: Counter_Parameters
  declare IOs: Counter_Ports

  constructor (params: Counter_Parameters) {
    super({ name: params.name, width: params.width ?? 4 })

    const width = this.params.width as number

    this.IOs = {
      clk:   { direction: 'input',  isClock: 'posedge' },
      reset: { direction: 'input',  isReset: 'highsync' },
      q:     { direction: 'output', width }
    }

    this.addRegister({
      d:        new TSSV.Expr(`q + ${width}'d1`),
      clk:      'clk',
      reset:    'reset',
      resetVal: 0n,
      q:        'q'
    })
  }
}
```

**Generated SystemVerilog** (`sv-examples/test_Counter_output/counter4b.sv`):

```systemverilog
module counter4b (
  input  logic       clk,
  input  logic       reset,
  output logic [3:0] q
);
  always_ff @(posedge clk)
    if (reset) q <= 'd0;
    else       q <= q + 4'd1;
endmodule
```

### TSSV API used

| Concept | How it was used |
|---|---|
| `isReset: 'highsync'` | Tells `addRegister` to emit a synchronous `if(reset)` — no async sensitivity |
| `new TSSV.Expr(...)` | Passes an arithmetic expression as the `d` input instead of a named signal |
| `resetVal: 0n` | Sets the reset value to 0 in the generated always_ff block |

---

## Step 2: Creating the Testbench

**Prompt:**
> *"Can you now make a testbench in `/Users/bennett/TSSV/ts/test` in TypeScript for the counter. And then can you go through the process of running it and viewing the waveforms to make sure they look correct."*

Claude created a TypeScript testbench in [`ts/test/test_Counter.ts`](../ts/test/test_Counter.ts) that:

1. Instantiates `Counter` and writes `counter4b.sv`
2. Builds a `tb_counter` module using TSSV's `Module` class with a raw SV body for stimulus
3. Uses `addSubmodule` with `autoBind=true, createMissing=true` to wire the counter automatically
4. Writes `tb_counter.sv` which includes both the DUT and the testbench

**Stimulus logic (inside `tbBody`):**

```systemverilog
always @(posedge clk)
  begin
    cycle_count <= cycle_count + 1;
    if (cycle_count < 3)
      reset <= 1'b1;       // initial reset for first 3 cycles
    else if (cycle_count == 21)
      reset <= 1'b1;       // mid-run reset pulse
    else
      reset <= 1'b0;
  end
```

**Important discovery — `writeSystemVerilog()` has a side effect:**

`writeSystemVerilog()` mutates `this.body` by appending `always_ff` blocks to it on every call. Calling it twice on the same module instance (once directly, once via a parent testbench) produces duplicate always blocks. The fix is to use **separate instances** for the standalone SV file and for the testbench:

```typescript
// Separate instance for the standalone .sv file
const counterForSV = new Counter({ name: 'counter4b', width: 4 })
writeFileSync('sv-examples/test_Counter_output/counter4b.sv', counterForSV.writeSystemVerilog())

// Fresh instance for the testbench (writeSystemVerilog will be called on this by tb.writeSystemVerilog())
const myCounter = new Counter({ name: 'counter4b', width: 4 })
```

**`addSubmodule` parameters used:**

```typescript
tb.addSubmodule('dut', myCounter, {}, true, true)
//                                     ^     ^
//                               autoBind   createMissing
```

- `autoBind=true`: automatically binds ports with matching signal names (`clk`, `reset`)
- `createMissing=true`: creates a `q` signal in the testbench so the counter output is visible in the waveform

The testbench also includes `rst_b` as a top-level input to stay compatible with the existing `verilatorTB/sim_main.cpp` driver, which drives a `rst_b` signal by default.

---

## Step 3: Running the Simulation

*This step was initiated as part of the same prompt as Step 2 — Claude compiled, simulated, and opened GTKWave autonomously after creating the testbench.*

All simulation infrastructure lives in `verilatorTB/`. The existing `Makefile` and `sim_main.cpp` were used without modification.

**Generate the SystemVerilog:**

```bash
cd ~/TSSV
npx tsc
node out/test/test_Counter.js
# → writes sv-examples/test_Counter_output/tb_counter.sv
```

**Compile and simulate:**

```bash
cd verilatorTB
make TOP_MODULE=Vtb_counter VERILOG_FILE=../sv-examples/test_Counter_output/tb_counter.sv
# Verilator compiles tb_counter.sv + sim_main.cpp → obj_dir/Vtb_counter
# Binary runs and writes Vtb_counter.vcd
```

**Open waveforms:**

```bash
./rungtkwave.sh Vtb_counter.vcd
```

---

## Step 4: Verifying the Waveforms

**Prompt:**
> *"Can you verify if this is correct?"*
> *(accompanied by a GTKWave screenshot showing clk, q[3:0], and reset)*

GTKWave was opened and the following signals were added from the `tb_counter` scope:

- `clk`
- `reset`
- `q[3:0]`

**What was observed:**

| Region | Behavior |
|---|---|
| First 2 cycles | `q` briefly reaches `1` then drops to `0` as reset asserts |
| Cycles 3–20 | `q` counts freely: `0, 1, 2, ..., F, 0, 1, ...` with natural 4-bit wraparound |
| Cycle 21 | `reset` pulses high; `q` briefly hits the next count then snaps to `0` |
| Cycles 22+ | Counting resumes from `0` |

**The brief `q=1` artifact** at both reset events is expected testbench behavior, not a counter bug. Because `reset` starts at `0` and the always block uses non-blocking assignments, the counter sees `reset=0` at the first clock edge and increments once before the NBA resolves `reset` to `1`. This is a one-cycle lag inherent to the testbench stimulus style and does not indicate a problem with the RTL.

The counter was confirmed correct:
- Synchronous active-high reset works as designed
- 4-bit natural wraparound (`0xF → 0x0`) is correct
- Mid-run reset pulse resets the counter cleanly

---

## Summary of the Full Workflow

```
1. Show Claude a waveform image
         ↓
2. Claude creates ts/src/modules/Counter.ts
   (extends Module, uses addRegister with Expr for increment)
         ↓
3. Claude creates ts/test/test_Counter.ts
   (testbench with internal reset stimulus, addSubmodule wiring)
         ↓
4. npx tsc && node out/test/test_Counter.js
   → sv-examples/test_Counter_output/tb_counter.sv
         ↓
5. cd verilatorTB && make TOP_MODULE=Vtb_counter VERILOG_FILE=...
   → obj_dir/Vtb_counter  +  Vtb_counter.vcd
         ↓
6. ./rungtkwave.sh Vtb_counter.vcd
   → Inspect clk / reset / q waveforms in GTKWave
         ↓
7. Share waveform screenshot with Claude for verification
```

---

## Tips for Using Claude in TSSV Development

- **Share the waveform image directly.** Claude can infer reset polarity, synchrony, and interface behavior from timing diagrams without a written spec.
- **Ask Claude to explain generated SV.** If you're unsure why an `always_ff` block looks a certain way, Claude can walk through the TSSV API call that produced it.
- **Use Claude to debug testbench artifacts.** The one-cycle reset lag above was identified and explained by Claude during waveform review — it distinguished a testbench scheduling effect from an RTL bug.
- **Watch for the `writeSystemVerilog()` side effect.** This was discovered during this session and is worth knowing: always use a fresh module instance for each call to `writeSystemVerilog()`.
