import TSSV from 'tssv/lib/core/TSSV'
import { inspect } from 'util'
import { exec } from 'child_process'
import { AXI4 } from 'tssv/lib/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4'

import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

// Function to create a temporary file and write a string to it
function saveStringToTempFile (data: string): string {
  const tempFilePath = path.join(os.tmpdir(), `tempfile-${Date.now()}.txt`)

  fs.writeFileSync(tempFilePath, data)

  return tempFilePath
}

export interface AXI4XBarParams extends TSSV.TSSVParameters {
  masters: Array<{
    name: string
    id: [number, number]
  }>
  beatBytes: 4 | 8 | 16 | 32 | 64 | 128
  addrBits: TSSV.IntRange<16, 64>
  idBits: TSSV.IntRange<1, 16>
  slaves: Array<{
    name: string
    address: {
      base: bigint
      mask: bigint
    }
    transferSizesWrite: [number, number]
    transferSizesRead: [number, number]
  }>
}

export class AXI4XBar extends TSSV.Module {
  declare params: AXI4XBarParams
  constructor (params: AXI4XBarParams) {
    super(params)

    this.IOs = {
      clock: { direction: 'input', isClock: 'posedge' },
      reset: { direction: 'input', isReset: 'highsync' }
    }

    console.log(inspect(params, { depth: null, colors: true }))

    const innerParams = {
      ...params,
      moduleName: `${params.name}_inner`
    }
    const jsonFile = saveStringToTempFile(TSSV.serialize(innerParams, undefined, ''))

    console.log('Generating AXI4XBar component using rocketdock container...')
    exec(`cat ${jsonFile};third-party/rocket-chip-component-gen/gen_rocket_component.sh AXI4XBar ${jsonFile}; rm ${jsonFile}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${inspect(error, { depth: null, colors: true })}`)
        return
      }
      console.error(`stderr: ${stderr}`)
      console.log(`stdout: ${stdout}`)
    })

    const bindings: Record<string, string | TSSV.Sig> = {
      clock: 'clock',
      reset: 'reset'
    }
    for (const m of this.params.masters) {
      const thisMaster = this.addInterface(m.name,
        new AXI4({
          DATA_WIDTH: (params.beatBytes << 3) as (32 | 64 | 128 | 256 | 512 | 1024),
          ADDR_WIDTH: params.addrBits,
          ID_WIDTH: params.idBits,
          USER_WIDTH: 0,
          QOS: 'withQOS'
        },
        'inward'
        ))

      for (const port in thisMaster.signals) {
        const regex = /^(AW|W|AR|R|B)(.*)$/
        const match = port.match(regex)
        if (match) {
          let prefix = match[1].toLowerCase()
          const base = match[2].toLowerCase()
          if ((base !== 'valid') && (base !== 'ready')) {
            prefix += '_bits'
          }
          bindings[`${m.name}_${prefix}_${base}`] = `${m.name}.${port}`
        }
      }
    }

    for (const s of this.params.slaves) {
      const thisSlave = this.addInterface(s.name,
        new AXI4({
          DATA_WIDTH: (params.beatBytes << 3) as (32 | 64 | 128 | 256 | 512 | 1024),
          ADDR_WIDTH: params.addrBits,
          ID_WIDTH: params.idBits,
          USER_WIDTH: 0,
          QOS: 'withQOS'
        },
        'outward'
        ))

      for (const port in thisSlave.signals) {
        const regex = /^(AW|W|AR|R|B)(.*)$/
        const match = port.match(regex)
        if (match) {
          let prefix = match[1].toLowerCase()
          const base = match[2].toLowerCase()
          if ((base !== 'valid') && (base !== 'ready')) {
            prefix += '_bits'
          }
          bindings[`${s.name}_${prefix}_${base}`] = `${s.name}.${port}`
        }
      }
    }

    this.addSystemVerilogSubmodule(
      'inner',
      `third-party/rocket-chip-component-gen/componentgen/compile.dest/${innerParams.moduleName}.sv`,
      {},
      bindings,
      true
    )
  }
}
