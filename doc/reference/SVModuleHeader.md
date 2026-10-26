[**tssv**](README.md)

***

[tssv](README.md) / SVModuleHeader

# SVModuleHeader

SystemVerilog module-header parser used by `Module.addSystemVerilogSubmodule()` to find the
module name and the declared direction of each port of an imported `.sv` file.  It runs
`verible-verilog-syntax --export_json --printtree` on the source and reads the module headers
from the concrete syntax tree.  Verible (https://github.com/chipsalliance/verible) must be installed.

## Interfaces

### SVModuleHeader

the name and port directions of one module found in a SystemVerilog source

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="name"></a> `name` | `string` |
| <a id="ports"></a> `ports` | `Record`\<`string`, [`SVPortKind`](#svportkind)\> |

***

### VeribleSyntaxOpts

options for a verible-verilog-syntax run

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="timeoutms"></a> `timeoutMs?` | `number` | timeout for the verible-verilog-syntax run (default 10000 ms) |

## Type Aliases

### SVPortKind

```ts
type SVPortKind = "input" | "output" | "inout" | "ref" | "interface";
```

declared kind of a port on an imported SystemVerilog module

## Functions

### parseSVModules()

```ts
function parseSVModules(src, opts?): SVModuleHeader[];
```

find every module declared in a SystemVerilog source, with its port directions.
Handles ANSI (`input logic signed [N-1:0] a,`) and non-ANSI (`input a; ...`) port styles.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `src` | `string` | SystemVerilog source text |
| `opts` | [`VeribleSyntaxOpts`](#veriblesyntaxopts) | the timeout for the verible-verilog-syntax run, which must be on `PATH` |

#### Returns

[`SVModuleHeader`](#svmoduleheader)[]

one entry per module declaration, in source order

***

### selectSVModule()

```ts
function selectSVModule(
   headers, 
   filePath, 
   moduleName
): SVModuleHeader;
```

pick the module to use from the headers parsed out of one or more SV files

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headers` | [`SVModuleHeader`](#svmoduleheader)[] | result of `parseSVModules()` for the files, together |
| `filePath` | `string` \| readonly `string`[] | the path, or paths, the module was looked for in, for the error message |
| `moduleName` | `string` | the module to select. It is never inferred |

#### Returns

[`SVModuleHeader`](#svmoduleheader)

the selected module header

#### Throws

if no file declares `moduleName`
