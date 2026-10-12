# Adding an interface

An interface class describes a signal bundle, such as an AXI4 bus or the simple `Memory` bus,
and the directions each side of a connection sees. Modules use it to declare a whole bus as one
port and bind it with one connection. This guide shows how to write one by hand, where the
file goes, and how to generate a first draft from an IP-XACT XML description with
`xml_interface_build`.

How the core uses interfaces (roles, SV type names, the checks `addSubmodule` makes when
binding them) is in [concepts.md §4](../framework/concepts.md#4-interfaces). The `Interface`
base class's signature is in [`doc/reference/Base.md`](../reference/Base.md#interface).

## 1. The pattern

An interface class extends `Interface` and sets three things in its constructor: its
parameters, its `signals` and its `modports`. `Memory` (`ts/src/interfaces/Memory.ts`) is the
smallest complete example. `AXI4` (`ts/src/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4.ts`) shows the
full pattern, with parameters that add and remove signals. Its parts, in file order:

**A parameter type.** Every parameter is optional and typed as narrowly as the spec allows:

```typescript
export interface AXI4_Parameters extends TSSVParameters {
  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024
  ADDR_WIDTH?: IntRange<16, 64>
  ID_WIDTH?: IntRange<1, 16>
  USER_WIDTH?: IntRange<0, 64>
  QOS?: 'withQOS' | 'noQOS'
  REGION?: 'withREGION' | 'noREGION'
}
```

**A signal type** (optional, but it gives `this.signals` precise types). Signals that only
exist for some parameter values are optional:

```typescript
export interface AXI4_Signals extends Signals {
  AWID: { width: number }
  AWADDR: { width: number }
  AWLEN: { width: 8 }
  // ...
  AWQOS?: { width: 4 }
}
```

**A role type** naming the modports a port instance may take. `undefined` is a local bundle:

```typescript
export type AXI4_Role = 'outward' | 'inward' | undefined
```

**The class**, with `declare` to narrow the inherited fields and the spec's VLNV
(vendor, library, name, version) as static metadata:

```typescript
export class AXI4 extends Interface {
  declare params: AXI4_Parameters
  declare signals: AXI4_Signals
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'AXI4',
    version: 'r0p0_0'
  }

  constructor (params: AXI4_Parameters = {}, role: AXI4_Role = undefined) {
    super(
      'AXI4',
      {
        DATA_WIDTH: params.DATA_WIDTH || 32,
        ADDR_WIDTH: params.ADDR_WIDTH || 32,
        ID_WIDTH: params.ID_WIDTH || 4,
        USER_WIDTH: params.USER_WIDTH || 0,
        QOS: params.QOS || 'withQOS',
        REGION: params.REGION || 'noREGION'
      },
      role
    )
```

The first argument to `super()` is the SV name. The second is the **complete, defaulted**
parameter set; it becomes `this.params`. Together they make the SV type name:
`AXI4_32_32_4_0_withQOS_noREGION`.

**The signals**, sized from the parameters, with optional ones added conditionally:

```typescript
    this.signals = {
      AWID: { width: params.ID_WIDTH || 4 },
      AWADDR: { width: params.ADDR_WIDTH || 32 },
      AWLEN: { width: 8 },
      // ...
    }
    if ((params.USER_WIDTH || 0) > 0) {
      this.signals.AWUSER = { width: params.USER_WIDTH || 1 }
      // ...
    }
```

**The modports.** Write the initiator's view (`outward`) by hand and derive the responder's
(`inward`) by flipping every direction, so the two can't drift apart:

```typescript
    this.modports = {
      outward: {
        AWID: 'output',
        AWADDR: 'output',
        // ...
        AWREADY: 'input',
        // ...
      }
    }
    this.modports.inward = Object.fromEntries(
      Object.entries(this.modports.outward).map(([key, value]) =>
        [key, (value === 'input') ? 'output' : 'input']))
  }
}
```

`AXI4.ts` also exports `AXI4_inward` and `AXI4_outward`, which are `AXI4` with `role` narrowed
to one value. A module can use them to type a port.

### Rules for a correct interface

The core doesn't check any of these. A mistake shows up as SystemVerilog that a linter or
simulator rejects.

1. **Every parameter that changes a signal or a width goes into the parameter set passed to
   `super()`.** That set is the SV type name, and the type name is what `addSubmodule`
   compares when it binds two instances. A parameter left out of it lets two different bundles
   pass as the same type.
2. **Resolve defaults before `super()`, and build signals and modports from the resolved
   values.** Then `new AXI4({})` and `new AXI4({ DATA_WIDTH: 32 })` are the same type with the
   same signals. `Memory` reads `this.params` after `super()`, which guarantees this. `AXI4`
   doesn't: it tests the raw `params.QOS`, so with the default (`withQOS`) the signals have no
   `AWQOS`/`ARQOS`, but the modports list them unconditionally. `new AXI4({}, 'outward')`
   therefore emits a modport that Verilator rejects (`Modport item not found: 'AWQOS'`). Eight
   other hand-written AMBA classes are broken with default parameters too ([#82](https://github.com/TypeScriptSystemVerilog/TSSV/issues/82)).
3. **Modports and signals must agree.** Every modport entry must name a signal in `signals`,
   and a signal missing from a modport isn't reachable through a port of that role. When a
   parameter adds a signal, add it to the modport in the same condition.
4. **Use `outward`/`inward` for the roles.** `outward` is the initiator, `inward` the responder;
   that is what `Memory`, `AXI4` and the role checks in `IpXactComponent` use. The generated
   AMBA5 files (`*_rtl.ts`) use `master`/`slave`, from an older version of the XML tool. Don't
   copy that into new files.
5. **The SV name must be a legal identifier.** Use the spec's name with `-` and `.` replaced by
   `_`: the class `AXI4_Lite` in `AXI4-Lite.ts` passes `'AXI4_Lite'`.
6. **Widths default to 1.** Set `isSigned` on a signal only if the bundle really carries a signed
   value. The emitted declarations are `logic` unless a signal sets `type`.

### Checking a new interface

Emit a module with the interface as a port in each role, with default parameters and with
every parameter that adds signals, and lint the result:

```typescript
import { Module } from 'tssv/lib/core/TSSV'
import { AXI4 } from 'tssv/lib/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4'
import { mkdirSync, writeFileSync } from 'fs'

mkdirSync('sv-examples/AXI4', { recursive: true })
for (const role of ['outward', 'inward'] as const) {
  const m = new Module({ name: `check_AXI4_${role}` })
  m.addInterface('bus', new AXI4({}, role))
  writeFileSync(`sv-examples/AXI4/check_AXI4_${role}.sv`, m.writeSystemVerilog())
}
```

```bash
npx tsc && node out/test/<your test>.js
verilator --lint-only sv-examples/AXI4/check_AXI4_outward.sv
```

On `main` this check reports the `AWQOS`/`ARQOS` errors from rule 2 for `AXI4`, and nothing for
`Memory`. [#82](https://github.com/TypeScriptSystemVerilog/TSSV/issues/82) adds this check for every interface class.

## 2. Where the file goes

**AMBA interfaces** follow the spec's VLNV:

```
ts/src/interfaces/AMBA/<library>/<protocol>/<version>/<protocol>.ts
```

| Part | From the VLNV | Example |
|---|---|---|
| `<library>` | `library` | `AMBA4` |
| `<protocol>` | `name`, spelled exactly as the spec does, hyphens included | `AXI4-Lite` |
| `<version>` | `version` | `r0p0_0` |

So `AXI4-Lite` r0p0_0 is `ts/src/interfaces/AMBA/AMBA4/AXI4-Lite/r0p0_0/AXI4-Lite.ts`, with
class `AXI4_Lite`, and modules import it as
`tssv/lib/interfaces/AMBA/AMBA4/AXI4-Lite/r0p0_0/AXI4-Lite`. A new revision of a protocol is a
new version directory next to the old one (`AMBA3/LPI` has `r2p0_0`, `r2p1_0` and `r3p0_0`).
Files generated from Arm's XML keep the XML's abstraction name, which ends in `_rtl`, for the
file and the class: `AMBA5/CXS/r0p0_0/CXS_rtl.ts` holds `CXS_rtl`.

**Other interfaces** (`Memory`, `TileLink`) are single files directly under
`ts/src/interfaces/`.

`IpXactComponent` maps the bus interfaces in an IP-XACT component file to TSSV classes with a
lookup table, `IpXactComponent.knownInterfaces`. The table is keyed by a path built from the
bus type's VLNV, and its classes come from the re-exports in `ts/src/tools/index.ts`. If
`IpXactComponent` should recognize a new interface, add it to both.

## 3. Generating a draft from XML: `xml_interface_build`

`ts/src/tools/xml_interface_build.ts` reads an IP-XACT **abstraction definition**, an XML file
whose root is `<abstractionDefinition>`, and writes an interface class. Arm publishes these
files for the AMBA protocols. The AMBA5 classes in the repo, the `*_rtl.ts` files, were generated
from them. None of the XML files are in the repo.

```bash
npx tsc
node out/src/tools/xml_interface_build.js <abstraction-definition.xml> [<output.ts>]
```

Without an output path, the file is written next to the XML and named after the definition's
`<name>`, with `-` and `.` replaced by `_`. The class takes the same name.

How the XML maps to the class:

| XML | Generated |
|---|---|
| `vendor`, `library`, `name`, `version` | `static readonly VLNV` |
| Each `<port>`'s `logicalName` (`.` becomes `_`) | A signal |
| `wire/onMaster/width`, else `wire/onSlave/width` | The signal's width |
| No width given | A parameter chosen by the port's qualifier: `isAddress` → `AW`, `isData` → `DW`, `isClock`/`isReset`/`isClockEnable` → `AIW`, anything else → `DIW` |
| `wire/onMaster/direction` | The `outward` modport (`in` → `input`, otherwise `output`) |
| `wire/onSlave/direction` | The `inward` modport |

The output is a draft. Before committing it:

- **Replace the parameters.** Every generated class gets the same four parameters (`AIW`,
  `AW`, `DIW`, `DW`) with defaults 8, 32, 8 and 32, whatever the protocol. Replace them with the
  protocol's real parameters, and give clocks and resets width 1 rather than `AIW`.
- **Make optional signals conditional.** Every port in the XML becomes a signal, including those
  the spec marks optional. Add parameters for them as `AXI4.ts` does, and follow the rules in §1.
- **Move the file** to its AMBA path (§2) and check that its imports resolve.
- **Run `npx eslint --fix`** on it, then `npx eslint .` and the lint check from §1.

The tool also has gaps of its own:

- A definition with a single `<port>` fails with
  `abstractionDefinition.ports?.port.map is not a function`, because the XML parser returns a
  lone element as an object rather than an array.
- It doesn't check its input. A file whose root isn't `<abstractionDefinition>` prints
  `Error mapping AMBA interface from parsed JSON.` and writes nothing.

## Where to go next

| To | Read |
|---|---|
| Use an interface in a module: roles, binding checks, local bundles | [concepts.md §4](../framework/concepts.md#4-interfaces) |
| Look up `Interface` and `addInterface` | [`doc/reference/Base.md`](../reference/Base.md#interface) |
| Wrap an existing SV module described by IP-XACT | [`IpXactComponent-spec.md`](../modules/IpXactComponent/IpXactComponent-spec.md) |
