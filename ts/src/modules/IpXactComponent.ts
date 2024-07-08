import { Module, type TSSVParameters } from 'tssv/lib/core/TSSV'
import { XMLParser } from 'fast-xml-parser'
import * as amba from 'tssv/lib/tools/index'
import * as fs from 'fs'

export interface ComponentData {
  version: string
  abstractionName: string
  abstractionLibrary: string
  busName: string
  ports: Record<string, string>
}

interface ParameterData {
  value: string
  realName: string
}

export interface IpXactComponent_Parameters extends TSSVParameters {
  xmlData: string
  svFilePath: string
}

export class IpXactComponent extends Module {
  declare params: IpXactComponent_Parameters

  static knownInterfaces: Record<string, any> = {
    'tssv/lib/interfaces/AMBA/AMBA2/AHB/r3p0_1/AHB_rtl': amba.AHB_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/AHBLite/r2p0_0/AHBLite_rtl': amba.AHBLite_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/AHBLiteInitiator/r2p0_0/AHBLiteInitiator_rtl': amba.AHBLiteInitiator_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/AHBLiteTarget/r2p0_0/AHBLiteTarget_rtl': amba.AHBLiteTarget_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/APB/r2p0_0/APB_rtl': amba.APB_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/ATB/r2p0_0/ATB_rtl': amba.ATB_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/AXI/r2p0_0/AXI_rtl': amba.AXI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/AXI_RO/r2p0_0/AXI_RO_rtl': amba.AXI_RO_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/AXI_WO/r2p0_0/AXI_WO_rtl': amba.AXI_WO_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/LPI/r2p0_0/LPI_rtl': amba.LPI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA3/LPI/r2p1_0/LPI_rtl': amba.LPI_rtl2,
    'tssv/lib/interfaces/AMBA/AMBA3/LPI/r3p0_0/LPI_rtl': amba.LPI_rtl3,
    'tssv/lib/interfaces/AMBA/AMBA4/ACE/r0p0_0/ACE_rtl': amba.ACE_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/ACE-Lite/r0p0_0/ACE-Lite_rtl': amba.ACE_Lite_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/ACE-Lite_RO/r0p0_0/ACE-Lite_RO_rtl': amba.ACE_Lite_RO_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/ACE-Lite_WO/r0p0_0/ACE-Lite_WO_rtl': amba.ACE_Lite_WO_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/ACP/r0p0_0/ACP_rtl': amba.ACP_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4_rtl': amba.APB4_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/ATB/r0p0_0/ATB_rtl': amba.ATB_rtl2,
    'tssv/lib/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4': amba.AXI4,
    'tssv/lib/interfaces/AMBA/AMBA4/AXI4-Lite/r0p0_0/AXI4-Lite_rtl': amba.AXI4_Lite_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/AXI4Stream/r0p0_1/AXI4Stream_rtl': amba.AXI4Stream_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/AXI4_RO/r0p0_0/AXI4_RO_rtl': amba.AXI4_RO_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/AXI4_WO/r0p0_0/AXI4_WO_rtl': amba.AXI4_WO_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/P-Channel/r0p0_0/P-Channel_rtl': amba.P_Channel_rtl,
    'tssv/lib/interfaces/AMBA/AMBA4/Q-Channel/r0p0_0/Q-Channel_rtl': amba.Q_Channel_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/ACE5/r0p0_0/ACE5_rtl': amba.ACE5_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/ACE5-Lite/r0p0_0/ACE5-Lite_rtl': amba.ACE5_Lite_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/ACE5-Lite/r0p2_0/ACE5-Lite_rtl': amba.ACE5_Lite_rtl2,
    'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteACP/r0p0_0/ACE5-LiteACP_rtl': amba.ACE5_LiteACP_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteACP/r0p2_0/ACE5-LiteACP_rtl': amba.ACE5_LiteACP_rtl2,
    'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteACP/r0p3_0/ACE5-LiteACP_rtl': amba.ACE5_LiteACP_rtl3,
    'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteDVM/r0p0_0/ACE5-LiteDVM_rtl': amba.ACE5_LiteDVM_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteDVM/r0p2_0/ACE5-LiteDVM_rtl': amba.ACE5_LiteDVM_rtl2,
    'tssv/lib/interfaces/AMBA/AMBA5/AHB5Initiator/r0p0_0/AHB5Initiator_rtl': amba.AHB5Initiator_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/AHB5Target/r0p0_0/AHB5Target_rtl': amba.AHB5Target_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/APB5/r0p0_0/APB5_rtl': amba.APB5_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/ATB/r0p0_0/ATB_rtl': amba.ATB_rtl3,
    'tssv/lib/interfaces/AMBA/AMBA5/AXI5/r0p0_0/AXI5_rtl': amba.AXI5_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/AXI5/r0p2_0/AXI5_rtl': amba.AXI5_rtl2,
    'tssv/lib/interfaces/AMBA/AMBA5/AXI5-Lite/r0p0_0/AXI5-Lite_rtl': amba.AXI5_Lite_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/AXI5-Lite/r0p2_0/AXI5-Lite_rtl': amba.AXI5_Lite_rtl2,
    'tssv/lib/interfaces/AMBA/AMBA5/AXI5-Stream/r0p0_0/AXI5-Stream_rtl': amba.AXI5_Stream_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-RND/r0p0_0/CHI-A-RND_rtl': amba.CHI_A_RND_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-RNF/r0p0_0/CHI-A-RNF_rtl': amba.CHI_A_RNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-RNI/r0p0_0/CHI-A-RNI_rtl': amba.CHI_A_RNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-SNF/r0p0_0/CHI-A-SNF_rtl': amba.CHI_A_SNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-SNI/r0p0_0/CHI-A-SNI_rtl': amba.CHI_A_SNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-RND/r0p0_0/CHI-B-RND_rtl': amba.CHI_B_RND_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-RNF/r0p0_0/CHI-B-RNF_rtl': amba.CHI_B_RNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-RNI/r0p0_0/CHI-B-RNI_rtl': amba.CHI_B_RNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-SNF/r0p0_0/CHI-B-SNF_rtl': amba.CHI_B_SNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-SNI/r0p0_0/CHI-B-SNI_rtl': amba.CHI_B_SNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-RND/r0p0_0/CHI-C-RND_rtl': amba.CHI_C_RND_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-RNF/r0p0_0/CHI-C-RNF_rtl': amba.CHI_C_RNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-RNI/r0p0_0/CHI-C-RNI_rtl': amba.CHI_C_RNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-SNF/r0p0_0/CHI-C-SNF_rtl': amba.CHI_C_SNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-SNI/r0p0_0/CHI-C-SNI_rtl': amba.CHI_C_SNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-RND/r0p0_0/CHI-D-RND_rtl': amba.CHI_D_RND_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-RNF/r0p0_0/CHI-D-RNF_rtl': amba.CHI_D_RNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-RNI/r0p0_0/CHI-D-RNI_rtl': amba.CHI_D_RNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-SNF/r0p0_0/CHI-D-SNF_rtl': amba.CHI_D_SNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-SNI/r0p0_0/CHI-D-SNI_rtl': amba.CHI_D_SNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-RND/r0p0_0/CHI-E-RND_rtl': amba.CHI_E_RND_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-RNF/r0p0_0/CHI-E-RNF_rtl': amba.CHI_E_RNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-RNI/r0p0_0/CHI-E-RNI_rtl': amba.CHI_E_RNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-SNF/r0p0_0/CHI-E-SNF_rtl': amba.CHI_E_SNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-SNI/r0p0_0/CHI-E-SNI_rtl': amba.CHI_E_SNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-RND/r0p0_0/CHI-F-RND_rtl': amba.CHI_F_RND_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-RNF/r0p0_0/CHI-F-RNF_rtl': amba.CHI_F_RNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-RNI/r0p0_0/CHI-F-RNI_rtl': amba.CHI_F_RNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-SNF/r0p0_0/CHI-F-SNF_rtl': amba.CHI_F_SNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-SNI/r0p0_0/CHI-F-SNI_rtl': amba.CHI_F_SNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-RND/r0p0_0/CHI-G-RND_rtl': amba.CHI_G_RND_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-RNF/r0p0_0/CHI-G-RNF_rtl': amba.CHI_G_RNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-RNI/r0p0_0/CHI-G-RNI_rtl': amba.CHI_G_RNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-SNF/r0p0_0/CHI-G-SNF_rtl': amba.CHI_G_SNF_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-SNI/r0p0_0/CHI-G-SNI_rtl': amba.CHI_G_SNI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/CXS/r0p0_0/CXS_rtl': amba.CXS_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/GFB/r0p0_0/GFB_rtl': amba.GFB_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/LTI/r0p0_0/LTI_rtl': amba.LTI_rtl,
    'tssv/lib/interfaces/AMBA/AMBA5/LTI/r0p1_0/LTI_rtl': amba.LTI_rtl2
  }

