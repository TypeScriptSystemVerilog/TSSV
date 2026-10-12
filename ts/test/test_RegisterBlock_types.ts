// Self-checking test of RegisterBlock's register types (TSSV#80). For each RegisterBlockDef
// below, this writes, under sv-examples/RegisterBlock_types/:
// - <block>.sv: the block
// - <block>_lint_top.sv: a lint wrapper (ts/test/models/lintWrapper.ts)
// - tb_<block>.sv: a testbench generated from the same definition. Every address, window size,
//   width, field range, reset value and expected wait-state count it checks comes from there
// - memory_models.sv: the Memory master BFM and slave models the testbenches use
//   (ts/test/models/MemoryModels.ts)
//
// The testbench drives `regs` with the master BFM and serves each RAM/ROM window with a slave
// model. It checks, for each type:
// - RO: a read returns the input (or the field inputs at their bit ranges); a constant RO returns
//   its reset, or its fields' resets
// - WO: a write updates the output (or field outputs) and pulses <R>_we for exactly the first
//   cycle it shows the new value, only on a write to its own address; a read returns 0
// - RAM: writes land in the slave model's word at the window offset, and reads return it, with
//   the slave at 0 and 2 wait states; `regs` sees one wait state per registerRequest and
//   registerResponse flop that is on, plus the slave's
// - ROM: reads return the slave model's preloaded words; a write completes at once and never
//   reaches the ROM
// Register accesses have no wait states. Any contract violation a slave model sees fails the test.
//
// `make -C verilatorTB regblock_types_sim` runs this, lints each block with -Wall and runs each
// testbench.
import { RegisterBlock, RegisterType, type RegisterBlockDef } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { type Interface } from 'tssv/lib/core/TSSV'
import { mkdirSync, writeFileSync } from 'fs'
import { lintWrapper } from 'tssv/test/models/lintWrapper'
import { memoryMasterBfm, memoryMasterName, memorySlaveModel, memorySlaveName, type MemoryModelOptions } from 'tssv/test/models/MemoryModels'

const OUT_DIR = 'sv-examples/RegisterBlock_types'
const GENERATOR = 'ts/test/test_RegisterBlock_types.ts'

/** Slave wait states each window is tested with */
const SLAVE_WAITS = [0, 2]

const def32 = {
  wordSize: 32,
  addrMap: {
    STATUS: 0x0n, // RO from an input; its reset is for RALF only
    FLAGS: 0x4n, // RO with field inputs, and gaps
    ID: 0x8n, // constant RO
    VERSION: 0xcn, // constant RO with fields
    CMD: 0x10n, // WO, 12 bits
    GO: 0x14n, // WO with fields
    SCRATCH: 0x18n, // RW, to check registers stay zero-wait around the windows
    RAM_REQ_RSP: 0x100n, // RAM, both flops (the default)
    RAM_REQ: 0x140n, // RAM, registered request only
    RAM_RSP: 0x180n, // RAM, registered response only
    RAM_NONE: 0x1c0n, // RAM, pass-through both ways
    ROM_REQ_RSP: 0x200n, // ROM, both flops
    ROM_NONE: 0x240n // ROM, pass-through both ways
  },
  registers: {
    STATUS: { type: RegisterType.RO, reset: 5n },
    FLAGS: {
      type: RegisterType.RO,
      fields: { busy: { bitRange: [0, 0] }, level: { bitRange: [7, 4] }, count: { bitRange: [27, 16] } }
    },
    ID: { type: RegisterType.RO, constant: true, reset: 0x7e5f0080n },
    VERSION: {
      type: RegisterType.RO,
      constant: true,
      fields: { major: { bitRange: [31, 24], reset: 2n }, minor: { bitRange: [15, 8], reset: 0x11n }, patch: { bitRange: [3, 0] } }
    },
    CMD: { type: RegisterType.WO, width: 12, reset: 0xabcn },
    GO: { type: RegisterType.WO, fields: { start: { bitRange: [0, 0] }, op: { bitRange: [11, 8], reset: 3n } } },
    SCRATCH: { type: RegisterType.RW },
    RAM_REQ_RSP: { type: RegisterType.RAM, size: 4n },
    RAM_REQ: { type: RegisterType.RAM, size: 4n, registerResponse: false },
    RAM_RSP: { type: RegisterType.RAM, size: 4n, registerRequest: false },
    RAM_NONE: { type: RegisterType.RAM, size: 4n, registerRequest: false, registerResponse: false },
    ROM_REQ_RSP: { type: RegisterType.ROM, size: 4n },
    ROM_NONE: { type: RegisterType.ROM, size: 4n, registerRequest: false, registerResponse: false }
  }
} satisfies RegisterBlockDef<Record<string, bigint>>

