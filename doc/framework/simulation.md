# Simulation and Waveform Viewing

`verilatorTB/` contains a pre-wired Verilator simulation harness. `make` chains the whole flow:

```
TypeScript → (npx tsc) → JS → (node) → .sv → (verilator) → binary → (run) → .vcd → (gtkwave)
```

It needs the Verilator version pinned in the top-level `README.md` (Setup section), and GTKWave
on your `PATH` to view the waveform.

A new self-checking testbench is built on the testbench framework instead: a synthesizable
harness under a sim-only `SimTop`, built with `verilator --binary --timing`
([testbench.md](testbench.md)).

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
| `VERILOG_FILE` | `../sv-examples/FIR/myFIR3/tb_lpFIR.sv` | The top SV file to simulate, or a Verilator filelist (`.f`), which the Makefile passes with `-F` |

`writeSystemVerilogFiles()` writes a design one module per file, and each file includes the files
it needs under `USE_INCLUDES`. So pass the top file: the build defines `USE_INCLUDES` and puts
`VERILOG_FILE`'s directory on the include path, and the includes bring in the rest. The build also
passes the common waivers file (SV guide, section 8), since generated SV writes `+` and `-`
without operand casts.

To simulate a different module:

```bash
make TOP_MODULE=Vmy_module VERILOG_FILE=../sv-examples/<Module>/<instance>/my_module.sv
```

The Makefile knows how to regenerate only two files: FIR's `tb_lpFIR.sv` (from
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

`make` tracks dependencies: if `VERILOG_FILE` is newer than the binary, it recompiles. It
doesn't see the files `VERILOG_FILE` includes, so after regenerating a design, force a full
rebuild:

```bash
make clean && make
```
