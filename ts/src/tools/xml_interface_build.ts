import * as fs from 'fs'
import * as path from 'path'
import { XMLParser } from 'fast-xml-parser'

// Interfaces for the parsed JSON
interface VLNV {
  vendor: string
  library: string
  name: string
  version: string
}

interface Signal {
  name: string
  width?: number
  producerDirection?: string
  responderDirection?: string
  isClock?: boolean
  isData?: boolean
  isAddress?: boolean
  isReset?: boolean
  isClockEnable?: boolean
}

interface BusType {
  vendor: string
  library: string
  name: string
  version: string
}

interface BusInterface {
  name: string
  busType: BusType
  signals?: Signal[]
}

interface Component {
  name: string
  vlnv: VLNV
  busInterfaces: {
    busInterface: BusInterface | BusInterface[]
  }
}

// Function to read and parse XML file
async function parseXmlFile (filePath: string): Promise<any> {
  const xmlData = fs.readFileSync(filePath, 'utf-8')
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', removeNSPrefix: true })
  const jsonData = parser.parse(xmlData)
  return jsonData
}

// Mapping function
function mapToAmbaInterface (json: any): Component | null {
  if (!json?.abstractionDefinition) { // (!json || !json.abstractionDefinition)
    return null
  }

  const abstractionDefinition = json.abstractionDefinition
  const vlnv = {
    vendor: abstractionDefinition.vendor || '',
    library: abstractionDefinition.library || '',
    name: abstractionDefinition.name || '',
    version: abstractionDefinition.version || ''
  }

  const mapSignal = (port: any): Signal => ({
    name: port.logicalName.replace(/\./g, '_'),
    width: port.wire?.onMaster?.width || port.wire?.onSlave?.width,
    producerDirection: port.wire?.onMaster?.direction,
    responderDirection: port.wire?.onSlave?.direction,
    isClock: port.wire?.qualifier?.isClock === true,
    isData: port.wire?.qualifier?.isData === true,
    isAddress: port.wire?.qualifier?.isAddress === true,
    isReset: port.wire?.qualifier?.isReset === true,
    isClockEnable: port.wire?.qualifier?.isClockEnable === true
  })

  const signals = abstractionDefinition.ports?.port.map(mapSignal)

  return {
    name: abstractionDefinition.name || '',
    vlnv,
    busInterfaces: {
      busInterface: {
        name: abstractionDefinition.name || '',
        busType: {
          vendor: abstractionDefinition.busType?.vendor || '',
          library: abstractionDefinition.busType?.library || '',
          name: abstractionDefinition.busType?.name || '',
          version: abstractionDefinition.busType?.version || ''
        },
        signals
      }
    }
  }
}

// Function to generate TypeScript code
function generateTypeScript (ambaInterface: Component): string {
  const interfaceName = ambaInterface.name.replace(/[-.]/g, '_').replace(/\s+/g, '_')
  const busInterface = Array.isArray(ambaInterface.busInterfaces.busInterface)
    ? ambaInterface.busInterfaces.busInterface[0]
    : ambaInterface.busInterfaces.busInterface

  let tsCode =
`import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the ${interfaceName} TSSV Interface bundle
 */
export interface ${interfaceName}_Parameters extends TSSVParameters {
  /**
   * Defines the bit width of the source identifier signal
   */
  AIW?: IntRange<1, 32>
  /**
   * Defines the bit width of the address signal
   */
  AW?: IntRange<8, 64>
  /**
   * Defines the bit width of the sink identifier signal
   */
  DIW?: IntRange<1, 32>
  /**
   * Defines the data bus width
   */
  DW?: 32 | 64
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type ${interfaceName}_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the ${interfaceName} protocol
 */
export class ${interfaceName} extends Interface {
  declare params: ${interfaceName}_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: '${ambaInterface.vlnv.vendor}',
    library: '${ambaInterface.vlnv.library}',
    name: '${ambaInterface.vlnv.name}',
    version: '${ambaInterface.vlnv.version}'
  }

  /**
   * Create a new ${interfaceName} Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: ${interfaceName}_Parameters = {}, role: ${interfaceName}_Role = undefined) {
    super(
      '${interfaceName}',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
`

  const uniqueSignals = new Map<string, Signal>()

  busInterface.signals?.forEach((signal) => {
    uniqueSignals.set(signal.name, signal)
  })

  const signalEntries = Array.from(uniqueSignals.entries())

  signalEntries.forEach(([name, signal], index) => {
    // Determine width based on qualifiers
    let width
    if (signal.width !== undefined) {
      width = signal.width
    } else if (signal.isClock || signal.isReset || signal.isClockEnable) {
      width = 'params.AIW || 8' // Default to AIW if AIW is defined, otherwise 8
    } else if (signal.isAddress) {
      width = 'params.AW || 32' // Default to AW if AW is defined, otherwise 32
    } else if (signal.isData) {
      width = 'params.DW || 32' // Default to DW if DW is defined, otherwise 32
    } else {
      width = 'params.DIW || 8' // Default to DIW if DIW is defined, otherwise 8
    }

    tsCode += `      ${name.replace(/\./g, '_')}: { width: ${width} }${index < signalEntries.length - 1 ? ',' : ''}\n`
  })

  tsCode += `    }
    this.modports = {
      master: {
`

  const producerSignals = signalEntries.filter(([_, signal]) => signal.producerDirection)

  producerSignals.forEach(([name, signal], index) => {
    tsCode += `        ${name.replace(/\./g, '_')}: '${signal.producerDirection === 'in' ? 'input' : 'output'}'${index < producerSignals.length - 1 ? ',' : ''}\n`
  })

  tsCode += `      },
      slave: {
`

  const responderSignals = signalEntries.filter(([name, signal]) => signal.responderDirection)

  responderSignals.forEach(([name, signal], index) => {
    tsCode += `        ${name.replace(/\./g, '_')}: '${signal.responderDirection === 'in' ? 'input' : 'output'}'${index < responderSignals.length - 1 ? ',' : ''}\n`
  })

  tsCode += `      }
    }
  }
}
`

  return tsCode
}

// Main function to execute the script
async function main (): Promise<number> {
  const xmlFilePath = process.argv[2]
  const outputFilePath = process.argv[3]

  if (!xmlFilePath) {
    console.error('Please provide the path to the XML file.')
    process.exit(1)
  }

  try {
    const jsonResult = await parseXmlFile(xmlFilePath)
    const ambaInterface = mapToAmbaInterface(jsonResult)
    if (ambaInterface) {
      const tsCode = generateTypeScript(ambaInterface)
      const defaultOutputPath = path.join(path.dirname(xmlFilePath), `${ambaInterface.name.replace(/[-.]/g, '_').replace(/\s+/g, '_')}.ts`)
      const finalOutputPath = outputFilePath || defaultOutputPath
      fs.writeFileSync(finalOutputPath, tsCode, 'utf-8')
      console.log(`TypeScript file generated at: ${finalOutputPath}`)
    } else {
      console.error('Error mapping AMBA interface from parsed JSON.')
    }
  } catch (error) {
    console.error('Error parsing XML file:', error)
    process.exit(1)
  }
  return 1
}

void main()
