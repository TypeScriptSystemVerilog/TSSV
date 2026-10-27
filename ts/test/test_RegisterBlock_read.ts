// Regression test for RegisterBlock's read path (TSSV#79), with self-checking testbenches generated
// from the same definitions (TSSV#130). Writes, under sv-examples/RegisterBlock_read/:
// - regblock_read32.sv: a 32-bit block with a WO register first, a field map with gaps, a
//   register with no `registers` entry (default RW), a narrow RW, an RWU, a RAM and a ROM whose
//   windows are smaller than their alignment, and registers at 0x100 and above
// - regblock_read64.sv: a 64-bit block whose RAM window is sized in 8-byte words
// - memory_<type>_<data width>_32.sv: each Memory interface the blocks have as a port
// - <block>_lint_top.sv for each: a wrapper that drives the block's bus from ports, so the
//   block can be linted with `verilator --lint-only -Wall`. A module with an interface port
//   can't be the top on its own: nothing would drive the interface
// - tb_<block>.sv for each: a testbench generated from the block's definition
//   (ts/test/models/RegisterBlockTestbench.ts), with the Memory master BFM and slave models it
//   uses, one per file
// - a lint filelist (.f) for each lint top and each testbench; the testbench's is also what
//   `make -C verilatorTB regblock_read_sim` builds it from
//
// Each testbench sweeps reads over every word address below its SWEEP_LIMIT and every probe
// address of the decode (RegisterBlockTestbench.probes(): each register address with one bit
// flipped, so an address that matches a register only in its low bits, and the byte-granular
// edges of each window). It sweeps after reset, then after a write to every register, every RAM
// word and every probe address and an RWU hardware update. Every read checks DATA_RD, the wait
// states (0 for a register, 2 for a window: the default registerRequest and registerResponse,
// TSSV#80), and that DATA_RD and READY hold a cycle later; each window's <R>_rd_hit is checked on
// every read. Then a read of each readable register holds through idle cycles while ADDR moves,
// and each field register takes all-ones and alternating patterns, each field at its own bits.
// Every expected value comes from the definition.
//
// `make -C verilatorTB regblock_read_sim` runs this, lints both blocks and runs both testbenches.
import { RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { mkdirSync } from 'fs'
import { writeLintWrapped } from 'tssv/test/models/lintWrapper'
import { type Def, hasFields, pattern, RegisterBlockTestbench } from 'tssv/test/models/RegisterBlockTestbench'

const OUT_DIR = 'sv-examples/RegisterBlock_read'
const GENERATOR = 'ts/test/test_RegisterBlock_read.ts'

const def32 = {
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
} satisfies Def

const def64 = {
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
} satisfies Def

/** The read-path steps, for any block: sweeps of reads, from the definition */
function readPath (tb: RegisterBlockTestbench, def: Def, sweepLimit: bigint): void {
  const W = def.wordSize
  const B = BigInt(W / 8)
  const names = Object.keys(def.addrMap)
  const typeOf = (r: string): RegisterType => tb.reg(r).type
  const probes = tb.probes()
  const sweep = (what: string): void => {
    tb.comment(`Sweep ${what}: every word address below 0x${sweepLimit.toString(16)}, then every probe address`)
    for (let a = 0n; a < sweepLimit; a += B) tb.read(a, `sweep ${what}`)
    for (const p of probes) tb.read(p, `sweep ${what}`)
  }

  tb.comment('ROM contents')
  for (const r of names.filter(r => typeOf(r) === RegisterType.ROM)) {
    tb.preload(r, Array.from({ length: Number(tb.reg(r).size ?? 1n) }, (_, i) => pattern(`${r}.${i}`, W)))
  }
  sweep('after reset')

  tb.comment('A write to every register and every RAM word, then to every probe address, and an RWU hardware update')
  for (const r of names) {
    const a = def.addrMap[r]
    if (typeOf(r) === RegisterType.RAM) {
      for (let i = 0n; i < (tb.reg(r).size ?? 1n); i++) tb.write(a + i * B, pattern(`${r}.${i}`, W), `RAM ${r}`)
    } else if (typeOf(r) !== RegisterType.ROM) {
      tb.write(a, pattern(`${r}.write`, W), `${typeOf(r)} ${r}`)
    }
  }
  for (const p of probes) tb.write(p, pattern(`probe.${p}`, W), 'probe')
  for (const r of names.filter(r => typeOf(r) === RegisterType.RWU)) tb.hwUpdate(r, pattern(`${r}.hw`, W))
  tb.checkState('after the writes')
  sweep('after the writes')

  tb.comment('A read holds through idle cycles, whatever ADDR does, until the next request')
  const readable = names.filter(r => typeOf(r) !== RegisterType.WO)
  for (const r of readable) {
    tb.read(def.addrMap[r], `${r}, before idle cycles`)
    tb.idleHold(names.filter(n => n !== r).slice(0, 3).map(n => def.addrMap[n]))
  }

  tb.comment('Field patterns: each field takes its own bits of DATA_WR, and reads back at them')
  for (const r of names.filter(r => hasFields(tb.reg(r)) && typeOf(r) !== RegisterType.RO)) {
    const all = (1n << BigInt(W)) - 1n
    for (const data of [all, all / 3n, (all / 3n) << 1n]) { // all ones, 0x5555..., 0xaaaa...
      const what = `${typeOf(r)} ${r} after 0x${data.toString(16)}`
      tb.write(def.addrMap[r], data, what)
      tb.checkState(what, [r])
      if (typeOf(r) !== RegisterType.WO) tb.read(def.addrMap[r], what)
    }
  }
}

const blocks = [
  { block: new RegisterBlock({ name: 'regblock_read32', busAddressWidth: 32 }, def32, new Memory()), def: def32 as Def, sweepLimit: 0x200n },
  { block: new RegisterBlock({ name: 'regblock_read64', busAddressWidth: 32 }, def64, new Memory()), def: def64 as Def, sweepLimit: 0x40n }
]

mkdirSync(OUT_DIR, { recursive: true })
for (const { block, def, sweepLimit } of blocks) {
  const tb = new RegisterBlockTestbench(block, def, GENERATOR, 'TSSV#79, TSSV#130')
  readPath(tb, def, sweepLimit)
  writeLintWrapped(block, OUT_DIR, GENERATOR)
  tb.emit(OUT_DIR)
  console.log(`wrote ${OUT_DIR}/${block.name}.sv, ${block.name}_lint_top.sv and ${tb.name}.sv`)
}
