#!/usr/bin/env node
// Check doc/rtl-style/sv/width/width_examples.sv, the examples for section 5 (WIDTH-*).
//
// At each parameter set below, the examples must lint clean under -Wall, and every output
// must match exact integer arithmetic for 3000 random and edge-case input vectors.
// Exits 0 if everything passes, 1 otherwise.

import { readFileSync } from 'node:fs'
import { lint, requirePinnedVerilator, simulate } from '../../tools/verilator.mjs'

const DIR = 'doc/rtl-style/sv-style/sv/width'
const DUT = `${DIR}/width_examples.sv`
const TB = `${DIR}/width_examples_tb.sv`

// Widths below, at and above 32 bits, including non-powers of two.
const CONFIGS = [
  { W: 8, N: 4, S: 3, F: 4, LIM: 7 },
  { W: 16, N: 6, S: 3, F: 4, LIM: 100 },
  { W: 33, N: 32, S: 3, F: 4, LIM: 123456789 },
  { W: 40, N: 12, S: 5, F: 9, LIM: 100 },
  { W: 64, N: 33, S: 7, F: 20, LIM: 100 }
]

// Exact value of each output. Values in EXACT must fit their port; the rest wrap on purpose.
const REF = {
  u_add_wrap: (v) => v.a + v.b,
  u_add_full: (v) => v.a + v.b,
  u_inc: (v) => v.a + 1n,
  u_add_narrow: (v) => v.a + v.c,
  u_avg: (v) => (v.a + v.b) / 2n,
  s_add_wrap: (v) => v.sa + v.sb,
  s_add_full: (v) => v.sa + v.sb,
  s_sub_lit: (v) => v.sa - 3n,
  s_add_narrow: (v) => v.sa + v.sc,
  s_add_mixed: (v) => v.sa + v.a,
  u_mul_full: (v) => v.a * v.b,
  u_mul_lo: (v) => v.a * v.b,
  u_mul_narrow: (v) => v.a * v.c,
  u_mul_lit: (v) => v.a * 3n,
  s_mul_full: (v) => v.sa * v.sb,
  s_mul_lit: (v) => v.sa * -5n,
  s_mul_mixed: (v) => v.sa * v.b,
  s_mul_q: (v, p) => (v.sa * v.sb) >> BigInt(p.F),
  u_shl_fix: (v, p) => v.a << BigInt(p.S),
  u_shl_full: (v, p) => v.a << BigInt(p.S),
  u_shr_fix: (v, p) => v.a >> BigInt(p.S),
  u_shl_var: (v) => v.a << v.sh,
  u_shr_var: (v) => v.a >> v.sh,
  u_onehot: (v) => 1n << v.sh,
  u_mask: (v) => (1n << v.sh) - 1n,
  s_sra_fix: (v, p) => v.sa >> BigInt(p.S),
  s_sra_var: (v) => v.sa >> v.sh,
  s_sla_full: (v, p) => v.sa << BigInt(p.S),
  s_neg_pow: (v) => -(1n << v.sh),
  u_zext: (v) => v.c,
  s_sext: (v) => v.sc,
  s_from_u: (v) => v.a,
  u_lim: (v, p) => BigInt(p.LIM),
  u_ones: () => -1n,
  u_trunc: (v) => v.a,
  u_trunc_sum: (v) => v.a + v.b,
  s_trunc: (v) => v.sa,
  u_is_zero: (v, p) => BigInt(v.a === 0n),
  u_at_lim: (v, p) => BigInt(v.a === BigInt(p.LIM) % (1n << BigInt(p.W))),
  u_sum_gt: (v) => BigInt(v.a + v.b > v.c),
  s_is_neg: (v) => BigInt(v.sa < 0n)
}
// u_onehot, u_mask and s_neg_pow aren't here: for a non-power-of-2 W, a $clog2(W)-bit sh can
// reach W, and those shifts then shift out, which the SV rules define.
const EXACT = new Set(['u_add_full', 'u_add_narrow', 'u_avg', 's_add_full', 's_add_narrow', 's_add_mixed',
  'u_mul_full', 'u_mul_narrow', 'u_mul_lit', 's_mul_full', 's_mul_lit', 's_mul_mixed', 'u_shl_full',
  'u_shr_fix', 'u_shr_var', 's_sra_fix', 's_sra_var', 's_sla_full', 'u_zext', 's_sext', 's_from_u'])
