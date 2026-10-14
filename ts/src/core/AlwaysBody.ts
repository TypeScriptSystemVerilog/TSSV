// Statement-level reading of the SV body passed to addCombAlways, addSequentialAlways and
// addLatchAlways, for the SV-guide rules those builders enforce (COMB-2, COMB-3, SEQ-1, SEQ-6).
// It isn't a parser: it finds the simple statements in a body (assignments and declarations),
// with the control flow around them (if, case, for, begin/end, labels) stripped off.

/** One simple statement of an always block body. */
export type BodyStatement =
  | { kind: 'declaration', text: string, automatic: boolean, initialized: boolean, names: string[] }
  | { kind: 'blocking' | 'nonblocking', text: string, target: string, rhs: string }
  | { kind: 'other', text: string }

// sv with its comments and string literals replaced by spaces, so offsets are unchanged
export function blankCommentsAndStrings (sv: string): string {
  return sv.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"/g, (m) => m.replace(/[^\n]/g, ' '))
}

// Index of the bracket that closes the one at `open`, or -1
function closing (text: string, open: number): number {
  const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' }
  const stack: string[] = []
  for (let i = open; i < text.length; i++) {
    const c = text[i] ?? ''
    if (c in pairs) stack.push(pairs[c] ?? '')
    else if (c === stack[stack.length - 1]) {
      stack.pop()
      if (stack.length === 0) return i
    }
  }
  return -1
}

// The text split at each ';' that isn't inside brackets
function splitStatements (text: string): string[] {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') depth--
    else if (c === ';' && depth === 0) {
      out.push(text.slice(start, i))
      start = i + 1
    }
  }
  out.push(text.slice(start))
  return out
}

const KEYWORD_PREFIX = /^\s*(?:begin(?:\s*:\s*\w+)?|end(?:\s*:\s*\w+)?|endcase|else|fork|join(?:_any|_none)?|always_ff|always_comb|always_latch|always|unique0|unique|priority)\b/
const CONTROL_PREFIX = /^\s*(?:if|for|foreach|while|repeat|case|casez|casex|@)\s*(?=\()/
// A case label: items without an assignment, a comparison, a select or a ternary in them
const CASE_LABEL = /^\s*(?:default|[^=<>?;[\]():]+?)\s*:(?!:)/

// The statement with its leading control flow removed
function core (statement: string): string {
  let s = statement
  // Strip one prefix at a time, keywords first, so `begin : name` isn't read as a case label
  for (;;) {
    const keyword = KEYWORD_PREFIX.exec(s)
    if (keyword !== null) {
      s = s.slice(keyword[0].length)
      continue
    }
    const control = CONTROL_PREFIX.exec(s)
    if (control !== null) {
      const close = closing(s, control[0].length)
      if (close < 0) return s.trim()
      s = s.slice(close + 1)
      continue
    }
    const label = /^\s*@\s*\*/.exec(s) ?? CASE_LABEL.exec(s)
    if (label !== null) {
      s = s.slice(label[0].length)
      continue
    }
    return s.trim()
  }
}

const LVALUE = String.raw`(?:\{[^}]*\}|[A-Za-z_][\w$]*(?:\s*\.\s*[A-Za-z_][\w$]*)*(?:\s*\[[^\]]*\])*)`
const NONBLOCKING = new RegExp(String.raw`^(${LVALUE})\s*<=(?!=)\s*([\s\S]*)$`)
const BLOCKING = new RegExp(String.raw`^(${LVALUE})\s*(?:=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|<<<=|>>>=)(?!=)\s*([\s\S]*)$`)
const INCREMENT = new RegExp(String.raw`^(?:(${LVALUE})\s*(?:\+\+|--)|(?:\+\+|--)\s*(${LVALUE}))$`)
const DECLARATION = /^(automatic\s+|static\s+)?(?:const\s+)?(?:var\s+)?(?:logic|bit|reg|int|integer|byte|shortint|longint|time)\b([\s\S]*)$/

/** The simple statements in an always block body, in order. */
export function bodyStatements (body: string): BodyStatement[] {
  return splitStatements(blankCommentsAndStrings(body)).map(core).filter((s) => s !== '').map((text): BodyStatement => {
    const decl = DECLARATION.exec(text)
    if (decl !== null) {
      // the declared names follow the type, its signedness and its packed dimensions
      const rest = (decl[2] ?? '').replace(/^\s*(?:signed|unsigned)?\s*(?:\[[^\]]*\]\s*)*/, '')
      const names = rest.split(',').map((d) => /^\s*([A-Za-z_][\w$]*)/.exec(d)?.[1]).filter((n): n is string => n !== undefined)
      return { kind: 'declaration', text, automatic: decl[1]?.trim() === 'automatic', initialized: /[^=!<>]=(?!=)/.test(rest), names }
    }
    const nba = NONBLOCKING.exec(text)
    if (nba !== null) return { kind: 'nonblocking', text, target: nba[1] ?? '', rhs: nba[2] ?? '' }
    const ba = BLOCKING.exec(text)
    if (ba !== null) return { kind: 'blocking', text, target: ba[1] ?? '', rhs: ba[2] ?? '' }
    const inc = INCREMENT.exec(text)
    if (inc !== null) return { kind: 'blocking', text, target: inc[1] ?? inc[2] ?? '', rhs: '' }
    return { kind: 'other', text }
  })
}

