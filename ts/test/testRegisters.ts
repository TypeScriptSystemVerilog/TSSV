// The example RegisterBlock from doc/framework/registers.md, with one register of each kind it
// uses: RW (REG0), RO from an input (REG1), RW with fields (REG2), a RAM (MEM0) and a ROM (MEM1).
// This script checks that serialize() and deserialize() round-trip its definition, then writes,
// under sv-examples/Core/Registers/:
// - testRegBlock.sv, and memory_<type>_32_32.sv for each Memory interface it has as a port
// - testRegBlock_lint_top.sv: a lint wrapper (ts/test/models/lintWrapper.ts), and its filelist
// - tb_testRegBlock.sv: a self-checking testbench generated from the same definition
//   (ts/test/models/RegisterBlockTestbench.ts, TSSV#130), with the Memory master BFM and slave
//   models it uses, one per file, and tb_testRegBlock.f, which lints and builds it
//
// The testbench checks every output and every register after reset. Then REG1 reads its input,
// zero-extended. REG0 and REG2 take a write, then one write per byte lane, and read back what
// they hold. MEM0 takes a write to every word and returns it, and MEM1 returns its preloaded
// words, each with 0, 1 and 2 slave wait states. Writes to REG1 and MEM1 change nothing. Last,
// every probe address of the decode (unaligned, unmapped and out-of-window addresses, and the
// register addresses with one bit flipped) is written and read, and every output and slave word
// checked against the model.
//
// `make -C verilatorTB registers_sim` runs this, lints the block with -Wall and runs the testbench.
import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { serialize, deserialize, RegisterType } from 'tssv/lib/core/TSSV'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { mkdirSync } from 'fs'
import { inspect } from 'util'
import diff from 'deep-diff'
import { writeLintWrapped } from 'tssv/test/models/lintWrapper'
import { pattern, RegisterBlockTestbench } from 'tssv/test/models/RegisterBlockTestbench'

const OUT_DIR = 'sv-examples/Core/Registers'
const GENERATOR = 'ts/test/testRegisters.ts'

/** Slave wait states each window is tested with */
const SLAVE_WAITS = [0, 1, 2]

const myRegMap = {
  REG0: BigInt('0x00000000'),
  REG1: BigInt('0x00000004'),
  REG2: BigInt('0x00000008'),
  MEM0: BigInt('0x00000020'),
  MEM1: BigInt('0x00000040')
} as const

const myRegs: RegisterBlockDef<typeof myRegMap> = {
  wordSize: 32,
  addrMap: myRegMap,
  registers: {
    REG0: {
      type: RegisterType.RW,
      reset: 0n,
      description: 'Register 0'
    },
    REG1: {
      type: RegisterType.RO,
      reset: 1n,
      description: 'Register 1',
      width: 16,
      isSigned: true
    },
    REG2: {
      type: RegisterType.RW,
      description: 'Register 2',
      fields: {
        REG2_field0: {
          bitRange: [15, 0],
          reset: BigInt('0x10')
        },
        REG2_field1: {
          bitRange: [31, 16],
          reset: BigInt('0x20')
        }
      }
    },
    MEM0: {
      type: RegisterType.RAM,
      size: 8n
    },
    MEM1: {
      type: RegisterType.ROM,
      size: 8n
    }
  }
}

console.log(inspect(myRegs, { depth: null, colors: true }))
const serialized = serialize(myRegs)
console.log(serialized)

const revived = deserialize(serialized)
console.log(inspect(revived, { depth: null, colors: true }))

const differences = diff.diff(myRegs, revived)
if (!differences) {
  console.log('There are no differences.')
} else {
  console.log(differences)
}

const testRegBlock = new RegisterBlock<typeof myRegs.addrMap>(
  {
    name: 'testRegBlock',
    busAddressWidth: 32
  },
  myRegs,
  new Memory()
)

