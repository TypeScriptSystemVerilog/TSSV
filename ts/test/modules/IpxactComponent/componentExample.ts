// Wraps three sample components with IpXactComponent, and writes each under
// sv-examples/IpXactComponent/<component>/, one definition per file:
// - <component>.sv: the wrapper, with each bus interface as a port
// - <interface>.sv: the interface those ports use
// - <component>_lint_top.sv: a wrapper that instantiates the interfaces, so the component can be
//   linted with `verilator --lint-only -Wall`
// - <component>_lint_top.f: the lint filelist
//
// Each sample's SystemVerilog file stands in for the vendor's RTL. It is this test's input,
// written by hand, not generated SV, so it isn't written out with the wrapper: the filelist names
// it where it is (doc/modules/IpXactComponent/IpXactComponent-spec.md).
//
// The AXI and APB samples come from a NoC generator. The adder is the spec's worked example: one
// APB port, so its XML has one bus interface, one parameter list and so on.
//
// It also checks that IpXactComponent ties an unmapped input to 0, and rejects a port whose width
// differs from its bus signal's.
//
// The sample paths start with $TSSV_ROOT, not a path relative to the cwd, so IpXactComponent finds
// them from any directory, and the paths it records in the wrapper's parameter comments are the
// same on every machine. Where the test reads a sample itself, it expands the path first.
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, posix } from 'path'
import { IpXactComponent } from 'tssv/lib/modules/IpXactComponent'
import { parseSVModules, selectSVModule } from 'tssv/lib/core/SVModuleHeader'
import { expandPath } from 'tssv/lib/core/TSSV'
import { writePortInterfaces } from 'tssv/test/models/emitSplit'
import { writeLintFilelist } from 'tssv/test/models/lintFilelist'
import { lintWrapper } from 'tssv/test/models/lintWrapper'

const GENERATOR = 'ts/test/modules/IpxactComponent/componentExample.ts'
const SAMPLES = '$TSSV_ROOT/ts/test/modules/IpxactComponent'
const OUT = 'sv-examples/IpXactComponent'

// `tied`: the inputs of the sample's module that its XML maps to no bus signal
const samples = [
  { name: 'axiComponent', xmlDataPath: `${SAMPLES}/AXI/axiSample.xml`, svFilePath: `${SAMPLES}/AXI/architectureSample.sv`, tied: ['tm'] },
  { name: 'apbComponent', xmlDataPath: `${SAMPLES}/APB/apbSample.xml`, svFilePath: `${SAMPLES}/APB/apbArchitecture.sv`, tied: ['tm'] },
  { name: 'adderComponent', xmlDataPath: `${SAMPLES}/Adder/adder.xml`, svFilePath: `${SAMPLES}/Adder/apb_adder.sv`, tied: [] }
]

for (const { tied, ...params } of samples) {
  const component = new IpXactComponent(params)
  const dir = `${OUT}/${component.name}`
  mkdirSync(dir, { recursive: true })
  // The sample's module, which the wrapper instantiates, is left out of the wrapper's file
  const svFilePath = expandPath(params.svFilePath)
  const sample = selectSVModule(parseSVModules(readFileSync(svFilePath, 'utf8')), svFilePath).name
  const defined = new Set<string>()
  const interfaces = writePortInterfaces(component, dir, defined)
  writeFileSync(`${dir}/${component.name}.sv`, component.writeSystemVerilog({ exclude: new Set([...defined, sample]) }))
  writeFileSync(`${dir}/${component.name}_lint_top.sv`, lintWrapper(component, GENERATOR))
  writeLintFilelist(dir, `${component.name}_lint_top`,
    [posix.relative(dir, svFilePath), ...interfaces, `${component.name}.sv`, `${component.name}_lint_top.sv`], GENERATOR)
  console.log(`wrote ${dir}/${[...interfaces, `${component.name}.sv`, `${component.name}_lint_top.sv`].join(', ')}`)
  // Each of them is tied to 0
  const sv = readFileSync(`${dir}/${component.name}.sv`, 'utf8')
  for (const port of tied) {
    if (!sv.includes(`.${port}(const_w1u0)`)) throw Error(`${component.name}: ${port} isn't tied to 0`)
  }
}

// The AXI sample with its XML edited by `edit` must fail to build, with an error mentioning
// `expected`
function expectThrow (what: string, edit: (xml: string) => string, expected: string): void {
  const axi = samples[0]
  const tmp = mkdtempSync(join(tmpdir(), 'ipxact-'))
  let message = ''
  try {
    const xml = readFileSync(expandPath(axi.xmlDataPath), 'utf8')
    const edited = edit(xml)
    if (edited === xml) throw Error(`${what}: the edit didn't change the AXI sample's XML`)
    const xmlDataPath = join(tmp, 'axiSample.xml')
    writeFileSync(xmlDataPath, edited)
    void new IpXactComponent({ name: axi.name, svFilePath: axi.svFilePath, xmlDataPath })
  } catch (err) {
    message = (err as Error).message
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
  if (!message.includes(expected)) throw Error(`${what}: expected a throw mentioning "${expected}", got "${message}"`)
  console.log(`PASS: ${what} throws`)
}

// A port whose width in the XML's <model><ports> differs from its bus signal's: Init0_Ar_Len
// widened to 8 bits in the model, which comes after the bus interfaces
expectThrow('a port wider than its bus signal', xml => {
  const model = xml.indexOf('<spirit:model>')
  return xml.slice(0, model) + xml.slice(model).replace(
    /(<spirit:name>Init0_Ar_Len<\/spirit:name>(?:(?!<\/spirit:port>)[\s\S])*<spirit:left>)3(<\/spirit:left>)/,
    (_, head: string, tail: string) => `${head}7${tail}`)
}, 'maps port Init0_Ar_Len (8 bits) to Init0.ARLEN (4 bits)')

// A bus type that isn't in IpXactComponent.knownInterfaces: the first interface's
expectThrow('an unknown bus type', xml => xml.replace('spirit:name="AXI_"', 'spirit:name="NOPE_"'),
  "of bus type tssv/lib/interfaces/AMBA/AMBA3/NOPE/r2p0_0/NOPE, which isn't in IpXactComponent.knownInterfaces")

// A relative path isn't resolved against the cwd, so either path given relative throws, naming it
for (const what of ['svFilePath', 'xmlDataPath'] as const) {
  const axi = samples[0]
  const relative = `ts/test/modules/IpxactComponent/AXI/${what === 'svFilePath' ? 'architectureSample.sv' : 'axiSample.xml'}`
  let message = ''
  try {
    void new IpXactComponent({ name: axi.name, svFilePath: axi.svFilePath, xmlDataPath: axi.xmlDataPath, [what]: relative })
  } catch (err) {
    message = (err as Error).message
  }
  if (!message.includes(`${what} '${relative}' is a relative path`)) throw Error(`a relative ${what}: expected a throw naming it, got "${message}"`)
  console.log(`PASS: a relative ${what} throws`)
}
