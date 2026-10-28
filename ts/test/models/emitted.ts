// The SV Module.writeSystemVerilogFiles() writes for a design, for a test that checks the text
// without keeping it under sv-examples/. The files go to a scratch directory that is removed again.
import { type Module } from 'tssv/lib/core/TSSV'
import { mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { basename, join } from 'path'

/**
 * Each file `m.writeSystemVerilogFiles()` writes, by file name, in the order it returns them:
 * every file before the files that include it, `m`'s own last.
 */
export function emittedFiles (m: Module): Map<string, string> {
  const dir = mkdtempSync(join(tmpdir(), 'tssv-emitted-'))
  try {
    return new Map(m.writeSystemVerilogFiles(dir).map(f => [basename(f), readFileSync(f, 'utf8')]))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

/** The text of `m`'s own file, `<m.name>.sv`, as writeSystemVerilogFiles() writes it. */
export function moduleSV (m: Module): string {
  return emittedFiles(m).get(`${m.name}.sv`) ?? ''
}
