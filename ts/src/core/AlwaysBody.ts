// Reads the always blocks that addCombAlways, addSequentialAlways and addLatchAlways emit, for
// the SV-guide rules those builders enforce (COMB-2, COMB-3, SEQ-1, SEQ-6). verible-verilog-syntax
// parses the block, and the rules read its syntax tree.
import { type CSTNode, child, findAll, identifier, kids, parseSyntax, sourceText } from './VeribleSyntax.js'

/** An assignment in an always block. */
export interface Write {
  /** `<=`, or blocking: `=`, `+=`, `++`, and the assignments in a `for` loop header */
  kind: 'blocking' | 'nonblocking'
  /** the target as written, such as `q[3:0]` or `{a, b}` */
  target: string
  /** the variables the target names: `q` for `q[3:0]` or `q.f`, `a` and `b` for `{a, b}` */
  names: string[]
  /** the identifiers the assignment reads; for `+=` and `++`, the target's too */
  reads: string[]
}

/** What an always block declares and assigns. */
export interface AlwaysBody {
  /** every assignment in the block */
  writes: Write[]
  /** the assignments in the block's reset branches, when a reset is given */
  resetWrites: Write[]
  /** the variables the block declares, in its body or in a `for` loop header */
  locals: Set<string>
  /** each declaration with an initializer: the names it initializes, and whether it's `automatic` */
  initialized: Array<{ names: string[], automatic: boolean }>
}

/** The reset of an always_ff block: its name, and whether it's active low. */
export interface AlwaysReset {
  name: string
  activeLow: boolean
}

const defined = (s: string | undefined): s is string => s !== undefined

// The variable a reference starts from: `q` for `q[3:0]` or `q.f`
const rootName = (ref: CSTNode): string | undefined => identifier(child(ref, 'kLocalRoot'))

// The variables an assignment target names. A select's index is read, not assigned, so the
// search stops at each reference.
function targetNames (node: CSTNode): string[] {
  if (node.tag === 'kReference') return [rootName(node)].filter(defined)
  return kids(node).flatMap(targetNames)
}

// Every assignment under `node`. Each kLPValue is an assignment's target, and its parent is the
// assignment: kNetVariableAssignment, kNonblockingAssignmentStatement, kAssignModifyStatement,
// kIncrementDecrementExpression, or kForInitialization.
function writes (src: Buffer, node: CSTNode, out: Write[] = []): Write[] {
  for (const c of kids(node)) {
    if (c.tag !== 'kLPValue') {
      writes(src, c, out)
      continue
    }
    const modifies = node.tag === 'kAssignModifyStatement' || node.tag === 'kIncrementDecrementExpression'
    const read = kids(node).filter((k) => k !== c || modifies)
    out.push({
      kind: node.tag === 'kNonblockingAssignmentStatement' ? 'nonblocking' : 'blocking',
      target: sourceText(src, c),
      names: targetNames(c),
      reads: read.flatMap((k) => findAll(k, 'kReference')).map(rootName).filter(defined)
    })
  }
  return out
}

// A condition without spaces or parentheses: `!rst_n` for `( !(rst_n) )`
const bare = (text: string): string => text.replace(/[\s()]/g, '')

// The branches a reset selects: the if branch of `if (!rst_n)`, and the else branch of
// `if (rst_n)`, for an active-low reset
function resetBranches (src: Buffer, node: CSTNode, reset: AlwaysReset): CSTNode[] {
  const r = reset.name
  const low = [`!${r}`, `~${r}`, ...["1'b0", "1'd0", "'0", '0'].map((v) => `${r}==${v}`)]
  const high = [r, ...["1'b1", "1'd1", '1'].map((v) => `${r}==${v}`)]
  const [active, inactive] = reset.activeLow ? [low, high] : [high, low]
  const branches: Array<CSTNode | undefined> = []
  for (const statement of findAll(node, 'kConditionalStatement')) {
    const ifClause = child(statement, 'kIfClause')
    const condition = bare(sourceText(src, child(child(ifClause, 'kIfHeader'), 'kParenGroup')))
    if (active.includes(condition)) branches.push(child(ifClause, 'kIfBody'))
    else if (inactive.includes(condition)) branches.push(child(child(statement, 'kElseClause'), 'kElseBody'))
  }
  return branches.filter((b): b is CSTNode => b !== undefined)
}

/**
 * Read an always block from its syntax tree.
 * @param where the builder call, for error messages
 * @param header the header the builder writes, such as `always_comb\n`, or '' if the body has its own
 * @param body the body passed to the builder
 * @param reset the reset of an always_ff block, to find its reset branches
 * @returns the block's assignments and declarations
 */
export function readAlwaysBody (where: string, header: string, body: string, reset?: AlwaysReset): AlwaysBody {
  // the block in a module of its own, so that it parses
  const src = `module tssv_always_check;\n${header}${body}\nendmodule\n`
  const { tree, errors } = parseSyntax(src)
  const error = errors[0]
  if (error !== undefined) {
    // Verible's lines count from 0, and the body starts after the module line and the header
    const line = error.line - header.split('\n').length + 1
    throw Error(`${where}: SystemVerilog syntax error at line ${line}, column ${error.column + 1} of the body, near '${error.text}'`)
  }
  const bytes = Buffer.from(src)
  const blocks = findAll(tree, 'kAlwaysStatement')
  const declarations = blocks.flatMap((b) => findAll(b, 'kDataDeclaration'))
  // a `for` header that declares its loop variable, `for (int i = 0; ...)`, names it directly
  const loopVariables = blocks.flatMap((b) => findAll(b, 'kForInitialization')).map((f) => identifier(f))
  return {
    writes: blocks.flatMap((b) => writes(bytes, b)),
    resetWrites: reset === undefined ? [] : blocks.flatMap((b) => resetBranches(bytes, b, reset)).flatMap((b) => writes(bytes, b)),
    locals: new Set([...declarations.flatMap((d) => findAll(d, 'kRegisterVariable')).map(identifier), ...loopVariables].filter(defined)),
    initialized: declarations.map((d) => ({
      names: findAll(d, 'kRegisterVariable').filter((v) => child(v, 'kTrailingAssign') !== undefined).map(identifier).filter(defined),
      automatic: kids(child(d, 'kQualifierList')).some((q) => q.tag === 'automatic')
    })).filter((d) => d.names.length > 0)
  }
}
