// A self-checking testbench for a RegisterBlock, generated from the RegisterBlockDef the block was
// built from (TSSV#130). A test script calls the step methods (read(), write(), setInput(), ...)
// in the order the testbench runs them. Each step emits its SV and updates a reference model of
// the block that follows the rules in doc/framework/registers.md §2 and §3. Every expected value
// (read data, wait states, output ports, the slave models' words) comes from that model, so
// changing the register map in TS changes what the testbench checks.
//
// The testbench, tb_<block>:
// - drives `regs` with the Memory master BFM `m`, by the handshake (ts/test/models/MemoryModels.ts)
// - serves each RAM/ROM window <R> with a slave model, <R>_mem, that is `size` words deep and
//   indexes them by offset / (wordSize/8)
// - drives the block's inputs (RO inputs, RWU hardware updates), never its outputs
// - checks each window's read decode, <R>_rd_hit, on every read, and counts each WO's <R>_we pulses
// - prints PASS, or prints FAIL and stops with $fatal, which exits nonzero. Any contract violation
//   a slave model sees is a failure too
//
// Used by ts/test/testRegisters.ts and ts/test/test_RegisterBlock_read.ts.
import { RegisterType, type RegisterBlock, type RegisterBlockDef } from 'tssv/lib/core/Registers'
import { type Interface } from 'tssv/lib/core/TSSV'
import { writeFileSync } from 'fs'
import { writeLintFilelist } from './lintFilelist.js'
import { TESTBENCH_MARKER } from './testbench.js'
import { memoryMasterBfm, memoryMasterName, memorySlaveModel, memorySlaveName, type MemoryModelOptions } from './MemoryModels.js'

export type Def = RegisterBlockDef<Record<string, bigint>>
export type Reg = NonNullable<Def['registers'][string]>

/** A deterministic test value of `width` bits, different for each `seed` */
export function pattern (seed: string, width: number): bigint {
  let h = 0xcbf29ce484222325n
  for (const c of seed) h = ((h ^ BigInt(c.charCodeAt(0))) * 0x100000001b3n) & ((1n << 64n) - 1n)
  return h & ((1n << BigInt(width)) - 1n)
}

/** `value` as a `width`-bit SV hex literal */
export function lit (value: bigint, width: number): string {
  return `${width}'h${value.toString(16)}`
}

export function hasFields (reg: Reg): boolean {
  return reg.fields !== undefined && Object.keys(reg.fields).length > 0
}

/** The word that holds each field's `value` at its bit range, the others 0 */
export function placeFields (reg: Reg, value: (name: string, index: number, width: number) => bigint): bigint {
  let word = 0n
  Object.entries(reg.fields ?? {}).forEach(([name, f], index) => {
    const [hi, lo] = f.bitRange
    word |= value(name, index, hi - lo + 1) << BigInt(lo)
  })
  return word
}

/** Bits `[hi:lo]` of `data` */
export function fieldBits (data: bigint, hi: number, lo: number): bigint {
  return (data >> BigInt(lo)) & ones(hi - lo + 1)
}

function ones (width: number): bigint {
  return (1n << BigInt(width)) - 1n
}

function isWindow (reg: Reg): boolean {
  return reg.type === RegisterType.RAM || reg.type === RegisterType.ROM
}

function isWritable (reg: Reg): boolean {
  return reg.type === RegisterType.RW || reg.type === RegisterType.WO || reg.type === RegisterType.RWU
}

/** A block whose bus is `regs`, as the testbench drives it */
type Block = RegisterBlock<Record<string, bigint>>

export class RegisterBlockTestbench {
  readonly name: string
  private readonly W: number
  private readonly B: number
  private readonly AW: number
  private readonly names: string[]
  /** Each register's value as a read returns it: its outputs, or its inputs for an RO, with fields at their bit ranges */
  private readonly values = new Map<string, bigint>()
  /** Each RAM/ROM window's words, as its slave model holds them */
  private readonly words = new Map<string, bigint[]>()
  private readonly slaveWaits = new Map<string, number>()
  /** How many times each WO's <R>_we should have pulsed */
  private readonly wePulses = new Map<string, number>()
  private readonly steps: string[] = []
  /** What `regs.DATA_RD` holds: the data of the last request, if it was a read */
  private lastRead: bigint | undefined
  private romWrites = false

