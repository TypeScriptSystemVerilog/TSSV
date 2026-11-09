[**tssv**](README.md)

***

[tssv](README.md) / Registers

# Registers

## Enumerations

### RegisterType

A register's type: who writes it, who reads it, and the ports it gives the block.
`doc/framework/registers.md` §3 has each type's exact ports and timing.

#### Enumeration Members

##### RO

```ts
RO: "RO";
```

read-only: logic drives it through one input per register (or per field), the host reads it. With `constant: true`, no port: it reads its reset

##### RW

```ts
RW: "RW";
```

read-write: the host writes it, logic reads it through one output per register (or per field)

##### RWU

```ts
RWU: "RWU";
```

read-write with a hardware update: an output, plus `<R>_hw_update` and `<R>_hw_update_val` inputs. Host and logic both write it

##### WO

```ts
WO: "WO";
```

write-only: one output per register (or per field), plus a `<R>_we` pulse. The host can't read it

##### RAM

```ts
RAM: "RAM";
```

a window of `size` words served by an external memory, through an outward `Memory` port `<R>` (`bidi`)

##### ROM

```ts
ROM: "ROM";
```

like `RAM`, with a `rd_only` port: the memory serves reads, and writes are dropped

## Classes

### RegAddr

Hands out consecutive register addresses, one word apart, for an `addrMap`.

```typescript
const addr = new RegAddr(0n, 32)
addr.next() // 0x0
addr.next() // 0x4
```

#### Constructors

##### Constructor

```ts
new RegAddr(start?, wordSize?): RegAddr;
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start?` | `bigint` | the first address; default `0n` |
| `wordSize?` | `32` \| `64` | the word size in bits, which sets the step; default 32 |

###### Returns

