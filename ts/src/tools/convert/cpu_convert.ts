import * as fs from 'fs'
import * as path from 'path'
import { Module, Expr, type IntRange } from 'tssv/lib/core/TSSV'
import { SRAM } from 'tssv/lib/modules/SRAM'

const logStream = fs.createWriteStream('cpu_convert.log', { flags: 'a' })
console.log = function (message) {
  logStream.write(`[LOG] ${message}\n`)
}
console.warn = function (message) {
  logStream.write(`[WARN] ${message}\n`)
}
console.error = function (message) {
  logStream.write(`[ERROR] ${message}\n`)
}

const predefinedConstants: Record<string, number> = {}

interface SramModule {
  moduleName: string
  instanceName: string
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
  // Read the content of the current file
  let verilogCode = fs.readFileSync(filePath, 'utf-8')

  // Regular expression to match import statements like import TPartCommon::*
  const importRegex = /import\s+(\w+)::\*\s*;/g
  let match

  const dirPath = path.dirname(filePath)

  // Find and read all the matched imported modules
  while ((match = importRegex.exec(verilogCode)) !== null) {
    const moduleName = match[1]

    const moduleFilePath = path.join(dirPath, `${moduleName}.sv`)

    if (fs.existsSync(moduleFilePath)) {
      const moduleCode = fs.readFileSync(moduleFilePath, 'utf-8')
      // Append the module code to the current Verilog file content
      verilogCode += '\n' + moduleCode
    } else {
      console.warn(`Module file ${moduleName}.sv not found in ${dirPath}`)
    }
  }

  return verilogCode
}

function generatePredefinedConstants (verilogCode: string) {
  const regex = /(parameter|localparam)\s+(\w+)\s*=\s*(\d+)\s*[,|;)]/g
  let match

  while ((match = regex.exec(verilogCode)) !== null) {
    const [, , paramName, paramValue] = match
    predefinedConstants[paramName] = parseInt(paramValue, 10)
  }
  console.log(JSON.stringify(predefinedConstants, null, 2))
}