  /**
   * @param block the block, built from `def` with a `Memory` bus
   * @param generator the test script, named in the testbench's header
   * @param issues the issues the testbench tests, named in its header
   */
  constructor (private readonly block: Block, private readonly def: Def, private readonly generator: string, private readonly issues: string) {
    this.name = `tb_${block.name}`
    this.W = def.wordSize
    this.B = this.W / 8
    this.AW = block.params.busAddressWidth ?? 32
    this.names = Object.keys(def.addrMap)
    for (const r of this.names) {
      const reg = this.reg(r)
      if (reg.width !== undefined && reg.width > this.W) throw Error(`${r}: a register wider than the word isn't supported`)
      if (isWindow(reg)) {
        this.words.set(r, Array.from({ length: Number(reg.size ?? 1n) }, () => 0n))
        this.slaveWaits.set(r, 0)
      } else if (reg.type === RegisterType.RO && reg.constant !== true) {
        this.values.set(r, 0n) // the testbench's inputs start at 0
      } else {
        const reset = hasFields(reg) ? placeFields(reg, f => reg.fields?.[f].reset ?? 0n) : (reg.reset ?? 0n)
        this.values.set(r, reset & this.stored(reg))
        if (reg.type === RegisterType.WO) this.wePulses.set(r, 0)
      }
    }
  }

  /** The register's definition, or the default for an `addrMap` entry with none: a full-word RW */
  reg (r: string): Reg {
    return this.def.registers[r] ?? { type: RegisterType.RW }
  }

  /** The bits a register holds, at their place in the word */
  private stored (reg: Reg): bigint {
    return hasFields(reg) ? placeFields(reg, (_f, _i, width) => ones(width)) : ones(reg.width ?? this.W)
  }

  private value (r: string): bigint {
    const v = this.values.get(r)
    if (v === undefined) throw Error(`${r}: not a register with a value`)
    return v
  }

  private windowWords (r: string): bigint[] {
    const words = this.words.get(r)
    if (words === undefined) throw Error(`${r}: not a RAM or ROM window`)
    return words
  }

  /** Wait states `regs` sees on an access to the window: one per request and response flop, plus the slave's */
  private windowWaits (r: string): number {
    const reg = this.reg(r)
    return Number(reg.registerRequest ?? true) + Number(reg.registerResponse ?? true) + (this.slaveWaits.get(r) ?? 0)
  }

  /** The window `addr` falls in, and the word it indexes: the offset / (wordSize/8) */
  private windowAt (addr: bigint): { r: string, index: number } | undefined {
    for (const r of this.names) {
      const reg = this.reg(r)
      const base = this.def.addrMap[r]
      if (!isWindow(reg) || addr < base || addr >= base + (reg.size ?? 1n) * BigInt(this.B)) continue
      return { r, index: Number((addr - base) / BigInt(this.B)) }
    }
    return undefined
  }

  /** The registers `addr` decodes to: equal to their address, all bits of it (registers.md §2) */
  private registersAt (addr: bigint): string[] {
    return this.names.filter(r => !isWindow(this.reg(r)) && this.def.addrMap[r] === addr)
  }

  private addr (a: bigint): string {
    return lit(a, this.AW)
  }

  private check (what: string, got: string, exp: string): void {
    this.steps.push(`    check("${what}", 64'(${got}), 64'(${exp}));`)
  }

  /** A comment, on a line of its own after a blank one */
  comment (text: string): void {
    this.steps.push('', `    // ${text}`)
  }