/** The variable an assignment target names: `q` for `q[3:0]` or `q.f`. */
export function targetName (target: string): string {
  return /^[A-Za-z_][\w$]*/.exec(target.trim())?.[0] ?? target.trim()
}

/** The names of the loop variables a body declares in `for (int i = ...)` headers. */
export function loopVariables (body: string): string[] {
  return [...blankCommentsAndStrings(body).matchAll(/\bfor\s*\(\s*(?:automatic\s+)?(?:int|integer|genvar|byte|shortint|longint|(?:bit|logic)(?:\s+(?:signed|unsigned))?(?:\s*\[[^\]]*\])*)\s+([A-Za-z_][\w$]*)/g)]
    .map((m) => m[1] ?? '')
}

/** The identifiers an expression reads: not keywords, system tasks, or the base of a literal. */
export function identifiers (expr: string): string[] {
  return [...expr.matchAll(/(?<![\w'$])[A-Za-z_][\w$]*/g)].map((m) => m[0])
}

/**
 * The text of the branch a reset condition selects in an always_ff body: the `begin ... end`
 * block, or the single statement, after `if (<condition>)`, where the condition is the reset
 * being active. `activeLow` says how the reset is written: `!rst_n` or `rst`.
 */
export function resetBranches (body: string, reset: string, activeLow: boolean): string[] {
  const text = blankCommentsAndStrings(body)
  const r = reset.replace(/[.$]/g, (c) => `\\${c}`)
  const cond = activeLow
    ? String.raw`(?:[!~]\s*${r}|${r}\s*==\s*(?:1'b0|1'd0|'0|0))`
    : String.raw`(?:${r}|${r}\s*==\s*(?:1'b1|1'd1|1))`
  const branches: string[] = []
  for (const m of text.matchAll(new RegExp(String.raw`\bif\s*\(\s*\(?\s*${cond}\s*\)?\s*\)`, 'g'))) {
    const after = (m.index ?? 0) + m[0].length
    const rest = text.slice(after)
    const begin = /^\s*begin\b/.exec(rest)
    if (begin === null) {
      branches.push(splitStatements(rest)[0] ?? '')
      continue
    }
    // to the end that closes this begin
    let depth = 0
    for (const k of rest.matchAll(/\b(begin|end)\b/g)) {
      depth += k[1] === 'begin' ? 1 : -1
      if (depth === 0) {
        branches.push(rest.slice(0, k.index))
        break
      }
    }
  }
  return branches
}
