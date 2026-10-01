// Rules checked by scanning generated SV text (see check-builder-examples.mjs).
// Each scan returns a list of findings for one SV file.

export const SCANS = {
  'COMB-9': (sv) => [...sv.matchAll(/\b(always_comb|always_ff\s*@\([^)]*\)|always_latch|always\s*@\([^)]*\))(?!\s*begin\s*:)/g)]
    .map((m) => `unnamed always block: "${m[1].replace(/\s+/g, ' ')}"`),
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
