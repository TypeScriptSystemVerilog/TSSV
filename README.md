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


### Setup

This section is the source of truth for setting up a machine to use or develop TSSV, including
the pinned Verible and Verilator versions. Projects built on TSSV (for example `tssv-noc`) point
here for these steps and document only what they add.

#### 1. Get an AI coding agent working first (by hand)

The fastest way to set up is to install an AI coding agent first, then have it do the rest. It
runs the commands, reads the errors, and checks each result. Only this step needs to be done
by hand.

| Where you are | Agent |
|---|---|
| Outside mainland China | [Claude Code](https://claude.com/claude-code): the VSCode extension (`anthropic.claude-code`) or the CLI |
| Mainland China | [Cline](https://cline.bot/) in VSCode (extension `saoudrizwan.claude-dev`). Claude Code is not available there |

1. Install [VSCode](https://code.visualstudio.com/). Ubuntu doesn't ship it, so add
   Microsoft's apt repo first (one time):
   ```bash
   sudo apt install -y wget gpg
   wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
   sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
   sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
   rm -f packages.microsoft.gpg
   sudo apt update
   sudo apt install -y code
   ```
   On macOS, use the installer from the VSCode site.
2. Install the agent's VSCode extension, then sign in to Claude Code, or give Cline a model
   provider and API key.
3. Open your home directory in VSCode and give the agent this prompt:

   > Clone https://github.com/TypeScriptSystemVerilog/TSSV.git into ~/TSSV, then work through
   > steps 2–4 of the "Setup" section of its README.md to set up this machine. Run every verify
   > command and stop to tell me if one fails.

   Some steps need `sudo`. The agent will ask you to run them or to approve them.

The remaining steps are written so that either you or the agent can follow them.

#### 2. Platform

- **Linux**: **Ubuntu 26.04 LTS** is the recommended version, and the commands below are
  written for Ubuntu. Other distributions work if you translate the package names.
- **macOS**: Apple silicon only, because Verible's macOS release is an arm64 build.
- **Windows**: run Ubuntu 26.04 LTS in a VirtualBox VM and do every step inside it. Don't use
  WSL2. Native Windows isn't supported, since the Verilator/`make`/`g++` toolchain is Linux-first.

#### 3. Install the tools

| Tool | Why | Verify |
|---|---|---|
| [Node.js](https://nodejs.org/) 24 LTS | Builds and runs everything (`npx tsc`, test scripts) | `node --version` |
| [git](https://git-scm.com/) | Version control | `git --version` |
| [`gh` CLI](https://cli.github.com/) | Issue/PR operations, if you'll contribute (see [`doc/process/issue-workflow.md`](doc/process/issue-workflow.md)) | `gh --version` |
| [Verible](https://github.com/chipsalliance/verible) `v0.0-4296-g0f262651` | Formats emitted SV and parses imported SV | `verible-verilog-format --version` |
| [Verilator](https://verilator.org/) `v5.052` | Lints and simulates generated SV | `verilator --version` |

**git and `gh`:**

```bash
sudo apt update && sudo apt install -y git gh curl   # macOS: brew install git gh
gh auth login --git-protocol ssh                     # only needed to contribute
```

**Node.js**, via nvm (macOS and Linux; no `sudo`, and no clash with distro packages):

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify:
node -v   # expect v24.x
npm -v
```

If you'd rather use apt, Ubuntu 26.04's own `nodejs`/`npm` packages are new enough. On older
releases, use [NodeSource](https://github.com/nodesource/distributions). On Ubuntu 22.04 and
earlier, remove `libnode-dev` before installing NodeSource's package. Otherwise `dpkg` aborts with
`trying to overwrite '/usr/include/node/common.gypi'`, and the machine ends up with no `npm` at all:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get remove -y libnode-dev libnode72      # the conflicting distro Node
sudo apt-get install -y nodejs                    # 24.x, brings its own npm
node --version && npm --version
```

**Verible** must be on your `PATH`. TSSV formats every emitted `.sv` file with
`verible-verilog-format` and parses imported SystemVerilog (`addSystemVerilogSubmodule()`) with
`verible-verilog-syntax`. Generation fails with an error if either is missing.

Neither Ubuntu nor Homebrew packages the pinned release, so install the prebuilt static binaries.

For Linux (detects x86_64 or arm64, leaves no files behind):

```bash
(
  set -euo pipefail
  VERIBLE=v0.0-4296-g0f262651
  case "$(uname -m)" in
    x86_64|amd64)  ARCH=x86_64 ;;
    aarch64|arm64) ARCH=arm64 ;;
    *) echo "No Verible Linux release for architecture $(uname -m)" >&2; exit 1 ;;
  esac
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT
  curl -fsSL "https://github.com/chipsalliance/verible/releases/download/$VERIBLE/verible-$VERIBLE-linux-static-$ARCH.tar.gz" \
    | tar xz -C "$TMP"
  sudo install -m 755 "$TMP/verible-$VERIBLE/bin/"* /usr/local/bin/
)
verible-verilog-format --version   # expect: Version v0.0-4296-g0f262651
verible-verilog-syntax --version   # expect: Version v0.0-4296-g0f262651
```

For macOS (Verible's macOS release is an Apple silicon (arm64) build only; there is no prebuilt Intel binary):

```bash
(
  set -euo pipefail
  VERIBLE=v0.0-4296-g0f262651
  [ "$(uname -m)" = arm64 ] || { echo "Verible's macOS release is arm64-only" >&2; exit 1; }
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT
  curl -fsSL "https://github.com/chipsalliance/verible/releases/download/$VERIBLE/verible-$VERIBLE-macOS.tar.gz" \
    | tar xz -C "$TMP"
  sudo install -m 755 "$TMP/verible-$VERIBLE-macOS/bin/"* /usr/local/bin/
)
verible-verilog-format --version   # expect: Version v0.0-4296-g0f262651
```

To emit unformatted SV instead, call `Module.setFormatterConfig({ engine: 'off' })` before `writeSystemVerilog()`.
Importing SystemVerilog still requires `verible-verilog-syntax`.

**Verilator** is an open-source Verilog/SystemVerilog simulator, also used as a lint check. Use
the pinned version below. Older releases miss real RTL bugs (for example, latches that Verilator
5.048+ flags), and every Ubuntu `verilator` package is older than the pin, so build it from source.

For Linux (Ubuntu/Debian), remove the distro package, then build the pin:
```bash
sudo apt-get remove -y verilator
sudo apt-get install -y build-essential autoconf flex bison help2man perl python3 \
    libfl2 libfl-dev zlib1g zlib1g-dev ccache libgoogle-perftools-dev numactl
VERILATOR_VERSION=v5.052
curl -fsSL -o /tmp/verilator.tar.gz \
    "https://github.com/verilator/verilator/archive/refs/tags/${VERILATOR_VERSION}.tar.gz"
rm -rf /tmp/verilator-src && mkdir /tmp/verilator-src
tar xf /tmp/verilator.tar.gz -C /tmp/verilator-src --strip-components=1
cd /tmp/verilator-src
unset VERILATOR_ROOT
autoconf && ./configure --prefix=/usr/local
make -j4                    # keep -j modest on a low-RAM host
sudo make install
hash -r && verilator --version   # expect: Verilator 5.052 2026-09-05
```
The build takes about 10 minutes. To move the pin, change `VERILATOR_VERSION` and the version in
the table above, then rerun the block.

For macOS:
```bash
brew install verilator
verilator --version   # expect 5.052; if Homebrew's version differs, build the pin from source as above
```

**Network note for mainland China:** GitHub and npm can be slow or blocked from a China
network. That has nothing to do with TSSV. If `git clone` or `npm install` fails or crawls,
fix the network path first (VPN, or an npm registry mirror).

#### 4. Build and run the demo (FIR module)

This checks the whole chain: TypeScript build, SV generation with Verible formatting, and a
Verilator lint of the result.

```bash
cd ~/TSSV
npm install
npx tsc
node out/test/test_FIR.js
cat sv-examples/FIR/myFIR3/myFIR3.sv
verilator --lint-only sv-examples/FIR/myFIR3/myFIR3.sv
```

If all of these succeed, setup is done.

### Run ESLint
Run ESLint for code quality checks beyond TypeScript's type checking.
```bash
cd ~/TSSV
npx eslint .
```
For linting in the VSCode GUI, install Microsoft's ESLint extension, v2.4.4 or later.

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
