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
  /**
     * endianness of ROM data
     */
  endianness?: 'big' | 'little'
}
export class ROM extends Module {
  declare params: ROM_Parameters
  declare MemInitFile // initial data file path or array
  declare rcf_path?: string // rcf file path
  constructor (params: ROM_Parameters, MemInitFile: string | number[] | Uint8Array, rcf_path?: string) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth,
      endianness: params.endianness || 'big'
    })
    this.rcf_path = rcf_path || ''
    this.MemInitFile = MemInitFile

    // Extract a string by identifier and convert it to hexadecimal, returning an array in hexadecimal
    function getStringsAfterChars (strings: string[] | number[] | Uint8Array, data_width: number): string[] {
      // If the input is of type Uint8Array, first convert it to a string array
      let strings_array: string[] = []
      if (strings instanceof Uint8Array) {
        strings_array = strings.join(' ').split(' ')
      } else {
        strings_array = strings.map(num => num.toString()) // Convert number array to string array
      }
      return strings_array.map(str => {
        let result_temp = str
        let result = ''
        let index_hex: number = -1
        for (const i of ['0x', '0X', '\'h']) {
          index_hex = result_temp.indexOf(i)
          if (index_hex !== -1) break
        }
        const index_dec = result_temp.indexOf('\'d')
        const index_bin = result_temp.indexOf('\'b')
        if (index_hex !== -1) { // Hexadecimal, output directly after truncation
          result += result_temp.substring(index_hex + '0x'.length)
        } else if (index_bin !== -1) { // Binary, truncated and converted to hexadecimal output
          result_temp = result_temp.substring(index_bin + '\'b'.length)
          const str2num = parseInt(result_temp, 2) // string to number
          result += str2num.toString(16).toUpperCase() // dec to hex
        } else if (index_dec !== -1) { // Decimal, truncated to determine positive or negative and convert to hexadecimal output
          result_temp = result_temp.substring(index_dec + '\'d'.length)
          if (str.startsWith('-')) { // Determine whether the decimal number is negative, if it is negative, take the inverse and add one to its absolute value
            const abs_dec2bin = (Number(result_temp).toString(2)).padStart(data_width, '0')
            const bin_inv = abs_dec2bin.split('').map(char => char === '0' ? '1' : '0').join('')
            const inv_add1 = (parseInt(bin_inv, 2) + 1).toString(2)
            result += parseInt(inv_add1, 2).toString(16).toUpperCase()
          } else {
            result += Number(result_temp).toString(16).toUpperCase()
          }
        } else { // If there is no identifier, default to decimal number
          if (str.startsWith('-')) { // Determine whether the decimal number is negative, if it is negative, take the inverse and add one to its absolute value
            result_temp = result_temp.substring(1)
            const abs_dec2bin = (Number(result_temp).toString(2)).padStart(data_width, '0')
            const bin_inv = abs_dec2bin.split('').map(char => char === '0' ? '1' : '0').join('')
            const inv_add1 = (parseInt(bin_inv, 2) + 1).toString(2)
            result += parseInt(inv_add1, 2).toString(16).toUpperCase()
          } else {
            result += Number(result_temp).toString(16).toUpperCase()
          }
        }
        // initial file Data bit width check
        if (result.length * 4 > data_width) throw Error(`The bit width of the initial data '${result}'is greater than the set width '${data_width}'`)
        return result
      })
    }

    // This function determines whether it is in endian mode based on the initial input data type and the set ROM bit width
    function EndianModeCheck (arrays: string[] | number[] | Uint8Array, data_width: number): number {
      let endian_mode = 0
      if (Array.isArray(arrays) && arrays.every((item: any) => typeof item === 'string')) { // The input array comes from the initialization file
        const char_index = (arrays[0] as string).indexOf('\'b')
        const isBinary = (char_index !== -1) // Check if the data is binary
        if (isBinary) {
          // Check if the data bit width is 8 and if the ROM bit width is an integer multiple of the data bit width
          const width_multOf8 = ((((arrays[0] as string).substring(char_index + '\'b'.length)).length === 8) && (data_width % 8 === 0) && (data_width / 8 > 1))
          if (width_multOf8) {
            endian_mode = 1
          }
        }
      } else { // The input array comes from the TS array
        if (arrays instanceof Uint8Array) {
          if ((data_width % 8 === 0) && (data_width / 8 > 1)) {
            endian_mode = 1
          }
        }
      }
      return endian_mode
    }

    // read init_file
    let init_data_array: string[] = []
    let data_width = this.params.dataWidth
    let isEndianMode = 0
    if (typeof this.MemInitFile === 'string') {
      let init_data: string[] = []
      try {
        const data = fs.readFileSync(`${this.MemInitFile}`, 'utf8') // 将文件内容读取为UTF-8编码的字符串
        init_data = (data.split('\n')).map(item => (item.split('_').join('')).split(' ').join(''))// Convert the read file content into a string array by line, while removing '_' and spaces from the string
      } catch (err) {
        console.error(err)
      }
      isEndianMode = EndianModeCheck(init_data, this.params.dataWidth)
      if (isEndianMode) {
        data_width = 8
      }
      init_data_array = getStringsAfterChars(init_data, data_width)
    } else {
      isEndianMode = EndianModeCheck(this.MemInitFile, this.params.dataWidth)
      if (isEndianMode) {
        data_width = 8
      }
      init_data_array = getStringsAfterChars(this.MemInitFile, data_width)
    }

    // calculate rom`s depth
    let rom_depth: number
    if (isEndianMode) {
      rom_depth = init_data_array.length / (this.params.dataWidth / 8)
    } else {
      rom_depth = init_data_array.length
    }

    // define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rd_en: { direction: 'input' },
      addr: { direction: 'input', width: this.bitWidth(rom_depth - 1) },
      data_out: { direction: 'output', width: this.params.dataWidth }
    }

    // If the data bit width is uneven, fill the high bits of the data with 0
    const arry_width = Math.ceil(data_width / 4)
    const init_data_array_pad = init_data_array.map(array => array.padStart(arry_width, '0'))

    // construct output signal list
    const signalArray: string[] = []
    if (isEndianMode) {
      const byte_num = this.params.dataWidth / 8
      let point = 0
      for (let i = 0; i < rom_depth; i++) {
        let rom_data = ''
        if (this.params.endianness === 'little') {
          for (let j = byte_num - 1; j >= 0; j--) {
            rom_data += init_data_array_pad[point + j]
          }
        } else {
          for (let j = 0; j < byte_num; j++) {
            rom_data += init_data_array_pad[point + j]
          }
        }
        point = point + byte_num
        signalArray.push(`${this.bitWidth(rom_depth)}'d${i}: data_out <= ${this.params.dataWidth}'h${rom_data};\n`)
      }
    } else {
      for (let n = 0; n < rom_depth; n++) {
        signalArray.push(`${this.bitWidth(rom_depth)}'d${n}: data_out <= ${this.params.dataWidth}'h${init_data_array_pad[n]};\n`)
      }
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
