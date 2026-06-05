import * as fs from 'fs'
import path from 'path'
import { SRAM_WRAPPER, type PortsType } from 'tssv/lib/modules/SRAM_WRAPPER'
import { extractModuleImpl, removeParameter } from 'tssv/lib/tools/verilogProcessor'
import { type OriginationUnfold, type SramConfig } from 'tssv/lib/tools/shared'

function parseSramData (sramPath: string): Record<string, SramConfig> {
  const sramConfigs = JSON.parse(fs.readFileSync(sramPath, 'utf8')) as Record<string, SramConfig>
  Object.values(sramConfigs).forEach(sramConfig => {
    sramConfig.name = `${sramConfig.sram_type}_${sramConfig.depth}x${sramConfig.width}${sramConfig.muxBankCd}${sramConfig.suffix}`
    const unfoldedOrigination = processOriginationUnfolds(sramConfig)
    sramConfig.originationUnfold = unfoldedOrigination
  })
  // console.log(sramConfigs)
  return sramConfigs
}

function processOriginationUnfolds (
  sramConfig: SramConfig
): OriginationUnfold[] {
  const unfolds: OriginationUnfold[] = []
  let instCounter = 0
  let remainingWidth = sramConfig.width - 1

  for (const origination of sramConfig.origination) {
    if (origination.type === 'SRAM') {
      for (let i = 0; i < origination.number; i++) {
        const unfold: OriginationUnfold = {
          ...origination,
          width: origination.width,
          depth: BigInt(origination.depth),
          instName: `u_sram_${instCounter++}`,
          bitBig: remainingWidth
        }
        unfolds.push(unfold)
        remainingWidth -= origination.width
      }
    } else if (origination.type === 'REG') {
      const unfold: OriginationUnfold = {
        ...origination,
        width: origination.width,
        depth: BigInt(origination.depth),
        instName: `u_reg_${instCounter++}`,
        bitBig: remainingWidth
      }
      unfolds.push(unfold)
      remainingWidth -= origination.width
    }
  }
  // console.log(unfolds)
  return unfolds
}

const extractSramList = (config: SramConfig): string => {
  return config.origination
    .filter(item => item.type === 'SRAM')
    .map(item => {
      const match = item.module.match(/^(.*?)(_wrapper.*)$/)
      return match ? match[1] : item.module
    })
    .join('\n')
}

const writeSramList = (filePath: string, data: string): void => {
  fs.writeFileSync(filePath, data, 'utf-8')
}

function generateSramWrapper (config: SramConfig): string {
  let ports: PortsType
  let writeEnableMask: 'none' | 'bit'

  switch (config.sram_type) {
    case 'ln05lpe_a00_mc_rd2r_hsr_rvt':
    case 'ln05lpe_a00_mc_rd2r_hsr_lvt':
      ports = 'RD2_HS'
      writeEnableMask = 'none'
      break
    case 'ln05lpe_a00_mc_rd2rw_hsr_rvt':
    case 'ln05lpe_a00_mc_rd2rw_hsr_lvt':
      ports = 'RD2_HS'
      writeEnableMask = 'bit'
      break
    case 'ln05lpe_a00_mc_rf2r_hsr_rvt':
    case 'ln05lpe_a00_mc_rf2r_hsr_lvt':
      ports = 'RF2_HS'
      writeEnableMask = 'none'
      break
    case 'ln05lpe_a00_mc_rf2rw_hsr_rvt':
    case 'ln05lpe_a00_mc_rf2rw_hsr_lvt':
      ports = 'RF2_HS'
      writeEnableMask = 'bit'
      break
    case 'ln05lpe_a00_mc_ra1r_hsr_rvt':
    case 'ln05lpe_a00_mc_ra1r_hsr_lvt':
      ports = 'RA1_HS'
      writeEnableMask = 'none'
      break
    case 'ln05lpe_a00_mc_ra1rw_hsr_rvt':
    case 'ln05lpe_a00_mc_ra1rw_hsr_lvt':
      ports = 'RA1_HS'
      writeEnableMask = 'bit'
      break
    case 'ln05lpe_a00_mc_rf1r_hsr_lvt':
    case 'ln05lpe_a00_mc_rf1r_hsr_rvt':
    case 'ln05lpe_a00_mc_rf1r_hdrw_lvt':
    case 'ln05lpe_a00_mc_rf1r_hdrw_rvt':
      ports = 'RF1_HS'
      writeEnableMask = 'none'
      break
    case 'ln05lpe_a00_mc_rf1rw_hsr_lvt':
    case 'ln05lpe_a00_mc_rf1rw_hsr_rvt':
    case 'ln05lpe_a00_mc_rf1rw_hdrw_lvt':
    case 'ln05lpe_a00_mc_rf1rw_hdrw_rvt':
      ports = 'RF1_HS'
      writeEnableMask = 'bit'
      break
    default:
      throw new Error(`Unsupported SRAM type: ${config.sram_type}`)
  }

  //  config.originationUnfold.map(origination => ({
  //     instName: origination.instName,
  //     module: origination.module,
  //     width: origination.width,
  //     depth: origination.depth,
  //     bitBig: origination.bitBig,
  //     type: origination.type,
  //     adr_mask: origination.adr_mask,
  //     en_ptn: origination.en_ptn
  //   })
  // })

  const wrapper = new SRAM_WRAPPER({
    name: `${config.name}`,
    dataWidth: config.width,
    depth: BigInt(config.depth),
    ports,
    writeEnableMask,
    split_direction: config.split_direction
  }, config.originationUnfold)

  return wrapper.writeVerilog()
}

function ensureFileExists (filePath: string): void {
  const dir = path.dirname(filePath)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(filePath, '', 'utf8')
  // console.log(`File created or overwritten: ${filePath}`)
}

function checkConfig (wrapConfig: SramConfig): void {
  if (wrapConfig.split_direction === 'depth') {
    for (const macro of wrapConfig.origination) {
      if (macro.type === 'SRAM' && (!macro.adr_mask || !macro.en_ptn)) {
        throw new Error(
        `When split_direction is 'depth' and type is 'SRAM', both adr_mask and en_ptn must be provided. Problematic entry: ${JSON.stringify(macro)}`
        )
      }
    }
  }
}

function main (): void {
  const inputPath = process.argv[2]
  const outputPath = process.argv[3]

  try {
    const sramConfigs = parseSramData(inputPath)
    for (const sramConfig of Object.values(sramConfigs)) {
      checkConfig(sramConfig)
      const sramList = extractSramList(sramConfig)
      writeSramList(outputPath, sramList)
      // console.log(`SRAM list has been written to ${outputPath}`)

      let wrapperVerilog = generateSramWrapper(sramConfig)
      wrapperVerilog = removeParameter(wrapperVerilog)
      wrapperVerilog = extractModuleImpl(wrapperVerilog, sramConfig.name)
      const wrapperPath = `${sramConfig.output_dir}/${sramConfig.name}_wrapper.v`
      ensureFileExists(wrapperPath)
      fs.writeFileSync(wrapperPath, wrapperVerilog, 'utf-8')
      console.log(`SRAM_WRAPPER has been written to ${wrapperPath}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error('An unknown error occurred:', error)
    }
  }
}

main()
