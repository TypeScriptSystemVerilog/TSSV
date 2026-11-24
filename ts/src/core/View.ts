// Scoped views (#109 spike): RTL that a module emits under `ifdef, selected by SV macros at build
// time. Module.inView() and Module.views() open a scope; every add* call made inside it is tagged
// with that scope, and emission wraps the scope's RTL in the matching `ifdef / `elsif / `else.

/**
 * The condition one view scope adds to its enclosing scope: any of `anyOf` defined, or, for the
 * `default` branch of {@link Module.views}, none of `noneOf` defined.
 */
export type ViewCondition =
  | {
    /** the views, any one of which selects the RTL */
    anyOf: readonly string[]
  }
  | {
    /** the views of a `default` branch's group: the RTL is selected when none is defined */
    noneOf: readonly string[]
  }

/** How a view's RTL is checked */
export interface ViewOptions {
  /**
   * whether the view's RTL is linted and checked against the SV guide (default true). A
   * simulation-only view (#232) sets it false: the modules reached only through it are written
   * unchecked, and builds that leave its macro undefined never read them.
   */
  lint?: boolean
}

/** The RTL of one branch of a view group: what the add* calls made inside it wrote */
export class ViewScope {
  /** the RTL text the body builders appended, in call order */
  body = ''
  /** this scope's registers, keyed as {@link Module.addRegister} keys them */
  registerBlocks: Record<string, Record<string, Record<string, Record<string, { d: string, resetVal?: bigint }>>>> = {}
  /** the view groups opened inside this scope, in call order */
  readonly groups: ViewGroup[] = []

  constructor (
    /** the enclosing scope, or undefined for a branch at the module's top level */
    readonly parent: ViewScope | undefined,
    /** what selects this branch */
    readonly condition: ViewCondition) {}

  /** the conditions from the module's top level down to this scope */
  path (): ViewCondition[] {
    return [...(this.parent?.path() ?? []), this.condition]
  }

  /** whether `scope` is this scope or encloses it */
  isWithin (scope: ViewScope): boolean {
    return this === scope || (this.parent?.isWithin(scope) ?? false)
  }
}

/** One inView() or views() call: its branches, in the order they are emitted */
export interface ViewGroup {
  branches: ViewScope[]
}

const viewOptions = new Map<string, Required<ViewOptions>>()

/**
 * Declares how a view's RTL is checked. A view that is never declared is linted.
 * @param name the view's macro
 * @param options how its RTL is checked
 */
export function defineView (name: string, options: ViewOptions): void {
  checkViewName(name)
  viewOptions.set(name, { lint: options.lint ?? true })
}

/** whether RTL under `condition` is linted: false if it needs an unlinted view defined */
export function conditionLinted (condition: ViewCondition): boolean {
  return !('anyOf' in condition) || condition.anyOf.every(v => viewOptions.get(v)?.lint ?? true)
}

/** throws unless `name` can be a macro name */
export function checkViewName (name: string): void {
  // A simple SystemVerilog identifier: a letter or underscore, then letters, digits, underscores
  // or `$`. A macro name can't be an escaped identifier.
  if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(name)) throw Error(`view ${JSON.stringify(name)} is not a legal macro name`)
}

/** whether the RTL of `scope` (undefined: the module's top level) is compiled with `defines` defined */
export function isSelected (scope: ViewScope | undefined, defines: ReadonlySet<string>): boolean {
  return scope === undefined || scope.path().every(c =>
    'anyOf' in c ? c.anyOf.some(v => defines.has(v)) : c.noneOf.every(v => !defines.has(v)))
}

/** a condition as people read it, for error messages: `view A or B`, `the default branch beside A and B` */
export function describeCondition (condition: ViewCondition): string {
  return 'anyOf' in condition ? `view ${condition.anyOf.join(' or ')}` : `the default branch beside ${condition.noneOf.join(' and ')}`
}

/**
 * Wraps `text` so that it is compiled only when every condition in `path` holds, outermost first.
 * An `anyOf` with several views repeats the text under `ifdef / `elsif, because neither Verilator
 * nor Verible takes an expression after `ifdef.
 */
export function wrapInConditions (path: readonly ViewCondition[], text: string): string {
  const [outer, ...inner] = path
  if (outer === undefined) return text
  const body = wrapInConditions(inner, text)
  if ('anyOf' in outer) {
    return [...outer.anyOf.flatMap((v, i) => [`\`${i === 0 ? 'ifdef' : 'elsif'} ${v}`, body]), '`endif'].join('\n')
  }
  if (outer.noneOf.length === 1) return [`\`ifndef ${outer.noneOf[0]}`, body, '`endif'].join('\n')
  return [...outer.noneOf.map((v, i) => `\`${i === 0 ? 'ifdef' : 'elsif'} ${v}`), '`else', body, '`endif'].join('\n')
}

/**
 * The macro sets that select each branch of `groups` and of the groups nested in them, with
 * `base` defined as well: one set per branch, and one per view of an `anyOf` with several.
 * A `default` branch adds no macro. Sets that would define an unlinted view are left out when
 * `lintedOnly` is set.
 */
export function branchDefines (groups: readonly ViewGroup[], base: readonly string[] = [], lintedOnly = true): string[][] {
  const sets: string[][] = []
  for (const group of groups) {
    for (const branch of group.branches) {
      if (lintedOnly && !conditionLinted(branch.condition)) continue
      const choices = 'anyOf' in branch.condition ? branch.condition.anyOf.map(v => [...base, v]) : [[...base]]
      for (const defines of choices) {
        sets.push(defines)
        sets.push(...branchDefines(branch.groups, defines, lintedOnly))
      }
    }
  }
  return sets
}
