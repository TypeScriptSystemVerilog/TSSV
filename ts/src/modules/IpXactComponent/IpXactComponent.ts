import { Module, type Sig, type TSSVParameters, absolutePath } from 'tssv/lib/core/TSSV'
import { XMLParser } from 'fast-xml-parser'
import * as amba from 'tssv/lib/tools/index'
import * as fs from 'fs'
import { parseSVModules, selectSVModule, type SVModuleHeader } from 'tssv/lib/core/SVModuleHeader'

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
  /**
   * path to the SystemVerilog file that defines the component's module; it is instantiated as is.
   * Environment variables in it are expanded, and it must then be absolute, as in
   * `$TSSV_ROOT/ts/test/...` (see `absolutePath()`)
   */
  svFilePath: string
  /**
   * path to the component's IP-XACT XML: its bus interfaces, their parameters and its ports.
   * Expanded and checked as `svFilePath` is
   */
  xmlDataPath: string
  /** the module in `svFilePath` that the component wraps. Required: it's never inferred */
  moduleName: string
}

// The parameters the module holds: the files' contents rather than their paths, so the same files
// at two paths give one derived name, and a changed file gives a new one
interface IpXactComponent_ModuleParameters extends TSSVParameters {
  moduleName: string
  svContents: string
  xmlContents: string
}

/**
 * @see doc/modules/IpXactComponent/IpXactComponent-spec.md
 */
export class IpXactComponent extends Module {
  declare params: IpXactComponent_ModuleParameters
  // The paths as given, for messages, the parameter comment and the import of the SV file
  private readonly svFilePath: string
  private readonly xmlDataPath: string

  static knownInterfaces: Record<string, any> = {
    'tssv/lib/interfaces/AMBA/AMBA2/AHB/r3p0_1/AHB': amba.AHB,
    'tssv/lib/interfaces/AMBA/AMBA3/AHBLite/r2p0_0/AHBLite': amba.AHBLite,
    'tssv/lib/interfaces/AMBA/AMBA3/AHBLiteInitiator/r2p0_0/AHBLiteInitiator': amba.AHBLiteInitiator,
    'tssv/lib/interfaces/AMBA/AMBA3/AHBLiteTarget/r2p0_0/AHBLiteTarget': amba.AHBLiteTarget,
    'tssv/lib/interfaces/AMBA/AMBA3/APB/r2p0_0/APB': amba.APB,
    'tssv/lib/interfaces/AMBA/AMBA3/ATB/r2p0_0/ATB': amba.ATB,
    'tssv/lib/interfaces/AMBA/AMBA3/AXI/r2p0_0/AXI': amba.AXI,
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
    // svFilePath is checked first, so a relative one throws before anything is read
    const svFile = absolutePath(params.svFilePath, 'svFilePath')
    const xmlData = fs.readFileSync(absolutePath(params.xmlDataPath, 'xmlDataPath'), 'utf-8')
    super({
      name: params.name,
      moduleName: params.moduleName,
      svContents: fs.readFileSync(svFile, 'utf-8'),
      xmlContents: xmlData
    })
    this.svFilePath = params.svFilePath
    this.xmlDataPath = params.xmlDataPath
    const interfaceData = this.createDictionary(xmlData)
    const paramData = this.parseParameters(xmlData)
    const portWidths = this.parsePortWidths(xmlData)

    this.addInterfaces(interfaceData, paramData)

    this.addSystemVerilogSubmoduleWithBindings(interfaceData, portWidths)
  }