const def64 = {
  wordSize: 64,
  addrMap: {
    STATUS: 0x0n,
    ID: 0x8n,
    CMD: 0x10n,
    BUF: 0x40n, // RAM, 2 words of 8 bytes
    TBL: 0x80n // ROM, 2 words of 8 bytes
  },
  registers: {
    STATUS: { type: RegisterType.RO },
    ID: { type: RegisterType.RO, constant: true, reset: 0x0123456789abcdefn },
    CMD: { type: RegisterType.WO },
    BUF: { type: RegisterType.RAM, size: 2n },
    TBL: { type: RegisterType.ROM, size: 2n, registerResponse: false }
  }
} satisfies RegisterBlockDef<Record<string, bigint>>

type Def = RegisterBlockDef<Record<string, bigint>>
type Reg = NonNullable<Def['registers'][string]>

/** A deterministic test value of `width` bits, different for each `seed` */
function pattern (seed: string, width: number): bigint {
  let h = 0xcbf29ce484222325n
  for (const c of seed) h = ((h ^ BigInt(c.charCodeAt(0))) * 0x100000001b3n) & ((1n << 64n) - 1n)
  return h & ((1n << BigInt(width)) - 1n)
}

function lit (value: bigint, width: number): string {
  return `${width}'h${value.toString(16)}`
}

function hasFields (reg: Reg): boolean {
  return reg.fields !== undefined && Object.keys(reg.fields).length > 0
}

/** The word a write of `data` leaves in `reg`'s outputs, or a read returns, at its fields' bit ranges */
function placeFields (reg: Reg, value: (name: string, index: number, width: number) => bigint): bigint {
  let word = 0n
  Object.entries(reg.fields ?? {}).forEach(([name, f], index) => {
    const [hi, lo] = f.bitRange
    word |= value(name, index, hi - lo + 1) << BigInt(lo)
  })
  return word
}

function fieldBits (data: bigint, hi: number, lo: number): bigint {
  return (data >> BigInt(lo)) & ((1n << BigInt(hi - lo + 1)) - 1n)
}

