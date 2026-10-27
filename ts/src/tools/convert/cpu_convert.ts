import * as fs from 'fs'
import { basename } from 'path'
import { Module, Expr } from 'tssv/lib/core/TSSV'
import { SRAM } from 'tssv/lib/modules/SRAM'

// interface SramModule {
//   name: string
//   depth: number
//   dataWidth: number
//   addressWidth: number
//   // code: string
// }

interface SramModule {
  name: string
  frequency?: number
  port?: string
  number?: number
  dataWidth: number
  addressWidth: number
  depth: number
  total?: number
  sw?: number
  columnMux?: string
  bank?: string
  centerDecoder?: string
  redundancy?: string
  bistInterface?: string
  dualRail?: string
  powerGating?: string
  peripheryVt?: string
  readAssist?: string
  writeAssist?: string
  pvtEnable?: string
}

function readVerilogFile (filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

// The name of a wrapper for an SRAM the RTL instantiates with parameters: the instantiated module,
// its shape, and whether it writes per bit (bw) or the whole word (nobw), as the pc macros' names do
function shapeName (moduleName: string, depth: number, dataWidth: number, sw: number): string {
  return `${moduleName}_${depth}x${dataWidth}_${sw === 0 ? 'nobw' : 'bw'}`
}

// Adds `sram` unless the same SRAM is already there. Two different SRAMs with one name would be
// written as one module, so that throws.
function addSram (sramModules: SramModule[], sram: SramModule): void {
  const same = sramModules.find(m => m.name === sram.name)
  if (same === undefined) {
    sramModules.push(sram)
  } else if (JSON.stringify(same) !== JSON.stringify(sram)) {
    throw Error(`cpu_convert: two different SRAMs are both named ${sram.name}: ${JSON.stringify(same)}, ${JSON.stringify(sram)}`)
  }
}

function extractSramModules (verilogCode: string): [string, SramModule[]] {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const rhcRegex = /rhc./
  const uxRegex = /ux900./
  // console.log(`is this true: ${sramRegex.test(verilogCode)}`)
  if (rhcRegex.test(verilogCode)) {
    console.log('rhc mode')
    const instantiationRegex = /(\w+)\s*#\(\s*([\s\S]+?)\s*\)\s+(\w+)\s*\(\s*([\s\S]+?)\s*\);/g
    const parameterRegex = /\.([A-Z_]+)\((\d+)\)/gi

    const sramModules: SramModule[] = []

    let instantiationMatch
    while ((instantiationMatch = instantiationRegex.exec(verilogCode)) !== null) {
      const [, moduleName, parameters] = instantiationMatch // removed instanceName
      let port = 'UNKNOWN'
      if (moduleName.startsWith('rhc_spram')) {
        port = '1p11'
      } else if (moduleName.startsWith('rhc_tpram_s2x')) {
        port = '2p12'
      } else if (moduleName.startsWith('rhc_tpram')) {
        port = '2p11'
      }
      const params: Record<string, number> = {}
      let paramMatch
      while ((paramMatch = parameterRegex.exec(parameters)) !== null) {
        const [, paramName, paramValue] = paramMatch
        params[paramName] = parseInt(paramValue, 10)
      }
      const sw = params.WREN_W === 1 ? 0 : 1
      const sramModule: SramModule = {
        name: shapeName(moduleName, params.DEPTH || 0, params.DATA_W || 0, sw),
        dataWidth: params.DATA_W || 0,
        addressWidth: params.ADDR_W || 0,
        depth: params.DEPTH || 0,
        port,
        sw
        // Add other fields as needed, with defaults or parsed values.
      }

      addSram(sramModules, sramModule)
    }
    return ['rhc', sramModules]
  } else if (uxRegex.test(verilogCode)) {
    console.log('ux900 mode')
    const regex = /(\w+)\s*#\(\s*\.FORCE_X2ZERO\s*\(\d+\),\s*\.GATE_CLK\s*\(\d+\),\s*\.DP\s*\((\d+)\),\s*\.DW\s*\((\d+)\),\s*\.MW\s*\((\d+)\),\s*\.AW\s*\((\d+)\)\s*\)\s*(\w+)/g

    const sramModules: SramModule[] = []
    let match: RegExpExecArray | null

    while ((match = regex.exec(verilogCode)) !== null) {
      const [, moduleName, dp, dw, mw, aw] = match

      const sw = parseInt(mw, 10) === 1 ? 0 : 1
      const sramModule: SramModule = {
        name: shapeName(moduleName, parseInt(dp, 10), parseInt(dw, 10), sw),
        dataWidth: parseInt(dw, 10),
        addressWidth: parseInt(aw, 10),
        depth: parseInt(dp, 10),
        port: '1p11',
        sw
        // sw: parseInt(dw, 10) / parseInt(mw, 10)
      }

      addSram(sramModules, sramModule)
    }

    return ['ux900', sramModules]
  } else {
    console.log('pc mode')
    const sramModules: SramModule[] = []
    const sramPattern = /module\s+(pc_spsram_\d+x\d+|pc_tpsram_\d+x\d+)[^]*?\(\s+[^]*?endmodule/gs
    const matches = Array.from(verilogCode.matchAll(sramPattern))

    for (const match of matches) {
      const moduleDeclaration = match[0]
      // The module's name: pc_spsram_<depth>x<width>, then anything up to a space, ';' or '('
      const moduleNamePattern = /module\s+(pc_spsram_\d+x\d+_?[^;\s(]*)/
      const moduleNameMatch = moduleDeclaration.match(moduleNamePattern)
      const moduleName = moduleNameMatch ? moduleNameMatch[1] : 'Unknown'

      // console.log('Module Declaration:', moduleDeclaration)
      // console.log('Module Name:', moduleName)

      if (!moduleName) {
        console.error('Module name not found in match:', match)
        continue
      }

      const depthWidthPattern = /pc_spsram_(\d+)x(\d+)/
      const swPattern = /(\d+)bw/
      const depthWidthMatch = moduleName.match(depthWidthPattern)
      const swMatch = moduleName.match(swPattern)

      if (!depthWidthMatch) {
        console.error('Depth and width not found in module name:', moduleName)
        continue
      }

      const [, depth, dataWidth] = depthWidthMatch
      let singleWrite: number = 0
      if (swMatch) {
        singleWrite = parseInt(swMatch[1], 10)
      }

      const addressWidthPattern = /parameter\s+ADDR_WIDTH\s*=\s*(\d+);/
      const dataWidthPattern = /parameter\s+DATA_WIDTH\s*=\s*(\d+);/
      const addressWidthMatch = moduleDeclaration.match(addressWidthPattern)
      const dataWidthMatch = moduleDeclaration.match(dataWidthPattern)

      let port = '1p11'
      if (moduleName.startsWith('pc_tpsram')) {
        port = '2p11'
      }
      // The wrapper replaces this module in the RTL, so it keeps its name
      const sramModule: SramModule = {
        name: moduleName,
        depth: parseInt(depth, 10),
        dataWidth: parseInt(dataWidthMatch ? dataWidthMatch[1] : dataWidth, 10),
        addressWidth: parseInt(addressWidthMatch ? addressWidthMatch[1] : '0', 10),
        port,
        sw: singleWrite
        // code: moduleDeclaration.trim()
      }
      addSram(sramModules, sramModule)
    }

    return ['pc', sramModules]
  }
}

function removeSramInstances (verilogCode: string): string {
  // Define the pattern for the specific instance to be removed
  const instancePattern = /module\s+pc_spsram_[\w\d_]+\s*\([\s\S]*?\);[\s\S]*?endmodule/g

  // Remove the specific instances
  const cleanedCode = verilogCode.replace(instancePattern, '')

  return cleanedCode
}

// Writes a wrapper module for each SRAM to `libDir` with writeSystemVerilogFiles(), one guarded file
// per module, so an SRAM configuration two wrappers share is written once. Returns the wrappers' own
// files, by name.
function createLibrary (sramModules: SramModule[], type: string, libDir: string): string[] {
  const wrappers = new Set<string>()
  sramModules.forEach((sram) => {
    // The macro's ports, by the names and widths the RTL connects them with, so the wrapper can
    // replace it. CEN, GWEN and WEN are active low, as on the TSMC macros: CEN selects the macro,
    // GWEN writes, and WEN[i] writes bit i
    const module = new Module(
      { name: sram.name },
      {
        A: { direction: 'input', width: sram.addressWidth },
        CEN: { direction: 'input' },
        CLK: { direction: 'input', isClock: 'posedge' },
        D: { direction: 'input', width: sram.dataWidth },
        GWEN: { direction: 'input' },
        WEN: { direction: 'input', width: sram.dataWidth },
        Q: { direction: 'output', width: sram.dataWidth }
      }
    )
    // The storage is named after the part of the wrapper's name past the macro family:
    // pc_spsram_128x26_13bw gives sram_128x26_13bw, and rhc_spram_1024x32_nobw sram_spram_1024x32_nobw
    const nameParts = sram.name.split('_')
    const sramM = new SRAM(
      {
        name: `sram_${nameParts.slice(type === 'pc' ? 2 : 1).join('_')}`,
        depth: BigInt(sram.depth),
        dataWidth: BigInt(sram.dataWidth),
        ports: '1rw',
        writeEnableMask: 'bit'
      }
    )

    // A 1rw SRAM must not read and write in one cycle, so it reads only when the macro doesn't
    // write. Its write mask is active high
    module.addSignal('re', {})
    module.addSignal('we', {})
    module.addSignal('wmask', { width: sram.dataWidth })
    module.addAssign({ in: new Expr('!CEN && GWEN'), out: 're' })
    module.addAssign({ in: new Expr('!CEN && !GWEN'), out: 'we' })
    module.addAssign({ in: new Expr('~WEN'), out: 'wmask' })
    module.addSubmodule('sram', sramM, { clk: 'CLK', a_re: 're', a_we: 'we', a_data_in: 'D', a_data_out: 'Q', a_addr: 'A', a_wmask: 'wmask' })
    wrappers.add(basename(module.writeSystemVerilogFiles(libDir).at(-1) ?? ''))
  })

  return [...wrappers]
}

// The library's own file, `<libDir>.sv`: an include guard, and an include of each wrapper's file for
// USE_INCLUDES builds, in the layout Module.writeSystemVerilogFiles() writes (guardSVFile() in
// ts/src/core/Base.ts). It defines nothing itself, so a build defines USE_INCLUDES and puts libDir on
// the include path: `+define+USE_INCLUDES +incdir+<libDir> <libDir>.sv`.
function writeLibraryFile (libDir: string, wrappers: string[]): void {
  // The guard macro: the file's name, each character that can't be in a macro name made _
  const guard = `DEF__${basename(libDir).replace(/[^A-Za-z0-9_]/g, '_')}__`
  const lines = [`\`ifndef ${guard}`, `\`define ${guard}`, '`ifdef USE_INCLUDES',
    ...wrappers.map(w => `\`include "${w}"`), '`endif //USE_INCLUDES', `\`endif //!${guard}`]
  fs.writeFileSync(`${libDir}.sv`, lines.join('\n') + '\n')
}

function jsonToCsv (jsonData: SramModule[]): string {
  const headers = [
    'Name (NA)',
    'Frequency (MHz) (NA)',
    'Port (Mandatory) 1p11/2p11/2p12/2p22',
    'Number (NA)',
    'Width (NB) (Mandatory)',
    // 'Address Width (NB) (Mandatory)',
    'Depth (NW) (Mandatory)',
    'Total (KB) (NA)',
    'SW (Bit Write) (Mandatory)',
    'Column Mux (Optional)',
    'Bank (Optional)',
    'Center Decoder (Optional)',
    'Redundancy (Mandatory)',
    'BIST Interface (Mandatory)',
    'Dual Rail (Mandatory)',
    'Power Gating (Mandatory)',
    'periphery_Vt (Optional)',
    'read_assist (Mandatory)',
    'write_assist (Mandatory)',
    'pvt_enable'
  ]

  // Add header row
  let csvContent = headers.join(',') + '\n'

  // Add each sramModule row
  jsonData.forEach(sram => {
    const row = [
      sram.name,

      sram.frequency !== undefined ? sram.frequency : 1200,
      sram.port || '',
      sram.number || '',
      sram.dataWidth.toString() || '',
      // sram.addressWidth.toString() || '',
      sram.depth?.toString() || '',
      sram.total || '',
      sram.sw !== (undefined || 0) ? 1 : 0,
      sram.columnMux || '',
      sram.bank || '',
      sram.centerDecoder || '',
      sram.redundancy !== undefined ? sram.redundancy.toString : 'TRUE',
      sram.bistInterface !== undefined ? sram.bistInterface.toString : 'FALSE',
      sram.dualRail !== undefined ? sram.dualRail.toString : 'FALSE',
      sram.powerGating !== undefined ? sram.powerGating.toString : 'FALSE',
      sram.peripheryVt || '',
      sram.readAssist !== undefined ? sram.readAssist.toString : 'FALSE',
      sram.writeAssist !== undefined ? sram.writeAssist.toString : 'FALSE',
      sram.pvtEnable !== undefined ? sram.pvtEnable.toString : '{ 19 20 22 }'
    ]
    csvContent += row.join(',') + '\n'
  })
  // console.log(csvContent)
  return csvContent
}

function splitCsvContent (csvContent: string, outputPath: string): void {
  const lines = csvContent.trim().split('\n')
  const header = lines[0]
  const rows = lines.slice(1)
  let fileIndex = 1
  for (let i = 0; i < rows.length; i += 5) {
    const chunk = rows.slice(i, i + 5)
    const chunkContent = [header, ...chunk].join('\n')
    fs.writeFileSync(`${outputPath}_part${fileIndex}.csv`, chunkContent)
    fileIndex++
  }
}

function main (): void {
  const args = process.argv.slice(2)
  if (args.length !== 2) {
    console.error('Usage: node cpu_convert.js <path-to-verilog-file> <output-path>')
    process.exit(1)
  }

  const filePath = args[0]
  const outputPath = args[1]

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  // if (!fs.existsSync(outputPath)) {
  //   console.error(`Output path not found: ${outputPath}`)
  //   process.exit(1)
  // }

  const verilogCode = readVerilogFile(filePath)
  const [type, sramModules] = extractSramModules(verilogCode)

  const sramModulesJson = JSON.stringify(sramModules, null, 2)

  if (type === 'pc') {
    fs.writeFileSync(`${outputPath}_pc.json`, sramModulesJson)
    const csvContent = jsonToCsv(sramModules)
    splitCsvContent(csvContent, `${outputPath}_info_pc`)

    const libDir = `${outputPath}_pc_library`
    writeLibraryFile(libDir, createLibrary(sramModules, type, libDir))

    const rest = removeSramInstances(verilogCode)
    fs.writeFileSync(`${outputPath}_pc_top.sv`, rest)
  } else if (type === 'ux900') {
    fs.writeFileSync(`${outputPath}_ux900.json`, sramModulesJson)
    const csvContent = jsonToCsv(sramModules)
    splitCsvContent(csvContent, `${outputPath}_info_ux900`)

    const libDir = `${outputPath}_ux900_library`
    writeLibraryFile(libDir, createLibrary(sramModules, type, libDir))
  } else {
    fs.writeFileSync(`${outputPath}_rhc.json`, sramModulesJson)
    const csvContent = jsonToCsv(sramModules)
    splitCsvContent(csvContent, `${outputPath}_info_rhc`)

    const libDir = `${outputPath}_rhc_library`
    writeLibraryFile(libDir, createLibrary(sramModules, type, libDir))
  }
}

main()
