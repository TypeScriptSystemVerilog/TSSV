# TSSV  (TypeScript SystemVerilog)

**DISCLAIMER:  This work is currently a demonstration and  not ready for production HDL development yet!**

TSSV is a meta-HDL language written in TypeScript for creating highly parameterized and configurable synthesizable SystemVerilog components improving productivity of hardware designers. It is intended to serve a similar role as Chisel(Scala) but has a focus on trying to have a design paradigm and syntax that will be more familiar to a hardware design engineer familiar with SystemVerilog.

### Mission Statement and Language Justification

TSSV exists to make structural hardware generation practical, readable, and approachable for working RTL engineers.
The project mission is to generate human-readable synthesizable SystemVerilog while keeping the host language experience familiar enough that engineers can be productive quickly without adopting a steep software-language learning curve.

From a programming-paradigm perspective, synthesizable HDL is naturally concurrent and declarative/dataflow-oriented, with localized imperative constructs used only to describe combinational or sequential structures that synthesis maps to hardware. TSSV intentionally mirrors that model by using TypeScript as an elaboration language rather than a behavioral simulator runtime.

The TypeScript and Node.js choice is deliberate:

- Structural typing aligns well with hardware interfaces (signal bundles and protocol shapes) without deep inheritance trees.
- Multi-paradigm support (procedural, OOP, and functional styles) allows framework authors and users to choose the right abstraction level for each design task.
- Strong tooling (tsc, ESLint, and LSP/IDE support) improves discoverability, refactoring safety, and onboarding speed.
- The JavaScript ecosystem simplifies configuration and code generation workflows (JSON-first flows, scriptable pipelines).

#### Comparison to Chisel, SpinalHDL, and Bluespec

TSSV is not trying to replace the technical strengths of Chisel, SpinalHDL, or Bluespec. Those ecosystems are powerful and mature, especially when teams want deeper compiler-style transformations, aggressive static typing, or formal method-centric workflows.

The TSSV mission is narrower and different: generate readable synthesizable SystemVerilog with minimal cognitive overhead for practicing RTL engineers. In that mission profile, TypeScript provides a better host language fit because it reduces language friction while preserving enough type safety and abstraction power to build robust structural generators.

In practical terms:

- Chisel and SpinalHDL (Scala-based) often require users to become comfortable with advanced Scala features and FP-heavy idioms before they are fully productive.
- Bluespec introduces a rule-based model that is elegant and rigorous, but it can feel semantically distant from day-to-day RTL coding style and review conventions.
- TypeScript keeps the elaboration model close to familiar software patterns and IDE workflows, helping teams adopt meta-HDL generation without a major paradigm retraining cost.

#### Why FP-Dominant Host Languages Are Not the Primary Fit Here

FP-dominant languages are excellent when the core mission includes theorem-like reasoning, complex IR rewrites, or behavioral/scheduling semantics embedded in the host framework. That is not TSSV's primary objective.

TSSV intentionally does not center behavioral simulation in the host runtime. Because the mission is structural elaboration and clean HDL emission, the key optimization target is engineer usability and output readability, not maximal host-language semantic rigor. For this scope, a pragmatic multi-paradigm host (TypeScript) is a better fit than an FP-dominant host that can impose a steeper onboarding burden on RTL-focused users.

TSSV explicitly prioritizes HDL generation quality and usability over in-language behavioral modeling. In other words, this framework is optimized to elaborate hardware structure and emit clean SystemVerilog that engineers can read, review, lint, and integrate into existing downstream verification and implementation flows.


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
