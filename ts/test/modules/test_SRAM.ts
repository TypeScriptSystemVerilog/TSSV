import { SRAM } from 'tssv/lib/modules/SRAM'
import { writeFileSync, mkdirSync } from 'fs'

const testMem_1rw = new SRAM({ dataWidth: 8n, depth: 32n, ports: '1rw', writeEnableMask: 'bit', readBehavior: 'undefOnWrite' })
try {
  mkdirSync(`sv-examples/SRAM/${testMem_1rw.name}`, { recursive: true })
  writeFileSync(`sv-examples/SRAM/${testMem_1rw.name}/${testMem_1rw.name}.sv`, testMem_1rw.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

const testMem_2rw = new SRAM({ dataWidth: 8n, depth: 32n, ports: '2rw', writeEnableMask: 'bit', readBehavior: 'undefOnWrite' })
try {
  mkdirSync(`sv-examples/SRAM/${testMem_2rw.name}`, { recursive: true })
  writeFileSync(`sv-examples/SRAM/${testMem_2rw.name}/${testMem_2rw.name}.sv`, testMem_2rw.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

const testMem_1r_1w = new SRAM({ dataWidth: 32n, depth: 256n, ports: '1r_1w', writeEnableMask: 'byte', readBehavior: 'readBeforeWrite' })
try {
  mkdirSync(`sv-examples/SRAM/${testMem_1r_1w.name}`, { recursive: true })
  writeFileSync(`sv-examples/SRAM/${testMem_1r_1w.name}/${testMem_1r_1w.name}.sv`, testMem_1r_1w.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

// wider than the old 256-bit dataWidth limit, in both single- and dual-port forms
for (const ports of ['1rw', '1r_1w'] as const) {
  const wideMem = new SRAM({ dataWidth: 1026n, depth: 4n, ports })
  try {
    mkdirSync(`sv-examples/SRAM/${wideMem.name}`, { recursive: true })
    writeFileSync(`sv-examples/SRAM/${wideMem.name}/${wideMem.name}.sv`, wideMem.writeSystemVerilog())
  } catch (err) {
    console.error(err)
  }
}
