// The testbench generator (doc/framework/testbench.md, "Configurations, testcases and the
// generator"): from DUT configurations (testbenchConfiguration.ts) and testcases (a manifest and
// its pattern files, patternFile.ts), it builds a project's harness under a SimTop for every pair,
// in each run mode, and writes them under `<outRoot>/<DUT>/<testbench>/` with a regression index.
// The harness itself is the project's, through a callback, so this file knows no DUT and no
// protocol.
//
//   - Preloaded: one build per configuration and testcase. The testcase's files and record counts
//     are compiled into the harness, and its files are copied beside the build.
//   - Reloaded: one build per configuration, run once per testcase. Each testcase's folder holds
//     its files and the load list SimTop reads at run time.
//
// Everything is built and checked before anything is written, so a bad configuration or testcase
// leaves the previous output as it was.
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { basename, dirname, join } from 'path'
import { type Harness } from './Harness.js'
import { type PatternMemoryMode } from './PatternMemory.js'
import { readManifest, readPatternWords, SNAKE_CASE, type Manifest } from './patternFile.js'
import { DEFAULT_LOAD_LIST, formatLoadList, SimTop } from './SimTop.js'
import { readConfiguration, type JsonValue, type TestbenchConfiguration } from './testbenchConfiguration.js'

/** What the project's harness callback builds one harness from. */
export interface HarnessBuild<P> {
  /** The configuration, with its parameters checked and typed by the project's `parameters`. */
  config: TestbenchConfiguration<P>
  /** The harness's module name, unique to the pair (preloaded) or the configuration (reloaded). */
  name: string
  mode: PatternMemoryMode
  /**
   * A pattern memory's options, by the path a manifest gives it (`h.inj_s_in.pattern`), to spread
   * into its component's parameters: its depth from the configuration, and in preloaded mode the
   * file the SV loads (`patterns/<file>`) and its record count, from the testcase. Throws for a
   * memory the configuration or the testcase has no entry for.
   */
  memory: (path: string) => { depth: number, file?: string, records?: number }
}

export interface GenerateTestbenches_Parameters<P> {
  /** The DUT, an SV identifier: the first folder under `outRoot`. */
  dut: string
  /**
   * The testbench, an SV identifier: the harness's kind, since a DUT may have several (a stream
   * harness and a waveform harness). The second folder, and part of every module name.
   */
  testbench: string
  /** Where the output goes: `<outRoot>/<dut>/<testbench>/`. */
  outRoot: string
  /** The configuration files (testbenchConfiguration.ts). */
  configurations: string[]
  /** The testcases' manifests (patternFile.ts). Each manifest's files are relative to it. */
  testcases: string[]
  /** The run modes to build, which the TB spec says the testbench supports. */
  modes: PatternMemoryMode[]
  /** Checks a configuration's parameters and gives them the project's type. `where` names the file. */
  parameters: (raw: Record<string, JsonValue>, where: string) => P
  /** Builds the harness, which calls `registerMemories()` for each component with pattern memories. */
  harness: (build: HarnessBuild<P>) => Harness
}

/** One run of a regression: a line of its index, `regression.txt`. */
export interface GeneratedTestbench {
  mode: PatternMemoryMode
  configuration: string
  testcase: string
  /** The SimTop: the module to build. */
  top: string
  /** The folder with the top's SV, relative to the index's folder. */
  buildDir: string
  /** The folder to run the build in, where `patterns/` is, relative to the index's folder. */
  runDir: string
}

/** The regression index's file name, in `<outRoot>/<dut>/<testbench>/`. */
export const REGRESSION_INDEX = 'regression.txt'

// An SV identifier: a letter or '_', then letters, digits and '_'
const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/

/**
 * The names of a pair's testbench: its SimTop, its harness, and its build and run folders,
 * relative to `<outRoot>/<dut>/<testbench>/`. A reloaded build is the configuration's, shared by
 * its testcases, so only its run folder names the testcase.
 */
export function testbenchNames (testbench: string, mode: PatternMemoryMode, configuration: string, testcase: string): { top: string, harness: string, buildDir: string, runDir: string } {
  const harness = mode === 'preloaded' ? `${testbench}_${configuration}_${testcase}` : `${testbench}_${configuration}_reloaded`
  const buildDir = mode === 'preloaded' ? `preloaded/${configuration}/${testcase}` : `reloaded/${configuration}`
  return { top: `tb_${harness}`, harness, buildDir, runDir: mode === 'preloaded' ? buildDir : `${buildDir}/${testcase}` }
}

/** The regression index: a line per run, `<mode> <configuration> <testcase> <top> <buildDir> <runDir>`. */
export function formatRegressionIndex (runs: GeneratedTestbench[]): string {
  return runs.map(r => `${r.mode} ${r.configuration} ${r.testcase} ${r.top} ${r.buildDir} ${r.runDir}\n`).join('')
}

