# TSSV Decorator Spike Spec

> Status: Draft
> Scope: exploratory API and implementation spike only

## Purpose

This document proposes a small decorator-based declaration layer for TSSV.
The goal is to evaluate whether decorators can reduce declaration boilerplate
while keeping TSSV source aligned with the resulting SystemVerilog.

The intended audience is RTL engineers who want generated HDL to remain
readable and predictable. The decorator layer should therefore mirror
SystemVerilog declaration semantics closely and differ only where the TSSV
abstraction is clearly better.

## Goals

- Reduce repeated string literals for signal and port names.
- Keep declarations visually close to modern SystemVerilog style.
- Preserve existing `add*()` elaboration APIs for behavior construction.
- Make emitted HDL easy to predict by inspection of the TSSV source.
- Keep the initial spike small enough to validate ergonomics quickly.

## Non-goals

- Replace the existing constructor-based API.
- Force internal signal declarations to class scope.
- Introduce behavioral simulation semantics into the host language.
- Build a full compile-time type-level hardware DSL in the decorator layer.
- Cover every SystemVerilog declaration form in the first spike.

## Design Principles

1. Match SystemVerilog on declaration meaning.
2. Use TSSV-specific metadata only when it improves safety or usability.
3. Keep declaration decorators separate from behavioral elaboration.
4. Prefer explicit RTL terminology over framework-specific jargon.
5. Default to modern SystemVerilog conventions where practical.
6. Keep local signals declared near point-of-use in constructors.

## Proposed Decorators

The initial decorator surface should follow the major declaration categories
visible in the emitted SystemVerilog.

### Port decorators

- `@Input(options?)`
- `@Output(options?)`
- `@InOut(options?)`

These map to module port declarations.

Example:

```typescript
@Input({ width: DATA_WIDTH })
a!: TSSV.Sig

@Output({ width: DATA_WIDTH, isSigned: true })
y!: TSSV.Sig

@Input({ isClock: 'posedge' })
clk!: TSSV.Sig

@Input({ isReset: 'lowasync' })
rst_b!: TSSV.Sig
```

Emitted intent:

```systemverilog
input  logic [DATA_WIDTH-1:0] a;
output logic signed [DATA_WIDTH-1:0] y;
input  logic                  clk;
input  logic                  rst_b;
```

### Internal declaration decorator (optional)

- `@Signal(options?)`

This maps to internal signal declarations when the author explicitly wants a
class-level declaration. For the primary spike, local/internal signals should
still be declared in constructor code near where they are used.

`kind` should default to `logic` and can usually be omitted.

Important: TypeScript decorators apply to class elements, not local variables.
That means they cannot decorate constructor-local signal declarations directly.
For this reason, `this.addSignal(...)` remains the preferred pattern for local
signals in the first spike.

Example:

```typescript
@Signal({ width: DATA_WIDTH })
data!: TSSV.Sig

@Signal({ width: DATA_WIDTH, isSigned: true })
accum!: TSSV.Sig

@Signal({ kind: 'wire' })
comb_ready!: TSSV.Sig
```

Emitted intent:

```systemverilog
logic [DATA_WIDTH-1:0] data;
logic signed [DATA_WIDTH-1:0] accum;
wire comb_ready;
```

### Interface decorators

- `@InterfacePort(options)`
- optional later spike: `@InterfaceInstance(options)`

These model SystemVerilog interface declarations directly rather than exposing
member-signal decorators.

Example:

```typescript
@InterfacePort({
  type: AXI4Stream,
  modport: 'slave',
  params: { DATA_WIDTH: 32 }
})
s_axis!: AXI4Stream

@InterfacePort({
  type: AXI4Stream,
  modport: 'master',
  params: { DATA_WIDTH: 32 }
})
m_axis!: AXI4Stream
```

Emitted intent:

```systemverilog
AXI4Stream #(.DATA_WIDTH(32)) s_axis (...);
AXI4Stream #(.DATA_WIDTH(32)) m_axis (...);
```

Note: exact emitted syntax depends on how TSSV currently renders interfaces and
modports. The spike should preserve existing TSSV interface semantics and only
change the declaration style in TypeScript.

## Option Shapes

### Common declaration options

```typescript
type DeclOptions = {
  width?: number | TSSV.Expr | ((params: object) => number | string)
  isSigned?: boolean
  packedDims?: Array<number | string>
  unpackedDims?: Array<number | string>
}
```

### Port options

```typescript
type PortOptions = DeclOptions & {
  kind?: 'logic' | 'wire'
  isClock?: 'posedge' | 'negedge'
  isReset?: 'highasync' | 'lowasync' | 'highsync' | 'lowsync'
}
```

Notes:

- `kind` defaults to `logic`.
- `isClock` and `isReset` are TSSV-specific metadata and are intentionally kept
  even though they are above raw SystemVerilog declaration syntax.

### Signal options

