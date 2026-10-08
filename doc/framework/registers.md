# Register blocks: `RegisterBlock`, YAML and RALF

`RegisterBlock` (`ts/src/core/Registers.ts`) generates a memory-mapped register block. You give
it a register map; it builds a module with a bus port on one side and one port per register on
the other. It contains the address decoder, the register flops and the read multiplexer. The
same definition also produces a RALF description for UVM register models.

This guide covers defining a block by hand or from YAML, what the generated module contains,
and the RALF output. Signatures are in [`doc/reference/Registers.md`](../reference/Registers.md).
The FIR module is a worked example that uses a block: [FIR tutorial, Part 4](../tutorials/fir.md#part-4--parameterized-register-block-via-repeatedregister-yaml).

> **Read "Current limitations" before relying on RO, WO, RAM or ROM registers, or on write
> strobes.** The generated logic has gaps that the earlier docs didn't mention. The
> register-type table below describes what the code emits today, not what the type names
> suggest.

`RegisterBlock` is unrelated to `Module.addRegister()`, which adds a single flop to any module
(see [concepts.md §6](concepts.md#6-registers-how-addregister-builds-always_ff-blocks)).

## 1. Defining a block

A block is defined by a [`RegisterBlockDef`](../reference/Registers.md#registerblockdef):

```typescript
import { type RegisterBlockDef, RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'

const myRegMap = {
  REG0: BigInt('0x00000000'),
  REG1: BigInt('0x00000004'),
  REG2: BigInt('0x00000008')
} as const

const myRegs: RegisterBlockDef<typeof myRegMap> = {
  wordSize: 32,
  addrMap: myRegMap,
  registers: {
    REG0: { type: RegisterType.RW, reset: 0n, description: 'Register 0' },
    REG1: { type: RegisterType.RO, width: 16, isSigned: true, description: 'Register 1' },
    REG2: {
      type: RegisterType.RW,
      fields: {
        REG2_field0: { bitRange: [15, 0], reset: BigInt('0x10') },
        REG2_field1: { bitRange: [31, 16], reset: BigInt('0x20') }
      }
    }
  }
}

const block = new RegisterBlock<typeof myRegMap>(
  { name: 'testRegBlock', busAddressWidth: 32 },
  myRegs,
  new Memory()
)
```

(From `ts/test/testRegisters.ts`.)

- **`addrMap`** lists every register and its byte address. Declare it `as const` and pass
  `typeof addrMap` as the type parameter, so `registers` only accepts names from the map.
- **`registers`** describes each register. An entry is optional: a register in `addrMap` with
  no entry here becomes a full-width `RW` register with reset `0`.
- **`wordSize`** is `32` or `64`; it is the bus data width and the default register width.
- **`baseAddress`** is accepted but not used. Addresses in `addrMap` are absolute.

Each register entry has these fields:

| Field | Meaning |
|---|---|
| `type` | A [`RegisterType`](../reference/Registers.md#registertype): `RW`, `RWU`, `RO`, `WO`, `RAM` or `ROM` (§3) |
| `reset` | Reset value (bigint); default `0n`. Used by `RW` without fields and by `RWU` |
| `width` | Bit width, 1–64; default `wordSize` |
| `isSigned` | Declares the register's port `signed` |
| `fields` | Named bit fields, `{ bitRange: [msb, lsb], reset?, description?, isSigned? }`; used by `RW` and in RALF |
| `size` | `RAM`/`ROM` only: the window size in words |
| `updatePriority` | `RWU` only: `'hw'` (default) or `'sw'`, which update wins when both happen in one cycle |
| `description` | Free text; appears in the YAML-generated JSDoc, not in the SV or RALF |

[`RegAddr`](../reference/Registers.md#regaddr) hands out consecutive addresses if you'd rather
not write them: `const a = new RegAddr(0n, 32)`, then `a.next()` returns `0x0`, `0x4`,
`0x8`, ….

### The constructor

`new RegisterBlock(params, regDefs, busInterface)`:

- **`params.name`**: always set it. The module name is derived from `params` alone, which
  don't include the register map, so two unnamed blocks get the same name and only the first
  one's definition is emitted (see [concepts.md §2](concepts.md#2-parameters-and-the-module-name)).
- **`params.busAddressWidth`**: the bus address width (default 32).
- **`busInterface`**: an instance that only selects the bus type. A `Memory` gives the block a
  `Memory` port; an `APB4` gives it an `APB4` port and an `APB_to_Memory` bridge inside. Any
  other interface throws `Unsupported interface`. The instance's own parameters are ignored:
  the port is built from `wordSize` and `busAddressWidth`.
- `params.busInterface` and `params.endianess` only appear in the parameter comment and the
  module name. The third argument picks the bus.

## 2. The generated module

Every block has these ports. The register ports from §3 go between `rst_b` and the bus port:

| Port | Kind |
|---|---|
| `clk` | input, rising edge |
| `rst_b` | input, active-low asynchronous reset |
| `regs` | `memory_<DATA>_<ADDR>.inward`, with a `Memory` bus |
| `apb` | `APB4_….inward`, with an `APB4` bus; `regs` is then an internal bundle driven by an `APB_to_Memory` instance ([spec](../modules/APB_to_Memory/APB_to_Memory-spec.md)) |

Inside, the block has three parts:

- **An address decoder**: each register gets `<R>_matchExpr`, which compares all of `regs.ADDR`
  with the register's address as a `busAddressWidth`-bit literal (`regs.ADDR == 32'h100`). A
  `RAM` or `ROM` with a `size` matches the window `[address, address + size × wordSize/8)`
  instead. `<R>_matchExpr` is combined with `regs.WE`/`regs.RE` into `<R>_WE`/`<R>_RE`, so
  reads and writes decode the same addresses. An address or window that doesn't fit in
  `busAddressWidth` bits throws when the block is constructed.
- **The register state**: flops built with `addRegister`, all on `clk`/`rst_b`, or a
  hand-written `always_ff` for `RWU`.
- **The read multiplexer**: an `always_comb` block named `read_mux`. It sets `regs.DATA_RD` to 0
  and `regs.READY` to 1, then, in `addrMap` order, the first register whose `<R>_RE` is high
  drives `regs.DATA_RD` with its read-back value (§3), zero-extended to the word. A `RAM` or
  `ROM` also drives `regs.READY` from its `<R>_ready`. A read of a `WO` register or of an
  address no register decodes returns 0.

The bus side is the `Memory` interface (`ts/src/interfaces/Memory.ts`): `ADDR`, `DATA_WR`,
`DATA_RD`, `WE`, `RE`, `READY`, `WSTRB`. The JSDoc above `RegisterBlock` holds two WaveDrom
diagrams, which [`doc/reference/Registers.md`](../reference/Registers.md#registerblock) renders:

![Write on `regs`](../reference/RegisterBlock-write-on-regs.svg)

![Read on `regs`](../reference/RegisterBlock-read-on-regs.svg)

They show the intended handshake:

- **Write**: `ADDR`, `DATA_WR` and `WE` go out together. `READY` drops while the write is taken
  and rises again when it is done.
- **Read**: `ADDR` and `RE` go out together. `READY` drops, then rises with `DATA_RD` valid,
  possibly several cycles later.

As generated, `READY` is high except during a `RAM` or `ROM` read, when it follows that
register's `<R>_ready`. Writes, and reads of the other types, finish in the cycle they are
issued: `DATA_RD` is valid combinationally while `RE` is high.

## 3. Register types

`<R>` is the register's name from `addrMap`. This table describes the ports and logic the
current code generates.

| Type | Ports created | Write | Read-back | RALF access |
|---|---|---|---|---|
| `RW`, no fields | output `<R>` | Flop loads all of `regs.DATA_WR` when `<R>_WE`; `WSTRB` isn't applied | `<R>` | `rw` |
| `RW`, with fields | output `<R>_field<i>` per field, numbered in declaration order | Each field's flop loads `regs.DATA_WR[msb:lsb]` when `<R>_WE` and any `WSTRB` bit is set; reset from the field | Each field at its `bitRange`, other bits 0. A reversed range, a bit past the word or two overlapping fields throws | `rw` |
| `RWU` | output `<R>`; inputs `<R>_hw_update`, `<R>_hw_update_val` | Software write on `<R>_WE`, hardware update on `<R>_hw_update`; `updatePriority` picks the winner when both are high | `<R>` | `rw` |
| `RO` | output `<R>` | None | `<R>`, but nothing drives the output (§5) | `ro` |
| `WO` | output `<R>` | `<R>` is assigned `regs.DATA_WR` continuously, whatever the address (§5) | None: reads 0 | `wo` |
| `RAM` | outputs `<R>_rdata`, `_re`, `_we`, `_wdata`, `_wstrb`, `_ready` | On `<R>_WE`, registers `DATA_WR`, the strobes and the enables onto those outputs | `<R>_wdata` (the last write) | `rw` |
| `ROM` | outputs `<R>_rdata`, `_re`, `_ready` | None; `_ready` registers `regs.READY` on any bus write | `<R>_rdata`, which nothing drives (§5) | `ro` |

`RWU` is for status registers that hardware updates and software can also write (for example
to clear them). `ts/test/test_RWU.ts` generates one block of each priority.

## 4. From YAML: `scripts/gen_regblock.sh`

For a fixed register map, describe it in YAML and generate the TypeScript:

```bash
./scripts/gen_regblock.sh path/to/my_regs.yaml
# wrote path/to/regs-my_regs.ts
```

The script writes `regs-<yaml-basename>.ts` next to the YAML file, marked autogenerated. Commit
it with the YAML, as `ts/src/modules/FIR/regs-fir_coeffs.ts` is. Rerun the script after every
YAML edit, never edit the output by hand. The script needs `node` and `js-yaml`. `js-yaml`
isn't a declared dependency of TSSV: it is in `node_modules` because ESLint depends on it.

The YAML has one of two shapes.

### A fixed map: `registers:`

`scripts/example_regblock.yaml` is the reference:

```yaml
name: myRegs
wordSize: 32
busInterface: Memory      # Memory | TL_UL
busAddressWidth: 32

registers:
  CTRL:
    address: "0x000"
    type: RW
    reset: "0x00000000"
    description: Control register
    fields:
      ENABLE:  { bits: "0:0",  reset: "0x0", description: Enable }
      MODE:    { bits: "3:1",  reset: "0x0", description: Mode select }

  STATUS:
    address: "0x004"
    type: RO
    description: Status register
```

| Key | Meaning |
|---|---|
| `name` | Prefix for the generated names; default `regBlock` |
| `wordSize` | `32` (default) or `64` |
| `busInterface` | `Memory` (default). `TL_UL` is listed but doesn't work (§5) |
| `busAddressWidth` | Default 32 |
| `registers.<R>.address` | Byte address, as a string (`"0x004"`) |
| `registers.<R>.type` | `RW` (default), `RWU`, `RO`, `WO`, `RAM` or `ROM` |
| `registers.<R>.reset` | Reset value; negative values are allowed. Dropped for `RAM`/`ROM` |
| `registers.<R>.width` | Written out only when it differs from `wordSize`; dropped for `RAM`/`ROM` |
| `registers.<R>.isSigned`, `.description` | As in `RegisterBlockDef` |
| `registers.<R>.size` | `RAM`/`ROM` only |
| `registers.<R>.fields.<F>` | `bits: "msb:lsb"` (or `bitRange: [msb, lsb]`), optional `reset` and `description` |

The output exports three things: `<name>AddrMap` (the `as const` map), `<name>Def` (the
`RegisterBlockDef`), and `<name>`, a ready-made `RegisterBlock` on a `Memory` bus. Above them a
JSDoc comment holds a markdown table of the registers and one of each register's fields.

### A repeated register: `repeatedRegister:`

Use this when the register count is a module parameter, like FIR's one coefficient per tap.
The script then generates a factory function instead of constants:

```yaml
name: firCoeffs
wordSize: 32
busInterface: Memory
busAddressWidth: 32
repeatedRegister:
  namePrefix: COEFF_
  countParam: numTaps
  widthParam: coefficientsWidth
  addressStride: 4
  type: RW
  isSigned: true
  description: "FIR tap {i} coefficient"
```

(`ts/src/modules/FIR/fir_coeffs.yaml`.) It generates
`createFirCoeffsDef(numTaps: number, coefficientsWidth: IntRange<1, 64> = 32, resetValues?: bigint[])`,
which returns `{ addrMap, def }`:

| Key | Meaning |
|---|---|
| `namePrefix` | Register names are the prefix plus the index (`COEFF_0`, `COEFF_1`, …); default `REG_` |
| `countParam` | Name of the factory's first argument, the register count; default `count` |
| `widthParam` | Optional. Makes the register width the factory's second argument (default `wordSize`). Without it the width is fixed at `width` |
| `width` | Fixed register width when there's no `widthParam`; default `wordSize` |
| `addressStride` | Bytes between registers, starting at address 0; default `wordSize / 8` |
| `type`, `isSigned` | Applied to every register; default `RW`, unsigned |
| `description` | `{i}` is replaced by the index |

Register `i` resets to `resetValues[i]`, default `0n`. FIR builds its block from the factory:

```typescript
const { def: coeffDef } = createFirCoeffsDef(numTaps, this.params.coefficientsWidth, this.params.coefficients)
const coeffRegBlock = new RegisterBlock<Record<string, bigint>>(
  { name: `${String(params.name ?? 'fir')}_coeffRegs`, busAddressWidth: 32 },
  coeffDef,
  new Memory()
)
this.addSubmodule('coeff_block', coeffRegBlock, coeffBindings, true, true)
```

(From `ts/src/modules/FIR/FIR.ts`.) Note the
`createMissing` (last `true`). It binds the block's `regs` bus to a new **internal** bundle in
FIR, not to a FIR port (see [concepts.md §5](concepts.md#5-submodules)), contrary to FIR's spec
([#83](https://github.com/TypeScriptSystemVerilog/TSSV/issues/83)). To reach a block's bus
from outside, give the parent a port of the same interface type and bind `regs` to it.

## 5. Current limitations

These are properties of the code on `main`. Check them before you depend on a block. Each one
links to the bug that tracks it: [#80](https://github.com/TypeScriptSystemVerilog/TSSV/issues/80) (register-type ports), [#81](https://github.com/TypeScriptSystemVerilog/TSSV/issues/81)
(write strobes) and [#86](https://github.com/TypeScriptSystemVerilog/TSSV/issues/86) (`TL_UL`).

- **`RO` and `ROM` data has no input.** `RO`'s `<R>` and `ROM`'s `<R>_rdata` are output ports
  that nothing inside the block drives, so the logic that should supply the value can't. `ROM`'s
  `<R>_re` is undriven too. `RO` ignores `reset` and `fields`. ([#80](https://github.com/TypeScriptSystemVerilog/TSSV/issues/80))
- **`WO` outputs aren't registered or qualified.** `<R>` follows `regs.DATA_WR` on every cycle.
  `<R>_WE` is computed but not exported. ([#80](https://github.com/TypeScriptSystemVerilog/TSSV/issues/80))
- **`RAM` is incomplete.** Its outputs only update on a write. No address output exists:
  `<R>_ADDR` is internal. A read returns the last written value, and `<R>_wstrb` is as wide
  as the register and always written as `1`. ([#80](https://github.com/TypeScriptSystemVerilog/TSSV/issues/80))
- **`WSTRB` is only partly applied.** A field register's enable treats `WSTRB` as one bit (any
  strobe set). A register without fields ignores it. The strobe signals are sized from
  `busAddressWidth`, not from the data width. ([#81](https://github.com/TypeScriptSystemVerilog/TSSV/issues/81))
- **`TL_UL` in YAML doesn't work** ([#86](https://github.com/TypeScriptSystemVerilog/TSSV/issues/86)). The generated file imports `TL_UL` from
  `tssv/lib/interfaces/AMBA/TL_UL`, which doesn't exist (the class is in
  `ts/src/interfaces/TileLink.ts`), and `RegisterBlock` accepts only `Memory` and `APB4`. For an APB block, generate with `Memory` and pass an `APB4` instance in
  your own code, as `ts/test/test_APB_Registers.ts` does.

## 6. RALF output: `writeRALF()`

[`writeRALF()`](../reference/Registers.md#writeralf) returns the block as a RALF (Synopsys
Register Abstraction Layer File) string, which UVM register-model generators read. Writing it
to a file is up to you:

```typescript
writeFileSync('sv-examples/test_writeRALF/MyRegBlock.ralf', block.writeRALF())
```

For a block with a fielded `RW` register `CTRL` and a plain `RO` register `STATUS`
(`ts/test/test_writeRALF.ts`), it produces:

```text
block MyRegBlock {
    bytes 4;
    register CTRL @0x4 {
        field enable {
            bits 1;
            reset 0x0;
            access rw;
        }
        field mode @ 1 {
            bits 2;
            reset 0x0;
            access rw;
        }
        field divisor @ 8 {
            bits 8;
            reset 0x1;
            access rw;
        }
    }
    register STATUS @0x8 {
        field status {
            bits 32;
            reset 0x0;
            access ro;
        }
    }
}
```

How a definition maps to RALF:

- `block` takes the module name; `bytes` is `wordSize / 8`.
- One `register` per `addrMap` entry **that has an entry in `registers`**. A register left at
  the default RW is in the SV but not in the RALF.
- A register with `fields` gets one `field` per field, with `@ <lsb>` when the LSB isn't 0, its
  width and reset. Field positions here are the declared ones, unlike the SV read-back (§5).
- A register without fields gets one field, named after the register in lower case, with the
  register's width and reset.
- `access` comes from the type: `RO` and `ROM` give `ro`, `WO` gives `wo`, everything else
  `rw`. `RAM`/`ROM` windows appear as a single register; `size` isn't represented.

## Where to go next

| To | Read |
|---|---|
| Look up `RegisterBlock`, `RegisterBlockDef` and `writeRALF` signatures | [`doc/reference/Registers.md`](../reference/Registers.md) |
| See a block used inside a module | [FIR tutorial, Part 4](../tutorials/fir.md#part-4--parameterized-register-block-via-repeatedregister-yaml) |
| Understand naming, binding and `createMissing` | [concepts.md](concepts.md) |
| Test a block in simulation | `ts/test/testRegisters.ts` (Memory bus), `ts/test/test_APB_Registers.ts` (APB) |