[`RegAddr`](#regaddr)

#### Methods

##### next()

```ts
next(): bigint;
```

###### Returns

`bigint`

the next address, starting at `start`, then one word on each call

***

### RegisterBlock

A module holding the registers in a [RegisterBlockDef](#registerblockdef). They are reached through its
`regs` Memory interface, or through an `apb` APB4 interface that an APB_to_Memory
submodule bridges onto `regs`.

`regs` follows the [Memory](Memory.md#memory) contract, which has the timing diagrams. A register access
has no wait states: `READY` stays high, and read data is captured on the clock edge after the
`RE` pulse and held until the next request. An access to a `RAM`/`ROM` window goes out on the
window's own outward `Memory` port and completes when the memory behind it raises `READY`.
It adds one wait state for each of the window's `registerRequest` and `registerResponse` flops
that is on (both are by default). `doc/framework/registers.md` §3 has the port list of every
register type.

#### Extends

- [`Module`](Base.md#module)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `bigint`\> |

#### Constructors

##### Constructor

```ts
new RegisterBlock<T>(
   params, 
   regDefs, 
   busInterface
): RegisterBlock<T>;
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`RegisterBlockParameters`](#registerblockparameters) | the parameters. Without a `name`, the derived name holds the bus address width, the bus, the endianness and a hash of the register map |
| `regDefs` | [`RegisterBlockDef`](#registerblockdef)\<`T`\> | the register map |
| `busInterface` | [`Interface`](Base.md#interface) | picks the bus, and only that: a `Memory` gives the block a `regs` Memory port, an `APB4` an `apb` port bridged onto `regs` by an `APB_to_Memory` submodule. The instance's own parameters are ignored; the port is built from `wordSize` and `busAddressWidth` |

###### Returns

[`RegisterBlock`](#registerblock)\<`T`\>

###### Throws

`Unsupported interface` for a bus that is neither a `Memory` nor an `APB4`

###### Throws

`RegisterBlock: params.busInterface is ...` if `params.busInterface` disagrees with `busInterface`

###### Throws

`<R>: constant is only allowed on RO, ...`, `<R>: registerRequest and registerResponse
are only allowed on RAM and ROM, ...`, or `<R>: a <type> window's width must be the wordSize, ...`
for an option on the wrong register type

###### Throws

`<R>: address ... doesn't fit in the <n>-bit bus address`, `<R>: size must be at least 1, ...`,
or `<R>: window ... doesn't fit in the <n>-bit bus address` for an address out of range

###### Throws

`<R>.<F>: bitRange [<hi>, <lo>] must be [msb, lsb]`, `<R>.<F>: bit <hi> is past the
<n>-bit word`, or `<R>.<F>: bits [<hi>:<lo>] overlap <R>.<G>` for a bad field

###### Throws

`<R>: reset ... doesn't fit in <n> bits` (or `<R>.<F>: ...`) for a reset value too wide

###### Overrides

[`Module`](Base.md#module).[`constructor`](Base.md#constructor-3)

#### Properties

| Property | Type | Description | Overrides |
| ------ | ------ | ------ | ------ |
| <a id="params"></a> `params` | [`RegisterBlockParameters`](#registerblockparameters) | the module's parameters, as passed to the constructor, with `name` set to the module name | [`Module`](Base.md#module).[`params`](Base.md#params-2) |
| <a id="regdefs"></a> `regDefs` | [`RegisterBlockDef`](#registerblockdef)\<`T`\> | the register map the block was built from | - |

#### Methods

##### writeRALF()

```ts
writeRALF(): string;
```

The register map in RALF, the register description format Synopsys' `ralgen` reads to
build a UVM register model: one `register` per register in `addrMap` that has a definition, at its address,
with its fields, reset values and access (`ro` for `RO`/`ROM`, `wo` for `WO`, `rw` otherwise).

###### Returns

`string`

the RALF `block`

##### formatParametersForComment()

```ts
protected formatParametersForComment(params?, opts?): string;
```

The parameter comment, with the register map given only as its register count and its hash,
the same hash a derived module name holds: the map is the whole block.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`TSSVParameters`](Base.md#tssvparameters) | the parameters to list |
| `opts?` | \{ `prefix?`: `string`; `skipName?`: `boolean`; \} | as for [Module.formatParametersForComment](Base.md#formatparametersforcomment) |
| `opts.prefix?` | `string` | - |
| `opts.skipName?` | `boolean` | - |

###### Returns

`string`

one `// key = value` line per parameter

###### Overrides

[`Module`](Base.md#module).[`formatParametersForComment`](Base.md#formatparametersforcomment)

## Interfaces

### Field

A field of a [Register](#register): its bits within the register, and its reset value

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="reset"></a> `reset?` | `bigint` | the field's reset value; default `0n` |
| <a id="description"></a> `description?` | `string` | free text, for the YAML-generated JSDoc; not in the SV or RALF |
| <a id="bitrange"></a> `bitRange` | \[ \| `0` \| `1` \| `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` \| `11` \| `12` \| `13` \| `14` \| `15` \| `16` \| `17` \| `18` \| `19` \| `20` \| `21` \| `22` \| `23` \| `24` \| `25` \| `26` \| `27` \| `28` \| `29` \| `30` \| `31` \| `32` \| `33` \| `34` \| `35` \| `36` \| `37` \| `38` \| `39` \| `40` \| `41` \| `42` \| `43` \| `44` \| `45` \| `46` \| `47` \| `48` \| `49` \| `50` \| `51` \| `52` \| `53` \| `54` \| `55` \| `56` \| `57` \| `58` \| `59` \| `60` \| `61` \| `62` \| `63`, \| `0` \| `1` \| `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` \| `11` \| `12` \| `13` \| `14` \| `15` \| `16` \| `17` \| `18` \| `19` \| `20` \| `21` \| `22` \| `23` \| `24` \| `25` \| `26` \| `27` \| `28` \| `29` \| `30` \| `31` \| `32` \| `33` \| `34` \| `35` \| `36` \| `37` \| `38` \| `39` \| `40` \| `41` \| `42` \| `43` \| `44` \| `45` \| `46` \| `47` \| `48` \| `49` \| `50` \| `51` \| `52` \| `53` \| `54` \| `55` \| `56` \| `57` \| `58` \| `59` \| `60` \| `61` \| `62` \| `63`\] | the field's bits in the register, `[msb, lsb]`. Fields can't overlap |
| <a id="issigned"></a> `isSigned?` | `boolean` | declares the field's port `signed` |

***

### Register

A register of a [RegisterBlockDef](#registerblockdef): its type, width, reset value and fields

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="type"></a> `type` | [`RegisterType`](#registertype) | the register's type |
| <a id="reset-1"></a> `reset?` | `bigint` | the reset value; default `0n`. Used by `RW` without fields, `RWU`, and a constant `RO` |
| <a id="description-1"></a> `description?` | `string` | free text, for the YAML-generated JSDoc; not in the SV or RALF |
| <a id="size"></a> `size?` | `bigint` | `RAM`/`ROM` only: the window's size in words, at least 1 |
| <a id="width"></a> `width?` | \| `2` \| `1` \| `3` \| `4` \| `8` \| `16` \| `32` \| `64` \| `5` \| `6` \| `10` \| `7` \| `12` \| `11` \| `14` \| `9` \| `13` \| `15` \| `17` \| `18` \| `19` \| `20` \| `21` \| `22` \| `23` \| `24` \| `25` \| `30` \| `36` \| `26` \| `27` \| `28` \| `29` \| `31` \| `33` \| `34` \| `35` \| `37` \| `38` \| `39` \| `40` \| `41` \| `42` \| `43` \| `44` \| `45` \| `46` \| `47` \| `48` \| `49` \| `50` \| `51` \| `52` \| `53` \| `54` \| `55` \| `56` \| `57` \| `58` \| `59` \| `60` \| `61` \| `62` \| `63` | the width in bits; default the block's `wordSize`. A `RAM`/`ROM` window's must be `wordSize` |
| <a id="issigned-1"></a> `isSigned?` | `boolean` | declares the register's port `signed` |
| <a id="fields"></a> `fields?` | `Record`\<`string`, [`Field`](#field)\> | named bit fields, each with its own port and reset; used by `RW` and in RALF |
| <a id="updatepriority"></a> `updatePriority?` | `"hw"` \| `"sw"` | RWU only: which update source wins when both assert in the same cycle. Default 'hw'. With 'hw', the hardware update sets the whole register. With 'sw', the software write sets the bytes whose `WSTRB` bit is set, and the hardware update sets the others. |
| <a id="constant"></a> `constant?` | `boolean` | RO only: no input port; the register reads its `reset`, or each field's `reset`. |
| <a id="registerrequest"></a> `registerRequest?` | `boolean` | RAM/ROM only: drive the window's request from flops. Default true. |
| <a id="registerresponse"></a> `registerResponse?` | `boolean` | RAM/ROM only: return the window's response through flops. Default true. |

***

### RegisterBlockDef

The register map of a [RegisterBlock](#registerblock). `doc/framework/registers.md` §2 has an example;
`scripts/gen_regblock.sh` writes one from a YAML register map.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `bigint`\> |

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="wordsize"></a> `wordSize` | `32` \| `64` | the bus data width, and the default register width |
| <a id="addrmap"></a> `addrMap` | `T` | every register and its absolute byte address, `{ REG_NAME: 0x0n, ... }`. Declare it `as const` and pass `typeof addrMap` as `T`, so `registers` only takes names from the map |
| <a id="baseaddress"></a> `baseAddress?` | `bigint` | accepted but not used: the addresses in `addrMap` are absolute |
| <a id="registers"></a> `registers` | \{ \[name in string \| number \| symbol\]?: Register \} | each register's definition. A register in `addrMap` without one is a full-width `RW` register with reset `0` |

***

### RegisterBlockParameters

The parameters of a [RegisterBlock](#registerblock)

#### Extends

- [`TSSVParameters`](Base.md#tssvparameters)

#### Indexable

```ts
[name: string]: ParameterValue | undefined
```

#### Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="name"></a> `name?` | `string` | the SystemVerilog module name. Without it, the name is derived from the class name and the other parameters' values (`doc/framework/concepts.md` §2); the constructor then sets it | [`TSSVParameters`](Base.md#tssvparameters).[`name`](Base.md#name) |
| <a id="businterface"></a> `busInterface?` | `"Memory"` \| `"TL_UL"` \| `"APB"` | the bus type. The bus interface argument picks it; if this is set, it must agree | - |
| <a id="endianess"></a> `endianess?` | `"little"` | the byte order; only `'little'`, the default. It appears only in the parameter comment and the name | - |
| <a id="busidwidth"></a> `busIDWidth?` | `8` | accepted but not used | - |
| <a id="busaddresswidth"></a> `busAddressWidth?` | `32` | the bus address width; default 32 | - |
