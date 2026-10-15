// Emits a design one module per file, as SVEmitOptions (#46) allows. Each file is named after
// the module it defines, so `verilator --lint-only -Wall` raises no DECLFILENAME. An interface a
// module has as a port gets a file of its own too, named after the interface, for the same
// reason. A file that instantiates another can't be linted alone, so the top also gets a lint
// filelist naming them all (lintFilelist.ts), which scripts/lint-sv.sh and
// `npm run check:generated-sv` lint with -F.
import { type Interface, type Module } from 'tssv/lib/core/TSSV'
import { runVerible } from 'tssv/lib/tools/formatters/verible'
import { mkdirSync, writeFileSync } from 'fs'
import { writeLintFilelist } from './lintFilelist.js'

interface WithSubmodules {
  submodules: Record<string, { module: Module }>
  interfaces: Record<string, Interface>
}

/**
 * Writes each interface `m` has as a port to `<dir>/<interface>.sv`, unless `defined` has it, and
 * adds its name to `defined`. writeSystemVerilog() would define it in `m`'s file, which then
 * defines two things (DECLFILENAME); pass `defined` as its `exclude`. Returns the files written,
 * relative to `dir`.
 */
export function writePortInterfaces (m: Module, dir: string, defined: Set<string>): string[] {
  const files: string[] = []
  for (const intf of Object.values((m as unknown as WithSubmodules).interfaces)) {
    const name = intf.interfaceName()
    if (intf.role === undefined || defined.has(name)) continue
    writeFileSync(`${dir}/${name}.sv`, runVerible(intf.writeSystemVerilog(), {}))
    files.push(`${name}.sv`)
    defined.add(name)
  }
  return files
}

/**
 * Writes `top` and every module it instantiates to `<dir>/<module>.sv`, each module once, and
 * each submodule before the modules that instantiate it. Each interface a module has as a port
 * goes to `<dir>/<interface>.sv`, before the module. Returns the files written, relative to `dir`,
 * `top`'s last.
 */
export function writeSplit (top: Module, dir: string): string[] {
  mkdirSync(dir, { recursive: true })
  const defined = new Set<string>()
  const files: string[] = []
  const visit = (m: Module): void => {
    if (defined.has(m.name)) return
    for (const { module } of Object.values((m as unknown as WithSubmodules).submodules)) visit(module)
    files.push(...writePortInterfaces(m, dir, defined))
    // exclude what earlier files define; `defined` collects what this one defines
    const sv = m.writeSystemVerilog({ exclude: new Set(defined), defined })
    // a module imported with addSystemVerilogSubmodule() returns its file as is, and records nothing
    defined.add(m.name)
    writeFileSync(`${dir}/${m.name}.sv`, sv)
    files.push(`${m.name}.sv`)
  }
  visit(top)
  return files
}

/**
 * writeSplit(), and if there is more than one file, `<dir>/<top>.f` too. Returns the paths
 * written, `top`'s last.
 */
export function emitSplit (top: Module, dir: string, generator: string): string[] {
  const files = writeSplit(top, dir)
  if (files.length > 1) writeLintFilelist(dir, top.name, files, generator)
  return files.map(f => `${dir}/${f}`)
}
