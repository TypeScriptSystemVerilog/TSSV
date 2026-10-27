// Regression test for APB_to_Memory against the Memory contract (TSSV#116). Writes, under
// sv-examples/APB_to_Memory/, one definition per file:
// - apb_regblock.sv: a RegisterBlock with an `apb` port, so its APB_to_Memory submodule drives
//   the block's Memory bus. It has a field register, a plain RW, an RWU, a WO and a RAM window.
//   The bridge, APB_to_Memory_32_32, and each interface the two have get files of their own
//   (Module.writeSystemVerilogFiles())
// - apb_regblock_lint_top.sv: a wrapper that brings the block's APB and RAM ports out to flat
//   ports and includes apb_regblock.sv, so the block can be linted with
//   `verilator --lint-only -Wall +define+USE_INCLUDES`
// - memory_slave_bidi_32_32.sv: the slave model for the RAM window
// - tb_APB_to_Memory.f: a filelist that ties the hand-written testbench outside sv-examples/,
//   verilatorTB/tb_APB_to_Memory.sv, to apb_regblock.sv and the slave model. `npm run lint:sv`
//   lints the slave model through it, since the model has an interface port and can't be linted
//   alone
//
// `make -C verilatorTB apb_to_memory_sim` runs this, lints the block through its wrapper and
// simulates verilatorTB/tb_APB_to_Memory.sv against it from the filelist, with USE_INCLUDES.
import { RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import { mkdirSync, writeFileSync } from 'fs'
import { writeLintFilelist } from 'tssv/test/models/lintFilelist'
import { guardSV } from 'tssv/test/models/guardSV'
import { writeLintWrapped } from 'tssv/test/models/lintWrapper'
import { memorySlaveModel, memorySlaveName, type MemoryModelOptions } from 'tssv/test/models/MemoryModels'

const OUT_DIR = 'sv-examples/APB_to_Memory'
const GENERATOR = 'ts/test/test_APB_to_Memory.ts'

const block = new RegisterBlock({ name: 'apb_regblock', busAddressWidth: 32 }, {
  wordSize: 32,
  addrMap: {
    CTRL: 0x0n, // fields at [0], [2:1] and [15:8]
    SCRATCH: 0x4n,
    STAT: 0x8n, // 16-bit RWU
    CMD: 0xcn, // WO: reads 0
    MEM: 0x20n // RAM, 4 words: 0x20-0x2f, served by a slave model in the testbench
  },
  registers: {
    CTRL: {
      type: RegisterType.RW,
      fields: {
        enable: { bitRange: [0, 0] },
        mode: { bitRange: [2, 1] },
        divisor: { bitRange: [15, 8], reset: 0x10n }
      }
    },
    SCRATCH: { type: RegisterType.RW, reset: 0x5a5a5a5an },
    STAT: { type: RegisterType.RWU, width: 16 },
    CMD: { type: RegisterType.WO },
    MEM: { type: RegisterType.RAM, size: 4n }
  }
}, new APB4({ DATA_WIDTH: 32, ADDR_WIDTH: 32 }))

mkdirSync(OUT_DIR, { recursive: true })
const design = writeLintWrapped(block, OUT_DIR, GENERATOR)
// A slave model for the RAM window (TSSV#80), in a file named after it
const ram: MemoryModelOptions = { type: 'bidi', dataWidth: 32 }
const model = memorySlaveName(ram)
writeFileSync(`${OUT_DIR}/${model}.sv`, guardSV(model, [], memorySlaveModel(ram)))
console.log(`wrote ${[...design, `${OUT_DIR}/${block.name}_lint_top.sv`, `${OUT_DIR}/${model}.sv`].join(', ')}`)
// apb_regblock.sv includes the rest of the block under USE_INCLUDES
writeLintFilelist(OUT_DIR, 'tb_APB_to_Memory', [
  '../../verilatorTB/tb_APB_to_Memory.sv', `${block.name}.sv`, `${model}.sv`
], GENERATOR)
