// Writes a doc example's SystemVerilog under doc/examples/core/<example>/, where the core's
// JSDoc includes it from (`{@includeCode}`). `npm run docs:examples` runs every example;
// see AGENTS.md, "Builder examples".
import { mkdirSync } from 'fs'
import { join } from 'path'
import { type Module } from 'tssv/lib/core/TSSV'

/**
 * Writes `module`'s SV, and that of every module it instantiates, to
 * `doc/examples/core/<example>/`
 * @param example the example's name: its file's name, which is the builder it shows
 * @param module the example's top module
 * @param options `nullViewDir`: a folder under the example's, for the null views of the modules
 * that opt in (see {@link Module.setNullView})
 * @returns the paths written, as {@link Module.writeSystemVerilogFiles} returns them
 */
export function writeExample (example: string, module: Module, options: { nullViewDir?: string } = {}): string[] {
  const dir = join('doc/examples/core', example)
  mkdirSync(dir, { recursive: true })
  return module.writeSystemVerilogFiles(dir, options.nullViewDir !== undefined ? { nullViewDir: join(dir, options.nullViewDir) } : {})
}