const tb = new RegisterBlockTestbench(testRegBlock, myRegs, GENERATOR, 'TSSV#130')
const W = myRegs.wordSize
const B = BigInt(W / 8)
const regNames = Object.keys(myRegMap) as Array<keyof typeof myRegMap>
const isWindow = (r: keyof typeof myRegMap): boolean => tb.reg(r).type === RegisterType.RAM || tb.reg(r).type === RegisterType.ROM

tb.comment('After reset: every output and slave word, and a read of every register')
tb.checkState('after reset')
for (const r of regNames) if (!isWindow(r)) tb.read(myRegMap[r], `${r} after reset`)

for (const r of regNames) {
  const reg = tb.reg(r)
  const a = myRegMap[r]
  const size = Number(reg.size ?? 1n)
  switch (reg.type) {
    case RegisterType.RO: {
      if (reg.constant === true) break // its read after reset checked it
      tb.comment(`RO ${r} reads its input, zero-extended, with its sign bit clear and set`)
      const width = reg.width ?? W
      for (const value of [pattern(`${r}.a`, width - 1), pattern(`${r}.b`, width) | (1n << BigInt(width - 1))]) {
        tb.setInput(r, value)
        tb.read(a, `RO ${r}`)
      }
      break
    }
    case RegisterType.RW:
    case RegisterType.WO:
    case RegisterType.RWU: {
      tb.comment(`${reg.type} ${r}: a write, then the inverse one byte lane at a time; only the strobed byte changes`)
      const data = pattern(`${r}.write`, W)
      tb.write(a, data, `${reg.type} ${r}`)
      tb.checkState(`${reg.type} ${r} after its write`, [r])
      tb.read(a, `${reg.type} ${r}`)
      for (let b = 0n; b < B; b++) {
        const what = `${reg.type} ${r} with WSTRB bit ${b}`
        tb.write(a, ~data, what, 1n << b)
        tb.checkState(what, [r])
        tb.read(a, what)
      }
      break
    }
    case RegisterType.RAM:
      tb.comment(`RAM ${r}: a write to every word, then a read of every word`)
      for (const waits of SLAVE_WAITS) {
        const what = `RAM ${r} (slave ${waits} waits)`
        tb.setSlaveWaits(r, waits)
        for (let i = 0; i < size; i++) tb.write(a + BigInt(i) * B, pattern(`${r}.${waits}.${i}`, W), what)
        for (let i = 0; i < size; i++) tb.read(a + BigInt(i) * B, what)
      }
      break
    case RegisterType.ROM:
      tb.comment(`ROM ${r}: a read of every preloaded word`)
      tb.preload(r, Array.from({ length: size }, (_, i) => pattern(`${r}.${i}`, W)))
      for (const waits of SLAVE_WAITS) {
        tb.setSlaveWaits(r, waits)
        for (let i = 0; i < size; i++) tb.read(a + BigInt(i) * B, `ROM ${r} (slave ${waits} waits)`)
      }
      break
  }
}

tb.comment('Writes to the RO and ROM registers change nothing, and a ROM never sees them')
for (const r of regNames) {
  const reg = tb.reg(r)
  if (reg.type !== RegisterType.RO && reg.type !== RegisterType.ROM) continue
  tb.write(myRegMap[r], pattern(`${r}.dropped`, W), `${reg.type} ${r} ignores a write`)
  tb.read(myRegMap[r], `${reg.type} ${r} after a write`)
}
tb.checkState('after the writes to RO and ROM')

tb.comment('Probes of the decode: a write to each, then every output and slave word, then a read of each')
const probes = tb.probes()
for (const p of probes) tb.write(p, pattern(`probe.${p}`, W), 'probe')
tb.checkState('after the probe writes')
for (const p of probes) tb.read(p, 'probe')

mkdirSync(OUT_DIR, { recursive: true })
tb.emit(OUT_DIR, writeLintWrapped(testRegBlock, OUT_DIR, GENERATOR))
console.log(`wrote ${OUT_DIR}/testRegBlock.sv, testRegBlock_lint_top.sv and ${tb.name}.sv`)
