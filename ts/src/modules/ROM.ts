import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
import * as fs from 'fs'

/**
 * configuration parameters of the SRAM module
 */
export interface ROM_Parameters extends TSSVParameters {
  /**
     * bit width of SRAM data
     */
  dataWidth: IntRange<1, 256>
  /**
     * number of data words in the SRAM
     */
  depth: bigint
}
export class ROM extends Module {
  declare params: ROM_Parameters
  declare MemInitFile: string | string[]// file path or array

  constructor (params: ROM_Parameters, MemInitFile: string | string[]) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth,
      depth: params.depth
    })

    this.MemInitFile = MemInitFile
    // define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rd_en: { direction: 'input' },
      addr: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
      data_out: { direction: 'output', width: this.params.dataWidth }
    }
    let init_data_array: string[] = []
    if (typeof this.MemInitFile === 'string') {
      // read init_file
      let init_data = ''
      try {
        const data = fs.readFileSync(`${this.MemInitFile}`, 'utf8') // 将文件内容读取为UTF-8编码的字符串
        console.log('read initial file successfully')
        init_data = data
      } catch (err) {
        console.error(err)
      }
      init_data_array = init_data.split('\n')
    } else {
      init_data_array = this.MemInitFile
    }

    // check if the depth and width of the data in the initial file are consistent with the configuration

    if (init_data_array.length !== Number(this.params.depth)) {
      throw Error(`The data depth of the initial file does not match the set ROM data depth of ${this.params.depth}`)
    }

    // construct output signal list
    const signalArray: string[] = []
    let i = 0
    for (const p of init_data_array) {
      signalArray.push(`${this.bitWidth(this.params.depth)}'d${i}: data_out <= ${this.params.dataWidth}'h${p};\n`)
      i = i + 1
    }

    // define rom`s body
    const rom_body =
    `
    always_ff @(posedge clk) begin
        if (rd_en) begin
            case(addr)
                ${signalArray.join('                ')}
                default: data_out <= ${this.params.dataWidth}'hx;
            endcase
        end
    end
    `
    this.addSequentialAlways({ clk: 'clk', outputs: ['data_out'] }, rom_body)

    // write RCF file
    // Hexadecimal to Binary conversion
    const rcf_array: string[] = init_data_array.map(hexString => {
      let binaryString = ''
      for (let i = 0; i < hexString.length; i++) {
        const hexChar = hexString[i]
        const binaryValue = parseInt(hexChar, 16).toString(2) // 将十六进制字符转换为十进制，然后转为二进制
        binaryString += binaryValue.padStart(4, '0') // 确保每个十六进制字符转换为4位二进制字符串
      }
      return binaryString
    })
    // output RCF
    const rcf_FilePath = `sv-examples/test_ROM_output/${this.params.name}.rcf`
    const rcf_data = rcf_array.join('\n')
    fs.writeFile(rcf_FilePath, rcf_data, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }
}
