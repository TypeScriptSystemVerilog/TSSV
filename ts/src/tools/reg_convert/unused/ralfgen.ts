import * as fs from 'fs'
import * as path from 'path'

const jsonFilePath = path.resolve('/home/runzhe.liu/TSSV/sv-examples/reg_convert/AIGC_DEMO_registers.json')
const registers = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

function generateRalfContent (registers: Record<string, any>): string {
  let ralfContent = ''

  for (const [registerName, regData] of Object.entries(registers)) {
    const { startAddr, packName, type, description, reset } = regData

    ralfContent += `field ${registerName} {\n`
    ralfContent += '  bits 32;\n'
    ralfContent += `  enum { ${registerName.toUpperCase()} };\n`
    ralfContent += '  coverpoint {\n'
    ralfContent += `    bins ${registerName.toUpperCase()} = { ${startAddr} };\n`
    ralfContent += '  }\n'
    ralfContent += `  description "${description}";\n`
    ralfContent += `  reset ${reset};\n`
    ralfContent += '}\n\n'

    if (packName) {
      ralfContent += `package ${packName} {\n`
      ralfContent += `  field ${registerName} {\n`
      ralfContent += '    bits 32;\n'
      ralfContent += `    reset ${reset};\n`
      ralfContent += '  }\n'
      ralfContent += '}\n\n'
    }
  }

  return ralfContent
}

const ralfContent = generateRalfContent(registers)

const ralfFilePath = path.resolve('/home/runzhe.liu/TSSV/sv-examples/reg_convert/AIGC_DEMO_registers.ralf')
fs.writeFileSync(ralfFilePath, ralfContent, 'utf-8')

console.log(`RALF file saved to: ${ralfFilePath}`)