/**
 * Checks that `config` fits `harness`: its depths name exactly the harness's pattern memories,
 * and each memory has the configured depth, which a harness that ignores `memory().depth` breaks.
 */
export function checkConfiguration (top: string, harness: Harness, config: TestbenchConfiguration<unknown>): void {
  const memories = harness.memories.map(m => `h.${m.path}`)
  const configured = Object.keys(config.depths)
  for (const path of configured) {
    if (!memories.includes(path)) throw Error(`${top}: configuration ${config.configuration} has a depth for ${path}, which isn't a pattern memory of the harness (${memories.join(', ')})`)
  }
  for (const m of harness.memories) {
    const depth = config.depths[`h.${m.path}`]
    if (depth === undefined) throw Error(`${top}: configuration ${config.configuration} has no depth for h.${m.path}`)
    if (m.depth !== depth) throw Error(`${top}: h.${m.path} has depth ${m.depth}, but configuration ${config.configuration} says ${depth}`)
  }
}

/**
 * Checks testcase `manifest`, read from `manifestPath`, against `harness`: its files name exactly
 * the harness's pattern memories, and each file exists, has the memory's radix, holds the records
 * the manifest says, no more than the memory's depth, each with the memory's word width. In
 * preloaded mode, each memory must also load `patterns/<file>` with the manifest's record count,
 * which a harness that ignores `memory()` breaks.
 */
export function checkTestcase (top: string, harness: Harness, manifestPath: string, manifest: Manifest): void {
  const what = `${top}: testcase ${manifest.testcase} (${manifestPath})`
  const memories = harness.memories.map(m => `h.${m.path}`)
  for (const f of manifest.files) {
    if (!memories.includes(f.memory)) throw Error(`${what} has a file for ${f.memory}, which isn't a pattern memory of the harness (${memories.join(', ')})`)
  }
  for (const m of harness.memories) {
    const path = `h.${m.path}`
    const f = manifest.files.find(f => f.memory === path)
    if (f === undefined) throw Error(`${what} has no file for ${path}`)
    if (f.radix !== m.layout.radix) throw Error(`${what}: ${f.file} is $readmem${f.radix}, but ${path} is $readmem${m.layout.radix}`)
    if (f.records > m.depth) throw Error(`${what}: ${f.file} has ${f.records} records, but ${path} holds ${m.depth}`)
    const words = readPatternWords(join(dirname(manifestPath), f.file), f.radix)
    if (words.length !== f.records) throw Error(`${what}: ${f.file} holds ${words.length} records, but the manifest says ${f.records}`)
    const digits = f.radix === 'h' ? m.layout.wordWidth / 4 : m.layout.wordWidth
    const bad = words.findIndex(w => w.length !== digits)
    if (bad >= 0) throw Error(`${what}: record ${bad} of ${f.file} has ${words[bad]?.length} digits, but a word of ${path} has ${digits}`)
    if (m.mode === 'preloaded' && (m.file !== `patterns/${f.file}` || m.records !== f.records)) {
      throw Error(`${what}: ${path} loads ${m.file ?? 'no file'} with ${m.records ?? 'no'} records, not patterns/${f.file} with ${f.records}; build it from memory()`)
    }
  }
}

/** Runs `build`, putting `top` in front of an error's message if it isn't already. */
function forPair<T> (top: string, build: () => T): T {
  try {
    return build()
  } catch (e) {
    const message = (e as Error).message
    throw Error(message.startsWith(`${top}: `) ? message : `${top}: ${message}`)
  }
}

/**
 * Generates the testbenches of every configuration and testcase in each mode, under
 * `<outRoot>/<dut>/<testbench>/`, and writes the regression index, `regression.txt`, a line per
 * run. Removes the `preloaded/` and `reloaded/` folders there first, and nothing else. Returns
 * the runs, as the index lists them.
 */
