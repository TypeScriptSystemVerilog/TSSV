# TSSV  (TypeScript SystemVerilog)

**DISCLAIMER:  This work is currently a demonstration and  not ready for production HDL development yet!**

TSSV is a meta-HDL language written in TypeScript for creating highly parameterized and configurable synthesizable
SystemVerilog components improving productivity of hardware designers. It is intended to serve a similar role as
Chisel(Scala) but has a focus on trying to have a design paradigm and syntax that will be more familiar to a
hardware design engineer familiar with SystemVerilog.


### Run the demo  (FIR Module)

Prerequite:  A modern version of NodeJS installed  (Recommend Node.js v20.12.0 LTS)

#### Installation
For MacBook M1/M2/M3 Node.js installation: 
download and double click to install https://nodejs.org/dist/v20.12.0/node-v20.12.0.pkg
```bash
node -v #v20.12.0
npm -v  #10.5.0
```
For Ubuntu 22.04 Node.js installation:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
node -v #v20.12.0
npm -v  #10.5.0
```

#### Run Procedure
```bash
$ git clone https://github.com/TypeScriptSystemVerilog/TSSV.git
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
A example of a simple FIR Filter TSSV Module can be found [here](docs/example.md)

### How to generate the TypeDoc documentation
#### Generating
```bash
$ cd ~/TSSV
$ npx typedoc --plugin typedoc-plugin-missing-exports --out docs/typedoc ts/src/**/*.ts
```
#### Viewing the TypeDoc Documentation
[The TSSV TypeDoc generated Github Page can be accessed here](https://TypeScriptSystemVerilog.github.io/TSSV/index.html)
### Next Steps
- implement addMemory()
- implement Control Register generator
- Decide approach to Bus fabrics and standardized interconnect