const INPUTS = new Set(['a', 'b', 'c', 'sa', 'sb', 'sc', 'sh'])

// Port widths and signedness, read from the example's own declarations.
function ports (p) {
  const src = readFileSync(DUT, 'utf8')
  const re = /^\s*(?:input|output)\s+logic\s*(signed)?\s*(?:\[([^\]]+)\])?\s*([A-Za-z_][\w, ]*?)\s*,?\s*(?:\/\/.*)?$/gm
  const env = { ...p, SW: Math.ceil(Math.log2(p.W)) }
  const result = {}
  for (const [, signed, range, names] of src.matchAll(re)) {
    // eslint-disable-next-line no-new-func
    const hi = range ? Function(...Object.keys(env), `return ${range.split(':')[0]}`)(...Object.values(env)) : 0
    for (const n of names.split(',').map((s) => s.trim()).filter(Boolean)) result[n] = { w: hi + 1, signed: !!signed }
  }
  return result
}

function wrap (v, { w, signed }) {
  const mask = (1n << BigInt(w)) - 1n
  const u = v & mask
  return signed && (u >> BigInt(w - 1)) ? u - (1n << BigInt(w)) : u
}

const pin = requirePinnedVerilator()
let failed = 0
for (const p of CONFIGS) {
  const label = Object.entries(p).map(([k, v]) => `${k}=${v}`).join(' ')
  const gflags = Object.entries(p).map(([k, v]) => `-G${k}=${v}`)
  const problems = []

  const l = lint([DUT], gflags)
  if (l.errors.length > 0 || l.warnings.length > 0) problems.push(`lint: ${[...l.errors, ...l.warnings].join(', ')}`)

  const pw = ports(p)
  const unchecked = Object.keys(pw).filter((n) => !INPUTS.has(n) && !(n in REF))
  if (unchecked.length > 0) problems.push(`outputs with no reference: ${unchecked.join(', ')}`)

  let vectors = 0
  const bad = new Map()
  for (const line of simulate([TB, DUT], 'width_examples_tb', gflags).split('\n')) {
    if (!line.startsWith('V ')) continue
    vectors++
    const v = {}
    for (const kv of line.slice(2).trim().split(/\s+/)) {
      const [k, h] = kv.split('=')
      v[k] = wrap(BigInt(`0x${h}`), pw[k])
    }
    for (const [k, f] of Object.entries(REF)) {
      const want = f(v, p)
      if (EXACT.has(k) && wrap(want, pw[k]) !== want) problems.push(`${k}: exact value ${want} doesn't fit its port`)
      if (v[k] !== wrap(want, pw[k]) && !bad.has(k)) bad.set(k, `got ${v[k]}, want ${wrap(want, pw[k])} (${line})`)
    }
  }
  if (vectors === 0) problems.push('testbench printed no vectors')
  for (const [k, msg] of bad) problems.push(`${k}: ${msg}`)

  if (problems.length > 0) {
    failed++
    console.log(`FAIL: width_examples ${label}\n    ${[...new Set(problems)].join('\n    ')}`)
  } else {
    console.log(`PASS: width_examples ${label}: lint clean, ${Object.keys(REF).length} outputs x ${vectors} vectors`)
  }
}
console.log(`\n${CONFIGS.length - failed} passed, ${failed} failed (Verilator ${pin})`)
process.exit(failed > 0 ? 1 : 0)