  protected addSystemVerilogSubmoduleWithBindings (componentDataRecord: Record<string, ComponentData>, portWidths: Record<string, number>): Module {
    const SVFilePath = this.svFilePath
    const header = this.readSVModuleHeader(SVFilePath)
    const bindings: Record<string, string | Sig> = {}

    // Bind each port the XML maps to a bus signal, after checking that the two are the same width
    // where the XML's <model><ports> gives the port's width
    for (const [interfaceName, componentData] of Object.entries(componentDataRecord)) {
      for (const [logicalPort, physicalPort] of Object.entries(componentData.ports)) {
        const busSignal = this.interfaces[interfaceName]?.signals[logicalPort]
        const width = portWidths[physicalPort]
        if (busSignal !== undefined && width !== undefined) {
          const busWidth = Number(busSignal.width ?? 1)
          if (width !== busWidth) {
            throw Error(`IpXactComponent ${this.name}: ${this.xmlDataPath} maps port ${physicalPort} (${width} bits) to ${interfaceName}.${logicalPort} (${busWidth} bits)`)
          }
        }
        bindings[physicalPort] = `${interfaceName}.${logicalPort}`
      }
    }

    // Tie each input of the SV module that the XML maps to no bus signal to 0
    const tied = Object.keys(header.ports).filter(port => header.ports[port] === 'input' && bindings[port] === undefined)
    for (const port of tied) {
      bindings[port] = this.addConstSignal(undefined, 0n, false, this.portWidth(port, header, portWidths))
    }
    if (tied.length > 0) {
      this.addBody(`// Inputs of ${header.name} that the XML maps to no bus signal, tied to 0: ${tied.join(', ')}`)
    }

    // A bus input that no port reads, because the XML maps it to no port or maps its port to
    // another bus signal as well (as it does a clock that several interfaces share), is read into
    // a signal that nothing uses, under a waiver for that signal only (LINT-3)
    const bound = new Set(Object.values(bindings).map(binding => binding.toString()))
    const ignored: string[] = []
    for (const [interfaceName, intf] of Object.entries(this.interfaces)) {
      const modport = intf.role === undefined ? undefined : intf.modports?.[intf.role]
      for (const [signal, direction] of Object.entries(modport ?? {})) {
        if (direction === 'input' && !bound.has(`${interfaceName}.${signal}`)) ignored.push(`${interfaceName}.${signal}`)
      }
    }
    if (ignored.length > 0) {
      this.addBody(`
        // Bus inputs that no port of ${header.name} reads
        /* verilator lint_off UNUSEDSIGNAL */
        logic unused_bus_inputs;
        /* verilator lint_on UNUSEDSIGNAL */
        assign unused_bus_inputs = ^{${ignored.join(', ')}};
      `)
    }

    // Every input is bound above, so nothing is left to bind by name (MOD-6)
    return this.addSystemVerilogSubmodule('u_ip', SVFilePath, {}, bindings, false, { moduleName: this.params.moduleName })
  }

  // The module header of the SystemVerilog module, which names its ports and their directions
  private readSVModuleHeader (filePath: string): SVModuleHeader {
    return selectSVModule(parseSVModules(this.params.svContents), absolutePath(filePath, 'svFilePath'), this.params.moduleName)
  }

  // The files' contents are long, so the SV's parameter comment gives each one's size, its hash (the
  // same one a derived module name holds) and the path it was read from
  protected override formatParametersForComment (
    params: TSSVParameters = this.params,
    opts?: { prefix?: string, skipName?: boolean }
  ): string {
    const summary = (text: unknown, path: string): string | undefined =>
      typeof text === 'string' ? `${Buffer.byteLength(text)} bytes, hash ${this.nameHash(text)}, from ${path}` : undefined
    return super.formatParametersForComment({
      ...params,
      svContents: summary(params.svContents, this.svFilePath),
      xmlContents: summary(params.xmlContents, this.xmlDataPath)
    }, opts)
  }

  // The width of a port of the SV module, from the XML's <model><ports>, for a port that needs one
  private portWidth (port: string, header: SVModuleHeader, portWidths: Record<string, number>): number {
    const width = portWidths[port]
    if (width === undefined) {
      throw Error(`IpXactComponent ${this.name}: port ${port} of ${header.name} isn't in the <model><ports> of ${this.xmlDataPath}`)
    }
    return width
  }

