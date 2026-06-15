# TSSV Core API Reference

> **Sources:** `ts/src/core/Base.ts`, `ts/src/core/Registers.ts`
> **Public re-export:** `tssv/lib/core/TSSVLib` (re-exports everything from Base and Registers)

This document is a quick reference for the building blocks you use inside a module constructor. Every `add*()` call appends to the module's internal description; nothing is emitted until `writeSystemVerilog()` is called.

---

## Signal handles: `Sig` and `Expr`

These are the two types you pass as signal arguments to `add*()` methods.

### `new Sig(name: string)`

A named signal reference. Carries the signal name and (optionally) metadata. Most `add*()` methods return a `Sig` so you can chain calls.

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
  resetVal?: 0n,          // bigint  — value on reset (default 0)
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

All three accept an optional `result` field to name the output signal explicitly.

---

## Rounding

### `addRound(io, roundMode?): Sig`

Right-shifts `in` by `rShift` bits with rounding, writing to `out`. Output width must be declared before calling.

```typescript
this.addSignal('rounded', { width: sumWidth - rShift + 1, isSigned: true })
this.addRound({ in: 'sum', out: 'rounded', rShift: 7 })
```

`rShift` may be a number (constant), string, or `Sig` (variable shift).

| `roundMode` | Behavior |
|---|---|
| `'rp'` (default) | Round toward positive infinity (round-half-up) |
| `'rm'` | Round toward negative infinity (truncate) |
| `'rz'` | Round toward zero |
| `'rn'` | Round to nearest even |
| `'rna'` | Round away from zero |

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
| `'balanced'` | Symmetric: signed min is `-(2^(W-1)-1)` |
| `'none'` | Wrap rather than clamp (no saturation logic) |

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

---

## Always blocks

For complex logic that can't be expressed with the `add*()` primitives, use these to inject raw SV.

### `addSequentialAlways(io, body): void`

Wraps `body` in `always_ff @(posedge clk …)`. TSSV fills the sensitivity list from `io.clk`/`io.reset` metadata; you only write the logic body.

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

```typescript
this.addCombAlways(
  { outputs: ['y'] },
  `  begin
     y = a & b;
   end`
)
```

### `addLatchAlways(io, body): void`

Same as `addCombAlways` but generates `always_latch`. Use for purely combinational logic that tools should not infer as a latch — or when explicitly modelling latch behavior.

---

## Interfaces

### `addInterface(instanceName, interface): Interface`

Adds a signal bundle to the module. Returns the `Interface` for use in bindings.

```typescript
const regs = this.addInterface('regs', new Memory({ DATA_WIDTH: 32, ADDR_WIDTH: 32 }, 'inward'))
// → memory_32_32.inward regs  in the port list
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
  true    // createMissing: for unbound ports, create new signals in parent (promotes interface bundles up)
)
```

**`autoBind=true`** (default): scans submodule ports; if a matching name exists in the parent, binds automatically.

**`createMissing=true`**: for any unbound port not found in parent, creates a new signal or interface — effectively promoting the submodule's bus interface to the parent's ports. Required when a submodule has an unbound `Interface` (e.g. Memory bus).

### `addSystemVerilogSubmodule(instanceName, svFilePath, params, bindings, autoBind?): void`

Includes a pre-existing `.sv` file as a black-box submodule. `svFilePath` is included verbatim; `params` sets Verilog `#(...)` parameter overrides; `bindings` maps ports to parent signals.

```typescript
this.addSystemVerilogSubmodule('inner', 'path/to/inner.sv', {}, bindings, true)
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

### `writeSystemVerilog(): string`

Renders the module to a SV string. Recursively includes all submodule definitions. Safe to call multiple times (idempotent after the fix in `Base.ts`).

---

## `RegisterBlock` (`ts/src/core/Registers.ts`)

Generates a self-contained register file module backed by a bus interface.

### `RegisterBlockDef<T>`

```typescript
interface RegisterBlockDef<T extends Record<string, bigint>> {
  wordSize: 32 | 64
  addrMap: T                          // { REG_NAME: 0x000n, ... } as const
  baseAddress?: bigint
  registers: {
    [name in keyof T]?: {
      type: 'RW' | 'RO' | 'WO' | 'RAM' | 'ROM'
      reset?: bigint
      description?: string
      width?: IntRange<1,64>          // defaults to wordSize
      isSigned?: boolean
      size?: bigint                   // RAM/ROM only: number of entries
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

| Register type | Output ports | Behavior |
|---|---|---|
| `'RW'` | One output per register (or per field) | Host writes, logic reads |
| `'RO'` | One input per register | Logic drives, host reads |
| `'WO'` | One output per register | Host writes, not readable |
| `'RAM'` | `re`, `we`, `rdata`, `wdata`, `wstrb`, `addr`, `ready` | External SRAM-style interface |
| `'ROM'` | `re`, `rdata`, `addr`, `ready` | External ROM-style interface |

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
# → ts/src/modules/MyModule/stub.my_regs.ts  (git-ignored)
```

The stub includes a JSDoc markdown table (renders in TypeDoc) and the full `addrMap`, `RegisterBlockDef`, and `RegisterBlock` instantiation. See `scripts/example_regblock.yaml` for the YAML schema.
