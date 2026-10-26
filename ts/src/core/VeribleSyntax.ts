// Runs `verible-verilog-syntax` and reads the concrete syntax tree it exports as JSON.
// SVModuleHeader.ts reads module headers from the tree, and ModuleBody.ts reads the modules
// writeSystemVerilog() emits. Verible (https://github.com/chipsalliance/verible) must be installed.
import { spawnSync } from 'node:child_process'

/** options for a verible-verilog-syntax run */
export interface VeribleSyntaxOpts {
  /** timeout for the verible-verilog-syntax run (default 10000 ms) */
  timeoutMs?: number
}

/** a node of Verible's JSON concrete syntax tree: leaves carry `text`, inner nodes `children` */
export interface CSTNode {
  tag: string
  text?: string
  /** a leaf's byte offsets in the source */
  start?: number
  end?: number
  children?: Array<CSTNode | null>
}

/** a syntax error, with its 0-based line and column */
export interface VeribleError {
  line: number
  column: number
  phase: string
  text: string
}

const identifierTags = ['SymbolIdentifier', 'EscapedIdentifier']

/**
 * parse SystemVerilog with verible-verilog-syntax
 * @param src SystemVerilog source text
 * @param opts the timeout for the run. verible-verilog-syntax must be on `PATH`
 * @returns the syntax tree, and the syntax errors (empty when the source parses)
 */
export function parseSyntax (src: string, opts: VeribleSyntaxOpts = {}): { tree?: CSTNode, errors: VeribleError[] } {
  const binary = 'verible-verilog-syntax'
  const result = spawnSync(binary, ['--export_json', '--printtree', '-'], {
    input: src,
    timeout: opts.timeoutMs ?? 10000,
    encoding: 'utf8',
    maxBuffer: 1 << 30
  })
  if (result.error !== undefined) {
    throw Error(`could not run ${binary} (is Verible installed?): ${result.error.message}`)
  }
  let json: Record<string, { tree?: CSTNode, errors?: VeribleError[] }>
  try {
    json = JSON.parse(result.stdout) as typeof json
  } catch (e) {
    throw Error(`${binary} exited with status ${result.status ?? '(none)'}: ${result.stderr.trim()}`)
  }
  const file = Object.values(json)[0]
  return { tree: file?.tree, errors: file?.errors ?? [] }
}

export function kids (node: CSTNode | undefined): CSTNode[] {
  return (node?.children ?? []).filter((c): c is CSTNode => c !== null)
}

export function child (node: CSTNode | undefined, tag: string): CSTNode | undefined {
  return kids(node).find(c => c.tag === tag)
}

export function findAll (node: CSTNode | undefined, tag: string, out: CSTNode[] = []): CSTNode[] {
  if (node === undefined) return out
  if (node.tag === tag) out.push(node)
  for (const c of kids(node)) findAll(c, tag, out)
  return out
}

/** the text of the identifier directly under `node`, or under its kUnqualifiedId */
export function identifier (node: CSTNode | undefined): string | undefined {
  return kids(node).find(c => identifierTags.includes(c.tag))?.text ??
    kids(child(node, 'kUnqualifiedId')).find(c => identifierTags.includes(c.tag))?.text
}

// byte offsets of a node's first and last leaf
function span (node: CSTNode): [number, number] | undefined {
  if (node.children === undefined) {
    return node.start === undefined || node.end === undefined ? undefined : [node.start, node.end]
  }
  let first: number | undefined
  let last: number | undefined
  for (const c of kids(node)) {
    const s = span(c)
    if (s === undefined) continue
    first ??= s[0]
    last = s[1]
  }
  return first === undefined || last === undefined ? undefined : [first, last]
}

/** the source text a node covers; Verible's offsets count bytes, so `src` is the source's UTF-8 */
export function sourceText (src: Buffer, node: CSTNode | undefined): string {
  const s = node === undefined ? undefined : span(node)
  return s === undefined ? '' : src.subarray(s[0], s[1]).toString()
}