  /**
   * A read of `addr`. It checks the data and wait states against the model, then that `DATA_RD`
   * and `READY` hold a cycle later. A window returns its slave's word. Otherwise the first
   * register in `addrMap` order at exactly `addr` returns its value, and a `WO`, or no register,
   * returns 0.
   */
  read (addr: bigint, what: string): void {
    let data = 0n
    let waits = 0
    const window = this.windowAt(addr)
    if (window !== undefined) {
      data = this.windowWords(window.r)[window.index] ?? 0n
      waits = this.windowWaits(window.r)
    } else {
      const r = this.registersAt(addr).find(r => this.reg(r).type !== RegisterType.WO)
      if (r !== undefined) data = this.value(r)
    }
    this.steps.push(`    read_check("${what}", ${this.addr(addr)}, ${lit(data, this.W)}, ${waits});`)
    this.lastRead = data
  }

  /**
   * A write of `data` to `addr` with `strb` (default: every byte), applied to the model. It checks
   * the wait states, then where the write lands. A `RAM` window's slave word changes in the
   * strobed bytes. A `ROM` window never sees it. An `RW`, `WO` or `RWU` at exactly `addr` changes
   * in the strobed bytes it holds, and a `WO`'s `<R>_we` pulses if any did.
   */
  write (addr: bigint, data: bigint, what: string, strb = ones(this.B)): void {
    let lanes = 0n
    for (let b = 0; b < this.B; b++) if (((strb >> BigInt(b)) & 1n) === 1n) lanes |= 0xffn << BigInt(8 * b)
    data &= ones(this.W)
    let waits = 0
    const before: string[] = []
    const after: string[] = []
    const window = this.windowAt(addr)
    if (window !== undefined && this.reg(window.r).type === RegisterType.RAM) {
      const words = this.windowWords(window.r)
      const word = ((words[window.index] ?? 0n) & ~lanes) | (data & lanes)
      words[window.index] = word
      waits = this.windowWaits(window.r)
      after.push(`    check("${what}: write @0x${addr.toString(16)} lands in ${window.r} word ${window.index}", 64'(${window.r}_mem.mem[${window.index}]), 64'(${lit(word, this.W)}));`)
    } else if (window !== undefined) {
      this.romWrites = true
      before.push(`    rom_reads = ${window.r}_mem.reads;`)
      // Long enough for the slave to finish a read the block might have sent it
      after.push(`    repeat (${this.windowWaits(window.r) + 1}) @(negedge clk);`, '    #1;',
        `    check("${what}: write @0x${addr.toString(16)} never reaches ROM ${window.r}", 64'(${window.r}_mem.reads), 64'(rom_reads));`)
    }
    for (const r of this.registersAt(addr)) {
      const reg = this.reg(r)
      if (!isWritable(reg)) continue
      const changed = lanes & this.stored(reg)
      this.values.set(r, (this.value(r) & ~changed) | (data & changed))
      if (reg.type !== RegisterType.WO) continue
      // write_check returns in the first cycle the register shows the new value: <R>_we's cycle
      after.push(`    check("${what}: write @0x${addr.toString(16)}: ${r}_we", 64'(${r}_we), 64'(${changed === 0n ? "1'b0" : "1'b1"}));`)
      if (changed !== 0n) this.wePulses.set(r, (this.wePulses.get(r) ?? 0) + 1)
    }
    this.steps.push(...before, `    write_check("${what}", ${this.addr(addr)}, ${lit(data, this.W)}, ${lit(strb, this.B)}, ${waits});`, ...after)
    this.lastRead = undefined
  }

  /** Sets a non-constant `RO`'s input, or its field inputs from their bit ranges of `value` */
  setInput (r: string, value: bigint): void {
    const reg = this.reg(r)
    if (reg.type !== RegisterType.RO || reg.constant === true) throw Error(`${r}: not an RO with an input`)
    if (hasFields(reg)) {
      Object.values(reg.fields ?? {}).forEach(({ bitRange: [hi, lo] }, i) => {
        this.steps.push(`    ${r}_field${i} = ${lit(fieldBits(value, hi, lo), hi - lo + 1)};`)
      })
    } else {
      const width = reg.width ?? this.W
      this.steps.push(`    ${r} = ${lit(value & ones(width), width)};`)
    }
    this.values.set(r, value & this.stored(reg))
  }

