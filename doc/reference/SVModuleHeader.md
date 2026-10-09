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

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="veriblesyntaxpath"></a> `veribleSyntaxPath?` | `string` | path to verible-verilog-syntax (default: found on PATH) |
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
| `opts` | [`VeribleSyntaxOpts`](#veriblesyntaxopts) | location of the Verible binary and timeout |

#### Returns

[`SVModuleHeader`](#svmoduleheader)[]

one entry per module declaration, in source order

***

### selectSVModule()

```ts
function selectSVModule(
   headers, 
   filePath, 
   moduleName?
): SVModuleHeader;
```

pick the module to use from the headers parsed out of an SV file

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headers` | [`SVModuleHeader`](#svmoduleheader)[] | result of `parseSVModules()` for the file |
| `filePath` | `string` | path of the file, used for the default choice and in error messages |
| `moduleName?` | `string` | module to select; by default the file's only module, or the one named after the file |

#### Returns

[`SVModuleHeader`](#svmoduleheader)

the selected module header
