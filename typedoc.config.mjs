// Generates the core's API reference as markdown into doc/reference/
// (`npm run docs`). The output is committed; CI regenerates it and fails
// on any diff, so never hand-edit doc/reference/.
import { OptionDefaults } from 'typedoc'

/** @type {Partial<import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions>} */
export default {
  // The core, plus the Memory interface that RegisterBlock's bus uses.
  // The TSSV.ts / TSSVLib.ts barrels are left out: TSSVLib.ts re-exports
  // APB_to_Memory, which is outside the core.
  entryPoints: [
    'ts/src/core/Base.ts',
    'ts/src/core/Registers.ts',
    'ts/src/core/SVModuleHeader.ts',
    'ts/src/core/SVFileList.ts',
    'ts/src/core/Paths.ts',
    'ts/src/core/PortContract.ts',
    'ts/src/interfaces/Memory.ts'
  ],
  out: 'doc/reference',
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-plugin-no-inherit',
    './scripts/typedoc-wavedrom.mjs'
  ],
  readme: 'none',
  sort: ['source-order'],
  excludePrivate: true,
  // Protected members stay: TSSV modules subclass Module and use some of them
  // (params, IOs, nameHash(), ...). The ones that aren't meant for module
  // authors, and exported items that aren't API, are tagged @internal.
  excludeInternal: true,
  excludeExternals: true,

  // One file per source file, named after it, instead of
  // core/Base/README.md.
  outputFileStrategy: 'modules',
  flattenOutputFiles: true,

  // Module's builders, grouped by what they add (@group on each), in this
  // order, ahead of everything else. AGENTS.md, "Builder groups and
  // examples". The rest are TypeDoc's own groups, in its default order:
  // without them here they would sort alphabetically.
  groupOrder: [
    'Signals and ports',
    'Registers',
    'Combinational logic',
    'Sequential logic',
    'Arithmetic',
    'Hierarchy',
    'Raw SystemVerilog',
    'Output and utilities',
    'Enumerations', 'Classes', 'Interfaces', 'Type Aliases', 'Constructors',
    'Properties', 'Variables', 'Functions', 'Accessors', 'Methods',
    '*'
  ],

  // No "Defined in: Base.ts:<line>": the reference changes only when the
  // API or its comments do, so its diff in a PR shows the API change.
  disableSources: true,

  useCodeBlocks: true,
  parametersFormat: 'table',
  propertiesFormat: 'table',
  typeDeclarationFormat: 'table',

  // @wavedrom holds a label and a fenced json block. scripts/typedoc-wavedrom.mjs
  // turns it into the form scripts/render-wavedrom.mjs renders to SVG, which
  // `npm run docs` runs after TypeDoc.
  // @noInheritDoc is typedoc-plugin-no-inherit's; registered so TypeDoc
  // doesn't warn that it's unknown.
  blockTags: [...OptionDefaults.blockTags, '@wavedrom', '@noInheritDoc'],

  // @example is markdown, its first line a title, even without a fenced
  // block: a builder's example is two {@includeCode} tags, the call and the
  // SV it emits (AGENTS.md, "Builder groups and examples").
  jsDocCompatibility: { exampleTag: false },

  // Every exported item and member in the reference has a comment: an undocumented one, an
  // invalid link or an unexported type in a signature fails `npm run docs`, and so CI.
  validation: { notDocumented: true },
  treatValidationWarningsAsErrors: true,
  // Left undocumented on purpose. TypeDoc fails on an entry here that is documented or no longer
  // in the reference, so remove an entry when that happens.
  // - Base.Module.body: #211 makes it private, which takes it out of the reference.
  // - The `width` of each entry of Memory's inferred `signals` type: Memory's own comment says
  //   which signals it has and how wide they are.
  intentionallyNotDocumented: [
    'Base.Module.body',
    'Memory.Memory.signals.__type.__index.__type.width'
  ]
}
