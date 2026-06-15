# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

TSSV (TypeScript SystemVerilog) is a meta-HDL framework that generates synthesizable SystemVerilog from TypeScript. Designers write TypeScript classes that extend `Module`, then call `writeSystemVerilog()` to emit `.sv` files. Think Chisel for Scala, but targeting SV designers.

## Commands

```bash
# Compile TypeScript → out/
npx tsc

# Run a specific test/demo (generates .sv in sv-examples/)
node out/test/test_FIR.js

# Lint the TypeScript source
npx eslint .

# Lint-check generated SystemVerilog (requires verilator installed)
verilator --lint-only sv-examples/test_FIR_output/myFIR.sv

# Generate TypeDoc documentation
npm run docs
```

There is no test runner (Jest/Mocha/etc.) — each file in `ts/test/` is a runnable script that exercises the framework and writes `.sv` output to `sv-examples/`.

## Source Layout

```
ts/src/
  core/
    Base.ts        # Module, Sig, Expr, Interface base classes (~1345 lines) — the heart of the framework
    Registers.ts   # Register/field generation helpers
    TSSVLib.ts     # Re-exports everything as the public API
  modules/         # Pre-built parameterized modules (FIR, SRAM, SFIFO, ROM, LZC, AXI4XBar, …)
  interfaces/      # Signal bundles: TileLink, Memory, and 50+ AMBA 2–5 specs
  tools/           # CLI utilities (xml_interface_build, cpu_convert)

ts/test/           # Runnable demo scripts; each produces sv-examples/<name>/ output
out/               # Compiled JS (git-ignored)
sv-examples/       # Generated SystemVerilog (committed as reference output)
```

## Core Architecture

### Module (`Base.ts`)
Every TSSV component extends `Module`. A module is constructed with:
- `params` — typed parameter bag (drives parameterization/uniquification)
- `IOs` — port map (`{ name: { direction, width } }`)
- `signals` — internal wire declarations
- `body` — optional raw SV string

Builder methods add logic inside the constructor:

| Method | Purpose |
|---|---|
| `addSignal()` | Declare internal signals |
| `addRegister()` | Create a DFF with clock/reset/enable bindings |
| `addCombAlways()` / `addSequentialAlways()` | Add always blocks |
| `addAssign()` | Continuous assignment |
| `addSubmodule()` | Instantiate a child `Module` with port bindings |
| `addMultiplier()`, `addAdder()`, `addMux()`, etc. | Arithmetic/logic primitives |
| `addInterface()` | Add an `Interface` bundle to the module |
| `writeSystemVerilog()` | Emit `.sv` to disk |

### Interface (`Base.ts`)
`Interface` wraps a group of signals with modport support (master/slave/monitor views). AMBA interfaces in `ts/src/interfaces/AMBA/` follow this pattern — each file defines a class with `signals` and `modports`.

### Signals and Expressions
- `Sig` — a named signal reference, carries width/signedness metadata
- `Expr` — a string expression (combinational), used in assignments and bindings

### Adding a New Module
1. Create `ts/src/modules/MyModule.ts`, extend `Module`
2. Define a typed `Parameters` interface
3. Declare IOs as a port map
4. In the constructor, build logic with `add*()` methods
5. Add a test in `ts/test/test_MyModule.ts` that instantiates the class and calls `writeSystemVerilog()`
6. `npx tsc && node out/test/test_MyModule.js` to generate and inspect the SV output

### TypeScript Configuration
- **Strict mode** enabled; `noUncheckedIndexedAccess` is on — array accesses return `T | undefined`
- Module system: `NodeNext` (ESM)
- Output target: ES2020

### ESLint
Uses `eslint-config-love` (strict TS rules). Notable disabled rules: `strict-boolean-expressions`, `prefer-nullish-coalescing`, `naming-convention`. Run `npx eslint .` before committing.

## Simulation and Waveform Viewing

`verilatorTB/` contains a pre-wired simulation harness. `make` chains the full flow automatically:

```
TypeScript → (npx tsc) → JS → (node) → .sv → (verilator) → binary → (run) → .vcd → (gtkwave)
```

### Full flow from scratch

```bash
cd verilatorTB
make          # compiles TS, generates SV, builds Verilator binary, runs simulation
              # produces Vtb_lpFIR.vcd in verilatorTB/
./rungtkwave.sh Vtb_lpFIR.vcd
```

### Makefile variables

| Variable | Default | Purpose |
|---|---|---|
| `TOP_MODULE` | `Vtb_lpFIR` | Name of the top-level module (also names the binary and VCD) |
| `VERILOG_FILE` | `../sv-examples/test_FIR_output/tb_lpFIR.sv` | SV file to simulate |

To simulate a different module:
```bash
make TOP_MODULE=Vmy_module VERILOG_FILE=../sv-examples/my_output/my_module.sv
```

### Key files

- `verilatorTB/sim_main.cpp` — generic C++ Verilator driver; clock/reset signal names and cycle count are controlled via preprocessor macros (`CLOCK_SIG`, `RESET_SIG`, `MAX_CYCLES`). The VCD is written to `<TOP_MODULE>.vcd` in the working directory.
- `verilatorTB/rungtkwave.sh` — thin wrapper that calls the native GTKWave binary (`/opt/homebrew/bin/gtkwave`). Accepts a relative or absolute VCD path.

### Rebuilding after SV changes

`make` tracks dependencies — if the `.sv` file is newer than the binary it recompiles. To force a full rebuild:
```bash
make clean && make
```