  /** An `RWU`'s hardware update to `value`, for one cycle, with no write in it */
  hwUpdate (r: string, value: bigint): void {
    const reg = this.reg(r)
    if (reg.type !== RegisterType.RWU) throw Error(`${r}: not an RWU`)
    const width = reg.width ?? this.W
    value &= ones(width)
    this.steps.push('    @(negedge clk);', `    ${r}_hw_update = 1'b1;`, `    ${r}_hw_update_val = ${lit(value, width)};`,
      '    @(negedge clk);', `    ${r}_hw_update = 1'b0;`, '    #1;')
    this.values.set(r, value)
  }

  /** Sets the words of a window's slave model, from word 0 */
  preload (r: string, words: bigint[]): void {
    const model = this.windowWords(r)
    words.forEach((word, i) => {
      if (i >= model.length) throw Error(`${r}: word ${i} is past its size, ${model.length}`)
      model[i] = word & ones(this.W)
      this.steps.push(`    ${r}_mem.mem[${i}] = ${lit(model[i] ?? 0n, this.W)};`)
    })
  }

  /** How many wait states a window's slave model inserts from now on */
  setSlaveWaits (r: string, waits: number): void {
    this.windowWords(r) // throws unless r is a window
    this.slaveWaits.set(r, waits)
    this.steps.push(`    ${r}_mem.wait_states = ${waits};`)
  }

  /**
   * Checks the outputs of every `RW`, `WO` and `RWU`, and every word of every window's slave
   * model, against the model. With `only`, checks just the registers and windows it names.
   */
  checkState (what: string, only?: string[]): void {
    for (const r of only ?? this.names) {
      const reg = this.reg(r)
      if (isWindow(reg)) {
        this.windowWords(r).forEach((word, i) => { this.check(`${what}: ${r} word ${i}`, `${r}_mem.mem[${i}]`, lit(word, this.W)) })
        continue
      }
      if (!isWritable(reg)) continue
      const value = this.value(r)
      if (hasFields(reg)) {
        Object.entries(reg.fields ?? {}).forEach(([f, { bitRange: [hi, lo] }], i) => {
          this.check(`${what}: ${r}.${f}`, `${r}_field${i}`, lit(fieldBits(value, hi, lo), this.W))
        })
      } else {
        this.check(`${what}: ${r}`, r, lit(value, this.W))
      }
    }
  }

  /**
   * After a read: moves `ADDR` to each of `addrs` in turn with no request, a cycle apart, and
   * checks that `DATA_RD` and `READY` hold
   */
  idleHold (addrs: bigint[]): void {
    const data = this.lastRead
    if (data === undefined) throw Error('idleHold() needs a read before it')
    for (const a of addrs) this.steps.push(`    idle_check(${this.addr(a)}, ${lit(data, this.W)});`)
  }

  /**
   * Addresses that probe the address decode, from the definition: each register's and window's
   * address with one bit flipped, for every bit of the bus address (the bits below the word make
   * unaligned addresses); each window's edges (the byte before it, its first two and last two
   * bytes, the byte after it and the word after that); and the top word of the address space.
   * A decode that ignores an address bit, or misplaces a window's edge, hits the wrong register at
   * one of them.
   */
  probes (): bigint[] {
    const top = ones(this.AW)
    const probes = new Set<bigint>()
    for (const r of this.names) {
      const base = this.def.addrMap[r]
      for (let bit = 0; bit < this.AW; bit++) probes.add(base ^ (1n << BigInt(bit)))
      const reg = this.reg(r)
      if (!isWindow(reg)) continue
      const end = base + (reg.size ?? 1n) * BigInt(this.B)
      for (const a of [base - 1n, base, base + 1n, end - 2n, end - 1n, end, end + BigInt(this.B)]) {
        if (a >= 0n && a <= top) probes.add(a)
      }
    }
    probes.add(top + 1n - BigInt(this.B))
    return [...probes]
  }