  // The width of each port of the component's model, from the XML's <model><ports>: the span of
  // its vector, or 1 for a port with no vector
  protected parsePortWidths (xmlData: string): Record<string, number> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textNodeName: 'text'
    })
    // A bound with attributes (spirit:format, spirit:resolve) parses to an object holding its text
    const bound = (value: any): number => Number(typeof value === 'object' ? value.text : value)
    const widths: Record<string, number> = {}
    for (const component of list(removePrefix(parser.parse(xmlData)).component)) {
      for (const port of list(component.model?.ports?.port)) {
        const vector = port.wire?.vector
        widths[port.name] = vector === undefined ? 1 : Math.abs(bound(vector.left) - bound(vector.right)) + 1
      }
    }
    return widths
  }

  // protected createDictionary (xmlData: string): Record<string, ComponentData> {
  //   const parser = new XMLParser({
  //     ignoreAttributes: false,
  //     attributeNamePrefix: '',
  //     textNodeName: 'text'
  //   })
  //   const jsonObj = parser.parse(xmlData)
  //   const components = jsonObj['spirit:component']
  //   const result: Record<string, ComponentData> = {}
  //   const processComponent = (component: any): void => {
  //     const busInterfaces = component['spirit:busInterfaces']['spirit:busInterface']
  //     busInterfaces.forEach((busInterface: any) => {
  //       const interfaceName = busInterface['spirit:name']
  //       const abstractionType = busInterface['spirit:abstractionType']
  //       const version = abstractionType['spirit:version']
  //       const abstractionName = abstractionType['spirit:name'].replace(/_+/g, '_')
  //       const abstractionLibrary = abstractionType['spirit:library']
  //       const busType = busInterface['spirit:busType']
  //       const busName = busType['spirit:name'].replace(/_+$/, '')
  //       const portMaps = busInterface['spirit:portMaps']['spirit:portMap']
  //       const portDictionary: Record<string, string> = {}
  //       portMaps.forEach((portMap: any) => {
  //         const logicalPort = portMap['spirit:logicalPort']['spirit:name']
  //         const physicalPort = portMap['spirit:physicalPort']['spirit:name']
  //         portDictionary[logicalPort] = physicalPort
  //       })
  //       result[interfaceName] = {
  //         version,
  //         abstractionName,
  //         abstractionLibrary,
  //         busName,
  //         ports: portDictionary
  //       }
  //     })
  //   }
  //   if (Array.isArray(components)) {
  //     components.forEach(processComponent)
  //   } else {
  //     processComponent(components)
  //   }
  //   return result
  // }
  protected createDictionary (xmlData: string): Record<string, ComponentData> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textNodeName: 'text'
    })

    const jsonObj = removePrefix(parser.parse(xmlData))
    const components = jsonObj.component
    const result: Record<string, ComponentData> = {}

    const processComponent = (component: any): void => {
      // The parser gives a single element as itself and several as an array: list() takes both
      const busInterfaces = list(component.busInterfaces.busInterface)
      busInterfaces.forEach((busInterface: any) => {
        const interfaceName = busInterface.name
        const abstractionType = busInterface.abstractionType
        const version = abstractionType.version
        const abstractionName = abstractionType.name.replace(/_+/g, '_')
        const abstractionLibrary = abstractionType.library
        const busType = busInterface.busType
        const busName = busType.name.replace(/_+$/, '')
        const portMaps = list(busInterface.portMaps.portMap)
        const portDictionary: Record<string, string> = {}

        portMaps.forEach((portMap: any) => {
          const logicalPort = portMap.logicalPort.name
          const physicalPort = portMap.physicalPort.name
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
      const pathString = `tssv/lib/interfaces/AMBA/${component.abstractionLibrary}/${component.busName}/${component.version}/${component.busName}`

      const InterfaceModule = IpXactComponent.knownInterfaces[pathString]
      if (InterfaceModule) {
        const isAXI = pathString.includes('AXI')
        const isAPB = pathString.includes('APB')
        const isOutward = interfaceName.startsWith('Init')
        const isInward = interfaceName.toLowerCase().startsWith('targ')

        if (isOutward || isInward) {
          const paramObject: Record<string, string | undefined> = {}

          if (isAXI) {
            const axiParams = parameterData[interfaceName]
            if (axiParams) {
              for (const [paramName, paramData] of Object.entries(axiParams)) {
                let transformedParamName = transformParameterName(paramName)
                if (transformedParamName.endsWith('USER_WIDTH')) {
                  transformedParamName = 'USER_WIDTH'
                }
                paramObject[transformedParamName] = paramData.value
              }

              // Check if any logical port contains 'QOS' and set the QOS parameter accordingly
              const qosParameter = component.ports && Object.keys(component.ports).some(logicalPort => logicalPort.includes('QOS')) ? 'withQOS' : 'noQOS'
              paramObject.QOS = qosParameter
            }
          } else if (isAPB) {
            const apbParams = parameterData[interfaceName]
            for (const [paramName, paramData] of Object.entries(apbParams)) {
              const transformedName = transformParameterName(paramName)
              paramObject[transformedName] = paramData.value
            }
          }

          // Remove undefined properties
          Object.entries(paramObject).forEach(([key, value]) => {
            if (value === undefined) {
              delete paramObject[key] // eslint-disable-line @typescript-eslint/no-dynamic-delete
            }
          })

          // Switched directions
          const direction = isOutward ? 'inward' : 'outward'

          // Add interface with parameters
          this.addInterface(interfaceName, new InterfaceModule(paramObject, direction)) // eslint-disable-line @typescript-eslint/no-unsafe-argument
        } else {
          throw Error(`IpXactComponent ${this.name}: ${this.xmlDataPath} has interface ${interfaceName}, whose name doesn't start with Init or Targ, so its direction is unknown`)
        }
      } else {
        throw Error(`IpXactComponent ${this.name}: ${this.xmlDataPath} has interface ${interfaceName} of bus type ${pathString}, which isn't in IpXactComponent.knownInterfaces`)
      }
    }
  }

  // protected addInterfaces (interfaceData: Record<string, ComponentData>, parameterData: Record<string, Record<string, ParameterData>>): void {
  //   for (const interfaceName in interfaceData) {
  //     const component = interfaceData[interfaceName]
  //     const pathString = `tssv/lib/interfaces/AMBA/${component.abstractionLibrary}/${component.busName}/${component.version}/${component.busName}`

  //     const InterfaceModule = IpXactComponent.knownInterfaces[pathString]
  //     if (InterfaceModule) {
  //       const isAXI = pathString.includes('AXI')
  //       const isOutward = interfaceName.startsWith('Init')
  //       const isInward = interfaceName.toLowerCase().startsWith('targ')

  //       if (isOutward || isInward) {
  //         const axiParams = parameterData[interfaceName]
  //         const axiParamObject: Record<string, string | undefined> = {}

  //         if (axiParams) {
  //           for (const [paramName, paramData] of Object.entries(axiParams)) {
  //             let transformedParamName = transformParameterName(paramName)
  //             if (transformedParamName.endsWith('USER_WIDTH')) {
  //               transformedParamName = 'USER_WIDTH'
  //             }

  //             axiParamObject[transformedParamName] = paramData.value
  //           }

  //           // Check if any logical port contains 'QOS' and set the QOS parameter accordingly
  //           const qosParameter = component.ports && Object.keys(component.ports).some(logicalPort => logicalPort.includes('QOS')) ? 'withQOS' : 'noQOS'
  //           axiParamObject.QOS = qosParameter

  //           // Remove undefined properties
  //           Object.entries(axiParamObject).forEach(([key, value]) => {
  //             if (value === undefined) {
  //               // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  //               delete axiParamObject[key]
  //             }
  //           })
  //         }

  //         // Switched directions
  //         const direction = isOutward ? 'inward' : 'outward'

  //         // Add AXI or non-AXI interface with parameters
  //         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //         this.addInterface(interfaceName, new InterfaceModule(isAXI ? axiParamObject : {}, direction))
  //       } else {
  //         console.warn(`Interface name ${interfaceName} does not indicate outward or inward.`)
  //       }
  //     } else {
  //       console.error(`Interface for ${interfaceName} with path ${pathString} is not known.`)
  //     }
  //   }
  // }

  protected parseParameters (xmlInput: string): Record<string, Record<string, ParameterData>> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    })

    const parsedXml = parser.parse(xmlInput)
    const busInterfaces = list(parsedXml['spirit:component']['spirit:busInterfaces']['spirit:busInterface'])

    const parametersData: Record<string, Record<string, ParameterData>> = {}

    busInterfaces.forEach((interfaceData: any) => {
      const interfaceName = interfaceData['spirit:name']
      const parameters = list(interfaceData['spirit:parameters']?.['spirit:parameter'])

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

// An XML element that may occur more than once, as an array: the parser gives one occurrence as
// itself, several as an array, and none as undefined
function list (element: any): any[] {
  return element === undefined ? [] : [element].flat()
}

// The parsed XML with each key's namespace prefix (`spirit:`, `ipxact:`) removed
function removePrefix (obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(removePrefix)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
    const newKey = key.replace(/^[^:]+:/, '')
    acc[newKey] = removePrefix(obj[key])
    return acc
  }, {})
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
