// Width cases for the builders in ts/src/core/Base.ts that emit expressions (#146). Each case
// builds a small module with one builder, at signed, unsigned and mismatched widths, and has a
// reference model of what the builder should compute, in exact integer arithmetic.
//
//   node out/test/rtl_style/test_builder_widths.js            builds every case and exits
//   node out/test/rtl_style/test_builder_widths.js <dir>      also writes, for each case,
//                                                             <dir>/<case>.sv and the case's
//                                                             test vectors to <dir>/cases.json
//
// doc/rtl-style/sv-style/tools/check-builder-widths.mjs runs the second form. It lints each
// module under -Wall, and simulates every vector.

import { Module, Expr, type IOSignals } from 'tssv/lib/core/TSSV'
import { mkdirSync, writeFileSync } from 'fs'

interface Port { width: number, signed?: boolean }
type Values = Record<string, bigint>

// A Module that can expose an auto-sized builder result as an output port, and report a port's width.
class WidthCase extends Module {
  expose (result: { toString: () => string }, out: string): void {
    const sig = this.signals[result.toString()]
    if (sig === undefined) throw new Error(`no signal ${result.toString()}`)
    this.IOs[out] = { direction: 'output', width: sig.width, isSigned: sig.isSigned }
    this.addAssign({ in: new Expr(result.toString()), out })
  }

  port (name: string): Port {
    const io = this.IOs[name]
    if (io === undefined) throw new Error(`no port ${name}`)
    return { width: Number(io.width ?? 1), signed: io.isSigned === true }
  }
}

interface Case {
  name: string
  inputs: Record<string, Port>
  outputs: Record<string, Port>
  build: (m: WidthCase) => void
  // Exact result for one input vector, or null to skip a vector the builder leaves undefined.
  // A case without ref is linted only.
  ref?: (v: Values) => Values | null
  // The module has clk and an active-low asynchronous rst_n; it's simulated held in reset
  clocked?: boolean
  // Why the case's module may leave input bits unused: lint runs with -Wno-UNUSEDSIGNAL for it
  unused?: string
}

const cases: Case[] = []
const u = (width: number): Port => ({ width })
const s = (width: number): Port => ({ width, signed: true })

// ---- reference arithmetic -------------------------------------------------------------------

const pow2 = (n: number): bigint => 1n << BigInt(n)

// Floor division by 2^n, for any sign.
const floorShift = (x: bigint, n: number): bigint => x >> BigInt(n)

function round (x: bigint, sh: number, mode: string): bigint {
  if (sh === 0) return x
  const d = pow2(sh)
  const fl = floorShift(x, sh)
  const rem = x - fl * d // 0 <= rem < d
  const half = d / 2n
  switch (mode) {
    case 'rm': return fl
    case 'rp': return rem >= half ? fl + 1n : fl
    case 'rz': return (x < 0n && rem !== 0n) ? fl + 1n : fl
    case 'rna': return (rem > half || (rem === half && x >= 0n)) ? fl + 1n : fl
    case 'rn': return (rem > half || (rem === half && (fl & 1n) === 1n)) ? fl + 1n : fl
    default: throw new Error(`unknown round mode ${mode}`)
  }
}

// Low n bits of x as a signed or unsigned value: what a port of that width holds.
function wrap (x: bigint, p: Port): bigint {
  const m = x & (pow2(p.width) - 1n)
  return (p.signed === true && m >= pow2(p.width - 1)) ? m - pow2(p.width) : m
}

const maxOf = (p: Port): bigint => p.signed === true ? pow2(p.width - 1) - 1n : pow2(p.width) - 1n
const minOf = (p: Port): bigint => p.signed === true ? -pow2(p.width - 1) : 0n

// ---- add, subtract, multiply ---------------------------------------------------------------

const OPS = [
  { tag: 'add', fn: 'addAdder', op: (a: bigint, b: bigint) => a + b },
  { tag: 'sub', fn: 'addSubtractor', op: (a: bigint, b: bigint) => a - b },
  { tag: 'mul', fn: 'addMultiplier', op: (a: bigint, b: bigint) => a * b }
] as const

type OpFn = 'addAdder' | 'addSubtractor' | 'addMultiplier'
const callOp = (m: WidthCase, fn: OpFn, io: Parameters<Module['addAdder']>[0]): void => { m[fn](io) }

const portName = (p: Port): string => `${p.signed === true ? 's' : 'u'}${p.width}`
const litName = (v: bigint): string => v < 0n ? `m${-v}` : `${v}`