  constructor (params: IpXactComponent_Parameters) {
    super({
      name: params.name,
      xmlData: params.xmlData,
      svFilePath: params.svFilePath
    })

    const interfaceData = this.createDictionary(params.xmlData)
    const paramData = this.parseParameters(params.xmlData)

    this.addInterfaces(interfaceData, paramData)

    this.addSystemVerilogSubmoduleWithBindings(interfaceData)
  }

  protected addSystemVerilogSubmoduleWithBindings (componentDataRecord: Record<string, ComponentData>): Module {
    const SVFilePath = this.params.svFilePath

    const vModuleName = `verilog${this.params.name}`
    const bindings: Record<string, string> = {}

    // Iterate through each component and build the bindings
    for (const [interfaceName, componentData] of Object.entries(componentDataRecord)) {
      for (const [logicalPort, physicalPort] of Object.entries(componentData.ports)) {
        bindings[physicalPort] = `${interfaceName}.${logicalPort}`
      }
    }

    // Parse the Verilog file to get the input signals
    const inputSignals = this.extractInputSignalsFromVerilog(SVFilePath)
    let sigNotAdded = true
    // Add bindings for input signals not listed in componentData
    inputSignals.forEach(signal => {
      if (!Object.values(componentDataRecord).some(componentData =>
        Object.values(componentData.ports).includes(signal))) {
        if (sigNotAdded) {
          sigNotAdded = false
          this.addSignal('unbound', {})
        }
        bindings[signal] = 'unbound' // Bind to constant value of 0
      }
    })

    return this.addSystemVerilogSubmodule(vModuleName, SVFilePath, {}, bindings, true)
  }

