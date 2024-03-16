# TSSV  (TypeScript SystemVerilog)

**DISCLAIMER:  This work is currently a demonstration and  not ready for production HDL development yet!**

TSSV is a meta-HDL language written in TypeScript for creating highly parameterized and configurable synthesizable
SystemVerilog components improving productivity of hardware designers. It is intended to serve a similar role as
Chisel(Scala) but has a focus on trying to have a design paradigm and syntax that will be more familiar to a
hardware design engineer familiar with SystemVerilog.


### Run the demo  (FIR Module)

Prerequite:  A modern version of NodeJS installed  (perhaps v18 or greater)

#### Installation
For MacBook M1/M2/M3 NodeJS installation: see link
https://dev.to/themodernpk/install-node-on-macos-m1-274d

For Ubuntu 22.04 NodeJS installation:
```bash
$ curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ sudo apt install nodejs
$ node -v
```

#### Run Procedure
```bash
$ git clone https://github.com/avonancken/TSSV.git
$ cd TSSV
$ npm install
$ npx tsc
$ node out/test/test_FIR.js
$ cat sv-examples/test_FIR_output/myFIR.sv
```
### Run ESLint
Run ESlint to for additional code quality checks beyond the type checking specified by Typescript.
```bash
$ cd ~/TSSV
$ npx eslint .
```
### Run Verilator
Verilator is an open source Verilog/SystemVerilog simulator.   It can also be used as a lint check of Verilog/SystemVerilog code.   

#### Installation
For Ubuntu 22.04 NodeJS installation:
```bash
$ sudo apt install verilator
```
#### Run Procedure
```bash
$ cd ~/TSSV
$ verilator --lint-only sv-examples/test_FIR_output/myFIR.sv
```

### Example TSSV Module
- <a href="https://github.com/avonancken/TSSV/blob/main/ts/src/modules/FIR.ts">Implementation of a simple FIR Filter module</a>

- <a href="https://github.com/avonancken/TSSV/blob/main/ts/test/test_FIR.ts">Test program for the simple FIR Filter example</a>

#### Generated SystemVerilog modules from the FIR Filter example
- <a href="https://github.com/avonancken/TSSV/blob/ebfebd1a4039c70e3c421d0ede336e12124344a2/sv-examples/test_FIR_output/myFIR.sv#L1-L57">Example 1</a>
- <a href="https://github.com/avonancken/TSSV/blob/main/sv-examples/test_FIR_output/FIR_1pmlbrs_8_9_2.sv">Example 2</a>
- <a href="https://github.com/avonancken/TSSV/blob/main/sv-examples/test_FIR_output/myFIR3.sv">Example 3</a>

### How to generate the TypeDoc documentation
#### Generating
```bash
$ cd ~/TSSV
$ npx typedoc --plugin typedoc-plugin-missing-exports --out docs ts/src/**/*.ts
```
#### Viewing the TypeDoc Documentation
[The TSSV TypeDoc generated Github Page can be accessed here](https://avonancken.github.io/TSSV/index.html)
### Next Steps
- implement addCombinationalAlways()
- implement addSeqentialAlways()
- implement addMemory()
- implement submodule instantiation and binding
- implement standard interfaces and signal bundles
- implement Control Register generator
- Decide approach to Bus fabrics and standardized interconnect