  /** The testbench's SV */
  render (): string {
    const W = this.W
    const B = this.B
    const AW = this.AW
    const { IOs, interfaces } = this.block as unknown as { IOs: Record<string, { direction: string, width?: number }>, interfaces: Record<string, Interface> }
    if (interfaces.regs?.role !== 'inward') throw Error(`${this.block.name}: the testbench needs a block with a Memory regs port`)

    const decls: string[] = []
    const binds: string[] = ['.clk', '.rst_b']
    const inits: string[] = []
    const monitors: string[] = []
    const finals: string[] = []
    for (const [port, io] of Object.entries(IOs)) {
      if (port === 'clk' || port === 'rst_b') continue
      const width = io.width ?? 1
      decls.push(`  logic ${width > 1 ? `[${width - 1}:0] ` : ''}${port};`)
      binds.push(`.${port}`)
      if (io.direction === 'input') inits.push(`    ${port} = '0;`)
    }
    for (const [port, intf] of this.ports(interfaces)) {
      decls.push(`  ${intf.interfaceName()} ${port}_bus ();`)
      binds.push(`.${port} (${port}_bus)`)
      if (port === 'regs') {
        decls.push(`  ${memoryMasterName(this.modelOptions(intf))} m (.clk, .bus (regs_bus));`)
        continue
      }
      const reg = this.reg(port)
      decls.push(`  ${memorySlaveName(this.modelOptions(intf))} #(.DEPTH(${reg.size ?? 1n})) ${port}_mem (.clk, .rst_b, .bus (${port}_bus));`)
      finals.push(`    errors += ${port}_mem.errors;`)
      const base = this.def.addrMap[port]
      const last = base + (reg.size ?? 1n) * BigInt(B) - 1n
      // An unsigned compare against 0 or the top address is always true, and Verilator flags it
      const terms: string[] = []
      if (base > 0n) terms.push(`regs_bus.ADDR >= ${this.addr(base)}`)
      if (last < ones(AW)) terms.push(`regs_bus.ADDR <= ${this.addr(last)}`)
      monitors.push(`  // ${port}_rd_hit, window ${port}'s read decode, is set by a read inside 0x${base.toString(16)}-0x${last.toString(16)} and no other
  always @(posedge clk)
    if (regs_bus.RE) check($sformatf("${port}_rd_hit @0x%0h", regs_bus.ADDR), 64'(dut.${port}_rd_hit), 64'(${terms.length > 0 ? terms.join(' && ') : "1'b1"}));`)
    }
    for (const [r, pulses] of this.wePulses) {
      monitors.push(`  int ${r}_we_count;
  initial ${r}_we_count = 0;
  always @(posedge clk) if (${r}_we) ${r}_we_count <= ${r}_we_count + 1;`)
      finals.push(`    check("${r}_we pulses, one per write to its address with a strobe in its bytes", 64'(${r}_we_count), 64'd${pulses});`)
    }

    return `// ${this.name}: self-checking testbench for ${this.block.name}, generated by ${this.generator}
// (${this.issues}) from the block's RegisterBlockDef, with ts/test/models/RegisterBlockTestbench.ts
\`timescale 1ns / 1ps

module ${this.name};
  ${TESTBENCH_MARKER}
  logic clk;
  logic rst_b = 1'b0;
  initial clk = 1'b0;
  always #5 clk = ~clk;

  int errors = 0;
  int checks = 0;
${this.romWrites ? '  int rom_reads;\n' : ''}
${decls.join('\n')}

  ${this.block.name} dut (
    ${binds.join(',\n    ')}
  );

  task automatic check (input string what, input logic [63:0] got, input logic [63:0] exp);
    checks++;
    if (got !== exp) begin
      errors++;
      $display("ERROR %0t: %s: got 0x%0h, expected 0x%0h", $time, what, got, exp);
    end
  endtask

  // A read of addr: its data and wait states, then DATA_RD and READY a cycle later. DATA_RD holds
  // until the next request
  task automatic read_check (input string what, input logic [${AW - 1}:0] addr, input logic [${W - 1}:0] exp, input int waits);
    logic [${W - 1}:0] data;
    m.read(addr, data);
    check($sformatf("%s: read @0x%0h: DATA_RD", what, addr), 64'(data), 64'(exp));
    check($sformatf("%s: read @0x%0h: wait states", what, addr), 64'(m.waits), 64'(waits));
    @(negedge clk);
    #1;
    check($sformatf("%s: read @0x%0h: DATA_RD held", what, addr), 64'(regs_bus.DATA_RD), 64'(exp));
    check($sformatf("%s: read @0x%0h: READY held", what, addr), 64'(regs_bus.READY), 64'h1);
  endtask

  // A write, and its wait states. write_check returns in the first cycle after the write lands
  task automatic write_check (input string what, input logic [${AW - 1}:0] addr, input logic [${W - 1}:0] data,
                              input logic [${B - 1}:0] strb, input int waits);
    m.write(addr, data, strb);
    check($sformatf("%s: write @0x%0h: wait states", what, addr), 64'(m.waits), 64'(waits));
  endtask

  // ADDR moves with no request: DATA_RD and READY hold
  task automatic idle_check (input logic [${AW - 1}:0] addr, input logic [${W - 1}:0] exp);
    m.set_addr(addr);
    #1;
    check($sformatf("idle, ADDR 0x%0h: DATA_RD held", addr), 64'(regs_bus.DATA_RD), 64'(exp));
    check($sformatf("idle, ADDR 0x%0h: READY held", addr), 64'(regs_bus.READY), 64'h1);
  endtask

${monitors.join('\n\n')}

  initial begin
    // Waveform, written to the run directory when the model is built with --trace-fst
    $dumpfile("${this.name}.fst");
    $dumpvars(0, ${this.name});
${inits.join('\n')}
    repeat (2) @(negedge clk);
    rst_b = 1'b1;
    @(negedge clk);
    #1;
${this.steps.join('\n')}

    repeat (2) @(negedge clk);
${finals.join('\n')}
    if (errors == 0) begin
      $display("${this.name}: PASS (%0d checks)", checks);
      $finish;
    end else begin
      $fatal(1, "${this.name}: FAIL (%0d of %0d checks)", errors, checks);
    end
  end
endmodule
`
  }

