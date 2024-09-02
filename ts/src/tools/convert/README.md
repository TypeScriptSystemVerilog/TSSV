# CPU Convert Tool

This is a tool which is used to extract sram from an RTL verilog file and produce various files containing information from the RTL. This depends on the source, if it is from the PC SPSRAM or the RHC SPRAM.

The tool is named cpu_convert and can be called through the following method:

```
npx tsc
node out/src/tools/convert/cpu_convert.js <path-to-verilog-file> <output-path/prefix>

```

This produces various files depending on what it is. The prefix is the beginning of the variosu file names that you would like.

## PC SPSRAM

If the RTL follows the PC SPSRAM format then the following four files will be produced.
```
∟ prefix_info.csv
∟ prefix_library.sv
∟ prefix_pc_top.sv
∟ prefix_sram_modules.json
```
The info file is a CSV which will show various parameters and their value if they are filled in.

The library file is a TSSV instantiation of all the various SRAMs in the original file.

The pc_top.sv file is the original file with the SRAM instantiations taken out.

The sram modules is a json which has the same information as the info file but in json form.

### Example

An example use case of this would look like:
```
cd ~/TSSV
npx tsc
node out/src/tools/convert/cpu_convert.js sv-examples/cpu_convert/pc_top.v ts/src/tools/pc/example1
```

This will take this example [file](../../../../sv-examples/cpu_convert/pc_top.v) and produce four files in this same tools directory, although it would make more sense to save it in an external directory.

## RHC SPRAM

This will produce three files which are
```
∟ prefix_info_rhc.csv
∟ prefix_rhc_library.sv
∟ prefix_rhc.json
```
The info_rhc file is a CSV which will show various parameters and their value if they are filled in.

The library file is a TSSV instantiation of all the various SRAMs in the original file.

The last file is a json which has the same information as the info file but in json form.

### Example
An example use of this case would look like this:
```
cd ~/TSSV
npx tsc
node out/src/tools/convert/cpu_convert.js sv-examples/cpu_convert/rhcexample.sv ts/src/tools/rhc/example3
```

This will take this example [file](../../../../sv-examples/cpu_convert/rhcexample.sv) and produce three files in this same tools directory, although it would make more sense to save it in an external directory.

## UX900 GNRL RAM

This will produce three files which are
```
∟ prefix_info_ux900.csv
∟ prefix_ux900_library.sv
∟ prefix_ux900.json
```
The info_ux900 file is a CSV which will show various parameters and their value if they are filled in.

The library file is a TSSV instantiation of all the various SRAMs in the original file.

The last file is a json which has the same information as the info file but in json form.

### Example
An example use of this case would look like this:
```
cd ~/TSSV
npx tsc
node out/src/tools/convert/cpu_convert.js sv-examples/cpu_convert/ux900_rams_wrapper.v ts/src/tools/ux900/example2
```

This will take this example [file](../../../../sv-examples/cpu_convert/ux900_rams_wrapper.v) and produce three files in this same tools directory, although it would make more sense to save it in an external directory.