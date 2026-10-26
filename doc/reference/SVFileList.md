[**tssv**](README.md)

***

[tssv](README.md) / SVFileList

# SVFileList

The SystemVerilog files `Module.addSystemVerilogSubmodule()` reads, from the paths and `.f`
filelists it is given, and the include guard `Module.writeSystemVerilogFiles()` writes each one
in.

## Functions

### expandSVFileList()

```ts
function expandSVFileList(paths, what): string[];
```

list the SystemVerilog files that `paths` name, in order.

Each path has its environment variables expanded ([expandPath](Paths.md#expandpath)), and must then be
absolute: a relative path isn't resolved against the cwd. A path ending in `.f` is a filelist,
and is replaced by the files it names:
- one path per line; blank lines are skipped
- `//` and `#` start a comment, on a line of their own or after whitespace, so `a//b.sv` is a
  path
- a path's variables are expanded, and a path that is still relative is relative to the `.f`
  file's directory
- a path ending in `.f` is read the same way, recursively
- a line starting with `+` or `-`, a simulator option such as `+incdir+`, throws

A file named more than once is listed once, where it first appears.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `paths` | `string` \| readonly `string`[] | the paths, such as `$TSSV_ROOT/ts/test/leaf.sv` or `$MY_IP/rtl/ip.f` |
| `what` | `string` | what the paths are, for error messages, such as `SVFilePath` |

#### Returns

`string`[]

the absolute path of each file

#### Throws

if a variable is unset, a path is relative or names no file, a `.f` holds an option or
reads itself, or the paths name no file

***

### importGuard()

```ts
function importGuard(path): string;
```

the include guard macro of an imported file: `SVIMPORT__<leaf>__`, where `<leaf>` is the file's
name without its extension, with each character that can't be in a macro name replaced by `_`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | the file's path |

#### Returns

`string`

the macro

***

### guardSVImport()

```ts
function guardSVImport(path, text): string;
```

wrap an imported file's text, otherwise untouched, in its include guard ([importGuard](#importguard)),
as `Module.writeSystemVerilogFiles()` writes it, so that SV which reaches the file more than
once defines what it holds once:

```systemverilog
`ifndef SVIMPORT__<leaf>__
`define SVIMPORT__<leaf>__
// the file's text, unchanged
`endif //!SVIMPORT__<leaf>__
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | the file's path |
| `text` | `string` | the file's text |

#### Returns

`string`

the text inside its guard
