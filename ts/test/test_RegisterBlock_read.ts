// Regression test for RegisterBlock's read path (TSSV#79). Writes, under sv-examples/RegisterBlock_read/:
// - regblock_read32.sv: a 32-bit block with a WO register first, a field map with gaps, a
//   register with no `registers` entry (default RW), a narrow RW, an RWU, a RAM and a ROM whose
//   windows are smaller than their alignment, and registers at 0x100 and above
// - regblock_read64.sv: a 64-bit block whose RAM window is sized in 8-byte words
// - <block>_lint_top.sv for each: a wrapper that drives the block's bus from ports, so the
//   block can be linted with `verilator --lint-only -Wall`. A module with an interface port
//   can't be the top on its own: nothing would drive the interface
//
// `make -C verilatorTB regblock_read_sim` runs this, lints both blocks and simulates
// verilatorTB/tb_RegisterBlock_read.sv against them.
import { RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { mkdirSync, writeFileSync } from 'fs'
import { lintWrapper } from 'tssv/test/models/lintWrapper'
import { memorySlaveModel } from 'tssv/test/models/MemoryModels'

const OUT_DIR = 'sv-examples/RegisterBlock_read'

const block32 = new RegisterBlock({ name: 'regblock_read32', busAddressWidth: 32 }, {
  wordSize: 32,
  addrMap: {
    CMD: 0x0n, // WO, and first: its case used to emit `regs.READY <= ;`
    CTRL: 0x4n, // fields with gaps at [7:3] and [31:16]
    SCRATCH: 0x8n, // no `registers` entry: a default 32-bit RW
    NARROW: 0xcn, // 12-bit RW, zero-extended on read
    STAT: 0x10n, // 16-bit RWU
    MEM: 0x20n, // RAM, 4 words: 0x20-0x2f, though 0x20 is 32-byte aligned
    TBL: 0x40n, // ROM, 2 words: 0x40-0x47
    HI: 0x100n, // needs more than 8 address bits
    FAR: 0x12340n
  },
  registers: {
    CMD: { type: RegisterType.WO },
    CTRL: {
      type: RegisterType.RW,
      fields: {
        enable: { bitRange: [0, 0] },
        mode: { bitRange: [2, 1] },
        divisor: { bitRange: [15, 8], reset: 0x10n }
      }
    },
    NARROW: { type: RegisterType.RW, width: 12 },
    STAT: { type: RegisterType.RWU, width: 16 },
    MEM: { type: RegisterType.RAM, size: 4n },
    TBL: { type: RegisterType.ROM, size: 2n },
    HI: { type: RegisterType.RW, reset: 0xa5a5a5a5n },
    FAR: { type: RegisterType.RW }
  }
}, new Memory())

const block64 = new RegisterBlock({ name: 'regblock_read64', busAddressWidth: 32 }, {
  wordSize: 64,
  addrMap: {
    CSR: 0x0n,
    BUF: 0x10n, // RAM, 2 words of 8 bytes: 0x10-0x1f
    HI: 0x100n
  },
  registers: {
    CSR: { type: RegisterType.RW },
    BUF: { type: RegisterType.RAM, size: 2n },
    HI: { type: RegisterType.RW }
  }
}, new Memory())

mkdirSync(OUT_DIR, { recursive: true })
for (const block of [block32, block64]) {
  writeFileSync(`${OUT_DIR}/${block.name}.sv`, block.writeSystemVerilog())
  writeFileSync(`${OUT_DIR}/${block.name}_lint_top.sv`, lintWrapper(block, 'ts/test/test_RegisterBlock_read.ts'))
  console.log(`wrote ${OUT_DIR}/${block.name}.sv and ${block.name}_lint_top.sv`)
}
// Slave models for the RAM and ROM windows (TSSV#80)
writeFileSync(`${OUT_DIR}/memory_models.sv`, [
  memorySlaveModel({ type: 'bidi', dataWidth: 32 }),
  memorySlaveModel({ type: 'rd_only', dataWidth: 32 }),
  memorySlaveModel({ type: 'bidi', dataWidth: 64 })
].join('\n'))
console.log(`wrote ${OUT_DIR}/memory_models.sv`)
