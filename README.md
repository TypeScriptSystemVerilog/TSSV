# TSSV  (TypeScript SystemVerilog)

**DISCLAIMER:  This work is currently a demonstration and  not ready for production HDL development yet!**

TSSV is a meta-HDL language written in TypeScript for creating highly parameterized and configurable synthesizable
SystemVerilog components improving productivity of hardware designers. It is intended to serve a similar role as
Chisel(Scala) but has a focus on trying to have a design paradigm and syntax that will be more familiar to a
hardware design engineer familiar with SystemVerilog.


### Run the demo  (FIR Module)

Prerequite:  A modern version of NodeJS installed  (Recommend Node.js v24.17.0 LTS)

#### Installation
For macOS and Linux: 

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.17.0".

# Verify npm version:
npm -v # Should print "11.13.0".
```

#### Run Procedure
```bash
git clone https://github.com/TypeScriptSystemVerilog/TSSV.git
cd TSSV
npm install
npx tsc
node out/test/test_FIR.js
cat sv-examples/FIR/myFIR3/myFIR3.sv
```
### Run ESLint
Run ESlint to for additional code quality checks beyond the type checking specified by Typescript.
```bash
cd ~/TSSV
npx eslint .
```
For Visual Studio Code GUI based linting, make sure install extensioin ESLint from Microsoft v2.4.4 or above.

### Run Verilator
Verilator is an open source Verilog/SystemVerilog simulator.   It can also be used as a lint check of Verilog/SystemVerilog code.   

#### Installation
For Ubuntu 22.04 NodeJS installation:
```bash
sudo apt install verilator
```
#### Run Procedure
```bash
cd ~/TSSV
verilator --lint-only sv-examples/FIR/myFIR3/myFIR3.sv
```

### Example TSSV Module
A example of a simple FIR Filter TSSV Module can be found [here](https://github.com/TypeScriptSystemVerilog/TSSV/wiki/Simple-FIR-Filter-Example)

### How to generate the TypeDoc documentation
#### Generating
```bash
cd ~/TSSV
npm run docs
```
#### Deploy to GitHub Pages
```bash
npm run deploy-docs
```
#### Viewing the TypeDoc Documentation
[The TSSV TypeDoc generated Github Page can be accessed here](https://TypeScriptSystemVerilog.github.io/TSSV/index.html)
### Next Steps
- [ ] implement Control Register generator
- [ ] Decide approach to Bus fabrics and standardized interconnect
