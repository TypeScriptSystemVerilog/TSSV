// Emits a design one module per file, as SVEmitOptions (#46) allows. Each file is named after
// the module it defines, so `verilator --lint-only -Wall` raises no DECLFILENAME. A file that
// instantiates another can't be linted alone, so the top also gets a lint filelist naming them
// all (lintFilelist.ts), which scripts/lint-sv.sh and `npm run check:generated-sv` lint with -F.
import { type Module } from 'tssv/lib/core/TSSV'
import { mkdirSync, writeFileSync } from 'fs'
import { writeLintFilelist } from './lintFilelist.js'

interface WithSubmodules { submodules: Record<string, { module: Module }> }

/**
 * Writes `top` and every module it instantiates to `<dir>/<module>.sv`, each module once, and
 * each submodule before the modules that instantiate it. If there is more than one file, writes
 * `<dir>/<top>.f` too. Returns the paths written, `top`'s last.
 */
export function emitSplit (top: Module, dir: string, generator: string): string[] {
  mkdirSync(dir, { recursive: true })
  const defined = new Set<string>()
  const files: string[] = []
  const visit = (m: Module): void => {
    if (defined.has(m.name)) return
    for (const { module } of Object.values((m as unknown as WithSubmodules).submodules)) visit(module)
    // exclude what earlier files define; `defined` collects what this one defines
    const sv = m.writeSystemVerilog({ exclude: new Set(defined), defined })
    writeFileSync(`${dir}/${m.name}.sv`, sv)
    files.push(`${m.name}.sv`)
  }
  visit(top)
  if (files.length > 1) writeLintFilelist(dir, top.name, files, generator)
  return files.map(f => `${dir}/${f}`)
}
