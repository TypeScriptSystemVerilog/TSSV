# Simulation and Waveform Viewing

`verilatorTB/` contains a pre-wired Verilator simulation harness. `make` chains the whole flow:

```
TypeScript → (npx tsc) → JS → (node) → .sv → (verilator) → binary → (run) → .vcd → (gtkwave)
```

It needs the Verilator version pinned in the top-level `README.md` (Setup section), and GTKWave
on your `PATH` to view the waveform.

## Full flow from scratch

```bash
cd verilatorTB
make          # compiles TS, generates SV, builds the Verilator binary, runs the simulation
              # and writes Vtb_lpFIR.vcd in verilatorTB/
./rungtkwave.sh Vtb_lpFIR.vcd
```

## Makefile variables

| Variable | Default | Purpose |
|---|---|---|
| `TOP_MODULE` | `Vtb_lpFIR` | Name of the top-level module; also names the binary and the VCD |
| `VERILOG_FILE` | `../sv-examples/FIR/myFIR3/tb_lpFIR.f` | SV file to simulate, or a Verilator filelist (`.f`), which the Makefile passes with `-F` |

A design emitted one module per file (`emitSplit()` in `ts/test/models/emitSplit.ts`) comes with a
filelist naming its files in order; pass that. The build also passes the common waivers file
(SV guide, section 8), since generated SV writes `+` and `-` without operand casts.

To simulate a different module:

```bash
make TOP_MODULE=Vmy_module VERILOG_FILE=../sv-examples/<Module>/<instance>/my_module.sv
```

The Makefile knows how to regenerate only two files: FIR's `tb_lpFIR.f` (from
`test_FIR.js`) and `sv-examples/Core/addRegister/addRegister_tb.sv` (from `test_addRegister.js`). For
any other module, run its test first (`npx tsc && node out/test/test_<Name>.js`) so
`VERILOG_FILE` exists.

## Key files

- `verilatorTB/sim_main.cpp`: a generic C++ Verilator driver. Preprocessor macros set the clock
  and reset signal names and the cycle count: `CLOCK_SIG` (default `clk`), `RESET_SIG` (default
  `rst_b`) and `MAX_CYCLES` (default 1000). The VCD is written to `<TOP_MODULE>.vcd` in the
  working directory.
- `verilatorTB/rungtkwave.sh`: a thin wrapper that checks the VCD exists and runs `gtkwave` on
  it. Takes a relative or absolute VCD path.

## Rebuilding after SV changes

`make` tracks dependencies: if the `.sv` file is newer than the binary, it recompiles. To force a
full rebuild:

```bash
make clean && make
```
