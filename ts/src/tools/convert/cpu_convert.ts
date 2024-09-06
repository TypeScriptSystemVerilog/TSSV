import * as fs from 'fs'
import { Module, Expr, type IntRange } from 'tssv/lib/core/TSSV'
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

function readVerilogFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

function extractSramModules(verilogCode: string): [string, SramModule[]] {
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
      const [, moduleName, parameters, instanceName] = instantiationMatch // removed instanceName
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
      const sramModule: SramModule = {
        name: '',
        dataWidth: params.DATA_W || 0,
        addressWidth: params.ADDR_W || 0,
        depth: params.DEPTH || 0,
        port: port,
        sw: params.WREN_W === 1? 0 : 1
        // Add other fields as needed, with defaults or parsed values.
      }

      const isDuplicate = sramModules.some(module => 
        module.name === sramModule.name &&
        module.dataWidth === sramModule.dataWidth &&
        module.addressWidth === sramModule.addressWidth &&
        module.depth === sramModule.depth &&
        module.port === sramModule.port &&
        module.sw === sramModule.sw
      )

      if (!isDuplicate) {
        sramModules.push(sramModule)
      }
    }
    return ['rhc', sramModules]
  } else if (uxRegex.test(verilogCode)) {
    console.log('ux900 mode')
    const regex = /(\w+)\s*#\(\s*\.FORCE_X2ZERO\s*\(\d+\),\s*\.GATE_CLK\s*\(\d+\),\s*\.DP\s*\((\d+)\),\s*\.DW\s*\((\d+)\),\s*\.MW\s*\((\d+)\),\s*\.AW\s*\((\d+)\)\s*\)\s*(\w+)/g

    const sramModules: SramModule[] = []
    let match: RegExpExecArray | null

    while ((match = regex.exec(verilogCode)) !== null) {
      const [, , dp, dw, mw, aw, instanceName] = match

      const sramModule: SramModule = {
        name: '',
        dataWidth: parseInt(dw, 10),
        addressWidth: parseInt(aw, 10),
        depth: parseInt(dp, 10),
        port: '1p11',
        sw: parseInt(mw, 10) === 1 ? 0 : 1
        //sw: parseInt(dw, 10) / parseInt(mw, 10)
      }
    
      const isDuplicate = sramModules.some(module => 
        module.name === sramModule.name &&
        module.dataWidth === sramModule.dataWidth &&
        module.addressWidth === sramModule.addressWidth &&
        module.depth === sramModule.depth &&
        module.port === sramModule.port &&
        module.sw === sramModule.sw
      )

      if (!isDuplicate) {
        sramModules.push(sramModule)
      }
    }

    return ['ux900', sramModules]
  } else {
    console.log('pc mode')
    const sramModules: SramModule[] = []
    const sramPattern = /module\s+(pc_spsram_\d+x\d+|pc_tpsram_\d+x\d+)[^]*?\(\s+[^]*?endmodule/gs
    const matches = Array.from(verilogCode.matchAll(sramPattern))

    for (const match of matches) {
      const moduleDeclaration = match[0]
      const moduleNamePattern = /module\s+(pc_spsram_\d+x\d+_?[^;\s]*)/
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
      const sramModule: SramModule = {
        name: '',
        depth: parseInt(depth, 10),
        dataWidth: parseInt(dataWidthMatch ? dataWidthMatch[1] : dataWidth, 10),
        addressWidth: parseInt(addressWidthMatch ? addressWidthMatch[1] : '0', 10),
        port: port,
        sw: singleWrite
        // code: moduleDeclaration.trim()
      }
      const isDuplicate = sramModules.some(module => 
        module.name === sramModule.name &&
        module.dataWidth === sramModule.dataWidth &&
        module.addressWidth === sramModule.addressWidth &&
        module.depth === sramModule.depth &&
        module.port === sramModule.port &&
        module.sw === sramModule.sw
      )

      if (!isDuplicate) {
        sramModules.push(sramModule)
      }
    
    }

    return ['pc', sramModules]
  }
}

function removeSramInstances(verilogCode: string): string {
  // Define the pattern for the specific instance to be removed
  const instancePattern = /module\s+pc_spsram_[\w\d_]+\s*\([\s\S]*?\);[\s\S]*?endmodule/g

  // Remove the specific instances
  const cleanedCode = verilogCode.replace(instancePattern, '')

  return cleanedCode
}

function removeLastCharacter(str: string): string {
  if (str.endsWith('(')) {
    return str.slice(0, -1)
  }
  return str
}

function createLibrary(sramModules: SramModule[], type: string): string {
  let libraryCode = ''
  sramModules.forEach((sram, index) => {
    const modName = (type === 'pc') ? removeLastCharacter(sram.name) : sram.name
    const module = new Module(
      { name: modName }, // took out removeLastCharacter
      {
        a: { direction: 'input', width: sram.addressWidth },
        cen: { direction: 'input' },
        clk: { direction: 'input', isClock: 'posedge' },
        d: { direction: 'input', width: sram.dataWidth },
        gwen: { direction: 'input' },
        wen: { direction: 'input', width: sram.dataWidth },
        q: { direction: 'output', width: sram.dataWidth }
      }
    )
    let sramMName = ''
    // Extract the part of the name after the second underscore
    if (type === 'pc') {
      const nameParts = sram.name.split('_')
      const sramSuffix = nameParts.slice(2).join('_')
      sramMName = `sram_${sramSuffix}`
    } else {
      const nameParts = sram.name.split('_')
      const sramSuffix = nameParts.slice(1).join('_')
      sramMName = `sram_${sramSuffix}`
    }

    const sramM = new SRAM(
      {
        name: `${sramMName}`, // took out removeLastCharacter
        depth: BigInt(sram.depth),
        dataWidth: sram.dataWidth as IntRange<1, 256>,
        ports: '1rw',
        writeEnableMask: 'bit'
      }
    )

    const writeExpr = new Expr('cen | wen & gwen')
    module.addSignal('we', {})
    module.addAssign({ in: writeExpr, out: 'we' })
    module.addSubmodule('sram', sramM, { clk: 'clk', a_re: 'cen', a_we: 'we', a_data_in: 'd', a_data_out: 'q', a_addr: 'a', a_wmask: 'wen' })
    libraryCode += module.writeSystemVerilog() + '\n'
  })

  return libraryCode
}

function jsonToCsv(jsonData: SramModule[]): string {
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
      removeLastCharacter(sram.name) || '',

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

function splitCsvContent(csvContent: string, outputPath: string): void {
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

function main(): void {
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

    const libString = createLibrary(sramModules, type)
    fs.writeFileSync(`${outputPath}_pc_library.sv`, libString)

    const rest = removeSramInstances(verilogCode)
    fs.writeFileSync(`${outputPath}_pc_top.sv`, rest)
  } else if (type === 'ux900') {
    fs.writeFileSync(`${outputPath}_ux900.json`, sramModulesJson)
    const csvContent = jsonToCsv(sramModules)
    splitCsvContent(csvContent, `${outputPath}_info_ux900`)

    const libStringRHC = createLibrary(sramModules, type)
    fs.writeFileSync(`${outputPath}_ux900_library.sv`, libStringRHC)
  } else {
    fs.writeFileSync(`${outputPath}_rhc.json`, sramModulesJson)
    const csvContent = jsonToCsv(sramModules)
    splitCsvContent(csvContent, `${outputPath}_info_rhc`)

    const libStringRHC = createLibrary(sramModules, type)
    fs.writeFileSync(`${outputPath}_rhc_library.sv`, libStringRHC)
  }
}

main()
