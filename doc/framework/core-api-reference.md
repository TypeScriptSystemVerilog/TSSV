# TSSV Core API Reference

> **Stopgap.** #71 moves this content into the core's JSDoc, which generates
> `doc/reference/` (#70), and then deletes this file.

> **Sources:** `ts/src/core/Base.ts`, `ts/src/core/Registers.ts`
> **Public re-export:** `tssv/lib/core/TSSVLib` (re-exports everything from Base and Registers)

This document is a quick reference for the building blocks you use inside a module constructor. Every `add*()` call appends to the module's internal description; nothing is emitted until `writeSystemVerilogFiles()` is called.

---

## Signal handles: `Sig` and `Expr`

These are the two types you pass as signal arguments to `add*()` methods.

### `new Sig(name: string)`

A named signal reference. It carries only the name: width and other metadata live in the module's `IOs`/`signals` tables (see `concepts.md` §3). Most `add*()` methods return a `Sig` so you can chain calls.

```typescript
const tap = this.addSignal('tap_0', { width: 8, isSigned: true })
// tap is a Sig — pass it as d/q/a/b/in/out to subsequent calls
```

### `new Expr(sv: string)`

A raw SystemVerilog expression string. Use when the assignment right-hand side is more complex than a single signal name.

```typescript
new Expr(`{padding_bits, data_in}`)
new Expr(`prod_a + prod_b + prod_c`)
```

`Expr` also accepts a function `(params) => string` for parameterized expressions.

---

## `Module` base class

All TSSV components extend `Module`. The constructor must call `super(params, IOs?, signals?, body?)`.

### Constructor

```typescript
constructor(
  params: TSSVParameters,   // parameter bag; TSSV derives the module name from this
  IOs?: IOSignals,          // port map
  signals?: Signals,        // internal signals (pre-declared)
  body?: string             // raw SV string appended verbatim to the module body
)
```

`TSSVParameters` has `name?: string` plus any additional keys via an index signature. If `name` is omitted, TSSV auto-generates a name from all parameter values.

#### `IOSignal` shape

```typescript
{
  direction: 'input' | 'output' | 'inout'
  width?: number          // default 1
  isSigned?: boolean
  isClock?: 'posedge' | 'negedge'
  isReset?: 'highasync' | 'lowasync' | 'highsync' | 'lowsync'
}
```

---

## Signal declaration

### `addSignal(name, signal): Sig`

Declares an internal wire/register. Returns a `Sig` for use in subsequent calls. Generates `logic [N-1:0] name;` (or `logic signed [N-1:0]` etc.).

```typescript
this.addSignal('tap_0', { width: 8, isSigned: true })
this.addSignal('valid', {})             // 1-bit logic
this.addSignal('addr',  { width: 16 })
```

`signal` fields: `width?`, `isSigned?`, `isClock?`, `isReset?`, `type?` (`'logic'|'wire'|'reg'|…`).

### `addConstSignal(name, value, isSigned?, width?): Sig`

Declares a named constant (`const logic`). `value` is a `bigint`; width is inferred if not given.

```typescript
this.addConstSignal('MAX_VAL', 255n, false, 8)
// → const logic [7:0] MAX_VAL = 255;
```

### `addConstSignals(name, values, isSigned?, width?): Sig[]`

Declares an array of constants from a `bigint[]`. Returns a `Sig[]`.

---

## Registers (flip-flops)

### `addRegister(io): Sig`

Creates a D flip-flop. All registers with the same `(clk, reset, en)` triple are merged into a single `always_ff` block.

```typescript
this.addRegister({
  d:        nextTap,      // string | Sig | Expr  — D input
  clk:      'clk',        // string | Sig  — must have isClock metadata
  reset?:   'rst_b',      // string | Sig  — must have isReset metadata; determines polarity/sync
  resetVal?: 0n,          // bigint  — value on reset (default 0); emitted as '0, or sized to q
  en?:      'en',         // string | Sig | Expr  — clock enable
  q?:       thisTap       // string | Sig  — output signal (auto-named if omitted)
})
```

**Reset polarity/sync** is read from the signal's `isReset` metadata:
| `isReset` value | Sensitivity | Condition |
|---|---|---|
| `'lowasync'` | `negedge rst_b` | `!rst_b` |
| `'highasync'` | `posedge rst` | `rst` |
| `'lowsync'` | (no extra sensitivity) | `!rst_b` |
| `'highsync'` | (no extra sensitivity) | `rst` |

---

## Combinational assignment

### `addAssign(io): Sig`

Generates `assign out = in;`.

```typescript
this.addAssign({ in: new Expr('a & b'), out: 'masked' })
this.addAssign({ in: someExpr, out: someSig })
```

---

## Arithmetic

All arithmetic methods accept `string | Sig | bigint` for operands and auto-compute output width.

### `addMultiplier(io): Sig`

```typescript
const prod = this.addMultiplier({ a: tapSig, b: coeffSig })
// → assign prod_tapxcoeff = tap * coeff;
// output width = width(a) + width(b)
```

### `addAdder(io): Sig`

```typescript
const sum = this.addAdder({ a: sigA, b: sigB })
// → assign sum_... = a + b;
// output width = max(width(a), width(b)) + 1
```

### `addSubtractor(io): Sig`

```typescript
const diff = this.addSubtractor({ a: sigA, b: sigB })
// → assign diff_... = a - b;
// output width = max(width(a), width(b)) + 1
```

All three accept an optional `result` field to name the output signal explicitly. The operation
is written plain, with no operand casts (SV guide WIDTH-3), and is computed at the result's
width. A `result` narrower than the natural width gets one outer cast, `8'(a + b)`, which keeps
the low bits (WIDTH-2), and logs a warning. If either operand is signed, or a negative literal,
the result is signed, and an unsigned signal is converted with `$signed({1'b0, x})` (WIDTH-4).
In a sum or difference, that conversion adds a bit, so the auto-sized result counts that
operand one bit wider. A literal is written at its own width, with a sign bit in a signed
operation: `a + 3'd5`, or `a + 4'sd5` if `a` is signed (WIDTH-1). A negative literal is the
negation of a signed literal that holds its magnitude and a sign bit: `a + -8n` gives
`a + -5'sd8`.

---

## Rounding

### `addRound(io, roundMode?): Sig`

Right-shifts `in` by `rShift` bits with rounding, writing to `out`. Output width must be declared before calling.

```typescript
this.addSignal('rounded', { width: sumWidth - rShift + 1, isSigned: true })
this.addRound({ in: 'sum', out: 'rounded', rShift: 7 })
```

`rShift` may be a number (constant, from 0 to `in`'s width minus 1), string, or `Sig` (variable
shift, unsigned, with values in the same range). Every mode but `'rm'` adds a bias before the
shift; the sum is a signal named `<out>_biased`, one bit wider than `in`, so it can't overflow.
`out` needs `in`'s width minus `rShift`, plus one bit, to hold every result; a narrower `out`
keeps the low bits.

| `roundMode` | Behavior |
|---|---|
| `'rp'` (default) | Round toward positive infinity (round-half-up) |
| `'rm'` | Round toward negative infinity (floor) |
| `'rz'` | Round toward zero |
| `'rn'` | Round half to even |
| `'rna'` | Round half away from zero |

---

## Saturation

### `addSaturate(io, satMode?): Sig`

Clamps `in` to the range representable by `out`'s declared width.

```typescript
this.addSignal('saturated', { width: outWidth, isSigned: true })
this.addSaturate({ in: 'rounded', out: 'saturated' })
```

| `satMode` | Behavior |
|---|---|
| `'simple'` (default) | Clamp to `[-(2^(W-1)), 2^(W-1)-1]` (signed) or `[0, 2^W-1]` (unsigned) |
| `'balanced'` | Symmetric: signed min is `-(2^(W-1)-1)`, even when `in` is as wide as `out` |
| `'none'` | No clamp: unsigned keeps the low `W` bits; signed out of range keeps its sign and the low `W-1` bits |

An `out` wider than `in` gets `in` extended.

---

## Multiplexer

### `addMux(io): Sig`

Generates a `unique case` multiplexer.

```typescript
this.addMux({
  in:      [sig0, sig1, sig2, sig3],  // Array<string | Sig | Expr>
  sel:     'sel_2bit',                // string | Sig | Expr  — selects index
  out:     'mux_out',                 // string | Sig
  default: '0'                        // optional default value
})
// → unique case(sel) 0: mux_out=sig0; 1: mux_out=sig1; ... endcase
```

`in` needs at least two entries. A signal input narrower than `out` is extended to it with the
input's signedness; one wider than `out` is an error. An `Expr` input is used as given.

---

## Always blocks

For complex logic that can't be expressed with the `add*()` primitives, use these to inject raw SV.

### `addSequentialAlways(io, body): void`

Wraps `body` in `always_ff @(posedge clk …)`. TSSV fills the sensitivity list from `io.clk`/`io.reset` metadata; you only write the logic body.

Emission checks the block against the SV guide, as it checks every always block in the module (see [`writeSystemVerilogFiles()`](#writesystemverilogfilesoutdir-string)). COMB-2, SEQ-1, SEQ-4, SEQ-5, SEQ-6 and RST-2 apply to this one.

```typescript
this.addSequentialAlways(
  { clk: 'clk', reset: 'rst_b', outputs: ['count'] },
  `  begin
     if (!rst_b) count <= 0;
     else        count <= count + 1;
   end`
)
```

### `addCombAlways(io, body): void`

Wraps `body` in `always_comb` (no inputs → `always_comb`; explicit inputs → `always @(a or b or …)`).

Emission checks the block against the SV guide, as it checks every always block in the module. COMB-2 and COMB-3 apply to this one: no initialized local that isn't `automatic`, and no nonblocking assignment. `<=` as a comparison is fine.

```typescript
this.addCombAlways(
  { outputs: ['y'] },
  `  begin
     y = a & b;
   end`
)
```

### `addLatchAlways(io, body): void`

Same as `addCombAlways` but generates `always_latch`. Use it only for a latch you mean to build (TSSV guide BUILD-5); combinational logic goes in `addCombAlways`. Emission checks the block: an initialized local must be `automatic` (COMB-2).

---

## Interfaces

### `addInterface(instanceName, interface): Interface`

Adds a signal bundle to the module. Returns the `Interface` for use in bindings.

```typescript
const regs = this.addInterface('regs', new Memory({ DATA_WIDTH: 32, ADDR_WIDTH: 32 }, 'inward'))
// → memory_bidi_32_32.inward regs  in the port list
```

Interface instances appear as SV interface type ports (with modport) in the generated module header.

### `Interface` constructor

```typescript
new InterfaceClass(params, role?)
// role: 'inward' | 'outward' | 'monitor' | undefined
```

Available interface classes: `Memory`, `TileLink`, AXI4, AHB, APB, ACE, and 50+ AMBA 2–5 variants in `tssv/lib/interfaces/`.

---

## Submodules

### `addSubmodule(instanceName, submodule, bindings, autoBind?, createMissing?): Module`

Instantiates another `Module` inside this one.

```typescript
this.addSubmodule(
  'coeff_block',     // instance name in generated SV
  coeffRegBlock,     // Module instance
  {                  // explicit port→signal bindings
    clk:    'clk',
    rst_b:  'rst_b',
    COEFF_0: coeffSig
  },
  true,   // autoBind: auto-match unbound ports by name to existing parent signals/IOs
  true    // createMissing: for unbound ports, create new local signals and bundles in parent (not ports)
)
```

**`autoBind=true`** (default): scans submodule ports; if a matching name exists in the parent, binds automatically.

**`createMissing=true`**: for any unbound port not found in parent, creates a new *internal* signal, or a role-less local interface bundle, in the parent. It does not add parent ports: to expose a submodule's bus, give the parent a port of the same interface type and bind to it (see `concepts.md` §5).

**Interface bindings** are checked at elaboration:

- The bound name must be an interface of the parent (`addInterface`), or `addSubmodule` throws `<port>: interface '<name>' not found in <parent>`.
- Parent instance and child port must be the same SV interface type: `interfaceName()`, the class name plus its parameter values, must match. Two `Memory` instances with different `DATA_WIDTH` are different types and throw `<port> interface type mismatch on <submodule>: <parent type> vs <child type>`.
- If the parent's interface has a role (it is itself a port), the child's role must be the same. A role-less parent instance (a local bundle) binds to any role.

### `addSystemVerilogSubmodule(instanceName, svFilePath, params, bindings, autoBind, options): Module`

Includes pre-existing SV files as a black-box submodule. `svFilePath` is a path or an array of paths, each an `.sv` file or a `.f` filelist that names more files, one per line, relative to the `.f`. Environment variables in a path (`$NAME`, `${NAME}`) are expanded, and the path must then be absolute: a relative one throws. `options.moduleName`, the module to instantiate, is required: it's never inferred. `params` sets Verilog `#(...)` parameter overrides; `bindings` maps ports to parent signals. The files are emitted untouched: `writeSystemVerilogFiles()` writes each one once, under its own name, inside its `` `ifndef SVIMPORT__<file name>__ `` guard, so a file two imports share is defined once. Details in `concepts.md` §8.

```typescript
this.addSystemVerilogSubmodule('inner', '$TSSV_ROOT/path/to/inner.sv', {}, bindings, true, { moduleName: 'inner' })
this.addSystemVerilogSubmodule('u_ip', '$MY_IP/rtl/my_ip.f', {}, bindings, false, { moduleName: 'my_ip' })
```

### `TSSV_ROOT`, `expandPath(path)`, `absolutePath(path, what)`, `projectRoot(envVar, importMetaUrl)`

Paths that don't depend on the cwd (`ts/src/core/Paths.ts`, `concepts.md` §8). `TSSV_ROOT` is the running TSSV checkout's root, also set as `$TSSV_ROOT`. `expandPath()` expands `$NAME` and `${NAME}`, which Node's `fs` takes literally; `absolutePath()` also requires the result to be absolute. `projectRoot()` finds a project's own root from its `import.meta.url` and sets it as an environment variable.

```typescript
const cfg = readFileSync(expandPath('$TSSV_ROOT/ts/test/cfg.json'), 'utf8')
export const NOC_ROOT = projectRoot('TSSV_NOC_ROOT', import.meta.url)
```

---

## Utilities

### `bitWidth(value, isSigned?): number`

Returns the minimum number of bits needed to represent `value`.

```typescript
this.bitWidth(255)       // → 8
this.bitWidth(128, true) // → 9  (signed, needs sign bit)
this.bitWidth(coeffSum)  // commonly used to size accumulators
```

### `setVerilogParameter(param): void`

Marks a parameter for emission as a SV `#(parameter ...)` override, enabling parameterized modules for use with Verilog parameter instantiation.

### `writeSystemVerilogFiles(outDir): string[]`

Writes the module and everything it reaches to `<outDir>/<name>.sv`, one guarded file per module and interface, and returns the paths, the top's last. A module's file includes the files it needs under `USE_INCLUDES`, so a build names only the top file: `verilator +define+USE_INCLUDES +incdir+<outDir> <outDir>/<top>.sv`. Files it doesn't write are left in place, and a call that throws writes nothing. Details in `concepts.md` §7.

It checks each module it writes against the SV guide first (`ts/src/core/ModuleCheck.ts`). `verible-verilog-syntax` parses the module's SV, and every always block in it is checked, whether a builder or raw SV (`addBody()`, a constructor `body`) wrote it. A syntax error or a broken rule throws, and the error lists every violation in the module. The check runs before formatting, so it throws whatever the formatter configuration says: `failOnFormatError: false` makes only the formatter's own failures warnings. The signal table says which signals are resets (`isReset`), of which kind, and which are constants:

| Rule | What it rejects |
|---|---|
| COMB-2 | A local declared with an initializer that isn't `automatic` |
| COMB-3 | `<=` in a combinational block: `always_comb`, `always @*`, or `always` with a list of levels |
| SEQ-1 | In a sequential block (`always_ff`, or `always` with an edge), `=` to anything but the block's own locals |
| SEQ-4 | A sequential block with more than one clock, or a clock on both edges. Every event-control term that isn't a reset is a clock, so an async reset must be marked `isReset` |
| SEQ-5 | An async reset missing from the event control or on the wrong edge, or a sync reset in it |
| SEQ-6 | A reset branch that reads a port, a signal that isn't a constant, an interface, or a variable raw SV declares. A reset branch is the `if` branch of `if (!rst_n)`, or the `else` branch of `if (rst_n)` |
| RST-2 | Sequential blocks that use resets of more than one kind |
| RST-4 | A reset generated in logic: a reset that isn't an input, or a signal bound to a submodule's reset port, assigned an expression or assigned in a combinational block. A reset may come from an input, a submodule output or a register, plainly, as a bit, or inverted (`!r`, `~r`) |

---

## `RegisterBlock` (`ts/src/core/Registers.ts`)

Generates a self-contained register file module backed by a bus interface. `registers.md` describes the generated logic and its current limitations.

### `RegisterBlockDef<T>`

```typescript
interface RegisterBlockDef<T extends Record<string, bigint>> {
  wordSize: 32 | 64
  addrMap: T                          // { REG_NAME: 0x000n, ... } as const
  baseAddress?: bigint
  registers: {
    [name in keyof T]?: {
      type: 'RW' | 'RWU' | 'RO' | 'WO' | 'RAM' | 'ROM'
      reset?: bigint
      description?: string
      width?: IntRange<1,64>          // defaults to wordSize
      isSigned?: boolean
      size?: bigint                   // RAM/ROM only: number of entries
      constant?: boolean              // RO only: no port, reads its reset
      registerRequest?: boolean       // RAM/ROM only: default true
      registerResponse?: boolean      // RAM/ROM only: default true
      updatePriority?: 'hw' | 'sw'    // RWU only: default 'hw'
      fields?: Record<string, {
        bitRange: [MSB, LSB]          // e.g. [7, 0]
        reset?: bigint
        description?: string
        isSigned?: boolean
      }>
    }
  }
}
```

### `new RegisterBlock<T>(params, regDef, busInterface)`

```typescript
const coeffRegs = new RegisterBlock<typeof addrMap>(
  { name: 'myRegs_coeffRegs', busAddressWidth: 32 },
  regDef,
  new Memory()
)
```

| Register type | Ports | Behavior |
|---|---|---|
| `'RW'` | One output per register (or per field) | Host writes, logic reads |
| `'RWU'` | An output, plus `<R>_hw_update` and `<R>_hw_update_val` inputs | Host and logic both write |
| `'RO'` | One input per register (or per field); none with `constant: true` | Logic drives, host reads |
| `'WO'` | One output per register (or per field), plus a `<R>_we` pulse | Host writes, not readable |
| `'RAM'` | An outward `Memory` port `<R>` (`bidi`) | An external memory serves the window |
| `'ROM'` | An outward `Memory` port `<R>` (`rd_only`) | An external memory serves reads; writes are dropped |

[`registers.md` §3](registers.md#3-register-types) has the exact port lists and the window timing.

### `RegAddr` helper

Generates sequential addresses:

```typescript
const addr = new RegAddr(0n, 32)  // start=0, wordSize=32
const a0 = addr.next()  // 0x00
const a1 = addr.next()  // 0x04
const a2 = addr.next()  // 0x08
```

---

## gen_regblock.sh

For hand-authored register maps, use the generator script instead of writing `RegisterBlockDef` by hand:

```bash
./scripts/gen_regblock.sh ts/src/modules/MyModule/my_regs.yaml
# → ts/src/modules/MyModule/regs-my_regs.ts  (commit it with the YAML)
```

The stub includes a JSDoc markdown table (renders in TypeDoc) and the full `addrMap`, `RegisterBlockDef`, and `RegisterBlock` instantiation. See `scripts/example_regblock.yaml` for the YAML schema.
