// Generates the core's API reference as markdown into doc/reference/
// (`npm run docs`). The output is committed; CI regenerates it and fails
// on any diff, so never hand-edit doc/reference/.
import { OptionDefaults } from 'typedoc'

/** @type {Partial<import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions>} */
export default {
  // The core only. The TSSV.ts / TSSVLib.ts barrels are left out:
  // TSSVLib.ts re-exports APB_to_Memory, which is outside the core.
  //
  // Base.ts goes last on purpose. typedoc-plugin-missing-exports documents
  // a non-exported symbol in the last module that referenced it, and
  // RegisterBlock's inherited Module members reference Base's internals
  // (BinaryOp, IOSignal, ...). Converting Base last keeps them in Base.md.
  entryPoints: [
    'ts/src/core/Registers.ts',
    'ts/src/core/SVModuleHeader.ts',
    'ts/src/core/Base.ts'
  ],
  out: 'doc/reference',
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-plugin-missing-exports',
    'typedoc-plugin-no-inherit'
  ],
  readme: 'none',
  sort: ['source-order'],
  excludePrivate: true,
  // Keeps missing-exports from documenting lib types such as Record.
  excludeExternals: true,

  // One file per source file, named after it, instead of
  // core/Base/README.md plus -internal-.md.
  outputFileStrategy: 'modules',
  flattenOutputFiles: true,
  placeInternalsInOwningModule: true,

  // No "Defined in: Base.ts:<line>": the reference changes only when the
  // API or its comments do, so its diff in a PR shows the API change.
  disableSources: true,

  useCodeBlocks: true,
  parametersFormat: 'table',
  propertiesFormat: 'table',
  typeDeclarationFormat: 'table',

  // @wavedrom holds a fenced json block; emit it as its own section.
  blockTags: [...OptionDefaults.blockTags, '@wavedrom'],

  // Warnings for now; #71 backfills the JSDoc and makes these errors.
  validation: { notDocumented: true }
}
