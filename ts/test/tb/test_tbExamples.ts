// Example testbenches built on tier 1 alone (doc/framework/testbench.md): each is a SimTop over a
// harness, written to sv-examples/tb/<testbench>/. verilatorTB/Makefile's tb_examples_sim checks
// each harness with scripts/check-harness.mjs, then builds and runs each testbench.
//
//   - tb_SFIFOWave_dual_port replays the SFIFO spec's dual-port timing diagram against the RTL.
//   - tb_Lfsr checks Lfsr against a model of the xorshift sequence.
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { SimTop } from 'tssv/lib/tb/SimTop'
import { SFIFOWaveHarness } from './SFIFOWaveHarness.js'
import { LfsrHarness } from './LfsrHarness.js'

const OUT = `${TSSV_ROOT}/sv-examples/tb`

const testbenches = [
  new SimTop({
    name: 'tb_SFIFOWave_dual_port',
    harness: new SFIFOWaveHarness({
      name: 'SFIFOWave_dual_port',
      svg: 'SFIFO-timing-dual-port.svg',
      // As the diagram is drawn: depth 4, and 8 bits for its letter labels
      config: { dataWidth: 8n, depth: 4n }
    }),
    maxCycles: 100
  }),
  new SimTop({ name: 'tb_Lfsr', harness: new LfsrHarness({ name: 'LfsrHarness' }), maxCycles: 100 })
]

for (const tb of testbenches) {
  const files = tb.writeSystemVerilogFiles(`${OUT}/${tb.name}`)
  console.log(`${tb.name}: wrote ${files.length} files to sv-examples/tb/${tb.name}/`)
}
