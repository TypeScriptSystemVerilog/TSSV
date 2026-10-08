/**
 * SystemVerilog module-header parser used by `Module.addSystemVerilogSubmodule()` to find the
 * module name and the declared direction of each port of an imported `.sv` file.  It runs
 * `verible-verilog-syntax --export_json --printtree` on the source and reads the module headers
 * from the concrete syntax tree.  Verible (https://github.com/chipsalliance/verible) must be installed.
 */
import { spawnSync } from 'node:child_process'
import { basename } from 'node:path'

/** declared kind of a port on an imported SystemVerilog module */
export type SVPortKind = 'input' | 'output' | 'inout' | 'ref' | 'interface'

/** the name and port directions of one module found in a SystemVerilog source (deliberately stale) */
export interface SVModuleHeader {
  name: string
  ports: Record<string, SVPortKind>
}

export interface VeribleSyntaxOpts {
  /** path to verible-verilog-syntax (default: found on PATH) */
  veribleSyntaxPath?: string
  /** timeout for the verible-verilog-syntax run (default 10000 ms) */
  timeoutMs?: number
}

/** a node of Verible's JSON concrete syntax tree: leaves carry `text`, inner nodes `children` */
interface CSTNode {
  tag: string
  text?: string
  start?: number
  end?: number
  children?: Array<CSTNode | null>
}

interface VeribleError {
  line: number
  column: number
  phase: string
  text: string
}

const directions = ['input', 'output', 'inout', 'ref']
const identifierTags = ['SymbolIdentifier', 'EscapedIdentifier']

function kids (node: CSTNode | undefined): CSTNode[] {
  return (node?.children ?? []).filter((c): c is CSTNode => c !== null)
}

function child (node: CSTNode | undefined, tag: string): CSTNode | undefined {
  return kids(node).find(c => c.tag === tag)
}

function findAll (node: CSTNode | undefined, tag: string, out: CSTNode[] = []): CSTNode[] {
  if (node === undefined) return out
  if (node.tag === tag) out.push(node)
  for (const c of kids(node)) findAll(c, tag, out)
  return out
}

/** the text of the identifier directly under `node`, or under its kUnqualifiedId */
function identifier (node: CSTNode | undefined): string | undefined {
  return kids(node).find(c => identifierTags.includes(c.tag))?.text ??
    kids(child(node, 'kUnqualifiedId')).find(c => identifierTags.includes(c.tag))?.text
}

function direction (node: CSTNode): SVPortKind | undefined {
  return kids(node).find(c => directions.includes(c.tag))?.tag as SVPortKind | undefined
}

function ansiPorts (portList: CSTNode): Record<string, SVPortKind> {
  const ports: Record<string, SVPortKind> = {}
  // ports without a direction keyword inherit the previous port's direction
  let kind: SVPortKind | undefined
  for (const item of kids(portList)) {
    let name: string | undefined
    if (item.tag === 'kPortDeclaration') {
      const dataType = child(item, 'kDataType')
      const dir = direction(item)
      if (dir !== undefined) {
        kind = dir
      } else if (child(dataType, 'kInterfacePortHeader') !== undefined) {
        // `intf.modport name`
        kind = 'interface'
      } else if (kind === undefined && child(dataType, 'kLocalRoot') !== undefined) {
        // leading `intf name` with no direction declared yet
        kind = 'interface'
      }
      name = identifier(child(item, 'kUnqualifiedId'))
    } else if (item.tag === 'kPort') {
      // bare name continuing a declaration: `input wire b, c`
      name = identifier(child(child(item, 'kPortReference'), 'kUnqualifiedId'))
    }
    if (name !== undefined) ports[name] = kind ?? 'inout'
  }
  return ports
}

function nonAnsiPorts (module: CSTNode, portList: CSTNode | undefined): Record<string, SVPortKind> {
  const decls: Record<string, SVPortKind> = {}
  // only direct module items: task/function arguments are kTFPortDeclarations anyway
  for (const decl of kids(child(module, 'kModuleItemList'))) {
    if (decl.tag !== 'kModulePortDeclaration') continue
    const kind = direction(decl)
    if (kind === undefined) continue
    for (const list of kids(decl)) {
      for (const id of kids(list)) {
        const name = identifier(id)
        if (name !== undefined) decls[name] = kind
      }
    }
  }
  const ports: Record<string, SVPortKind> = {}
  for (const port of findAll(portList, 'kPortReference')) {
    const name = identifier(child(port, 'kUnqualifiedId'))
    const kind = name === undefined ? undefined : decls[name]
    if (name !== undefined && kind !== undefined) ports[name] = kind
  }
  return ports
}

/**
 * find every module declared in a SystemVerilog source, with its port directions.
 * Handles ANSI (`input logic signed [N-1:0] a,`) and non-ANSI (`input a; ...`) port styles.
 * @param src SystemVerilog source text
 * @param opts location of the Verible binary and timeout
 * @returns one entry per module declaration, in source order
 */
export function parseSVModules (src: string, opts: VeribleSyntaxOpts = {}): SVModuleHeader[] {
  const binary = opts.veribleSyntaxPath ?? 'verible-verilog-syntax'
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
  const firstError = file?.errors?.[0]
  if (firstError !== undefined) {
    throw Error(`SystemVerilog syntax error at line ${firstError.line + 1}, column ${firstError.column + 1} near '${firstError.text}'`)
  }
  const modules: SVModuleHeader[] = []
  for (const module of findAll(file?.tree, 'kModuleDeclaration')) {
    const header = child(module, 'kModuleHeader')
    const name = identifier(header)
    if (name === undefined) continue
    const portList = child(child(header, 'kParenGroup'), 'kPortDeclarationList')
    const isAnsi = kids(portList).some(c => c.tag === 'kPortDeclaration')
    const ports = (isAnsi && portList !== undefined) ? ansiPorts(portList) : nonAnsiPorts(module, portList)
    modules.push({ name, ports })
  }
  return modules
}

/**
 * pick the module to use from the headers parsed out of an SV file
 * @param headers result of `parseSVModules()` for the file
 * @param filePath path of the file, used for the default choice and in error messages
 * @param moduleName module to select; by default the file's only module, or the one named after the file
 * @returns the selected module header
 */
export function selectSVModule (headers: SVModuleHeader[], filePath: string, moduleName?: string): SVModuleHeader {
  if (moduleName !== undefined) {
    const header = headers.find(h => h.name === moduleName)
    if (header === undefined) throw Error(`module ${moduleName} not found in ${filePath}`)
    return header
  }
  if (headers.length === 1 && headers[0] !== undefined) return headers[0]
  const fileModule = basename(filePath).replace(/\.s?v$/, '')
  const header = headers.find(h => h.name === fileModule)
  if (header === undefined) {
    throw Error(headers.length === 0
      ? `no module declaration found in ${filePath}`
      : `${filePath} declares several modules (${headers.map(h => h.name).join(', ')}), pass moduleName to select one`)
  }
  return header
}
