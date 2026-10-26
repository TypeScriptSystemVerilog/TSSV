/**
 * Paths that don't depend on the cwd: a project's root directory, found from the location of its
 * own code, and environment variables in path strings.
 *
 * Node's `fs` takes a path as it is: `readFileSync('$TSSV_ROOT/x.sv')` looks for a directory
 * named `$TSSV_ROOT`. A path that holds variables goes through {@link expandPath} first.
 *
 * @module Paths
 */
import { existsSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * replace each environment variable in a path, written `$NAME` or `${NAME}`, with its value.
 * NAME is a letter or underscore, then letters, digits or underscores; use the braces when a
 * name character follows, as in `${IP}_v2/rtl.sv`. `~`, `$(cmd)`, `${NAME:-default}` and globs
 * aren't expanded.
 * @param path the path, such as `$TSSV_ROOT/ts/test/leaf.sv`
 * @param where where the path came from, such as `rtl.f:12`, for the error message
 * @returns the path with each variable replaced by its value
 * @throws if a variable is unset or empty
 */
export function expandPath (path: string, where?: string): string {
  // `$` followed by either a name in braces (`${NAME}`, group 1) or a bare name (`$NAME`,
  // group 2). A bare name runs as far as name characters do.
  return path.replace(/\$(?:\{([A-Za-z_][A-Za-z0-9_]*)\}|([A-Za-z_][A-Za-z0-9_]*))/g,
    (_match: string, braced: string | undefined, bare: string | undefined) => {
      const name = braced ?? bare ?? ''
      const value = process.env[name]
      if (value === undefined || value === '') {
        throw Error(`environment variable ${name} is not set, in path '${path}'${where === undefined ? '' : ` (${where})`}`)
      }
      return value
    })
}

/**
 * expand a path's environment variables ({@link expandPath}) and check that the result is
 * absolute. TSSV doesn't resolve a relative path against the cwd, so that what a path names
 * doesn't depend on where `node` was started.
 * @param path the path, such as `$TSSV_ROOT/ts/test/leaf.sv`
 * @param what what the path is, for the error message, such as `svFilePath`
 * @returns the expanded path
 * @throws if a variable is unset or empty, or the expanded path is relative
 */
export function absolutePath (path: string, what: string): string {
  const expanded = expandPath(path, what)
  if (!isAbsolute(expanded)) {
    throw Error(`${what} '${path}' is a relative path, and paths aren't resolved against the cwd. ` +
      `Start it with a root variable, as in '$TSSV_ROOT/${path}', or make it absolute`)
  }
  return expanded
}

/**
 * find a project's root directory from the location of its own code, and set it as an
 * environment variable.
 *
 * The root is the nearest directory, at or above the file `fromUrl` names, that holds a
 * `package.json`. Called with the caller's own `import.meta.url`, which names the compiled `.js`
 * that is running, it finds the checkout that code belongs to, whatever the cwd. Each git
 * worktree finds itself, even one nested inside another checkout. Node resolves symlinks when it
 * loads a module, so a package reached through a `node_modules` link finds its real checkout.
 *
 * `process.env[envVar]` is set to the root, so `$<envVar>` works in paths given to
 * {@link expandPath}, in `.f` filelists, and in the processes this one starts. A different value
 * already in the environment is replaced, with a warning: the root always follows the code.
 * @param envVar the environment variable to set, such as `TSSV_ROOT`
 * @param fromUrl the caller's `import.meta.url`
 * @returns the root directory, with symlinks resolved
 * @throws if no directory at or above `fromUrl` holds a `package.json`
 */
export function projectRoot (envVar: string, fromUrl: string): string {
  const start = dirname(fileURLToPath(fromUrl))
  let dir = start
  while (!existsSync(join(dir, 'package.json'))) {
    const parent = dirname(dir)
    if (parent === dir) throw Error(`no package.json at or above ${start}, so ${envVar} can't be set`)
    dir = parent
  }
  const root = realpathSync(dir)
  const inherited = process.env[envVar]
  if (inherited !== undefined && inherited !== '' && inherited !== root &&
      !(existsSync(inherited) && realpathSync(inherited) === root)) {
    console.warn(`${envVar} was ${inherited}; using ${root}, the checkout this code runs from`)
  }
  process.env[envVar] = root
  return root
}

/**
 * the root directory of the TSSV checkout whose code is running. Loading TSSV also sets
 * `$TSSV_ROOT` to it ({@link projectRoot}).
 */
export const TSSV_ROOT = projectRoot('TSSV_ROOT', import.meta.url)