/** The testbench for `block`, generated from `def` */
function testbench (block: RegisterBlock<Record<string, bigint>>, def: Def): string {
  const name = block.name
  const W = def.wordSize
  const B = W / 8
  const { IOs, interfaces } = block as unknown as { IOs: Record<string, { direction: string, width?: number }>, interfaces: Record<string, Interface> }
  const regOf = (r: string): Reg => def.registers[r] ?? { type: RegisterType.RW }
  const regNames = Object.keys(def.addrMap)
  const addr = (a: bigint): string => lit(a, 32)

  const decls: string[] = []
  const binds: string[] = ['.clk', '.rst_b']
  const inits: string[] = []
  const steps: string[] = []
  const finals: string[] = []
  const monitors: string[] = []

  for (const [port, io] of Object.entries(IOs)) {
    if (port === 'clk' || port === 'rst_b') continue
    const width = io.width ?? 1
    decls.push(`  logic ${width > 1 ? `[${width - 1}:0] ` : ''}${port};`)
    binds.push(`.${port}`)
    if (io.direction === 'input') inits.push(`    ${port} = '0;`)
  }
  for (const [port, intf] of Object.entries(interfaces)) {
    if (intf.role === undefined) continue
    const opts: MemoryModelOptions = { type: (intf.params as { type: MemoryModelOptions['type'] }).type, dataWidth: W as 32 | 64 }
    decls.push(`  ${intf.interfaceName()} ${port}_bus ();`)
    binds.push(`.${port} (${port}_bus)`)
    if (port === 'regs') {
      decls.push(`  ${memoryMasterName(opts)} m (.clk, .bus (regs_bus));`)
    } else {
      decls.push(`  ${memorySlaveName(opts)} #(.DEPTH(${regOf(port).size ?? 1n})) ${port}_mem (.clk, .rst_b, .bus (${port}_bus));`)
      finals.push(`    errors += ${port}_mem.errors;`)
    }
  }

  // A read of `a`, checked for its data, its wait states, and that DATA_RD holds a cycle later
  const read = (what: string, a: bigint, exp: string, waits: number): void => {
    steps.push(`    m.read(${addr(a)}, rdata);
    check("${what} @0x${a.toString(16)} DATA_RD", 64'(rdata), 64'(${exp}));
    check("${what} @0x${a.toString(16)} wait states", 64'(m.waits), 64'd${waits});
    @(negedge clk); #1;
    check("${what} @0x${a.toString(16)} DATA_RD held", 64'(regs_bus.DATA_RD), 64'(${exp}));`)
  }
  const write = (what: string, a: bigint, data: bigint, waits: number): void => {
    steps.push(`    m.write(${addr(a)}, ${lit(data, W)});
    check("${what} @0x${a.toString(16)} wait states", 64'(m.waits), 64'd${waits});`)
  }
  const check = (what: string, got: string, exp: string): void => {
    steps.push(`    check("${what}", 64'(${got}), 64'(${exp}));`)
  }

  // ---- RO ----
  for (const r of regNames) {
    const reg = regOf(r)
    if (reg.type !== RegisterType.RO) continue
    const a = def.addrMap[r]
    if (reg.constant === true) {
      const value = hasFields(reg)
        ? placeFields(reg, (f) => reg.fields?.[f].reset ?? 0n)
        : (reg.reset ?? 0n)
      read(`constant RO ${r}`, a, lit(value, W), 0)
      continue
    }
    for (const round of ['a', 'b']) {
      if (hasFields(reg)) {
        const value = placeFields(reg, (f, i, width) => {
          const v = pattern(`${r}.${f}.${round}`, width)
          steps.push(`    ${r}_field${i} = ${lit(v, width)};`)
          return v
        })
        read(`RO ${r} from its field inputs`, a, lit(value, W), 0)
      } else {
        const width = reg.width ?? W
        const v = pattern(`${r}.${round}`, width)
        steps.push(`    ${r} = ${lit(v, width)};`)
        read(`RO ${r} from its input`, a, lit(v, W), 0)
      }
    }
  }

  // ---- WO ----
  const woNames = regNames.filter(r => regOf(r).type === RegisterType.WO)
  for (const r of woNames) {
    const reg = regOf(r)
    monitors.push(`  int ${r}_we_count = 0;
  always @(posedge clk) if (${r}_we) ${r}_we_count++;`)
    // After reset
    if (hasFields(reg)) {
      Object.entries(reg.fields ?? {}).forEach(([f, field], i) => { check(`WO ${r}.${f} reset`, `${r}_field${i}`, lit(field.reset ?? 0n, W)) })
    } else {
      check(`WO ${r} reset`, r, lit(reg.reset ?? 0n, W))
    }
    check(`WO ${r}_we low after reset`, `${r}_we`, "1'b0")
  }
  for (const r of woNames) {
    const reg = regOf(r)
    const a = def.addrMap[r]
    for (const round of ['a', 'b']) {
      const data = pattern(`${r}.write.${round}`, W)
      write(`WO ${r}`, a, data, 0)
      // m.write returns in the cycle after the capture edge: the first cycle with the new value
      if (hasFields(reg)) {
        Object.entries(reg.fields ?? {}).forEach(([f, field], i) => {
          const [hi, lo] = field.bitRange
          check(`WO ${r}.${f} after its write`, `${r}_field${i}`, lit(fieldBits(data, hi, lo), W))
        })
      } else {
        const width = reg.width ?? W
        check(`WO ${r} after its write`, r, lit(data & ((1n << BigInt(width)) - 1n), W))
      }
      check(`WO ${r}_we in the first cycle with the new value`, `${r}_we`, "1'b1")
      steps.push('    @(negedge clk); #1;')
      check(`WO ${r}_we for one cycle only`, `${r}_we`, "1'b0")
    }
    read(`WO ${r} reads`, a, lit(0n, W), 0)
  }

  // ---- RW, between the windows ----
  const rwName = regNames.find(r => regOf(r).type === RegisterType.RW)
  const rwCheck = (round: string): void => {
    if (rwName === undefined) return
    const data = pattern(`${rwName}.${round}`, W)
    write(`RW ${rwName}`, def.addrMap[rwName], data, 0)
    read(`RW ${rwName}`, def.addrMap[rwName], lit(data, W), 0)
  }

  // ---- RAM and ROM windows ----
  for (const r of regNames) {
    const reg = regOf(r)
    if (reg.type !== RegisterType.RAM && reg.type !== RegisterType.ROM) continue
    const base = def.addrMap[r]
    const size = Number(reg.size ?? 1n)
    const flops = Number(reg.registerRequest ?? true) + Number(reg.registerResponse ?? true)
    for (const slaveWaits of SLAVE_WAITS) {
      const waits = flops + slaveWaits
      const tag = `${reg.type} ${r} (slave ${slaveWaits} waits)`
      steps.push(`    ${r}_mem.wait_states = ${slaveWaits};`)
      const words: bigint[] = []
      for (let i = 0; i < size; i++) words.push(pattern(`${r}.${slaveWaits}.${i}`, W))
      if (reg.type === RegisterType.RAM) {
        words.forEach((data, i) => {
          write(tag, base + BigInt(i * B), data, waits)
          check(`${tag} write @0x${(base + BigInt(i * B)).toString(16)} lands in word ${i}`, `${r}_mem.mem[${i}]`, lit(data, W))
        })
      } else {
        words.forEach((data, i) => steps.push(`    ${r}_mem.mem[${i}] = ${lit(data, W)};`))
      }
      // Reads at a different byte inside each word: the slave indexes by word
      words.forEach((data, i) => { read(tag, base + BigInt(i * B + (i % B)), lit(data, W), waits) })
      rwCheck(`${r}.${slaveWaits}`)
    }
    if (reg.type === RegisterType.ROM) {
      const junk = pattern(`${r}.junk`, W)
      steps.push(`    rom_reads = ${r}_mem.reads;`)
      write(`ROM ${r} write, dropped`, base, junk, 0)
      // Long enough for the slave to finish an access it might have been sent
      steps.push(`    repeat (${Math.max(...SLAVE_WAITS) + 2}) @(negedge clk);\n    #1;`)
      check(`ROM ${r} write never reaches the ROM`, `${r}_mem.reads`, 'rom_reads')
      check(`ROM ${r} word 0 after a write`, `${r}_mem.mem[0]`, lit(pattern(`${r}.${SLAVE_WAITS[SLAVE_WAITS.length - 1]}.0`, W), W))
    }
  }

  for (const r of woNames) {
    finals.push(`    check("WO ${r}_we pulses, one per write to its address", 64'(${r}_we_count), 64'd2);`)
  }

  return `// tb_${name}: self-checking testbench for ${name}, generated by ${GENERATOR} (TSSV#80)
\`timescale 1ns / 1ps

module tb_${name};
  logic clk = 1'b0;
  logic rst_b = 1'b0;
  always #5 clk = ~clk;

  int errors = 0;
  int checks = 0;
  logic [${W - 1}:0] rdata;
  int rom_reads;

${decls.join('\n')}

  ${name} dut (
    ${binds.join(',\n    ')}
  );

  task automatic check (input string what, input logic [63:0] got, input logic [63:0] exp);
    checks++;
    if (got !== exp) begin
      errors++;
      $display("ERROR %0t: %s: got 0x%0h, expected 0x%0h", $time, what, got, exp);
    end
  endtask

${monitors.join('\n')}

  initial begin
${inits.join('\n')}
    repeat (2) @(negedge clk);
    rst_b = 1'b1;
    @(negedge clk); #1;

${steps.join('\n')}

    repeat (2) @(negedge clk);
${finals.join('\n')}
    if (errors == 0) begin
      $display("tb_${name}: PASS (%0d checks)", checks);
      $finish;
    end else begin
      $fatal(1, "tb_${name}: FAIL (%0d of %0d checks)", errors, checks);
    end
  end
endmodule
`
}

