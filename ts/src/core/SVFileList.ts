/**
 * The SystemVerilog files `Module.addSystemVerilogSubmodule()` reads, from the paths and `.f`
 * filelists it is given, and the include guard each file is emitted in.
 *
 * @module SVFileList
 */
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, parse, resolve } from 'node:path'
import { absolutePath, expandPath } from './Paths.js'

/**
 * list the SystemVerilog files that `paths` name, in order.
 *
 * Each path has its environment variables expanded ({@link expandPath}), and must then be
 * absolute: a relative path isn't resolved against the cwd. A path ending in `.f` is a filelist,
 * and is replaced by the files it names:
 * - one path per line; blank lines are skipped
 * - `//` and `#` start a comment, on a line of their own or after whitespace, so `a//b.sv` is a
 *   path
 * - a path's variables are expanded, and a path that is still relative is relative to the `.f`
 *   file's directory
 * - a path ending in `.f` is read the same way, recursively
 * - a line starting with `+` or `-`, a simulator option such as `+incdir+`, throws
 *
 * A file named more than once is listed once, where it first appears.
 * @param paths the paths, such as `$TSSV_ROOT/ts/test/leaf.sv` or `$MY_IP/rtl/ip.f`
 * @param what what the paths are, for error messages, such as `SVFilePath`
 * @returns the absolute path of each file
 * @throws if a variable is unset, a path is relative or names no file, a `.f` holds an option or
 * reads itself, or the paths name no file
 */
export function expandSVFiles (paths: string | readonly string[], what: string): string[] {
  const files: string[] = []
  const seen = new Set<string>()
  const add = (file: string, where: string, open: string[]): void => {
    if (!existsSync(file)) throw Error(`${where} names ${file}, which doesn't exist`)
    const real = realpathSync(file)
    if (file.endsWith('.f')) {
      readFilelist(file, real, open)
    } else if (!seen.has(real)) {
      seen.add(real)
      files.push(file)
    }
  }
  // `open` holds the real paths of the filelists being read, outermost first
  const readFilelist = (filelist: string, real: string, open: string[]): void => {
    if (open.includes(real)) throw Error(`${filelist} reads itself: ${[...open, real].join(' -> ')}`)
    const lines = readFileSync(filelist, 'utf8').split('\n')
    lines.forEach((raw, i) => {
      const where = `${filelist}:${i + 1}`
      // A comment: `//` or `#` at the start of the line or after whitespace, to the end of the
      // line. Whitespace before the marker is required so that a `//` inside a path stays.
      const line = raw.replace(/(^|\s)(\/\/|#).*$/, '').trim()
      if (line === '') return
      // A simulator option: a line starting with `+` (`+incdir+`, `+define+`) or `-` (`-v`, `-f`)
      if (/^[+-]/.test(line)) {
        throw Error(`${where}: simulator option '${line}' isn't supported in a filelist read by addSystemVerilogSubmodule()`)
      }
      const path = expandPath(line, where)
      add(isAbsolute(path) ? path : resolve(dirname(filelist), path), where, [...open, real])
    })
  }
  for (const path of typeof paths === 'string' ? [paths] : paths) {
    add(resolve(absolutePath(path, what)), `${what} '${path}'`, [])
  }
  if (files.length === 0) {
    throw Error(`${what} ${typeof paths === 'string' ? `'${paths}'` : `[${paths.join(', ')}]`} names no SystemVerilog file`)
  }
  return files
}

// The file each SVIMPORT guard macro has guarded, and its text, since this process started
const guarded = new Map<string, { path: string, text: string }>()

/**
 * wrap an imported file's text in its include guard, so that SV which reaches the file more than
 * once defines what it holds once:
 *
 * ```systemverilog
 * `ifndef SVIMPORT__<leaf>__
 * `define SVIMPORT__<leaf>__
 * // the file's text, unchanged
 * `endif //!SVIMPORT__<leaf>__
 * ```
 *
 * `<leaf>` is the file's name without its extension, with each character that can't be in a
 * macro name replaced by `_`.
 * @param path the file's path
 * @param text the file's text
 * @returns the text inside its guard
 * @throws if another file with different text already took the same guard, because the
 * preprocessor would silently drop whichever of the two came second
 */
export function guardSVImport (path: string, text: string): string {
  // Each character other than a letter, digit or underscore: none of them can be in a macro name
  const guard = `SVIMPORT__${parse(path).name.replace(/[^A-Za-z0-9_]/g, '_')}__`
  const other = guarded.get(guard)
  if (other === undefined) {
    guarded.set(guard, { path, text })
  } else if (other.path !== path && other.text !== text) {
    throw Error(`${other.path} and ${path} would both be guarded by ${guard}, so the second would be ` +
      'dropped wherever both are compiled. Rename one of them')
  }
  return `\`ifndef ${guard}\n\`define ${guard}\n${text}${text.endsWith('\n') ? '' : '\n'}\`endif //!${guard}\n`
}