function evaluateExpression (expr: string): number {
  try {
    for (const [key, value] of Object.entries(predefinedConstants)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g')
      expr = expr.replace(regex, value.toString())
    }

    const clog2Regex = /\$clog2\((\d+)/g
    expr = expr.replace(clog2Regex, (match, p1) => {
      const value = parseInt(p1, 10)
      if (value <= 0) return '0'
      return Math.ceil(Math.log2(value)).toString()
    })

    return eval(expr)
  } catch (error) {
    console.error(`Unable to evaluate expression: ${expr}`)
    return NaN
  }
}

function processParameter (paramValue: string): number {
  if (paramValue.startsWith('$bits')) {
    return NaN // $bits function
  }

  if (!isNaN(Number(paramValue.trim()))) {
    return parseInt(paramValue.trim(), 10)
  }

  return evaluateExpression(paramValue)
}

function isDuplicateModule (existingModules: SramModule[], newModule: SramModule): boolean {
  return existingModules.some(module =>
    module.instanceName === newModule.instanceName &&
    module.dataWidth === newModule.dataWidth &&
    module.addressWidth === newModule.addressWidth &&
    module.depth === newModule.depth &&
    module.port === newModule.port &&
    module.sw === newModule.sw
  )
}

function extractSramModules (verilogCode: string): [string, SramModule[]] {
  const rhcRegex = /rhc.*pram/
  const uxRegex = /ux900./
  if (rhcRegex.test(verilogCode)) {
    console.log('rhc mode')
    const instantiationRegex = /(rhc\w*ram\w*)\s*#\(\s*([\s\S]+?)\s*\)\s*(\w+)\s*\(\s*([\s\S]+?)\s*\);/g

    const sramModules: SramModule[] = []

    let instantiationMatch
    while ((instantiationMatch = instantiationRegex.exec(verilogCode)) !== null) {
      const [, moduleName, parameters, instanceName] = instantiationMatch
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
      const parameterRegex = /\.(\w+)\s*\(\s*([\s\S]+?)\s*\)/g
      while ((paramMatch = parameterRegex.exec(parameters)) !== null) {
        const [, paramName, paramValue] = paramMatch
        const finalValue = processParameter(paramValue)
        params[paramName] = finalValue
      }
      console.log(JSON.stringify(params, null, 2))
      const sramModule: SramModule = {
        moduleName: moduleName,
        instanceName: removeLastCharacter(instanceName),
        dataWidth: params.DATA_W,
        addressWidth: params.ADDR_W || NaN,
        depth: params.DEPTH || 0,
        port,
        sw: params.WREN_W === 1 ? 0 : 1
      }

      if (!isDuplicateModule(sramModules, sramModule)) {
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
        moduleName: 'ux900_gnrl_ram',
        instanceName: instanceName,
        dataWidth: parseInt(dw, 10),
        addressWidth: parseInt(aw, 10),
        depth: parseInt(dp, 10),
        port: '1p11',
        sw: parseInt(mw, 10) === 1 ? 0 : 1
        // sw: parseInt(dw, 10) / parseInt(mw, 10)
      }

      if (!isDuplicateModule(sramModules, sramModule)) {
        sramModules.push(sramModule)
      }
    }

    return ['ux900', sramModules]
  } else {
    console.log('pc mode')
    const sramModules: SramModule[] = []
    const sramPattern = /module\s+(pc_spsram_\d+x\d+|pc_tpsram_\d+x\d+)[^]*?\(\s+[^]*?endmodule/gs
    // const sramPattern = /(pc_spsram_\d+x\d+(?:_\d+bw|_nobw)?)\s+(\w+)\s*\([^]*?\);/g

    const matches = Array.from(verilogCode.matchAll(sramPattern))

    for (const match of matches) {
      // console.log("Module name: ", match[1])
      // console.log("Instance name: ", match[2])
      // const moduleDeclaration = match[1]
      const moduleDeclaration = match[0]
      const moduleNamePattern = /module\s+(pc_spsram_\d+x\d+_?[^;\s]*)/
      const moduleNameMatch = moduleDeclaration.match(moduleNamePattern)
      const moduleName = moduleNameMatch ? removeLastCharacter(moduleNameMatch[1]) : 'Unknown'

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
        moduleName: moduleName,
        instanceName: '',
        depth: parseInt(depth, 10),
        dataWidth: parseInt(dataWidthMatch ? dataWidthMatch[1] : dataWidth, 10),
        addressWidth: parseInt(addressWidthMatch ? addressWidthMatch[1] : '0', 10),
        port: port,
        sw: singleWrite
        // code: moduleDeclaration.trim()
      }
      if (!isDuplicateModule(sramModules, sramModule)) {
        sramModules.push(sramModule)
      }
    }

    return ['pc', sramModules]
  }
}

function removeSramInstances (verilogCode: string): string {
  // Define the pattern for the specific instance to be removed
  // const instancePattern = /module\s+pc_spsram_[\w\d_]+\s*\([\s\S]*?\);[\s\S]*?endmodule/g
  const instancePattern = /(pc_spsram_\d+x\d+(?:_\d+bw|_nobw)?)\s+(\w+)\s*\([^]*?\);/g

  // Remove the specific instances
  const cleanedCode = verilogCode.replace(instancePattern, 'toreplace')

  return cleanedCode
}

function removeLastCharacter (str: string): string {
  if (str.endsWith('(')) {
    return str.slice(0, -1)
  }
  return str
}

function createLibrary (sramModules: SramModule[], type: string): string {
  let libraryCode = ''
  sramModules.forEach((sram, index) => {
    const modName = (type === 'pc') ? removeLastCharacter(sram.moduleName) : sram.moduleName
    const module = new Module(
      { name: modName },
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
    if (type === 'pc') {
      const nameParts = sram.moduleName.split('_')
      const sramSuffix = nameParts.slice(2).join('_')
      sramMName = `sram_${sramSuffix}`
    } else {
      const nameParts = sram.moduleName.split('_')
      const sramSuffix = nameParts.slice(1).join('_')
      sramMName = `sram_${sramSuffix}`
    }

    const sramM = new SRAM(
      {
        name: `${sramMName}`,
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

function jsonToCsv (jsonData: SramModule[]): string {
  const headers = [
    'Name (NA)',
    'Frequency (MHz) (NA)',
    'Port (Mandatory) 1p11/2p11/2p12/2p22',
    'Number (NA)',
    'Width (NB) (Mandatory)',
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

  const hasInvalidData = jsonData.some(sram => isNaN(sram.dataWidth) || isNaN(sram.depth))
  if (hasInvalidData) {
    return 'Error: Unable to generate CSV because some modules have null dataWidth or depth.'
  }
  // Add header row
  let csvContent = headers.join(',') + '\n'

  // Add each sramModule row
  jsonData.forEach(sram => {
    const row = [
      // removeLastCharacter(sram.name) || '',
      '',
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
      sram.peripheryVt !== undefined ? sram.peripheryVt.toString : 'FALSE',
      sram.readAssist !== undefined ? sram.readAssist.toString : 'FALSE',
      sram.writeAssist !== undefined ? sram.writeAssist.toString : 'FALSE',
      sram.pvtEnable !== undefined ? sram.pvtEnable.toString : '{ 19 20 22 }'
    ]
    csvContent += row.join(',') + '\n'
  })
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

  const verilogCode = readVerilogFile(filePath)

  generatePredefinedConstants(verilogCode)
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

    // const libStringRHC = createLibrary(sramModules, type)
    // fs.writeFileSync(`${outputPath}_rhc_library.sv`, libStringRHC)
  }
}

main()
