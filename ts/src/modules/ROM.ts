import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
import * as fs from 'fs'

/**
 * configuration parameters of the ROM module
 */
export interface ROM_Parameters extends TSSVParameters {
  /**
     * bit width of ROM data
     */
  dataWidth: IntRange<1, 256>
}
export class ROM extends Module {
  declare params: ROM_Parameters
  declare MemInitFile: string | string[]// initial data file path or array
  declare rcf_path?: string // rcf file path
  constructor (params: ROM_Parameters, MemInitFile: string | string[], rcf_path?: string) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth
    })
    this.rcf_path = rcf_path || ''
    this.MemInitFile = MemInitFile

    // read init_file
    let init_data_array: string[] = []
    if (typeof this.MemInitFile === 'string') {
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

    // calculate rom`s depth
    const rom_depth = init_data_array.length

    // define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rd_en: { direction: 'input' },
      addr: { direction: 'input', width: this.bitWidth(rom_depth - 1) },
      data_out: { direction: 'output', width: this.params.dataWidth }
    }

    // If the data bit width is uneven, fill the high bits of the data with 0
    const arry_width = Math.ceil(this.params.dataWidth / 4)
    const init_data_array_pad = init_data_array.map(array => array.padStart(arry_width, '0'))

    // construct output signal list
    const signalArray: string[] = []
    let i = 0
    for (const p of init_data_array_pad) {
      signalArray.push(`${this.bitWidth(rom_depth)}'d${i}: data_out <= ${this.params.dataWidth}'h${p};\n`)
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
    if (this.rcf_path) {
      // Hexadecimal to Binary conversion
      const rcf_array: string[] = init_data_array_pad.map(hexString => {
        let binaryString = ''
        for (let i = 0; i < hexString.length; i++) {
          const hexChar = hexString[i]
          const binaryValue = parseInt(hexChar, 16).toString(2) // 将十六进制字符转换为十进制，然后转为二进制
          binaryString += binaryValue.padStart(4, '0') // 确保每个十六进制字符转换为4位二进制字符串
        }
        return binaryString
      })
      // output RCF
      const rcf_FilePath = `${this.rcf_path}/${this.params.name}.rcf`
      const rcf_data = rcf_array.join('\n')
      fs.writeFile(rcf_FilePath, rcf_data, (err) => {
        if (err) {
          console.error(err)
        }
      })
    }
  }
}