export function generateTestbenches<P> (p: GenerateTestbenches_Parameters<P>): GeneratedTestbench[] {
  for (const [key, value] of [['dut', p.dut], ['testbench', p.testbench]]) {
    if (!IDENTIFIER.test(value)) throw Error(`generateTestbenches: ${key} ${JSON.stringify(value)} isn't an SV identifier`)
  }
  const what = `${p.dut}/${p.testbench}`
  if (p.modes.length === 0 || new Set(p.modes).size !== p.modes.length) throw Error(`${what}: modes must name each mode once, got ${p.modes.join(', ')}`)
  if (p.configurations.length === 0 || p.testcases.length === 0) throw Error(`${what}: needs at least one configuration and one testcase`)

  // The inputs, read and checked
  const configs = p.configurations.map(path => {
    const raw = readConfiguration(path)
    return { path, config: { ...raw, parameters: p.parameters(raw.parameters, path) } }
  })
  const testcases = p.testcases.map(path => {
    const manifest = readManifest(path)
    if (!SNAKE_CASE.test(manifest.testcase)) throw Error(`${path}: testcase ${manifest.testcase} isn't lower snake_case`)
    return { path, manifest }
  })
  for (const [kind, names] of [['configuration', configs.map(c => c.config.configuration)], ['testcase', testcases.map(t => t.manifest.testcase)]] as const) {
    const twice = names.find((n, i) => names.indexOf(n) !== i)
    if (twice !== undefined) throw Error(`${what}: two ${kind}s are named ${twice}`)
  }

  // Build and check every pair before writing anything
  const builds: Array<{ top: SimTop, buildDir: string, configPath: string }> = []
  const runs: Array<{ run: GeneratedTestbench, manifestPath: string, manifest: Manifest, loadList?: string }> = []
  const tops = new Map<string, string>() // a top's name, and the build it names
  const claim = (top: string, build: string): void => {
    const other = tops.get(top)
    if (other !== undefined && other !== build) throw Error(`${what}: ${build} and ${other} would both be ${top}; rename a configuration or testcase`)
    tops.set(top, build)
  }
  for (const mode of p.modes) {
    for (const { path: configPath, config } of configs) {
      const cfg = config.configuration
      const depth = (top: string, path: string): number => {
        const d = config.depths[path]
        if (d === undefined) throw Error(`${top}: configuration ${cfg} has no depth for ${path}`)
        return d
      }
      if (mode === 'reloaded') {
        const names = testbenchNames(p.testbench, mode, cfg, '')
        claim(names.top, `reloaded ${cfg}`)
        const { top, harness } = forPair(names.top, () => {
          const harness = p.harness({ config, name: names.harness, mode, memory: path => ({ depth: depth(names.top, path) }) })
          checkConfiguration(names.top, harness, config)
          return { top: new SimTop({ name: names.top, harness, maxCycles: config.maxCycles, resetCycles: config.resetCycles }), harness }
        })
        builds.push({ top, buildDir: names.buildDir, configPath })
        for (const { path: manifestPath, manifest } of testcases) {
          const tc = testbenchNames(p.testbench, mode, cfg, manifest.testcase)
          const loadList = forPair(names.top, () => {
            checkTestcase(names.top, harness, manifestPath, manifest)
            return formatLoadList(harness, manifest)
          })
          runs.push({ run: { mode, configuration: cfg, testcase: manifest.testcase, top: names.top, buildDir: names.buildDir, runDir: tc.runDir }, manifestPath, manifest, loadList })
        }
      } else {
        for (const { path: manifestPath, manifest } of testcases) {
          const names = testbenchNames(p.testbench, mode, cfg, manifest.testcase)
          claim(names.top, `preloaded ${cfg} ${manifest.testcase}`)
          const memory = (path: string): { depth: number, file: string, records: number } => {
            const f = manifest.files.find(f => f.memory === path)
            if (f === undefined) throw Error(`${names.top}: testcase ${manifest.testcase} has no file for ${path}`)
            return { depth: depth(names.top, path), file: `patterns/${f.file}`, records: f.records }
          }
          const top = forPair(names.top, () => {
            const harness = p.harness({ config, name: names.harness, mode, memory })
            checkConfiguration(names.top, harness, config)
            checkTestcase(names.top, harness, manifestPath, manifest)
            return new SimTop({ name: names.top, harness, maxCycles: config.maxCycles, resetCycles: config.resetCycles })
          })
          builds.push({ top, buildDir: names.buildDir, configPath })
          runs.push({ run: { mode, configuration: cfg, testcase: manifest.testcase, top: names.top, buildDir: names.buildDir, runDir: names.runDir }, manifestPath, manifest })
        }
      }
    }
  }

  // Write: each build's SV and configuration, each run's patterns, and the index
  const outDir = join(p.outRoot, p.dut, p.testbench)
  for (const mode of ['preloaded', 'reloaded']) rmSync(join(outDir, mode), { recursive: true, force: true })
  for (const b of builds) {
    const dir = join(outDir, b.buildDir)
    b.top.writeSystemVerilogFiles(dir)
    copyFileSync(b.configPath, join(dir, basename(b.configPath)))
  }
  for (const r of runs) {
    const patterns = join(outDir, r.run.runDir, 'patterns')
    mkdirSync(patterns, { recursive: true })
    copyFileSync(r.manifestPath, join(patterns, `${r.manifest.testcase}.json`))
    for (const f of r.manifest.files) {
      mkdirSync(dirname(join(patterns, f.file)), { recursive: true })
      copyFileSync(join(dirname(r.manifestPath), f.file), join(patterns, f.file))
    }
    if (r.loadList !== undefined) writeFileSync(join(outDir, r.run.runDir, DEFAULT_LOAD_LIST), r.loadList)
  }
  const index = runs.map(r => r.run)
  writeFileSync(join(outDir, REGRESSION_INDEX), formatRegressionIndex(index))
  return index
}
