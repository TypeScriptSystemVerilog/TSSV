// Shared helpers for the doc/rtl-style checks of both guides: the Verilator pin, linting and simulation.

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// The common lint waivers that every Verilator lint run passes (SV guide, section 8).
export const COMMON_WAIVERS = fileURLToPath(new URL('../sv-style/common_waivers.vlt', import.meta.url))

// Exit unless the Verilator on PATH is the version pinned in README.md. Returns the pin.
export function requirePinnedVerilator () {
  const pinMatch = readFileSync('README.md', 'utf8').match(/^VERILATOR_VERSION=v(\S+)$/m)
  if (!pinMatch) {
    console.error('ERROR: no VERILATOR_VERSION=v<version> line in README.md')
    process.exit(1)
  }
  const pin = pinMatch[1]
  let version
  try {
    version = execFileSync('verilator', ['--version'], { encoding: 'utf8' }).trim()
  } catch {
    console.error('ERROR: verilator not found on PATH')
    process.exit(1)
  }
  if (!version.startsWith(`Verilator ${pin} `)) {
    console.error(`ERROR: expected Verilator ${pin} (README.md pin), found "${version}"`)
    process.exit(1)
  }
  return pin
}

// Generated SV is one guarded file per module and interface, and each file `include`s the files
// it needs inside `ifdef USE_INCLUDES (Module.writeSystemVerilogFiles()). Every lint and build
// here defines USE_INCLUDES, and the caller puts the top file's directory on the include path
// (+incdir+<dir>), so naming a top file brings in everything it reaches.
export const USE_INCLUDES = '+define+USE_INCLUDES'

// The lint tops among `files`, SV paths: each file that no file in `files` includes. A file
// includes another by name, from its own directory. A top's lint reaches everything it includes,
// so an included file is never linted alone: one with interface ports would fail as a top.
export function lintTops (files) {
  const included = new Set()
  for (const file of files) {
    // An include line, `include "<file>", capturing <file>
    for (const m of readFileSync(file, 'utf8').matchAll(/^[ \t]*`include[ \t]+"([^"]+)"/gm)) {
      included.add(join(dirname(file), m[1]))
    }
  }
  return files.filter((f) => !included.has(join(f)))
}

// Lint with -Wall, the common waivers and USE_INCLUDES. Returns the sorted, de-duplicated warning
// codes, any hard errors and the raw output.
export function lint (files, flags = []) {
  const run = spawnSync('verilator', ['--lint-only', '-Wall', '-Wno-fatal', COMMON_WAIVERS, USE_INCLUDES, ...flags, ...files], { encoding: 'utf8' })
  const out = run.stdout + run.stderr
  const warnings = [...new Set([...out.matchAll(/%Warning-([A-Z0-9_]+)/g)].map((m) => m[1]))].sort()
  const errors = out.split('\n').filter((l) => l.startsWith('%Error') && !l.includes('Exiting due to'))
  return { warnings, errors, out }
}

// Build a testbench with `verilator --binary` and USE_INCLUDES, and run it. Returns its stdout.
// Throws if the build fails or the simulation exits non-zero.
export function simulate (files, top, flags = []) {
  const dir = mkdtempSync(join(tmpdir(), 'rtl-style-sim-'))
  try {
    const build = spawnSync('verilator',
      ['--binary', '--timing', '-Wno-fatal', '-Wno-lint', '-Wno-WIDTH', '--Mdir', dir, '--top-module', top, USE_INCLUDES, ...flags, ...files],
      { encoding: 'utf8' })
    if (build.status !== 0) throw new Error(`build of ${top} failed:\n${build.stdout}${build.stderr}`)
    const run = spawnSync(join(dir, `V${top}`), [], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
    if (run.status !== 0) throw new Error(`${top} exited ${run.status}:\n${run.stdout}${run.stderr}`)
    return run.stdout
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