for (const { tag, fn, op } of OPS) {
  // Two signals, auto-sized result. The result is a wire the test reads through an output.
  for (const [a, b] of [[u(4), u(4)], [s(4), s(4)], [u(4), s(6)], [s(4), u(6)], [u(6), s(4)], [s(6), u(4)], [u(6), u(4)], [s(6), s(4)], [u(33), s(31)]]) {
    cases.push({
      name: `${tag}_${portName(a)}_${portName(b)}`,
      inputs: { a, b },
      outputs: { r: { width: 0 } }, // sized below from the builder's auto result
      build: (m) => {
        m.expose(m[fn]({ a: 'a', b: 'b' }), 'r')
      },
      ref: (v) => ({ r: op(v.a, v.b) })
    })
  }
  // A signal and a literal, in either order.
  for (const lit of [5n, 15n, -3n, -8n]) {
    for (const a of [u(4), s(4)]) {
      cases.push({
        name: `${tag}_${portName(a)}_lit${litName(lit)}`,
        inputs: { a },
        outputs: { r: { width: 0 } },
        build: (m) => {
          m.expose(m[fn]({ a: 'a', b: lit }), 'r')
        },
        ref: (v) => ({ r: op(v.a, lit) })
      })
      cases.push({
        name: `${tag}_lit${litName(lit)}_${portName(a)}`,
        inputs: { a },
        outputs: { r: { width: 0 } },
        build: (m) => {
          m.expose(m[fn]({ a: lit, b: 'a' }), 'r')
        },
        ref: (v) => ({ r: op(lit, v.a) })
      })
    }
  }
  // An explicit result, narrower or wider than the natural width. A narrower one keeps the low bits.
  for (const [a, b, r] of [[u(4), u(4), u(3)], [u(4), u(4), u(12)], [s(4), s(4), s(12)], [s(4), s(4), s(3)], [u(4), s(4), s(12)], [u(8), u(8), u(6)]]) {
    cases.push({
      name: `${tag}_${portName(a)}_${portName(b)}_to_${portName(r)}`,
      inputs: { a, b },
      outputs: { r },
      build: (m) => { callOp(m, fn, { a: 'a', b: 'b', result: 'r' }) },
      ref: (v) => ({ r: op(v.a, v.b) }),
      ...(r.width < Math.max(a.width, b.width) ? { unused: 'a result narrower than its operands needs only their low bits' } : {})
    })
  }
}

// ---- addRound --------------------------------------------------------------------------------

for (const mode of ['rp', 'rm', 'rz', 'rn', 'rna'] as const) {
  for (const [i, o, sh] of [[u(8), u(7), 1], [s(8), s(7), 1], [s(8), s(7), 2], [u(8), u(6), 3], [s(8), s(6), 3], [s(16), s(10), 7], [u(6), u(6), 0], [s(40), s(30), 11]] as const) {
    cases.push({
      name: `round_${mode}_${portName(i)}_${portName(o)}_sh${sh}`,
      inputs: { i },
      outputs: { o },
      build: (m) => { m.addRound({ in: 'i', out: 'o', rShift: sh }, mode) },
      ref: (v) => ({ o: round(v.i, sh, mode) })
    })
  }
  for (const [i, o] of [[s(8), s(8)], [u(8), u(8)]] as const) {
    cases.push({
      name: `round_${mode}_${portName(i)}_${portName(o)}_var`,
      inputs: { i, sh: u(3) },
      outputs: { o },
      build: (m) => { m.addRound({ in: 'i', out: 'o', rShift: 'sh' }, mode) },
      ref: (v) => ({ o: round(v.i, Number(v.sh), mode) })
    })
  }
}

// ---- addSaturate -----------------------------------------------------------------------------

function saturate (x: bigint, i: Port, o: Port, mode: string): bigint {
  const hi = maxOf(o)
  const lo = (mode === 'balanced' && o.signed === true) ? -hi : minOf(o)
  if (mode !== 'none') return x > hi ? hi : x < lo ? lo : x
  if (o.width >= i.width) return x
  if (o.signed !== true) return wrap(x, o)
  // 'none', signed: keep the sign, wrap the magnitude bits
  const low = x & (pow2(o.width - 1) - 1n)
  if (x > hi) return low
  if (x < lo) return low - pow2(o.width - 1)
  return x
}

