# SystemVerilog Coding Style

Rules for the SystemVerilog that TSSV modules emit. They apply to everything a module
generates, and most of all to the raw SV strings passed to `addCombAlways()`,
`addSequentialAlways()`, `addLatchAlways()` and the constructor `body`. The builders
type-check signal names, but not those strings.

Rules for the TypeScript that generates the SV will live in the TSSV coding guide,
[`../tssv-style/`](../tssv-style/) ([#58](https://github.com/TypeScriptSystemVerilog/TSSV/issues/58)).
Until it exists, the builder rules here (COMB-7, COMB-8, SEQ-3, LATCH-1, RST-1, NAME-1 to
NAME-3, WIDTH-8) stand in for it.

Every rule has a stable ID (`COMB-1`, `SEQ-3`, …). Cite the ID in reviews, commit messages
and lint waivers. Never renumber a rule: if one is retired, mark it *retired* and leave
its number in place.

**MUST** rules are required. A violation is a bug unless an inline waiver explains it
(LINT-3). **SHOULD** rules are the default; deviate only with a reason in a comment.

## Quick checklist

Before you open a PR that touches generated RTL:

- [ ] Every `always_comb` assigns a default to every output before any `if`/`case` (COMB-1)
- [ ] Every local variable in an always block is `automatic` or uninitialized (COMB-2)
- [ ] `=` only in comb blocks; in sequential blocks, `<=` for registers and `=` only for block-local `automatic` temporaries (COMB-3, SEQ-1)
- [ ] Each signal is driven from exactly one place (COMB-5)
- [ ] Carries and signs survive: full-width intermediates, mixed signedness converted, `>>>` only on signed values (WIDTH-2 to WIDTH-6)
- [ ] `verilator --lint-only -Wall` on the pinned Verilator (5.052) is clean for the generated `.sv` (LINT-1)

## 1. Combinational logic (`addCombAlways`)

**COMB-1 (MUST): Assign every output a default at the top of the block.**
Put the defaults before any `if`, `case` or loop. Then any path that doesn't assign an
output keeps the default, and no latch is inferred.

<!-- lint: dont LATCH
input  logic [1:0] req
output logic [1:0] grant
-->
```systemverilog
// Don't: when neither branch is taken, grant holds its old value, so a latch is inferred
always_comb begin : arb
  if (req[0]) grant = 2'b01;
  else if (req[1]) grant = 2'b10;
end
```

<!-- lint: do
input  logic [1:0] req
output logic [1:0] grant
-->
```systemverilog
// Do
always_comb begin : arb
  grant = '0;
  if (req[0]) grant = 2'b01;
  else if (req[1]) grant = 2'b10;
end
```

**COMB-2 (MUST): Declare a local variable inside an always block `automatic`, or don't initialize it in its declaration.**
A variable declared in a procedural block is *static* by default (IEEE 1800-2023 §6.21).
An initializer in its declaration runs once, at time zero, not on every evaluation. The
value then carries over between evaluations, which is storage, so a latch is inferred.
Verilator ≥ 5.048 reports this as `IMPLICITSTATIC` and `LATCH`. Older versions accept
it silently.

This is the tssv-noc#129 bug. The `flit_commit` block in tssv-noc's `ControlUnit.ts` was:

<!-- lint: dont IMPLICITSTATIC LATCH
input  logic [3:0] layer_rdy
output logic [1:0] sel
output logic       valid
-->
```systemverilog
// Don't: static locals, initialized once at time zero
always_comb begin : flit_commit
  logic [1:0] layer_idx   = 2'd0;
  logic       layer_found = 1'b0;
  for (int i = 0; i < 4; i++) begin
    if (!layer_found && layer_rdy[i]) begin
      layer_idx   = 2'(i);
      layer_found = 1'b1;
    end
  end
  sel   = layer_idx;
  valid = layer_found;
end
```

<!-- lint: do
input  logic [3:0] layer_rdy
output logic [1:0] sel
output logic       valid
-->
```systemverilog
// Do: automatic locals are re-created, and re-initialized, on every evaluation
always_comb begin : flit_commit
  automatic logic [1:0] layer_idx   = 2'd0;
  automatic logic       layer_found = 1'b0;
  for (int i = 0; i < 4; i++) begin
    if (!layer_found && layer_rdy[i]) begin
      layer_idx   = 2'(i);
      layer_found = 1'b1;
    end
  end
  sel   = layer_idx;
  valid = layer_found;
end
```

<!-- lint: do
input  logic [3:0] layer_rdy
output logic [1:0] sel
output logic       valid
-->
```systemverilog
// Also fine: declare without an initializer, assign first thing in the body
always_comb begin : flit_commit
  logic [1:0] layer_idx;
  logic       layer_found;
  layer_idx   = 2'd0;
  layer_found = 1'b0;
  for (int i = 0; i < 4; i++) begin
    if (!layer_found && layer_rdy[i]) begin
      layer_idx   = 2'(i);
      layer_found = 1'b1;
    end
  end
  sel   = layer_idx;
  valid = layer_found;
end
```

Loop variables declared in the `for` header (`for (int i = 0; ...)`) are automatic
already and need no keyword.

**COMB-3 (MUST): Use blocking assignments (`=`) only.** No `<=` in combinational logic.
Verilator reports this as `COMBDLY`.

<!-- lint: dont COMBDLY
input  logic [3:0] a
input  logic [3:0] b
output logic [3:0] total
-->
```systemverilog
// Don't
always_comb begin : sum
  total <= a + b;
end
```

<!-- lint: do
input  logic [3:0] a
input  logic [3:0] b
output logic [3:0] total
-->
```systemverilog
// Do
always_comb begin : sum
  total = a + b;
end
```

**COMB-4 (MUST): Give every `case` a `default`, even when the listed items look exhaustive.**
Use `unique case` or `priority case` only when the designer means the stated
property. Both change what synthesis may assume, and violating it is a
simulation/synthesis mismatch. Verilator reports a missing default as `CASEINCOMPLETE`.

<!-- lint: dont CASEINCOMPLETE LATCH
input  logic [1:0] sel
input  logic a
input  logic b
input  logic c
output logic y
-->
```systemverilog
// Don't: sel == 2'b11 assigns nothing, so a latch is inferred unless a default precedes it
always_comb begin : dec
  case (sel)
    2'b00: y = a;
    2'b01: y = b;
    2'b10: y = c;
  endcase
end
```

<!-- lint: do
input  logic [1:0] sel
input  logic a
input  logic b
input  logic c
output logic y
-->
```systemverilog
// Do
always_comb begin : dec
  case (sel)
    2'b00:   y = a;
    2'b01:   y = b;
    2'b10:   y = c;
    default: y = '0;
  endcase
end
```

**COMB-5 (MUST): Drive each signal from exactly one place.** That place is one `always_comb`,
one `assign`, or one submodule output. Never split a signal's assignments across two
always blocks, or across an always block and an `assign`. Verilator reports this as
`MULTIDRIVEN`.

<!-- lint: dont MULTIDRIVEN
input  logic busy
input  logic flush
output logic ready
-->
```systemverilog
// Don't: ready is driven from two places
assign ready = ~busy;
always_comb begin : flush_ctl
  if (flush) ready = 1'b0;
end
```

<!-- lint: do
input  logic busy
input  logic flush
output logic ready
-->
```systemverilog
// Do: one block owns ready
always_comb begin : ready_ctl
  ready = ~busy;
  if (flush) ready = 1'b0;
end
```

**COMB-6 (MUST): Avoid combinational loops and reads before writes.**
Within a block, don't read a signal before the block assigns it in the same evaluation,
unless it's a true input. Across blocks, no signal may depend combinationally on itself.
Verilator reports these as `UNOPTFLAT`/`ALWCOMBORDER`.

<!-- lint: dont ALWCOMBORDER
input  logic a
input  logic b
output logic y
logic tmp;
-->
```systemverilog
// Don't: tmp is read before this evaluation assigns it, so it uses the previous value
always_comb begin : calc
  y   = tmp + 1'b1;
  tmp = a & b;
end
```

<!-- lint: do
input  logic a
input  logic b
output logic y
logic tmp;
-->
```systemverilog
// Do: assign before reading
always_comb begin : calc
  tmp = a & b;
  y   = tmp + 1'b1;
end
```

**COMB-7 (MUST): Omit `inputs` when calling `addCombAlways`.**
Without `inputs`, the builder emits `always_comb`. With `inputs`, it emits a legacy
`always @( a or b )`, and every missing input becomes a simulation/synthesis mismatch.
Don't write the `always` keyword in the body yourself either.

```ts
// Don't: emits `always @( req )`; any signal read but not listed is missed in simulation
this.addCombAlways({ inputs: ['req'], outputs: ['grant'] }, body)

// Do: emits `always_comb`
this.addCombAlways({ outputs: ['grant'] }, `
  begin : arb
    grant = '0;
    if (req[0]) grant = 2'b01;
    else if (req[1]) grant = 2'b10;
  end
`)
```

**COMB-8 (SHOULD): Prefer a builder or `assign` over an always block for simple logic.**
A one-line expression belongs in `addAssign`. A selector belongs in `addMux`, arithmetic
in `addAdder`/`addMultiplier`. Reserve `addCombAlways` for logic that needs procedural
code.

```ts
// Don't
this.addCombAlways({ outputs: ['valid_out'] }, `
  begin : vld
    valid_out = valid_in & ~stall;
  end
`)

// Do
this.addAssign({ in: new TSSV.Expr('valid_in & ~stall'), out: 'valid_out' })
```

**COMB-9 (SHOULD): Name every always block** (`begin : flit_commit`). Lint messages,
waveforms and coverage reports then point at a meaningful scope.

<!-- lint: dont
input  logic a
input  logic b
output logic y
-->
```systemverilog
// Don't
always_comb begin
  y = a & b;
end
```

<!-- lint: do
input  logic a
input  logic b
output logic y
-->
```systemverilog
// Do
always_comb begin : both_set
  y = a & b;
end
```

## 2. Sequential logic (`addSequentialAlways`, `addRegister`)

**SEQ-1 (MUST): Use nonblocking assignments (`<=`) for every variable visible outside the block.**
Use `=` only for `automatic` variables declared inside the `always_ff`. Give each one a value
before reading it (COMB-2), so it carries no state between clock edges. Never assign the same
variable with both `=` and `<=`. Verilator reports `=` to a non-local variable as `BLKSEQ`.

<!-- lint: dont BLKSEQ
input  logic clk
input  logic rst_n
input  logic vld_nxt
output logic vld_q
-->
```systemverilog
// Don't
always_ff @(posedge clk or negedge rst_n) begin : vld_reg
  if (!rst_n) vld_q = 1'b0;
  else        vld_q = vld_nxt;
end
```

<!-- lint: do
input  logic clk
input  logic rst_n
input  logic vld_nxt
output logic vld_q
-->
```systemverilog
// Do
always_ff @(posedge clk or negedge rst_n) begin : vld_reg
  if (!rst_n) vld_q <= 1'b0;
  else        vld_q <= vld_nxt;
end
```

**SEQ-2 (SHOULD): Compute next state in a separate combinational block.**
By default, compute next state in an `always_comb` (`foo_nxt`), then register it. Keep
arithmetic, muxing and decode out of `always_ff`, apart from reset and enable.

<!-- lint: do
input  logic       clk
input  logic       rst_n
input  logic       inc
output logic [7:0] cnt_q
logic [7:0] cnt_nxt;
-->
```systemverilog
always_comb begin : cnt_next
  cnt_nxt = cnt_q;
  if (inc) cnt_nxt = cnt_q + 8'd1;
end

always_ff @(posedge clk or negedge rst_n) begin : cnt_reg
  if (!rst_n) cnt_q <= '0;
  else        cnt_q <= cnt_nxt;
end
```

**Exception: next-state logic used only by this block's registers can be written inside the
`always_ff`** with block-local `automatic` temporaries (SEQ-1). This keeps the logic next to
the registers it feeds, and event-driven simulators evaluate it once per clock edge rather
than on every input change. Declare the temporaries, with defaults, in a **named**
`begin`/`end` inside the `else` branch:
- The name gives the temporaries a scope (`cnt_reg.cnt_next`) for debuggers and simulators
  that can probe automatic variables. Verilator's waveform tracing (FST or VCD) does not
  dump them.
- Keeping them inside the `else` leaves the async-reset `if`/`else` as the entire body,
  which synthesis tools recognize as the async-reset template.

<!-- lint: do
input  logic       clk
input  logic       rst_n
input  logic       clr
input  logic       inc
input  logic       dec
output logic [7:0] cnt_q
output logic       wrap_q
-->
```systemverilog
// Also fine: next-state logic private to this register group
always_ff @(posedge clk or negedge rst_n) begin : cnt_reg
  if (!rst_n) begin
    cnt_q  <= '0;
    wrap_q <= 1'b0;
  end else begin : cnt_next
    automatic logic [7:0] cnt_nxt  = cnt_q;
    automatic logic       wrap_nxt = 1'b0;
    if (clr) begin
      cnt_nxt = '0;
    end else if (inc && !dec) begin
      cnt_nxt  = cnt_q + 8'd1;
      wrap_nxt = (cnt_q == 8'hFF);
    end else if (dec && !inc) begin
      cnt_nxt = cnt_q - 8'd1;
    end
    cnt_q  <= cnt_nxt;
    wrap_q <= wrap_nxt;
  end
end
```

Move the logic out to a separate `always_comb` with `foo_nxt` signals when:
- **Assertions, coverage or formal** need the next-state value. Automatic variables can't be
  referenced hierarchically (IEEE 1800-2023 §6.21), so concurrent SVA, bind files,
  covergroups and formal tools can't reach them.
- **Other logic** uses the value, such as a lookahead flag, a bypass or a forward. Don't
  duplicate the logic.
- **You need the value in a Verilator waveform** (`--trace-fst`) while debugging.

**SEQ-3 (SHOULD): Use `addRegister` for plain flip-flops.**
It checks that `clk` is marked `isClock` and `reset` is marked `isReset`. It emits the
correct sensitivity list and reset condition for the reset kind, and groups registers
that share clock, reset and enable into one block. It names `q` as `<d>_q` when `d` is a
simple signal. Use `addSequentialAlways` only when the register needs logic that
`addRegister` can't express.

```ts
// Don't: hand-written flop the builder already covers
this.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['cnt_q'] }, `
  begin
    if (!rst_n) cnt_q <= '0;
    else if (en) cnt_q <= cnt_nxt;
  end
`)

// Do
this.addRegister({ d: 'cnt_nxt', clk: 'clk', reset: 'rst_n', en: 'en', q: 'cnt_q' })
```

**SEQ-4 (MUST): Use one clock per sequential block, and one edge.**

<!-- lint: dont
input  logic clk_a
input  logic clk_b
input  logic d
output logic q
-->
```systemverilog
// Don't
always_ff @(posedge clk_a or posedge clk_b) begin : sync
  q <= d;
end
```

<!-- lint: do
input  logic clk_a
input  logic rst_n
input  logic da
output logic qa
-->
```systemverilog
// Do: one block per clock; the crossing goes through a synchronizer (SYN-3)
always_ff @(posedge clk_a or negedge rst_n) begin : a_reg
  if (!rst_n) qa <= '0;
  else        qa <= da;
end
```

**SEQ-5 (MUST): Make the sensitivity list match the reset kind.**
An async reset appears in the sensitivity list (`or negedge rst_n` for `lowasync`). A sync
reset doesn't. If the body includes its own `always_ff` header, `addSequentialAlways`
checks it against the declared `clk`/`reset`. Leave the header out and let the builder
emit it.

<!-- lint: dont
input  logic       clk
input  logic       rst_n
input  logic [1:0] st_nxt
output logic [1:0] st_q
localparam logic [1:0] IDLE = 2'd0;
-->
```systemverilog
// Don't: rst_n is lowasync, but it's missing from the sensitivity list,
// so the reset only takes effect on a clock edge
always_ff @(posedge clk) begin : st_reg
  if (!rst_n) st_q <= IDLE;
  else        st_q <= st_nxt;
end
```

<!-- lint: do
input  logic       clk
input  logic       rst_n
input  logic [1:0] st_nxt
output logic [1:0] st_q
localparam logic [1:0] IDLE = 2'd0;
-->
```systemverilog
// Do
always_ff @(posedge clk or negedge rst_n) begin : st_reg
  if (!rst_n) st_q <= IDLE;
  else        st_q <= st_nxt;
end
```

**SEQ-6 (MUST): Reset values must be constants.** Don't reset a register to another
signal's value.

<!-- lint: dont
input  logic        clk
input  logic        rst_n
input  logic [31:0] cfg_base
input  logic [31:0] base_nxt
output logic [31:0] base_q
-->
```systemverilog
// Don't
always_ff @(posedge clk or negedge rst_n) begin : base_reg
  if (!rst_n) base_q <= cfg_base;
  else        base_q <= base_nxt;
end
```

<!-- lint: do
input  logic        clk
input  logic        rst_n
input  logic [31:0] base_nxt
output logic [31:0] base_q
-->
```systemverilog
// Do
always_ff @(posedge clk or negedge rst_n) begin : base_reg
  if (!rst_n) base_q <= 32'h0000_1000;
  else        base_q <= base_nxt;
end
```

## 3. Reset policy

**RST-1 (SHOULD): Default to an active-low asynchronous reset** (`isReset: 'lowasync'`),
named `rst_n`. This matches the existing modules. Use a different kind only when the
target library or the surrounding design requires it.

**RST-2 (MUST): Use one reset kind per module.** Don't mix sync and async resets, or
active-high and active-low, inside a module.

**RST-3 (SHOULD): Reset control state; leave wide datapath registers unreset.**
Reset FSM state, valid bits, counters and pointers. A data register that's always
written before it's read doesn't need a reset. Omitting it saves area and reset fan-out.

**RST-4 (MUST): Never generate a reset in logic.** Don't use a combinational expression
as a reset. Reset synchronizers live in a dedicated, reviewed module.

## 4. Latches (`addLatchAlways`)

**LATCH-1 (MUST): Use a latch only by intent, and only through `addLatchAlways`.**
It emits `always_latch`, so the intent is visible to tools and reviewers. An inferred
latch anywhere else is a bug (COMB-1, COMB-2). Comment every intentional latch with the
reason it's needed.

## 5. Widths and arithmetic

[`sv/width/width_examples.sv`](sv/width/width_examples.sv) shows every rule in this section
applied to width-parameterized code. The names in brackets below are outputs in that file.
`npm run check:rtl-style` lints it and checks every output against exact integer arithmetic
at widths from 8 to 64 bits, including non-powers of two. The examples use an SV parameter
`W` so that one file can be checked at many widths. In TSSV code the preferred style is
different (WIDTH-8): compute widths in TypeScript and emit them as numbers, so `(W+1)'(c)`
becomes `${w + 1}'(c)` in the template and `17'(c)` in the SV. The rules are the same either
way.

Lint misses the most common width bugs, so WIDTH-4, WIDTH-5 and WIDTH-6 apply even when lint
is clean. TSSV currently wraps every generated module in `/* verilator lint_off WIDTH */`,
which hides Verilator's `WIDTH*` warnings in generated output.

**WIDTH-1: Literals.**
- (MUST) Use `'0` / `'1` for all-zeros / all-ones at any width [`u_ones`, `u_is_max`].
  `'hFFFF_FFFF` is wrong above 32 bits.
- (MUST) Use only sized literals in concatenations and replications: `{a[W-2:0], 1'b0}`.
- (MUST) Cast integer parameters, and any constant wider than 32 bits, to the width they're
  used at [`u_lim`, `u_at_lim`].
- (MUST) In signed expressions, use signed literals (`'sd3`), never `'d3` [`s_sub_lit`,
  `s_is_neg`]. An unsigned literal makes the whole expression unsigned, so `sa < 'd0` is
  always false.
- (SHOULD) Prefer based literals (`'d1`, `'sd3`) to bare decimals [`u_inc`, `u_mul_lit`,
  `u_onehot`]. They state intent and signedness. An unsized one needs no size when its value
  fits in 32 bits: the expression's context extends it.

**WIDTH-2 (MUST): Let the target hold the result's natural growth.** An add grows by one bit
and a multiply by the sum of its operand widths. A target that wide keeps every bit, with no
casts [`u_add_full`, `s_add_full`, `u_mul_full`, `s_mul_full`, `u_mul_narrow`]. A target of
the operand width wraps, which is fine when you want wrap-around [`u_add_wrap`, `u_mul_lo`,
`s_add_wrap`]. A left shift has no natural growth. For a lossless shift, cast the operand to
the target width first [`u_shl_full`, `s_sla_full`].

**WIDTH-3 (MUST): Cast a narrower operand to the common width.** `W'(x)` extends with `x`'s
own signedness: zero for unsigned, sign for signed [`u_add_narrow`, `s_add_narrow`, `u_zext`,
`s_sext`]. Never add or remove signedness around an extension. `W'($unsigned(sc))`
zero-extends a negative value, and lint is clean.

**WIDTH-4 (MUST): Convert unsigned to signed with `$signed({1'b0, x})`.** Never use
`$signed(x)`: it turns a large unsigned value negative. Never mix the two signednesses without
converting first: `sa * b` is computed unsigned, and lint is clean [`s_add_mixed`,
`s_mul_mixed`, `s_from_u`].

**WIDTH-5 (MUST): Use `>>` for unsigned values and `>>>` for signed.** `>>>` is an arithmetic
shift only when its operand is signed. `sa >> S` and `$unsigned(sa) >>> sh` both lint clean
and drop the sign [`s_sra_fix`, `s_sra_var`, `u_shr_fix`, `u_shr_var`].

**WIDTH-6 (MUST): Name an intermediate that needs more bits than the result.** An operation is
only as wide as its context: the target, or its widest operand. In `(a + b) >> 1`, the sum is
W bits and the carry is lost. A cast to the result width can't recover it:
`W'((sa * sb) >>> F)` still loses the product's high bits. Compute the full-width value in a
named signal, then shift or slice it [`u_avg` uses `u_add_full`; `s_mul_q` uses `s_prod`].
In a comparison, widening one operand widens the whole compare [`u_sum_gt`].

**WIDTH-7 (MUST): Truncate explicitly.** Slice a signal [`u_trunc`]. Cast an expression,
which can't be sliced [`u_trunc_sum`]. A slice is always unsigned; cast a signed value to
keep it signed [`s_trunc`].

**WIDTH-8 (SHOULD): Make widths TSSV parameters, computed in TypeScript and emitted as
numbers.** Do every width calculation in the module class, for example with
`this.bitWidth()` or `Math.ceil(Math.log2(depth))`, and interpolate the result. Don't
hand-compute widths in SV strings. Each set of parameter values then gets its own module,
named after those values (`<Class>_<values>`), and the generated RTL shows every signal's
width directly, so it can be read and reviewed without working out parameter expressions.

Expose a width as an SV parameter only when the SV itself needs one, and then write width
expressions in terms of it (`[W:0]`, `(W+S)'(a)`), never as numbers that silently assume one
value. Whether TSSV should have a formal mechanism for exposing SV parameters is tracked in
[#58](https://github.com/TypeScriptSystemVerilog/TSSV/issues/58).

## 6. Naming and structure

These add to the naming conventions in `AGENTS.md`.

**NAME-1 (SHOULD): Use the standard suffixes:**
- `_q` is a register's output; `addRegister` already uses it.
- `_nxt` is a register's next-state value.
- `_n` marks an active-low signal.

Prefer `rst_n` for new code. Some existing modules use `rst_b`. Don't rename existing
ports just to follow this rule.

**NAME-2 (SHOULD): Do structural generation in TypeScript.**
Write loops over ports, lanes and layers as TS loops that emit clean SV. Don't build SV
`generate` blocks inside template strings. TS loops type-check, and their output is
easier to read and lint.

**NAME-3 (SHOULD): Use builder methods instead of raw `body` strings** wherever a builder
exists. Raw SV strings are where these rules get broken.

## 7. Synthesizability

**SYN-1 (MUST): Keep testbench-only constructs out of RTL.** Never emit any of these into
a synthesizable module:
- `initial` blocks
- `#` delays
- `$display` and other tasks
- `force`/`release`
- `casex`

Use `casez` only with intent and a comment. All of these are fine in testbenches.

**SYN-2 (MUST): No gated or generated clocks.** Clock gating goes through a dedicated,
reviewed clock-gate cell or module.

**SYN-3 (MUST): Synchronize every signal that crosses a clock domain explicitly.**
The crossing goes through a synchronizer module. Never sample another domain's signal
directly.

**SYN-4 (SHOULD): Use the existing `SRAM`/`ROM`/`SFIFO` modules for memories** instead of
ad-hoc arrays, so that inferred memory behavior stays consistent.

## 8. Lint and verification

**LINT-1 (MUST): The generated output must lint clean.**
Every module's generated `.sv` must pass `verilator --lint-only -Wall` with zero warnings
on the pinned Verilator version, currently 5.052, built from source per `README.md`. Newer Verilator releases catch bugs that
older ones accept (COMB-2 is one), so lint on the pin, not on a distro package.

**LINT-2 (MUST): Every new module needs a `ts/test/` script** that generates its SV into
`sv-examples/`. The generated output is the evidence for LINT-1.

**LINT-3 (MUST): Scope every waiver as narrowly as possible, and justify it.**
A waiver wraps only the offending line or block, cites the rule or explains why the
warning is a false positive, and is emitted from TypeScript next to the code it covers.

<!-- lint: do
input  logic [31:0] cfg_in
output logic [3:0]  mode
-->
```systemverilog
/* verilator lint_off UNUSEDSIGNAL */  // only the low bits are used; upper bits reserved by spec
logic [31:0] cfg_word;
/* verilator lint_on UNUSEDSIGNAL */
assign cfg_word = cfg_in;
assign mode     = cfg_word[3:0];
```

## Maintaining this document

This guide lives in `doc/rtl-style/sv-style/` with the examples and checks that verify it; see
[README.md](README.md) there. Every rule needs an entry in `rules.json` saying how it's
verified. Run `npm run check:rtl-style` after any change to a rule or an example.

`npm run lint:style-examples` (`doc/rtl-style/sv-style/tools/lint-style-examples.mjs`), one of those
checks, extracts every `systemverilog` example above and lints it with the Verilator version
pinned in the top-level `README.md`. Every SV example needs an HTML comment immediately before
its code fence. The comment doesn't show when the doc is rendered:

- `<!-- lint: do` marks an example that must pass `verilator --lint-only -Wall` with no
  warnings. Use it for every Do, "Also fine" and unlabeled example.
- `<!-- lint: dont CODE ...` marks an example that must trigger each listed warning. List the
  warnings the rule's text cites. Leave the list empty for a mistake Verilator doesn't flag,
  as in COMB-9, SEQ-4, SEQ-5 and SEQ-6, which review has to catch instead.
- Each line after the first declares one port (`input logic [1:0] req`) or one module-scope
  declaration (`logic tmp;`). The script wraps the example in a module with those
  declarations, so every signal the example uses must be declared there.
- Write each example as complete code, with no `...`, one example per code fence.

