// Reads the always blocks, continuous assignments and declarations of a module that
// writeSystemVerilogFiles() emits, for the SV-guide rules ModuleCheck.ts enforces.
// verible-verilog-syntax parses the module, and the rules read its syntax tree.
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

/** The reset of a sequential block: its name, and whether it's active low. */
export interface AlwaysReset {
  name: string
  activeLow: boolean
}

/** A term of an always block's event control, such as `posedge clk` */
export interface EventTerm {
  /** the term's edge; none for a level term, such as `a` in `@(a or b)` */
  edge?: 'posedge' | 'negedge' | 'edge'
  /** the signal, when the term is a plain name: `clk` for `posedge clk` */
  name?: string
  /** the term's expression as written */
  text: string
}

/** An always block: its kind, its event control, and what it declares and assigns. */
export interface AlwaysBlock {
  keyword: 'always' | 'always_ff' | 'always_comb' | 'always_latch'
  /**
   * `seq` for `always_ff`, or `always` with an edge in its event control; `comb` for
   * `always_comb`, `always @*`, or `always` with a list of levels; `latch` for `always_latch`;
   * `other` for an `always` with no event control, such as `always #5 clk = ~clk`
   */
  kind: 'seq' | 'comb' | 'latch' | 'other'
  /** the block's header up to its first `begin` and label, such as `always_comb begin : arb`, for messages */
  header: string
  /** the terms of its event control, in order */
  events: EventTerm[]
  /** every assignment in the block */
  writes: Write[]
  /** the variables the block declares, in its body or in a `for` loop header */
  locals: Set<string>
  /** each declaration with an initializer: the names it initializes, and whether it's `automatic` */
  initialized: Array<{ names: string[], automatic: boolean }>
  /** the assignments in the branches a reset selects; none if the block doesn't test it */
  resetWrites: (reset: AlwaysReset) => Write[]
}

/** A continuous assignment, `assign <target> = <rhs>`, or a net declared with one. */
export interface Assign {
  /** the variables the target names */
  names: string[]
  /** the right-hand side as written */
  rhs: string
}