for (const mode of ['simple', 'balanced', 'none'] as const) {
  for (const [i, o] of [[s(8), s(4)], [u(8), u(4)], [s(10), s(8)], [s(4), s(8)], [u(4), u(8)], [s(6), s(6)], [s(40), s(34)], [u(40), u(33)], [s(5), s(1)]] as const) {
    cases.push({
      name: `sat_${mode}_${portName(i)}_${portName(o)}`,
      inputs: { i },
      outputs: { o },
      build: (m) => { m.addSaturate({ in: 'i', out: 'o' }, mode) },
      ref: (v) => ({ o: saturate(v.i, i, o, mode) }),
      ...(mode === 'none' && o.signed !== true && o.width < i.width ? { unused: "unsigned 'none' keeps only the low bits" } : {})
    })
  }
}

// ---- addMux ----------------------------------------------------------------------------------

cases.push({
  name: 'mux4_u4',
  inputs: { a: u(4), b: u(4), c: u(4), d: u(4), sel: u(2) },
  outputs: { o: u(4) },
  build: (m) => { m.addMux({ in: ['a', 'b', 'c', 'd'], sel: 'sel', out: 'o' }) },
  ref: (v) => ({ o: [v.a, v.b, v.c, v.d][Number(v.sel)] ?? 0n })
})
cases.push({
  name: 'mux3_default_widesel',
  inputs: { a: u(4), b: u(4), c: u(4), sel: u(2) },
  outputs: { o: u(4) },
  build: (m) => { m.addMux({ in: ['a', 'b', 'c'], sel: 'sel', out: 'o', default: 'a' }) },
  ref: (v) => ({ o: [v.a, v.b, v.c][Number(v.sel)] ?? v.a })
})
cases.push({
  name: 'mux3_nodefault',
  inputs: { a: u(4), b: u(4), c: u(4), sel: u(2) },
  outputs: { o: u(4) },
  build: (m) => { m.addMux({ in: ['a', 'b', 'c'], sel: 'sel', out: 'o' }) },
  ref: (v) => v.sel < 3n ? { o: [v.a, v.b, v.c][Number(v.sel)] ?? 0n } : null
})
cases.push({
  name: 'mux2_narrow_inputs',
  inputs: { a: u(3), b: s(2), sel: u(1) },
  outputs: { o: s(5) },
  build: (m) => { m.addMux({ in: ['a', 'b'], sel: 'sel', out: 'o' }) },
  ref: (v) => ({ o: v.sel === 0n ? v.a : v.b })
})

// ---- addConstSignal --------------------------------------------------------------------------

for (const [tag, value, p] of [['u8_5', 5n, u(8)], ['s6_m3', -3n, s(6)], ['s4_m8', -8n, s(4)], ['s8_7', 7n, s(8)], ['u40_big', 0x123456789an, u(40)]] as const) {
  cases.push({
    name: `const_${tag}`,
    inputs: {},
    outputs: { o: p },
    build: (m) => {
      const c = m.addConstSignal(`c_${tag}`, value, p.signed === true, p.width)
      m.addAssign({ in: new Expr(c.toString()), out: 'o' })
    },
    ref: () => ({ o: value })
  })
}

// ---- addSubmodule: width extension and constant bindings -------------------------------------

for (const [x, p] of [[u(4), u(8)], [s(4), s(8)], [u(4), s(8)]] as const) {
  const tag = `${portName(x)}_${portName(p)}`
  cases.push({
    name: `submodule_ext_${tag}`,
    inputs: { x },
    outputs: { y: p },
    build: (m) => {
      const leaf = new Module({ name: `bw_leaf_${tag}` }, { p: { direction: 'input', width: p.width, isSigned: p.signed === true }, q: { direction: 'output', width: p.width, isSigned: p.signed === true } }, {})
      leaf.addAssign({ in: new Expr('p'), out: 'q' })
      m.addSubmodule('u_leaf', leaf, { p: 'x', q: 'y' }, false, false, true)
    },
    ref: (v) => ({ y: v.x })
  })
}
cases.push({
  name: 'submodule_const_s8_m5',
  inputs: {},
  outputs: { y: s(8) },
  build: (m) => {
    const leaf = new Module({ name: 'bw_leaf_const' }, { p: { direction: 'input', width: 8, isSigned: true }, q: { direction: 'output', width: 8, isSigned: true } }, {})
    leaf.addAssign({ in: new Expr('p'), out: 'q' })
    m.addSubmodule('u_leaf', leaf, { p: -5n, q: 'y' }, false)
  },
  ref: () => ({ y: -5n })
})

// ---- addRegister: reset values -------------------------------------------------------------
// A clocked case is simulated held in its asynchronous reset, so q is the reset value.

