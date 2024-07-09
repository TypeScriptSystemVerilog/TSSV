import { writeFileSync, mkdirSync } from 'fs'
// import * as fs from 'fs'
import { IpXactComponent } from 'tssv/lib/modules/IpXactComponent'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

try {
  mkdirSync('sv-examples/IpxactComponent')
} catch (e) {}

const xml_path = join(__dirname, '../../../../ts/test/modules/IpxactComponent/axiSample.xml')
const sv_path = join(__dirname, '../../../../ts/test/modules/IpxactComponent/architectureSample.sv')

const component = new IpXactComponent(
  {
    name: 'newComponent',
    xmlDataPath: xml_path,
    svFilePath: sv_path
  })

try {
  const TB =
`
    // verilator lint_off DECLFILENAME
    // verilator lint_off UNUSED
    ${component.writeSystemVerilog()}
`
  writeFileSync('sv-examples/IpxactComponent/componentExample.sv', TB)
} catch (err) {
  console.error(err)
}