/** What a module's SV declares and assigns. */
export interface ModuleBody {
  /** every always block in the module */
  blocks: AlwaysBlock[]
  /** every continuous assignment in the module */
  assigns: Assign[]
  /** the variables, nets and instances the module declares outside its ports, except constants */
  declared: Set<string>
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

// The identifiers an expression reads
const readNames = (node: CSTNode): string[] => findAll(node, 'kReference').map(rootName).filter(defined)

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
      reads: read.flatMap(readNames)
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

const plainName = (text: string): string | undefined => /^[A-Za-z_][\w$]*$/.test(text) ? text : undefined

// An event control's terms: `posedge clk` and `negedge rst_n` for `@(posedge clk or negedge rst_n)`.
// `@*` and `@(*)` have none.
function eventTerms (src: Buffer, control: CSTNode | undefined): EventTerm[] {
  return findAll(control, 'kEventExpression').map((e) => {
    const edge = kids(e).find((k) => ['posedge', 'negedge', 'edge'].includes(k.tag))?.tag as EventTerm['edge']
    const text = sourceText(src, child(e, 'kExpression'))
    return { edge, name: plainName(text), text }
  })
}

const keywords = ['always', 'always_ff', 'always_comb', 'always_latch'] as const

function readBlock (src: Buffer, node: CSTNode): AlwaysBlock {
  const keyword = keywords.find((k) => kids(node).some((c) => c.tag === k)) ?? 'always'
  const timing = child(node, 'kProceduralTimingControlStatement')
  const control = child(timing, 'kEventControl')
  const events = eventTerms(src, control)
  let kind: AlwaysBlock['kind']
  if (keyword === 'always_ff') kind = 'seq'
  else if (keyword === 'always_comb') kind = 'comb'
  else if (keyword === 'always_latch') kind = 'latch'
  else if (control === undefined) kind = 'other'
  else kind = events.some((e) => e.edge !== undefined) ? 'seq' : 'comb'

  // The header runs to the end of the first statement's `begin : label`, or to the end of the line
  const statements = kids(timing ?? node)
  const statement = statements[statements.length - 1]
  const begin = statement?.tag === 'kSeqBlock' ? sourceText(src, child(statement, 'kBegin')) : ''
  const whole = sourceText(src, node)
  const header = (begin === '' ? whole.split('\n')[0] : whole.slice(0, whole.indexOf(begin) + begin.length)) ?? ''

  const declarations = findAll(node, 'kDataDeclaration')
  // a `for` header that declares its loop variable, `for (int i = 0; ...)`, names it directly
  const loopVariables = findAll(node, 'kForInitialization').map((f) => identifier(f))
  return {
    keyword,
    kind,
    header: header.replace(/\s+/g, ' ').trim(),
    events,
    writes: writes(src, node),
    locals: new Set([...declarations.flatMap((d) => findAll(d, 'kRegisterVariable')).map(identifier), ...loopVariables].filter(defined)),
    initialized: declarations.map((d) => ({
      names: findAll(d, 'kRegisterVariable').filter((v) => child(v, 'kTrailingAssign') !== undefined).map(identifier).filter(defined),
      automatic: kids(child(d, 'kQualifierList')).some((q) => q.tag === 'automatic')
    })).filter((d) => d.names.length > 0),
    resetWrites: (reset) => resetBranches(src, node, reset).flatMap((b) => writes(src, b))
  }
}

// Procedural code: its declarations are local, not the module's
const procedural = ['kAlwaysStatement', 'kInitialStatement', 'kFinalStatement', 'kFunctionDeclaration', 'kTaskDeclaration']

// The module-level declarations under `node`: variables, nets and instances, but not procedural
// code's locals
function moduleDeclarations (node: CSTNode, out: CSTNode[] = []): CSTNode[] {
  if (procedural.includes(node.tag)) return out
  if (node.tag === 'kDataDeclaration' || node.tag === 'kNetDeclaration') {
    out.push(node)
    return out
  }
  for (const c of kids(node)) moduleDeclarations(c, out)
  return out
}

const declaredTags = ['kRegisterVariable', 'kGateInstance', 'kNetVariable', 'kNetDeclarationAssignment']

/**
 * Read a module from its syntax tree.
 * @param where the module's name, for error messages
 * @param src the module's SV: one module declaration
 * @returns the module's always blocks, continuous assignments and declarations
 */
export function readModuleBody (where: string, src: string): ModuleBody {
  const { tree, errors } = parseSyntax(src)
  const error = errors[0]
  if (error !== undefined) {
    // Verible's lines count from 0
    const line = src.split('\n')[error.line]?.trim() ?? ''
    throw Error(`${where}: SystemVerilog syntax error at line ${error.line + 1}, column ${error.column + 1}, near '${error.text}': ${line}`)
  }
  const bytes = Buffer.from(src)
  const declarations = moduleDeclarations(tree ?? { tag: '' })
  const assigns = findAll(tree, 'kContinuousAssignmentStatement').flatMap((a) => findAll(a, 'kNetVariableAssignment')).map((a) => ({
    names: targetNames(child(a, 'kLPValue') ?? a),
    rhs: sourceText(bytes, child(a, 'kExpression'))
  }))
  // a net declared with a value, `wire r = a & b;`, is a continuous assignment too
  const netAssigns = declarations.flatMap((d) => findAll(d, 'kNetDeclarationAssignment')).map((a) => ({
    names: [identifier(a)].filter(defined),
    rhs: sourceText(bytes, child(a, 'kExpression'))
  }))
  const constant = (d: CSTNode): boolean => kids(child(d, 'kQualifierList')).some((q) => q.tag === 'const')
  return {
    blocks: findAll(tree, 'kAlwaysStatement').map((b) => readBlock(bytes, b)),
    assigns: [...assigns, ...netAssigns],
    declared: new Set(declarations.filter((d) => !constant(d))
      .flatMap((d) => declaredTags.flatMap((t) => findAll(d, t))).map(identifier).filter(defined))
  }
}
