[**tssv**](README.md)

***

[tssv](README.md) / Registers

# Registers

## Enumerations

### RegisterType

#### Enumeration Members

##### RO

```ts
RO: "RO";
```

##### RW

```ts
RW: "RW";
```

##### RWU

```ts
RWU: "RWU";
```

##### WO

```ts
WO: "WO";
```

##### RAM

```ts
RAM: "RAM";
```

##### ROM

```ts
ROM: "ROM";
```

## Classes

### RegAddr

#### Constructors

##### Constructor

```ts
new RegAddr(start?, wordSize?): RegAddr;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `start?` | `bigint` |
| `wordSize?` | `32` \| `64` |

###### Returns

[`RegAddr`](#regaddr)

#### Methods

##### next()

```ts
next(): bigint;
```

###### Returns

`bigint`

***

### RegisterBlock

A module holding the registers in a [RegisterBlockDef](#registerblockdef). They are reached through its
`regs` Memory interface, or through an `apb` APB4 interface that an APB_to_Memory
submodule bridges onto `regs`.

`regs` follows the [Memory](Memory.md#memory) contract, which has the timing diagrams. A register access
has no wait states: `READY` stays high, and read data is captured on the clock edge after the
`RE` pulse and held until the next request. A `RAM`/`ROM` window drives `READY` and `DATA_RD`
itself after an access to it.

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

| Parameter | Type |
| ------ | ------ |
| `params` | [`RegisterBlockParameters`](#registerblockparameters) |
| `regDefs` | [`RegisterBlockDef`](#registerblockdef)\<`T`\> |
| `busInterface` | [`Interface`](Base.md#interface) |

###### Returns

[`RegisterBlock`](#registerblock)\<`T`\>

###### Overrides

[`Module`](Base.md#module).[`constructor`](Base.md#constructor-3)

#### Properties

| Property | Type | Overrides |
| ------ | ------ | ------ |
| <a id="params"></a> `params` | [`RegisterBlockParameters`](#registerblockparameters) | [`Module`](Base.md#module).[`params`](Base.md#params-2) |
| <a id="regdefs"></a> `regDefs` | [`RegisterBlockDef`](#registerblockdef)\<`T`\> | - |

#### Methods

##### writeRALF()

```ts
writeRALF(): string;
```

###### Returns

`string`

## Interfaces

### Field

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="reset"></a> `reset?` | `bigint` |
| <a id="description"></a> `description?` | `string` |
| <a id="bitrange"></a> `bitRange` | \[ \| `0` \| `1` \| `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` \| `11` \| `12` \| `13` \| `14` \| `15` \| `16` \| `17` \| `18` \| `19` \| `20` \| `21` \| `22` \| `23` \| `24` \| `25` \| `26` \| `27` \| `28` \| `29` \| `30` \| `31` \| `32` \| `33` \| `34` \| `35` \| `36` \| `37` \| `38` \| `39` \| `40` \| `41` \| `42` \| `43` \| `44` \| `45` \| `46` \| `47` \| `48` \| `49` \| `50` \| `51` \| `52` \| `53` \| `54` \| `55` \| `56` \| `57` \| `58` \| `59` \| `60` \| `61` \| `62` \| `63`, \| `0` \| `1` \| `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` \| `11` \| `12` \| `13` \| `14` \| `15` \| `16` \| `17` \| `18` \| `19` \| `20` \| `21` \| `22` \| `23` \| `24` \| `25` \| `26` \| `27` \| `28` \| `29` \| `30` \| `31` \| `32` \| `33` \| `34` \| `35` \| `36` \| `37` \| `38` \| `39` \| `40` \| `41` \| `42` \| `43` \| `44` \| `45` \| `46` \| `47` \| `48` \| `49` \| `50` \| `51` \| `52` \| `53` \| `54` \| `55` \| `56` \| `57` \| `58` \| `59` \| `60` \| `61` \| `62` \| `63`\] |
| <a id="issigned"></a> `isSigned?` | `boolean` |

***

### Register

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="type"></a> `type` | [`RegisterType`](#registertype) | - |
| <a id="reset-1"></a> `reset?` | `bigint` | - |
| <a id="description-1"></a> `description?` | `string` | - |
| <a id="size"></a> `size?` | `bigint` | - |
| <a id="width"></a> `width?` | \| `2` \| `1` \| `3` \| `4` \| `8` \| `16` \| `32` \| `64` \| `5` \| `6` \| `10` \| `7` \| `12` \| `11` \| `14` \| `9` \| `13` \| `15` \| `17` \| `18` \| `19` \| `20` \| `21` \| `22` \| `23` \| `24` \| `25` \| `30` \| `36` \| `26` \| `27` \| `28` \| `29` \| `31` \| `33` \| `34` \| `35` \| `37` \| `38` \| `39` \| `40` \| `41` \| `42` \| `43` \| `44` \| `45` \| `46` \| `47` \| `48` \| `49` \| `50` \| `51` \| `52` \| `53` \| `54` \| `55` \| `56` \| `57` \| `58` \| `59` \| `60` \| `61` \| `62` \| `63` | - |
| <a id="issigned-1"></a> `isSigned?` | `boolean` | - |
| <a id="fields"></a> `fields?` | `Record`\<`string`, [`Field`](#field)\> | - |
| <a id="updatepriority"></a> `updatePriority?` | `"hw"` \| `"sw"` | RWU only: which update source wins when both assert in the same cycle. Default 'hw'. |

***

### RegisterBlockDef

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `bigint`\> |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="wordsize"></a> `wordSize` | `32` \| `64` |
| <a id="addrmap"></a> `addrMap` | `T` |
| <a id="baseaddress"></a> `baseAddress?` | `bigint` |
| <a id="registers"></a> `registers` | \{ \[name in string \| number \| symbol\]?: Register \} |

***

### RegisterBlockParameters

#### Extends

- [`TSSVParameters`](Base.md#tssvparameters)

#### Indexable

```ts
[name: string]: ParameterValue | undefined
```

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="name"></a> `name?` | `string` | [`TSSVParameters`](Base.md#tssvparameters).[`name`](Base.md#name) |
| <a id="businterface"></a> `busInterface?` | `"Memory"` \| `"TL_UL"` \| `"APB"` | - |
| <a id="endianess"></a> `endianess?` | `"little"` | - |
| <a id="busidwidth"></a> `busIDWidth?` | `8` | - |
| <a id="busaddresswidth"></a> `busAddressWidth?` | `32` | - |
