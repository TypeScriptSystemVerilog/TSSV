import TSSV from 'tssv/lib/core/TSSV'
import { inspect } from 'util'
import { exec } from 'child_process'

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
    id: [ number, number ]
  }>
  beatBytes: 4 | 16 | 32 | 64 | 128
  addrBits: TSSV.IntRange<16, 64>
  idBits: TSSV.IntRange<1, 32>
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
      clk: { direction: 'input', isClock: 'posedge' }
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
  }
}