const blocks = [
  { block: new RegisterBlock({ name: 'regblock_types32', busAddressWidth: 32 }, def32, new Memory()), def: def32 as Def },
  { block: new RegisterBlock({ name: 'regblock_types64', busAddressWidth: 32 }, def64, new Memory()), def: def64 as Def }
]

mkdirSync(OUT_DIR, { recursive: true })
const models = new Map<string, string>()
for (const { block, def } of blocks) {
  writeFileSync(`${OUT_DIR}/${block.name}.sv`, block.writeSystemVerilog())
  writeFileSync(`${OUT_DIR}/${block.name}_lint_top.sv`, lintWrapper(block, GENERATOR))
  writeFileSync(`${OUT_DIR}/tb_${block.name}.sv`, testbench(block, def))
  const dataWidth = def.wordSize as 32 | 64
  models.set(memoryMasterName({ dataWidth }), memoryMasterBfm({ dataWidth }))
  for (const type of ['bidi', 'rd_only'] as const) models.set(memorySlaveName({ type, dataWidth }), memorySlaveModel({ type, dataWidth }))
  console.log(`wrote ${OUT_DIR}/${block.name}.sv, ${block.name}_lint_top.sv and tb_${block.name}.sv`)
}
writeFileSync(`${OUT_DIR}/memory_models.sv`, [...models.values()].join('\n'))
console.log(`wrote ${OUT_DIR}/memory_models.sv`)