  /**
   * Writes the testbench to `<dir>/tb_<block>.sv`, the Memory models it uses to `<dir>/<model>.sv`,
   * and `<dir>/tb_<block>.f`, the filelist that lints and builds it. `design` lists the files that
   * define the block, relative to `dir`, as writeLintWrapped() returns them.
   */
  emit (dir: string, design: string[]): void {
    writeFileSync(`${dir}/${this.name}.sv`, this.render())
    const { interfaces } = this.block as unknown as { interfaces: Record<string, Interface> }
    const models = new Map<string, string>()
    for (const [port, intf] of this.ports(interfaces)) {
      const opts = this.modelOptions(intf)
      if (port === 'regs') models.set(memoryMasterName(opts), memoryMasterBfm(opts))
      else models.set(memorySlaveName(opts), memorySlaveModel(opts))
    }
    for (const [model, sv] of models) writeFileSync(`${dir}/${model}.sv`, sv)
    writeLintFilelist(dir, this.name, [`${this.name}.sv`, ...design, ...[...models.keys()].map(m => `${m}.sv`)], this.generator)
  }

  /** The block's interface ports: `regs` and one per RAM/ROM window */
  private ports (interfaces: Record<string, Interface>): Array<[string, Interface]> {
    return Object.entries(interfaces).filter(([, intf]) => intf.role !== undefined)
  }

  private modelOptions (intf: Interface): MemoryModelOptions {
    return { type: (intf.params as { type: MemoryModelOptions['type'] }).type, dataWidth: this.W as 32 | 64 }
  }
}
