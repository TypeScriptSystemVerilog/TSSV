import { type RegWoFdsUnfoldRep, type Register } from 'tssv/lib/tools/shared'

export function removeParameter (data: string): string {
  // 使用正则表达式删除 #( ... ) 部分
  const modifiedData = data.replace(/#\([^)]*\)/, '')

  return modifiedData
}

export function extractModuleImpl (wrapperVerilog: string, moduleName: string): string {
  // 定义正则表达式匹配特定模块名称及其内容
  const moduleRegex = new RegExp(`module\\s+${moduleName}[\\s\\S]*?endmodule`, 'g')

  // 匹配所有模块，过滤出指定模块名称的内容
  const matchedModule = wrapperVerilog.match(moduleRegex)

  if (matchedModule) {
    // 只处理匹配到的模块内容，删除 #(parameter dataWidth = 32)
    const cleanedModule = removeParameter(matchedModule[0])
    return cleanedModule
  } else {
    // 如果没有找到匹配的模块，返回空字符串或处理方式
    return ''
  }
}

export function trimLines (content: string): string {
  return content
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}
export function generateVerilogHeader (blockName: string, version: string, commitId: string | undefined): string {
  return `import ${blockName}_pkg::*;

// =============================================================================
// Generated Register Block ${version}
// =============================================================================

// Commit ID: ${commitId ?? 'unknown commit'}
`
}

/*
 splitWdataByRes Modify always_ff:
  - reg_ctrl <= reg_wdata;
  + reg_CTRL[31:25] <= reg_wdata[31:25];
  + reg_CTRL[24:30] <= '0;
  + reg_CTRL[29:4] <= reg_wdata[29:4];
  + reg_CTRL[3:7] <= '0;
  + reg_CTRL[6:0] <= reg_wdata[6:0];

*/
export function splitWdataByRes (content: string, wordSize: number, regs: Record<string, RegWoFdsUnfoldRep>): string {
  return content.replace(/reg_(\w+) <= (\w+);/g, (match, key, source) => {
    const regName = key.toUpperCase()
    const regInfo = regs[regName]
    if (!regInfo?.reserved) {
      return match // 保持原样
    }
    let result = ''
    let lastBit = wordSize - 1
    // 按位区间从高到低排序
    const sortedReserved = regInfo.reserved.sort((a, b) => b[1] - a[1])
    sortedReserved.forEach(([msb, lsb]) => {
      if (lastBit > msb) {
        result += `  reg_${key}[${lastBit}:${msb + 1}] <= ${source}[${lastBit}:${msb + 1}];\n`
      }
      result += `  reg_${key}[${msb}:${lsb}] <= '0;\n`
      lastBit = lsb - 1
    })
    if (lastBit > 0) {
      result += `  reg_${key}[${lastBit}:0] <= ${source}[${lastBit}:0];\n`
    } else if (lastBit === 0) {
      result += `  reg_${key}[0] <= ${source}[0];\n`
    }
    return result.trim()
  })
}

/* replaceSignalTypes:
-logic [31:0] reg_debug_0;
+DEBUG_0_t reg_debug_0;
*/

export function replaceSignalTypes (content: string, wordSize: number, regs: Record<string, RegWoFdsUnfoldRep>): string {
  return content
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim()
      if (!(trimmedLine.includes('reg_wdata') || trimmedLine.includes('*reg_rdata*'))) {
        for (const [key, reg] of Object.entries(regs)) {
          const keyPattern = `reg_${key.toLowerCase()};`
          if (trimmedLine.includes(keyPattern)) {
            if (reg.packName) {
              return trimmedLine.replace(`logic [${wordSize - 1}:0]`, reg.packName)
            }
          }
        }
      }
      return trimmedLine
    })
    .join('\n')
}

/* outRegField:
- output logic [31:0] cfg_protocol2_ext_ovrd_2
+ output logic [15:0] protocol2_ext_tx_eq_ovrd_g3
- assign cfg_protocol2_ext_ovrd_2 = reg_protocol2_ext_ovrd_2;
+ assign protocol2_ext_tx_eq_ovrd_g3 = reg_protocol2_ext_ovrd_2[15:0];
or
- assign cfg_protocol2_ext_ovrd_2 = buf_protocol2_ext_ovrd_2;
+ assign protocol2_ext_tx_eq_ovrd_g3 = buf_protocol2_ext_ovrd_2[15:0];
*/
export function outRegField (content: string, wordSize: number, regs: Record<string, Register>): string {
  return content
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim()
      for (const regName in regs) {
        if (regs[regName].fieldOut === true) {
          // for (const fieldName in regs[regName].fields) {
          if (trimmedLine.includes(`output logic [${wordSize - 1}:0] cfg_${regName.toLowerCase()}`)) {
            const fieldOutputs = Object.entries(regs[regName].fields).map(([fieldName, field]) => {
              const fieldWidth = field.bitRange[0] - field.bitRange[1] + 1
              return trimmedLine.replace(`output logic [${wordSize - 1}:0] cfg_${regName.toLowerCase()}`, `output logic ${fieldWidth - 1 === 0 ? '' : `[${fieldWidth - 1}:0] `}${fieldName}`)
              // return trimmedLine.replace(`output logic [${wordSize - 1}:0] cfg_${regName.toLowerCase()}`, fieldWidth - 1 === 0 ? `output logic ${fieldName}` : `output logic [${fieldWidth - 1}:0] ${fieldName}`)
            })
            return fieldOutputs.join(',\n')
          } else if (trimmedLine.startsWith(`assign cfg_${regName.toLowerCase()} = `)) {
            if (regs[regName].useBuf === true) {
              const fieldAssigns = Object.entries(regs[regName].fields).map(([fieldName, field]) => {
                const fieldWidth = field.bitRange[0] - field.bitRange[1] + 1
                return `assign ${fieldName} = buf_${regName.toLowerCase()}[${fieldWidth === 1 ? field.bitRange[0] : field.bitRange.join(':')}];`
              })
              return fieldAssigns.join('\n')
            } else {
              const fieldAssigns = Object.entries(regs[regName].fields).map(([fieldName, field]) => {
                const fieldWidth = field.bitRange[0] - field.bitRange[1] + 1
                return `assign ${fieldName} = reg_${regName.toLowerCase()}[${fieldWidth === 1 ? field.bitRange[0] : field.bitRange.join(':')}];`
              })
              return fieldAssigns.join('\n')
            }
          }
          // }
        }
      }
      // 如果没有匹配到任何寄存器字段，则返回原始行
      return trimmedLine
    })
    .join('\n')
}
