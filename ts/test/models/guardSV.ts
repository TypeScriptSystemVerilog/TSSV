// The include guard and USE_INCLUDES include block that Module.writeSystemVerilogFiles() wraps each
// generated file in (guardSVFile() in ts/src/core/Base.ts), for SV a test writes by hand: a lint
// wrapper, a testbench, a Memory model. A hand-written file that includes what it instantiates is
// linted and built like a generated one, by naming it with `+define+USE_INCLUDES +incdir+<dir>`
// (scripts/lint-sv.sh, `npm run check:generated-sv`), and the files it includes are never linted
// alone. Keep the layout in step with guardSVFile().

/**
 * `sv` inside the guard `DEF__<name>__`, with a `` `include `` of each file in `includes` for
 * `USE_INCLUDES` builds. `includes` are file names in the same directory, with their extensions.
 * A `` `timescale `` line in `sv`, as a testbench has, goes first, before the guard: a directive
 * applies only to what comes after it, and that includes the included files. Returns the contents
 * of `<name>.sv`.
 */
export function guardSV (name: string, includes: string[], sv: string): string {
  const guard = `DEF__${name}__`
  const includeBlock = includes.length === 0
    ? ''
    : ['`ifdef USE_INCLUDES', ...includes.map(i => `\`include "${i}"`), '`endif //USE_INCLUDES', ''].join('\n')
  // A line that is a `timescale directive, with its newline
  const timescale = /^`timescale [^\n]*\n/m
  const directive = timescale.exec(sv)?.[0] ?? ''
  // Drop the blank lines at the start (one or more runs of whitespace ending in a newline), so
  // the definition starts right after the guard, and the whitespace at the end
  const body = sv.replace(timescale, '').replace(/^(\s*\n)+/, '').trimEnd()
  return `${directive}\`ifndef ${guard}\n\`define ${guard}\n${includeBlock}\n${body}\n\n\`endif //!${guard}\n`
}