```typescript
type SignalOptions = DeclOptions & {
  kind?: 'logic' | 'wire' | 'reg' | 'const logic'
}
```

Notes:

- `kind` defaults to `logic`.
- `reg` support should remain only as needed for compatibility with existing
  TSSV code generation rules.

### Interface options

```typescript
type InterfacePortOptions<T> = {
  type: new (...args: any[]) => T
  params?: Record<string, unknown>
  modport?: string
  role?: string
}
```

Notes:

- Prefer `modport` when the interface abstraction maps directly to a named
  SystemVerilog modport.
- `role` can remain as a compatibility field if current TSSV interfaces use
  terms like `inward` and `outward`.

## Recommended Naming

Recommended first-spike decorator names:

- `@Input`
- `@Output`
- `@InOut`
- `@InterfacePort`

Optional (not primary in first spike):

- `@Signal`

Rationale:

- Direction-specific decorators align better with SystemVerilog than a generic
  `@Port({ dir: ... })` form.
- `@Signal` (if used) is a better fit than `@Internal` because it matches RTL
  vocabulary.
- Interface declarations should remain first-class and should not be decomposed
  into `@InterfaceSignal` member declarations for ordinary module authors.
- Keeping internal signals in constructor code preserves locality and makes data
  path construction easier to read and maintain.

## Minimal Example

This example shows the intended declaration style only. Behavioral elaboration
remains in normal constructor code using the existing `add*()` APIs.

```typescript
class Counter8 extends TSSV.Module {
  @Input({ isClock: 'posedge' })
  clk!: TSSV.Sig

  @Input({ isReset: 'lowasync' })
  rst_b!: TSSV.Sig

  @Input()
  en!: TSSV.Sig

  @Output({ width: 8 })
  count!: TSSV.Sig

  constructor () {
    super({})
    const count_q = this.addSignal('count_q', { width: 8 })

    this.addRegister({
      d: new TSSV.Expr('count_q + 1'),
      clk: 'clk',
      reset: 'rst_b',
      en: 'en',
      q: count_q
    })

    this.addAssign({ out: 'count', in: count_q })
  }
}
```

Approximate emitted declarations:

```systemverilog
module Counter8 (
  input  logic       clk,
  input  logic       rst_b,
  input  logic       en,
  output logic [7:0] count
);

logic [7:0] count_q;
```

## Interface Example

```typescript
class StreamPassThrough extends TSSV.Module {
  @Input({ isClock: 'posedge' })
  clk!: TSSV.Sig

  @Input({ isReset: 'lowasync' })
  rst_b!: TSSV.Sig

  @InterfacePort({
    type: AXI4Stream,
    modport: 'slave',
    params: { DATA_WIDTH: 32 }
  })
  s_axis!: AXI4Stream

  @InterfacePort({
    type: AXI4Stream,
    modport: 'master',
    params: { DATA_WIDTH: 32 }
  })
  m_axis!: AXI4Stream

  constructor () {
    super({})
    this.body += '   assign m_axis.TVALID = s_axis.TVALID;\n'
    this.body += '   assign m_axis.TDATA = s_axis.TDATA;\n'
    this.body += '   assign s_axis.TREADY = m_axis.TREADY;\n'
  }
}
```

## Implementation Strategy

The spike should use decorators only for declaration capture.

Suggested flow:

1. Decorators register typed metadata on the class.
2. `Module` materializes that metadata during construction.
3. Materialization calls existing APIs such as `addSignal()` and
   `addInterface()` or populates `IOs` using the current data model.
4. Behavioral logic and most internal signal declaration continue to use
  existing constructor code.

This keeps the spike low-risk because it reuses existing elaboration and HDL
emission logic.

## Tooling Expectations

- ESLint and VS Code type checking should remain intact if the implementation
  keeps metadata typed and avoids `any`-heavy registries.
- Decorators should improve authoring ergonomics only if field types remain
  explicit and metadata stays close to the declaration site.
- The spike should avoid magical runtime behaviors that are hard to inspect or
  refactor.

## Open Questions

1. Should `modport` replace current `role` terminology throughout the public
   interface API, or should both be supported?
2. Should `width` accept only numeric/elaboration-time expressions in the first
   spike, or also callback-based parameter functions?
3. Should internal constants use a separate decorator later, such as `@Const`?
4. How much of existing `IOSignal` and `Signal` typing should be reused versus
   wrapped in decorator-specific option types?

## Recommended First Spike Scope

Implement only the smallest surface needed to evaluate the idea:

1. `@Input`
2. `@Output`
3. `@InterfacePort` (optional if straightforward)

Explicitly defer in first spike:

4. `@Signal` for internal declarations (keep constructor-local `addSignal()` as
  the default style)

Success criteria:

- A small demo module generates the same SystemVerilog as the manual style.
- No major regression in ESLint or authoring-time type checking.
- The declaration syntax reads more like RTL and less like framework plumbing.