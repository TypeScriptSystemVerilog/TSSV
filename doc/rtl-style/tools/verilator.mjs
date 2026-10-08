// Shared helpers for the doc/rtl-style checks: the Verilator pin, linting and simulation.

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

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

// Lint with -Wall. Returns the sorted, de-duplicated warning codes, any hard errors and the raw output.
export function lint (files, flags = []) {
  const run = spawnSync('verilator', ['--lint-only', '-Wall', '-Wno-fatal', ...flags, ...files], { encoding: 'utf8' })
  const out = run.stdout + run.stderr
  const warnings = [...new Set([...out.matchAll(/%Warning-([A-Z0-9_]+)/g)].map((m) => m[1]))].sort()
  const errors = out.split('\n').filter((l) => l.startsWith('%Error') && !l.includes('Exiting due to'))
  return { warnings, errors, out }
}

// Build a testbench with `verilator --binary` and run it. Returns its stdout.
// Throws if the build fails or the simulation exits non-zero.
export function simulate (files, top, flags = []) {
  const dir = mkdtempSync(join(tmpdir(), 'rtl-style-sim-'))
  try {
    const build = spawnSync('verilator',
      ['--binary', '--timing', '-Wno-fatal', '-Wno-lint', '-Wno-WIDTH', '--Mdir', dir, '--top-module', top, ...flags, ...files],
      { encoding: 'utf8' })
    if (build.status !== 0) throw new Error(`build of ${top} failed:\n${build.stdout}${build.stderr}`)
    const run = spawnSync(join(dir, `V${top}`), [], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
    if (run.status !== 0) throw new Error(`${top} exited ${run.status}:\n${run.stdout}${run.stderr}`)
    return run.stdout
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
