import { writeFileSync, mkdirSync } from 'fs'
// import * as fs from 'fs'
import { IpXactComponent } from 'tssv/lib/modules/IpXactComponent'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { writeLintFilelist } from 'tssv/test/models/lintFilelist'
import { lintWrapper } from 'tssv/test/models/lintWrapper'

const GENERATOR = 'ts/test/modules/IpxactComponent/componentExample.ts'

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

mkdirSync('sv-examples/IpXactComponent/axiComponent', { recursive: true })
mkdirSync('sv-examples/IpXactComponent/apbComponent', { recursive: true })

const xml_path = join(__dirname, '../../../../ts/test/modules/IpxactComponent/AXI/axiSample.xml')
const sv_path = join(__dirname, '../../../../ts/test/modules/IpxactComponent/AXI/architectureSample.sv')

// AXI component

const component = new IpXactComponent(
  {
    name: 'axiComponent',
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
  writeFileSync('sv-examples/IpXactComponent/axiComponent/componentExample.sv', TB)
  // Its ports are interfaces, so it's linted through a wrapper that instantiates them
  writeFileSync('sv-examples/IpXactComponent/axiComponent/axiComponent_lint_top.sv', lintWrapper(component, GENERATOR))
  writeLintFilelist('sv-examples/IpXactComponent/axiComponent', 'axiComponent_lint_top',
    ['componentExample.sv', 'axiComponent_lint_top.sv'], GENERATOR)
} catch (err) {
  console.error(err)
}

// APB component

const xml_path_apb = join(__dirname, '../../../../ts/test/modules/IpxactComponent/APB/apbSample.xml')
const sv_path_apb = join(__dirname, '../../../../ts/test/modules/IpxactComponent/APB/apbArchitecture.sv')

const apbComponent = new IpXactComponent(
  {
    name: 'apbComponent',
    xmlDataPath: xml_path_apb,
    svFilePath: sv_path_apb
  }
)

try {
  const TB =
  `
      // verilator lint_off DECLFILENAME
      // verilator lint_off UNUSED
      ${apbComponent.writeSystemVerilog()}
  `
  writeFileSync('sv-examples/IpXactComponent/apbComponent/apbComponentExample.sv', TB)
  writeFileSync('sv-examples/IpXactComponent/apbComponent/apbComponent_lint_top.sv', lintWrapper(apbComponent, GENERATOR))
  writeLintFilelist('sv-examples/IpXactComponent/apbComponent', 'apbComponent_lint_top',
    ['apbComponentExample.sv', 'apbComponent_lint_top.sv'], GENERATOR)
} catch (err) {
  console.error(err)
}
