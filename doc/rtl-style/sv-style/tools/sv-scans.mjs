// Rules checked by scanning generated SV text (see check-builder-examples.mjs and
// check-generated-sv.mjs). Each scan returns a list of findings for one SV file.

export const SCANS = {
  'SYN-1': (sv) => [
    ...[...sv.matchAll(/^\s*(initial|force|release|casex)\b/gm)].map((m) => `testbench-only construct "${m[1]}"`),
    ...[...sv.matchAll(/(?<![\w'])#\s*\d/g)].map(() => 'delay "#"'),
    ...[...sv.matchAll(/\$(display|write|monitor|strobe|finish|stop|fatal|error|warning|info)\b/g)].map((m) => `system task "$${m[1]}"`)
  ],
  'LINT-3': (sv) => {
    const found = []
    const lines = sv.split('\n')
    lines.forEach((l, i) => {
      const off = l.match(/verilator\s+lint_off\s+(\w+)/)
      if (!off) return
      const onAt = lines.findIndex((m, j) => j > i && new RegExp(`verilator\\s+lint_on\\s+${off[1]}\\b`).test(m))
      const span = lines.slice(i, onAt < 0 ? lines.length : onAt).join('\n')
      if (/^\s*module\b/m.test(span) && /^\s*endmodule\b/m.test(span)) found.push(`waiver "lint_off ${off[1]}" covers the whole module`)
      if (!/\/\/\s*\S/.test(l) && !/\/\/\s*\S/.test(lines[i - 1] ?? '')) found.push(`waiver "lint_off ${off[1]}" has no justification comment`)
    })
    return found
  }
}

// Rules whose "generated" check is these scans plus lint of the generated SV.
export const GENERATED_RULES = [...Object.keys(SCANS), 'LINT-1']

// A test script marks each testbench module it generates with this comment, inside the module
// (ts/test/models/testbench.ts). SYN-1 bans what testbenches are for, so it skips them.
const TESTBENCH_MARKER = /^[ \t]*\/\/[ \t]*tssv:[ \t]*testbench\b/m

// The module definitions in a file's SV text, in order: { name, text, testbench }.
export function svModules (sv) {
  return [...sv.matchAll(/^[ \t]*module\s+(\w+)\b[\s\S]*?^[ \t]*endmodule\b/gm)]
    .map((m) => ({ name: m[1], text: m[0], testbench: TESTBENCH_MARKER.test(m[0]) }))
}

// Runs every scan on one file's SV text: [{ rule, finding }], in SCANS order. SYN-1 doesn't see
// the testbench modules; the other scans see the whole file.
export function scanFile (sv) {
  const syn1Text = svModules(sv).filter((m) => m.testbench).reduce((text, m) => text.replace(m.text, ''), sv)
  return Object.entries(SCANS).flatMap(([rule, scan]) =>
    scan(rule === 'SYN-1' ? syn1Text : sv).map((finding) => ({ rule, finding })))
}
