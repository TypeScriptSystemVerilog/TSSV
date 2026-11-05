// A DUT configuration file (doc/framework/testbench.md, "Configurations, testcases and the
// generator"): what a generated testbench is built from, apart from its testcase. Changing a
// configuration means a rebuild: it holds the DUT parameters that vary, each pattern memory's
// depth, and SimTop's timeout. A testcase (a manifest and its pattern files, patternFile.ts) is
// content, which a reloaded build loads without one.
//
// The file names neither the DUT nor the testbench, because its folder does
// (`<DUT>/<testbench>/configurations/<configuration>.json`). Its `depths` tie it to one harness:
// the testbench generator checks that their keys are exactly the harness's pattern memories.
import { mkdirSync, writeFileSync } from 'fs'
import { basename, dirname } from 'path'
import { SNAKE_CASE, checkJsonKeys, isJsonObject, parseJsonFile } from './patternFile.js'

/** A value JSON can hold. */
export type JsonValue = number | string | boolean | null | JsonValue[] | { [key: string]: JsonValue }

/** A DUT configuration, as its file holds it. `P` is the project's type for its parameters. */
export interface TestbenchConfiguration<P = Record<string, JsonValue>> {
  /** Names the configuration's folders and its tops: lower snake_case, and the file's name. */
  configuration: string
  /**
   * The DUT parameters that vary between configurations, which the harness passes to the DUT.
   * Which keys they are is the project's to define and check. A number is a safe integer; a value
   * wider than 53 bits is a `"0x…"` string, which the project turns into a bigint.
   */
  parameters: P
  /**
   * Each pattern memory's depth, by the path a manifest gives it (`h.inj_s_in.pattern`): the most
   * records a testcase may hold in it. Depth is structural, so it is configuration, never content.
   */
  depths: Record<string, number>
  /** SimTop's timeout, in the report domain's cycles. */
  maxCycles: number
  /** SimTop's reset length, in cycles. Default 4. */
  resetCycles?: number
}

/** Checks that `v` holds only JSON values whose numbers are safe integers. */
function checkParameterValue (where: string, v: unknown): void {
  if (typeof v === 'number') {
    if (!Number.isSafeInteger(v)) throw Error(`${where}: ${v} isn't a safe integer; write a wider value as a "0x…" string`)
  } else if (Array.isArray(v)) {
    v.forEach((e, i) => { checkParameterValue(`${where}[${i}]`, e) })
  } else if (isJsonObject(v)) {
    for (const [k, e] of Object.entries(v)) checkParameterValue(`${where}.${k}`, e)
  } else if (typeof v !== 'string' && typeof v !== 'boolean' && v !== null) {
    throw Error(`${where}: ${String(v)} isn't a JSON value`)
  }
}

/** Checks that `v` is an integer of at least `min`. */
function checkInteger (where: string, v: unknown, min: number): number {
  if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < min) throw Error(`${where} must be an integer, at least ${min}, got ${JSON.stringify(v)}`)
  return v
}

/**
 * A configuration from `json`, the value a configuration file parses to, checked against the
 * schema in testbench.md. `where` names the file in errors. Refuses a missing or unknown key, a
 * name that isn't lower snake_case, parameters that aren't an object or hold a number that isn't
 * a safe integer, a depth below 2, and a maxCycles or resetCycles below 1. What the parameters
 * mean is checked by the project, and the depths' keys by the generator.
 */
export function parseConfiguration (json: unknown, where: string): TestbenchConfiguration {
  if (!isJsonObject(json)) throw Error(`${where}: a configuration is a JSON object`)
  checkJsonKeys(where, json, ['configuration', 'parameters', 'depths', 'maxCycles'], ['resetCycles'])
  const { configuration, parameters, depths, maxCycles, resetCycles } = json
  if (typeof configuration !== 'string' || !SNAKE_CASE.test(configuration)) {
    throw Error(`${where}: configuration ${JSON.stringify(configuration)} isn't a lower snake_case name`)
  }
  if (!isJsonObject(parameters)) throw Error(`${where}: parameters must be an object`)
  checkParameterValue(`${where}: parameters`, parameters)
  if (!isJsonObject(depths)) throw Error(`${where}: depths must be an object of memory paths and depths`)
  const checkedDepths: Record<string, number> = {}
  for (const [path, depth] of Object.entries(depths)) {
    if (path === '') throw Error(`${where}: depths has an empty memory path`)
    checkedDepths[path] = checkInteger(`${where}: depths.${path}`, depth, 2)
  }
  return {
    configuration,
    parameters: parameters as Record<string, JsonValue>,
    depths: checkedDepths,
    maxCycles: checkInteger(`${where}: maxCycles`, maxCycles, 1),
    ...(resetCycles === undefined ? {} : { resetCycles: checkInteger(`${where}: resetCycles`, resetCycles, 1) })
  }
}

/**
 * The configuration in file `path`, checked as parseConfiguration() checks it. The file must be
 * named after it, `<configuration>.json`, so a folder listing names what it holds.
 */
export function readConfiguration (path: string): TestbenchConfiguration {
  const config = parseConfiguration(parseJsonFile(path), path)
  if (basename(path) !== `${config.configuration}.json`) throw Error(`${path}: holds configuration ${config.configuration}, so it must be named ${config.configuration}.json`)
  return config
}

/**
 * Writes `config` to `path`, `<configuration>.json`, as JSON with its keys in the schema's order,
 * making the folder if needed. It is checked first, as readConfiguration() would check it.
 */
export function writeConfiguration (path: string, config: TestbenchConfiguration<unknown>): void {
  const c = parseConfiguration(config, path)
  if (basename(path) !== `${c.configuration}.json`) throw Error(`${path}: holds configuration ${c.configuration}, so it must be named ${c.configuration}.json`)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(c, null, 2)}\n`)
}