  // Helper method to extract input signals from a Verilog file
  private extractInputSignalsFromVerilog (filePath: string): string[] {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const inputSignals: string[] = []

    // Regex to match input signals and their names, handling sizes correctly
    const inputSignalRegex = /input\s+(?:\[\d+:\d+\]\s+)?([^\s,;]+)/g
    let match
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    while ((match = inputSignalRegex.exec(fileContent)) !== null) {
      // Extract the signal name from the regex match
      const signalName = match[1].trim()
      inputSignals.push(signalName)
    }

    return inputSignals
  }

  protected createDictionary (xmlData: string): Record<string, ComponentData> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textNodeName: 'text'
    })
    const jsonObj = parser.parse(xmlData)
    const components = jsonObj['spirit:component']
    const result: Record<string, ComponentData> = {}
    const processComponent = (component: any): void => {
      const busInterfaces = component['spirit:busInterfaces']['spirit:busInterface']
      busInterfaces.forEach((busInterface: any) => {
        const interfaceName = busInterface['spirit:name']
        const abstractionType = busInterface['spirit:abstractionType']
        const version = abstractionType['spirit:version']
        const abstractionName = abstractionType['spirit:name'].replace(/_+/g, '_')
        const abstractionLibrary = abstractionType['spirit:library']
        const busType = busInterface['spirit:busType']
        const busName = busType['spirit:name'].replace(/_+$/, '')
        const portMaps = busInterface['spirit:portMaps']['spirit:portMap']
        const portDictionary: Record<string, string> = {}
        portMaps.forEach((portMap: any) => {
          const logicalPort = portMap['spirit:logicalPort']['spirit:name']
          const physicalPort = portMap['spirit:physicalPort']['spirit:name']
          portDictionary[logicalPort] = physicalPort
        })
        result[interfaceName] = {
          version,
          abstractionName,
          abstractionLibrary,
          busName,
          ports: portDictionary
        }
      })
    }
    if (Array.isArray(components)) {
      components.forEach(processComponent)
    } else {
      processComponent(components)
    }
    return result
  }

  protected addInterfaces (interfaceData: Record<string, ComponentData>, parameterData: Record<string, Record<string, ParameterData>>): void {
    for (const interfaceName in interfaceData) {
      const component = interfaceData[interfaceName]
      const pathString = `tssv/lib/interfaces/AMBA/${component.abstractionLibrary}/${component.busName}/${component.version}/${component.abstractionName}`

      const InterfaceModule = IpXactComponent.knownInterfaces[pathString]
      if (InterfaceModule) {
        const isAXI = pathString.includes('AXI')
        const isOutward = interfaceName.startsWith('Init')
        const isInward = interfaceName.toLowerCase().startsWith('targ')

        if (isOutward || isInward) {
          const axiParams = parameterData[interfaceName]
          const {
            AWID_WIDTH,
            WID_WIDTH,
            BID_WIDTH,
            ARID_WIDTH,
            RID_WIDTH,
            ADDR_WIDTH,
            DATA_WIDTH,
            BURST_LEN_WIDTH,
            USER_WIDTH,
            RESP_WIDTH
          } = axiParams || {}

          const axiParamObject: Record<string, string | undefined> = {
            AWID_WIDTH: AWID_WIDTH?.value,
            WID_WIDTH: WID_WIDTH?.value,
            BID_WIDTH: BID_WIDTH?.value,
            ARID_WIDTH: ARID_WIDTH?.value,
            RID_WIDTH: RID_WIDTH?.value,
            ADDR_WIDTH: ADDR_WIDTH?.value,
            DATA_WIDTH: DATA_WIDTH?.value,
            BURST_LEN_WIDTH: BURST_LEN_WIDTH?.value,
            USER_WIDTH: USER_WIDTH?.value,
            RESP_WIDTH: RESP_WIDTH?.value
          }

          // Check if any logical port contains 'QOS' and set the QOS parameter accordingly
          const qosParameter = component.ports && Object.keys(component.ports).some(logicalPort => logicalPort.includes('QOS')) ? 'true' : 'false'
          axiParamObject.QOS = qosParameter

          // Remove undefined properties
          Object.entries(axiParamObject).forEach(([key, value]) => {
            if (value === undefined) {
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              delete axiParamObject[key]
            }
          })
          // switched directions
          const direction = isOutward ? 'inward' : 'outward'

          // Add AXI or non-AXI interface with parameters
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          this.addInterface(interfaceName, new InterfaceModule(isAXI ? axiParamObject : {}, direction))
        } else {
          console.warn(`Interface name ${interfaceName} does not indicate outward or inward.`)
        }
      } else {
        console.error(`Interface for ${interfaceName} with path ${pathString} is not known.`)
      }
    }
  }

  protected parseParameters (xmlInput: string): Record<string, Record<string, ParameterData>> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    })

    const parsedXml = parser.parse(xmlInput)
    const busInterfaces = parsedXml['spirit:component']['spirit:busInterfaces']['spirit:busInterface']

    const parametersData: Record<string, Record<string, ParameterData>> = {}

    busInterfaces.forEach((interfaceData: any) => {
      const interfaceName = interfaceData['spirit:name']
      const parameters = interfaceData['spirit:parameters']['spirit:parameter']

      const interfaceParametersData: Record<string, ParameterData> = {}

      parameters.forEach((param: any) => {
        const name = param['spirit:name']
        const value = param['spirit:value']
        const realName = transformParameterName(`${name}`)
        interfaceParametersData[name] = {
          value,
          realName
        }
      })

      parametersData[interfaceName] = interfaceParametersData
    })

    return parametersData
  }
}

function transformParameterName (name: string): string {
  let transformedName = name.toUpperCase()
  if (transformedName.startsWith('W')) {
    transformedName = transformedName.slice(1) + '_WIDTH'
  }
  if (transformedName.includes('LEN')) {
    transformedName = transformedName.replace('LEN', 'BURST_LEN')
  }
  return transformedName
}

export default IpXactComponent
