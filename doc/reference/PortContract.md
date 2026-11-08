[**tssv**](README.md)

***

[tssv](README.md) / PortContract

# PortContract

Port contracts: promises a module makes about the paths between its own ports, checked on the
SV it generates (doc/framework/concepts.md, "Port contracts").

The one promise today is "no combinational path from input `from` to output `to`", declared
with `Module.addNoCombinationalPathContract()`. Verilator can't report a path from an input to
an output, but it does report a combinational loop (UNOPTFLAT). So for each contract a wrapper
instantiates the module and ties `to` back into `from`, and any path through the module becomes
a loop. `writeSystemVerilogFiles()` writes the wrappers into `<module>.contracts.json`, and
`scripts/check-port-contracts.mjs` lints them.

## Interfaces

### PortSignal

One bit-level view of a port: a plain port, or one signal of an interface port

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="name"></a> `name` | `string` | the plain port's name, or the interface signal's name |
| <a id="direction"></a> `direction` | `"input"` \| `"output"` \| `"inout"` | the direction the module sees it in |
| <a id="width"></a> `width` | `number` | the width in bits |
| <a id="issigned"></a> `isSigned` | `boolean` | whether it is declared `signed` |

***

### ModulePorts

A module's ports as seen from outside: its plain ports, in declaration order, then each
interface port with the signals of its modport, in the modport's order.

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="plain"></a> `plain` | [`PortSignal`](#portsignal)[] | the plain ports, in declaration order |
| <a id="interfaces"></a> `interfaces` | `object`[] | the interface ports: each one's name, SV type and modport signals |

***

### PortContract

A promise that the module has no combinational path from input bit `from` to output bit `to`.
Each endpoint names one bit: a one-bit port (`ready`), a one-bit signal of an interface port
(`out.ready`), or one bit of a wider one (`ready_bus[2]`, `out.ready_bus[2]`).

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="from"></a> `from` | `string` | one bit of an input |
| <a id="to"></a> `to` | `string` | one bit of an output |

***

### Endpoint

An endpoint resolved against the module's ports

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="port"></a> `port` | `string` | the plain port, or the interface port |
| <a id="signal"></a> `signal?` | `string` | the interface signal, for an endpoint on an interface port |
| <a id="bit"></a> `bit?` | `number` | the bit, for an endpoint on a signal wider than one bit |
| <a id="width-1"></a> `width` | `number` | the width of the port or signal the endpoint is a bit of |

***

### ContractManifest

What writeSystemVerilogFiles() writes to `<module>.contracts.json`, for
scripts/check-port-contracts.mjs: the wrapper left open, and one closed wrapper per contract.
Each `sv` is the whole file, which includes `<module>.sv` under `USE_INCLUDES`.

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="module"></a> `module` | `string` | the module's name |
| <a id="open"></a> `open` | `object` | every port brought out, nothing closed: a loop here is the module's own |
| `open.top` | `string` | the wrapper's module name |
| `open.sv` | `string` | the wrapper's file |
| <a id="contracts"></a> `contracts` | `object`[] | one wrapper per contract, in the order declared, with that contract's loop closed |

## Functions

### contractText()

```ts
function contractText(c): string;
```

A contract as a failure names it: `no combinational path from <from> to <to>`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `c` | [`PortContract`](#portcontract) |

#### Returns

`string`

***

### resolveContract()

```ts
function resolveContract(
   module, 
   ports, 
   c
): object;
```

Checks contract `c` against the module's ports, and returns its two endpoints. Throws, naming
the module and the contract, if `from` isn't one bit of an input or `to` one bit of an output.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `module` | `string` |
| `ports` | [`ModulePorts`](#moduleports) |
| `c` | [`PortContract`](#portcontract) |

#### Returns

| Name | Type | Description |
| ------ | ------ | ------ |
| `from` | [`Endpoint`](#endpoint) | the input end |
| `to` | [`Endpoint`](#endpoint) | the output end |

***

### wrapperSV()

```ts
function wrapperSV(
   module, 
   ports, 
   top, 
   header, 
   close?
): string;
```

The SV text of a wrapper module, `top`, that instantiates `module` as `dut`, for a lint run with
`-Wall`. A module with an interface port can't be linted as the top on its own: nothing would
drive the interface. So the wrapper instantiates each interface port's interface, as
`<port>_bus`, and brings each of its signals out to a wrapper port `<port>_<signal>`. A plain
port keeps its name. Every wrapper port has the direction the module sees.

With `close`, the wrapper also ties output bit `close.to` back into input bit `close.from`, so a
combinational path from `from` to `to` inside the module becomes a loop, which Verilator reports
as UNOPTFLAT. The other bits of `from`'s signal still come from the wrapper port.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `module` | `string` | the module to wrap |
| `ports` | [`ModulePorts`](#moduleports) | its ports, `Module.ports()` |
| `top` | `string` | the wrapper's name |
| `header` | `string` | the comment lines above `module <top>` |
| `close?` | \{ `from`: [`Endpoint`](#endpoint); `to`: [`Endpoint`](#endpoint); \} | the contract to close, resolved with resolveContract() |
| `close.from?` | [`Endpoint`](#endpoint) | - |
| `close.to?` | [`Endpoint`](#endpoint) | - |

#### Returns

`string`