for (const [tag, d, resetVal] of [['u4_5', u(4), 5n], ['s4_m3', s(4), -3n], ['s4_m8', s(4), -8n], ['u40_0', u(40), undefined],
  ['u64_big', u(64), 0x11223344556677n], ['s40_m', s(40), -0x123456789n]] as const) {
  cases.push({
    name: `register_reset_${tag}`,
    inputs: { d },
    outputs: { q: d },
    clocked: true,
    build: (m) => { m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_n', resetVal, q: 'q' }) },
    ref: () => ({ q: resetVal ?? 0n })
  })
}

// ---- build, and write the cases out ----------------------------------------------------------

// Up to 12 input bits, every vector; beyond that, the edges of each input crossed, plus random ones.
function vectors (inputs: Record<string, Port>): Values[] {
  const ports = Object.entries(inputs)
  const bits = ports.reduce((n, [, p]) => n + p.width, 0)
  const fromBits = (p: Port, b: bigint): bigint => wrap(b, p)
  if (bits <= 12) {
    const all: Values[] = []
    for (let x = 0n; x < pow2(bits); x++) {
      const v: Values = {}
      let rest = x
      for (const [k, p] of ports) {
        v[k] = fromBits(p, rest & (pow2(p.width) - 1n))
        rest >>= BigInt(p.width)
      }
      all.push(v)
    }
    return all
  }
  const edges = (p: Port): bigint[] => [...new Set([0n, 1n, -1n, maxOf(p), minOf(p), maxOf(p) - 1n, minOf(p) + 1n].map((e) => wrap(e, p)))]
  let combos: Values[] = [{}]
  for (const [k, p] of ports) combos = combos.flatMap((c) => edges(p).map((e) => ({ ...c, [k]: e })))
  let seed = 0x2545f491n
  const rand = (p: Port): bigint => {
    let r = 0n
    for (let i = 0; i < p.width; i += 31) {
      seed = (seed * 48271n) % 0x7fffffffn
      r = (r << 31n) | seed
    }
    return wrap(r, p)
  }
  for (let i = 0; i < 500; i++) combos.push(Object.fromEntries(ports.map(([k, p]) => [k, rand(p)])))
  return combos
}

const hex = (x: bigint, p: Port): string => (x & (pow2(p.width) - 1n)).toString(16)

const outDir = process.argv[2]
if (outDir !== undefined) mkdirSync(outDir, { recursive: true })
const written: unknown[] = []
let failed = 0

for (const c of cases) {
  try {
    const clk: IOSignals = c.clocked === true ? { clk: { direction: 'input', isClock: 'posedge' }, rst_n: { direction: 'input', isReset: 'lowasync' } } : {}
    const ios: IOSignals = Object.fromEntries([
      ...Object.entries(c.inputs).map(([k, p]) => [k, { direction: 'input' as const, width: p.width, isSigned: p.signed === true }]),
      ...Object.entries(c.outputs).filter(([, p]) => p.width > 0).map(([k, p]) => [k, { direction: 'output' as const, width: p.width, isSigned: p.signed === true }])
    ])
    const m = new WidthCase({ name: `bw_${c.name}` }, { ...clk, ...ios }, {})
    c.build(m)
    // An auto-sized result (width 0 above) is sized by the builder: read it back.
    for (const [k, p] of Object.entries(c.outputs)) if (p.width === 0) c.outputs[k] = m.port(k)
    const sv = m.writeSystemVerilog()
    const vecs = c.ref === undefined
      ? []
      : vectors(c.inputs).flatMap((v) => {
        const exp = c.ref?.(v)
        return exp === null || exp === undefined ? [] : [{ in: v, out: exp }]
      })
    if (outDir !== undefined) {
      writeFileSync(`${outDir}/${c.name}.sv`, sv)
      written.push({
        name: c.name,
        top: m.name,
        file: `${c.name}.sv`,
        clocked: c.clocked === true,
        unused: c.unused,
        inputs: Object.entries(c.inputs).map(([k, p]) => ({ name: k, width: p.width })),
        outputs: Object.entries(c.outputs).map(([k, p]) => ({ name: k, width: p.width })),
        vectors: vecs.map((x) => ({
          in: Object.entries(c.inputs).map(([k, p]) => hex(x.in[k] ?? 0n, p)),
          out: Object.entries(c.outputs).map(([k, p]) => hex(wrap(x.out[k] ?? 0n, p), p))
        }))
      })
    }
  } catch (e) {
    failed++
    console.log(`FAIL: ${c.name}: ${e instanceof Error ? e.message : String(e)}`)
  }
}

if (outDir !== undefined) writeFileSync(`${outDir}/cases.json`, JSON.stringify(written))
console.log(`${cases.length} builder width cases, ${failed} failed to build${outDir !== undefined ? `; wrote ${outDir}` : ''}`)
process.exit(failed > 0 ? 1 : 0)
