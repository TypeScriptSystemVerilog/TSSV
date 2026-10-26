[**tssv**](README.md)

***

[tssv](README.md) / Paths

# Paths

Paths that don't depend on the cwd: a project's root directory, found from the location of its
own code, and environment variables in path strings.

Node's `fs` takes a path as it is: `readFileSync('$TSSV_ROOT/x.sv')` looks for a directory
named `$TSSV_ROOT`. A path that holds variables goes through [expandPath](#expandpath) first.

## Variables

### TSSV\_ROOT

```ts
const TSSV_ROOT: string;
```

the root directory of the TSSV checkout whose code is running. Loading TSSV also sets
`$TSSV_ROOT` to it ([projectRoot](#projectroot)).

## Functions

### expandPath()

```ts
function expandPath(path, where?): string;
```

replace each environment variable in a path, written `$NAME` or `${NAME}`, with its value.
NAME is a letter or underscore, then letters, digits or underscores; use the braces when a
name character follows, as in `${IP}_v2/rtl.sv`. `~`, `$(cmd)`, `${NAME:-default}` and globs
aren't expanded.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | the path, such as `$TSSV_ROOT/ts/test/leaf.sv` |
| `where?` | `string` | where the path came from, such as `rtl.f:12`, for the error message |

#### Returns

`string`

the path with each variable replaced by its value

#### Throws

if a variable is unset or empty

***

### absolutePath()

```ts
function absolutePath(path, what): string;
```

expand a path's environment variables ([expandPath](#expandpath)) and check that the result is
absolute. TSSV doesn't resolve a relative path against the cwd, so that what a path names
doesn't depend on where `node` was started.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | the path, such as `$TSSV_ROOT/ts/test/leaf.sv` |
| `what` | `string` | what the path is, for the error message, such as `svFilePath` |

#### Returns

`string`

the expanded path

#### Throws

if a variable is unset or empty, or the expanded path is relative

***

### projectRoot()

```ts
function projectRoot(envVar, fromUrl): string;
```

find a project's root directory from the location of its own code, and set it as an
environment variable.

The root is the nearest directory, at or above the file `fromUrl` names, that holds a
`package.json`. Called with the caller's own `import.meta.url`, which names the compiled `.js`
that is running, it finds the checkout that code belongs to, whatever the cwd. Each git
worktree finds itself, even one nested inside another checkout. Node resolves symlinks when it
loads a module, so a package reached through a `node_modules` link finds its real checkout.

`process.env[envVar]` is set to the root, so `$<envVar>` works in paths given to
[expandPath](#expandpath), in `.f` filelists, and in the processes this one starts. A different value
already in the environment is replaced, with a warning: the root always follows the code.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `envVar` | `string` | the environment variable to set, such as `TSSV_ROOT` |
| `fromUrl` | `string` | the caller's `import.meta.url` |

#### Returns

`string`

the root directory, with symlinks resolved

#### Throws

if no directory at or above `fromUrl` holds a `package.json`
