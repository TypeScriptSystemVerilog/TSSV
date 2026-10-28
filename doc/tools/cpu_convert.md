# CPU Convert Tool

This is a tool which is used to extract sram from an RTL verilog file and produce various files containing information from the RTL. This depends on the source, if it is from the PC SPSRAM or the RHC SPRAM.

The tool is named cpu_convert and can be called through the following method:

```
npx tsc
node out/src/tools/convert/cpu_convert.js <path-to-verilog-file> <output-path/prefix>

```

This produces various files depending on what it is. The prefix is the beginning of the variosu file names that you would like.

> **Example inputs are missing.** The three examples below read their input from
> `sv-examples/cpu_convert/`, which was removed from the repo in a44e841 (2026-06-12) when
> `sv-examples/` stopped being tracked. To run one, restore its input from history first, for
> example `mkdir -p sv-examples/cpu_convert && git show a44e841^:sv-examples/cpu_convert/pc_top.v > sv-examples/cpu_convert/pc_top.v`.

## The SRAM wrappers

Each mode writes one wrapper module per distinct SRAM, each around a TSSV `SRAM` (`1rw`, bit write mask).

- **Names.** In PC mode a wrapper has the name of the `pc_spsram_*` module it replaces, such as `pc_spsram_128x26_13bw`. In RHC and UX900 mode the RTL instantiates parameterized modules, so a wrapper is named after the module and the instance's shape: `<module>_<depth>x<width>_<bw|nobw>`, such as `rhc_spram_1024x32_nobw`, where `bw` means a per-bit write enable. Two instances with the same name and shape share one wrapper. Two different SRAMs that would get the same name make the tool throw.
- **Ports.** Every wrapper has the PC macros' ports: `A`, `CEN`, `CLK`, `D`, `GWEN`, `WEN` and `Q`. `CEN`, `GWEN` and `WEN` are active low, as on the TSMC macros: with `CEN` low, the macro writes the bits whose `WEN` bit is low when `GWEN` is low, and reads otherwise. In PC mode these match the `pc_spsram_*` modules, by name and width. In RHC and UX900 mode they don't match the modules the RTL instantiates yet ([#192](https://github.com/TypeScriptSystemVerilog/TSSV/issues/192)).
- **Lint.** Every wrapper lints clean with `verilator --lint-only -Wall +define+USE_INCLUDES +incdir+<library dir> <library dir>/<wrapper>.sv`.

## PC SPSRAM

If the RTL follows the PC SPSRAM format then the following four files and the library directory will be produced.
```
∟ prefix_info.csv
∟ prefix_pc_library.sv
∟ prefix_pc_library/
∟ prefix_pc_top.sv
∟ prefix_sram_modules.json
```
The info file is a CSV which will show various parameters and their value if they are filled in.

The library is a TSSV wrapper module for each SRAM in the original file, written with `writeSystemVerilogFiles()` to `prefix_pc_library/`, one guarded file per module. `prefix_pc_library.sv` includes each wrapper's file under `USE_INCLUDES` and defines nothing itself, so build it with `+define+USE_INCLUDES +incdir+prefix_pc_library prefix_pc_library.sv`.

The pc_top.sv file is the original file with the `pc_spsram_*` module definitions taken out. The library's wrappers, which have the same names and ports, replace them.

The sram modules is a json which has the same information as the info file but in json form.

### Example

An example use case of this would look like:
```
cd ~/TSSV
npx tsc
node out/src/tools/convert/cpu_convert.js sv-examples/cpu_convert/pc_top.v ts/src/tools/example1
```

This will take this example file (`sv-examples/cpu_convert/pc_top.v`) and produce four files and the library directory in this same tools directory, although it would make more sense to save it in an external directory.

## RHC SPRAM

This will produce three files and the library directory, which are
```
∟ prefix_info_rhc.csv
∟ prefix_rhc_library.sv
∟ prefix_rhc_library/
∟ prefix_rhc.json
```
The info_rhc file is a CSV which will show various parameters and their value if they are filled in.

The library is a TSSV wrapper module for each SRAM in the original file, written with `writeSystemVerilogFiles()` to `prefix_rhc_library/`, one guarded file per module. `prefix_rhc_library.sv` includes each wrapper's file under `USE_INCLUDES` and defines nothing itself, so build it with `+define+USE_INCLUDES +incdir+prefix_rhc_library prefix_rhc_library.sv`.

The last file is a json which has the same information as the info file but in json form.

### Example
An example use of this case would look like this:
```
cd ~/TSSV
npx tsc
node out/src/tools/convert/cpu_convert.js sv-examples/cpu_convert/rhcexample.sv ts/src/tools/example3
```

This will take this example file (`sv-examples/cpu_convert/rhcexample.sv`) and produce three files and the library directory in this same tools directory, although it would make more sense to save it in an external directory.

## UX900 GNRL RAM

This will produce three files and the library directory, which are
```
∟ prefix_info_ux900.csv
∟ prefix_ux900_library.sv
∟ prefix_ux900_library/
∟ prefix_ux900.json
```
The info_ux900 file is a CSV which will show various parameters and their value if they are filled in.

The library is a TSSV wrapper module for each SRAM in the original file, written with `writeSystemVerilogFiles()` to `prefix_ux900_library/`, one guarded file per module. `prefix_ux900_library.sv` includes each wrapper's file under `USE_INCLUDES` and defines nothing itself, so build it with `+define+USE_INCLUDES +incdir+prefix_ux900_library prefix_ux900_library.sv`.

The last file is a json which has the same information as the info file but in json form.

### Example
An example use of this case would look like this:
```
cd ~/TSSV
npx tsc
node out/src/tools/convert/cpu_convert.js sv-examples/cpu_convert/ux900_rams_wrapper.v ts/src/tools/example2
```

This will take this example file (`sv-examples/cpu_convert/ux900_rams_wrapper.v`) and produce three files and the library directory in this same tools directory, although it would make more sense to save it in an external directory.
