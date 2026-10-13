/** @module Registers */
import { Module, type TSSVParameters, type IntRange, Expr, type Interface } from 'tssv/lib/core/TSSV'

import { Memory } from 'tssv/lib/interfaces/Memory'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import { APB_to_Memory } from 'tssv/lib/modules/APB_to_Memory'

export enum RegisterType {
  RO = 'RO',
  RW = 'RW',
  RWU = 'RWU',
  WO = 'WO',
  RAM = 'RAM',
  ROM = 'ROM',
}

interface Field {
  reset?: bigint
  description?: string
  bitRange: [IntRange<0, 63>, IntRange<0, 63>]
  isSigned?: boolean
}
interface Register {
  type: RegisterType
  reset?: bigint
  description?: string
  size?: bigint
  width?: IntRange<1, 64>
  isSigned?: boolean
  fields?: Record<string, Field>
  /**
   * RWU only: which update source wins when both assert in the same cycle. Default 'hw'. With
   * 'hw', the hardware update sets the whole register. With 'sw', the software write sets the
   * bytes whose `WSTRB` bit is set, and the hardware update sets the others.
   */
  updatePriority?: 'hw' | 'sw'
  /** RO only: no input port; the register reads its `reset`, or each field's `reset`. */
  constant?: boolean
  /** RAM/ROM only: drive the window's request from flops. Default true. */
  registerRequest?: boolean
  /** RAM/ROM only: return the window's response through flops. Default true. */
  registerResponse?: boolean
}

/** A RAM/ROM window's response, for the read path: when it is ready and what it returns. */
interface WindowResponse {
  regName: string
  /** High unless the window has an access in flight. */
  ready: string
  /** The window's read data. */
  data: string
}

export class RegAddr {
  private addr: bigint
  private readonly stride: bigint
  constructor (start?: bigint, wordSize?: 32 | 64) {
    this.addr = start || 0n
    this.stride = BigInt((wordSize || 32) / 8)
  }

  next (): bigint {
    const nextAddr = this.addr
    this.addr += this.stride
    return nextAddr
  }
}
export interface RegisterBlockDef<T extends Record<string, bigint>> {
  wordSize: 32 | 64
  addrMap: T
  baseAddress?: bigint
  registers: { [name in keyof T]?: Register }
}

export interface RegisterBlockParameters extends TSSVParameters {
  busInterface?: 'Memory' | 'TL_UL' | 'APB'
  endianess?: 'little'
  busIDWidth?: 8
  busAddressWidth?: 32
}

/** The byte lanes that bits `[hi:lo]` of the data bus span, lowest first */
function byteLanes (hi: number, lo: number): number[] {
  const lanes: number[] = []
  for (let lane = Math.floor(lo / 8); lane <= Math.floor(hi / 8); lane++) lanes.push(lane)
  return lanes
}

/**
 * Bits `[h:l]` of `sig`, a `width`-bit signal. All of it is `sig` itself: a 1-bit signal has no
 * bit range to select.
 */
function slice (sig: string, h: number, l: number, width: number): string {
  if (l === 0 && h === width - 1) return sig
  return h === l ? `${sig}[${h}]` : `${sig}[${h}:${l}]`
}

function ralfAccessType (type: RegisterType): string {
  switch (type) {
    case RegisterType.RO:
    case RegisterType.ROM: return 'ro'
    case RegisterType.WO: return 'wo'
    case RegisterType.RW:
    case RegisterType.RAM:
    default: return 'rw'
  }
}

/**
 * A module holding the registers in a {@link RegisterBlockDef}. They are reached through its
 * `regs` Memory interface, or through an `apb` APB4 interface that an APB_to_Memory
 * submodule bridges onto `regs`.
 *
 * `regs` follows the {@link Memory} contract, which has the timing diagrams. A register access
 * has no wait states: `READY` stays high, and read data is captured on the clock edge after the
 * `RE` pulse and held until the next request. An access to a `RAM`/`ROM` window goes out on the
 * window's own outward `Memory` port and completes when the memory behind it raises `READY`.
 * It adds one wait state for each of the window's `registerRequest` and `registerResponse` flops
 * that is on (both are by default). `doc/framework/registers.md` §3 has the port list of every
 * register type.
 *
 * @noInheritDoc
 */
export class RegisterBlock<T extends Record<string, bigint>> extends Module {
  declare params: RegisterBlockParameters
  regDefs: RegisterBlockDef<T>

  constructor (params: RegisterBlockParameters, regDefs: RegisterBlockDef<T>, busInterface: Interface) {
    super({
      name: params.name,
      busInterface: params.busInterface || 'Memory',
      endianess: params.endianess || 'little'
    })
    this.regDefs = regDefs

    // Define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' }
    }

    if (busInterface instanceof Memory) {
      this.addInterface('regs', new Memory({
        DATA_WIDTH: regDefs.wordSize || 32,
        ADDR_WIDTH: params.busAddressWidth
      }, 'inward'))
    } else if (busInterface instanceof APB4) {
      this.addInterface('apb', new APB4({
        DATA_WIDTH: regDefs.wordSize || 32,
        ADDR_WIDTH: params.busAddressWidth
      }, 'inward'))
      this.addInterface('regs', new Memory({
        DATA_WIDTH: regDefs.wordSize || 32,
        ADDR_WIDTH: params.busAddressWidth
      }))
      this.addSubmodule('apb_to_mem', new APB_to_Memory({
        DATA_WIDTH: regDefs.wordSize || 32,
        ADDR_WIDTH: params.busAddressWidth
      }), {
        clk: 'clk',
        rst_b: 'rst_b',
        apb: 'apb',
        mem: 'regs'
      }, false)
    } else {
      throw Error('Unsupported interface')
    }

    // Create signals and logic for registers
    const windows: WindowResponse[] = []
    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const baseAddr = this.regDefs.addrMap[regName]
      const thisReg = this.resolveRegister(regName)
      this.checkRegister(regName, thisReg)
      const isWindow = thisReg.type === RegisterType.RAM || thisReg.type === RegisterType.ROM
      const matchExpr = this.addSignal(`${regName}_matchExpr`, { width: 1 })
      this.addAssign({ in: new Expr(this.decodeExpr(regName, baseAddr, isWindow ? thisReg.size : undefined)), out: matchExpr })

      // The read and write decodes, for the types that are read or written
      if (thisReg.type !== RegisterType.WO) {
        const rdHit = this.addSignal(`${regName}_rd_hit`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: rdHit })
      }
      if (thisReg.type !== RegisterType.RO && thisReg.type !== RegisterType.ROM) {
        const wrHit = this.addSignal(`${regName}_wr_hit`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: wrHit })
      }

      if (thisReg.type === RegisterType.RW) {
        if (thisReg.fields && Object.keys(thisReg.fields).length > 0) {
          this.addFieldRegisters(regName, thisReg.fields)
        } else {
          const width = thisReg.width || regDefs.wordSize
          this.IOs[regName.toString()] = {
            direction: 'output',
            width,
            isSigned: thisReg.isSigned
          }
          this.addRegister({
            d: new Expr(this.strobedWrite(width - 1, 0, (h, l) => slice(regName, h, l, width))),
            clk: 'clk',
            reset: 'rst_b',
            q: regName.toString(),
            en: `${regName}_wr_hit`,
            resetVal: thisReg.reset || 0n
          })
        }
      } else if (thisReg.type === RegisterType.RWU) {
        const width = thisReg.width || regDefs.wordSize
        const resetHex = (thisReg.reset ?? 0n).toString(16)

        this.IOs[regName] = { direction: 'output', width, isSigned: thisReg.isSigned, type: 'reg' }
        this.IOs[`${regName}_hw_update`] = { direction: 'input', width: 1 }
        this.IOs[`${regName}_hw_update_val`] = { direction: 'input', width, isSigned: thisReg.isSigned }

        const hwFirst = (thisReg.updatePriority ?? 'hw') === 'hw'
        const hwVal = `${regName}_hw_update_val`
        // A software write keeps the unstrobed bytes, or with 'sw' priority gives them to a
        // hardware update in the same cycle
        const swVal = this.strobedWrite(width - 1, 0, hwFirst
          ? (h, l) => slice(regName, h, l, width)
          : (h, l) => `(${regName}_hw_update ? ${slice(hwVal, h, l, width)} : ${slice(regName, h, l, width)})`)
        const firstCond = hwFirst ? `${regName}_hw_update` : `${regName}_wr_hit`
        const firstVal = hwFirst ? hwVal : swVal
        const secondCond = hwFirst ? `${regName}_wr_hit` : `${regName}_hw_update`
        const secondVal = hwFirst ? swVal : hwVal
        this.body += `
always_ff @( posedge clk or negedge rst_b )
  if (!rst_b)
    ${regName} <= ${width}'h${resetHex};
  else if (${firstCond})
    ${regName} <= ${firstVal};
  else if (${secondCond})
    ${regName} <= ${secondVal};
`
      } else if (thisReg.type === RegisterType.RO) {
        // A constant RO has no port: the read path returns its reset value
        if (thisReg.constant !== true) {
          if (thisReg.fields && Object.keys(thisReg.fields).length > 0) {
            Object.values(thisReg.fields).forEach((field, index) => {
              this.IOs[`${regName}_field${index}`] = {
                direction: 'input',
                width: field.bitRange[0] - field.bitRange[1] + 1,
                isSigned: field.isSigned
              }
            })
          } else {
            this.IOs[regName] = {
              direction: 'input',
              width: thisReg.width || regDefs.wordSize,
              isSigned: thisReg.isSigned
            }
          }
        }
      } else if (thisReg.type === RegisterType.WO) {
        const lanes = new Set<number>()
        if (thisReg.fields && Object.keys(thisReg.fields).length > 0) {
          this.addFieldRegisters(regName, thisReg.fields)
          Object.values(thisReg.fields).forEach(f => { byteLanes(...f.bitRange).forEach(b => lanes.add(b)) })
        } else {
          const width = thisReg.width || regDefs.wordSize
          byteLanes(width - 1, 0).forEach(b => { lanes.add(b) })
          this.IOs[regName] = { direction: 'output', width, isSigned: thisReg.isSigned }
          this.addRegister({
            d: new Expr(this.strobedWrite(width - 1, 0, (h, l) => slice(regName, h, l, width))),
            clk: 'clk',
            reset: 'rst_b',
            q: regName,
            en: `${regName}_wr_hit`,
            resetVal: thisReg.reset ?? 0n
          })
        }
        // High for one cycle, the first cycle the register shows the new value, after a write
        // with a strobe set in a byte lane the register stores
        const strobed = [...lanes].sort((a, b) => a - b).map(b => `regs.WSTRB[${b}]`).join(' || ')
        this.IOs[`${regName}_we`] = { direction: 'output', width: 1 }
        this.addRegister({ d: new Expr(`${regName}_wr_hit && (${strobed})`), clk: 'clk', reset: 'rst_b', q: `${regName}_we` })
      } else if (isWindow) {
        windows.push(this.addWindow(regName, baseAddr, thisReg))
      }
    }
    this.addReadMux(windows)
  }

  /**
   * Throws if `reg` uses an option its type doesn't allow: `constant` outside `RO`, the window
   * timing options outside `RAM`/`ROM`, or a window `width` other than `wordSize`.
   */
  private checkRegister (regName: string, reg: Register): void {
    const isWindow = reg.type === RegisterType.RAM || reg.type === RegisterType.ROM
    if (reg.constant !== undefined && reg.type !== RegisterType.RO) {
      throw Error(`${regName}: constant is only allowed on RO, not ${reg.type}`)
    }
    if ((reg.registerRequest !== undefined || reg.registerResponse !== undefined) && !isWindow) {
      throw Error(`${regName}: registerRequest and registerResponse are only allowed on RAM and ROM, not ${reg.type}`)
    }
    if (isWindow && reg.width !== undefined && reg.width !== this.regDefs.wordSize) {
      throw Error(`${regName}: a ${reg.type} window's width must be the wordSize, ${this.regDefs.wordSize}, not ${reg.width}`)
    }
  }

  /**
   * One output `<R>_field<i>` per field, each a flop that loads its bit range of `regs.DATA_WR` on
   * a write to the register. Only the field's bytes whose `WSTRB` bit is set change
   * ({@link strobedWrite}).
   */
  private addFieldRegisters (regName: string, fields: Record<string, Field>): void {
    Object.values(fields).forEach((field, index) => {
      const fieldSigName = `${regName}_field${index}`
      const [hi, lo] = field.bitRange
      this.IOs[fieldSigName] = {
        direction: 'output',
        width: hi - lo + 1,
        isSigned: field.isSigned
      }
      this.addRegister({
        d: new Expr(this.strobedWrite(hi, lo, (h, l) => slice(fieldSigName, h, l, hi - lo + 1))),
        clk: 'clk',
        reset: 'rst_b',
        q: fieldSigName,
        en: `${regName}_wr_hit`,
        resetVal: field.reset || 0n
      })
    })
  }

  /**
   * The value that bits `[hi:lo]` of a register take on a write to it, one byte lane at a time:
   * `regs.DATA_WR` in each lane whose `WSTRB` bit is set, and `keep(h, l)` in the others. `h` and
   * `l` count from bit `lo`, so for a signal that holds bits `[hi:lo]` at its bits `[hi-lo:0]`,
   * `keep` is its slice `[h:l]`.
   */
  private strobedWrite (hi: number, lo: number, keep: (h: number, l: number) => string): string {
    const lanes = byteLanes(hi, lo).map(lane => {
      const laneLo = Math.max(lo, lane * 8)
      const laneHi = Math.min(hi, lane * 8 + 7)
      return `regs.WSTRB[${lane}] ? ${slice('regs.DATA_WR', laneHi, laneLo, this.regDefs.wordSize)} : ${keep(laneHi - lo, laneLo - lo)}`
    }).reverse()
    return lanes.length === 1 ? lanes[0] : `{${lanes.map(l => `(${l})`).join(', ')}}`
  }

  /**
   * A `RAM`/`ROM` window: an outward `Memory` port `<R>` (`bidi` for `RAM`, `rd_only` for `ROM`)
   * that carries each access in the window to the memory behind it. `<R>.ADDR` is the byte offset
   * inside the window.
   *
   * `<R>_wait_q` is high from the cycle after the memory sees the request until the cycle its
   * `READY` completes the access. With `registerRequest`, the request reaches `<R>` from flops,
   * one cycle after the `regs` request. With `registerResponse`, `<R>_rdata_q` captures the read
   * data when the access completes, and the window's `READY` term is made only of flops.
   */
  private addWindow (regName: string, base: bigint, reg: Register): WindowResponse {
    const isROM = reg.type === RegisterType.ROM
    const registerRequest = reg.registerRequest ?? true
    const registerResponse = reg.registerResponse ?? true
    const wordSize = this.regDefs.wordSize
    const addrWidth = this.addrWidth()
    this.addInterface(regName, new Memory({
      type: isROM ? 'rd_only' : 'bidi',
      DATA_WIDTH: wordSize,
      ADDR_WIDTH: this.params.busAddressWidth
    }, 'outward'))

    const hit = isROM ? `${regName}_rd_hit` : `${regName}_rd_hit || ${regName}_wr_hit`
    const request: Array<{ sig: string, value: string, width: number, held: boolean }> = [
      { sig: 'ADDR', value: base === 0n ? 'regs.ADDR' : `regs.ADDR - ${this.addrLiteral(base)}`, width: addrWidth, held: true },
      { sig: 'RE', value: `${regName}_rd_hit`, width: 1, held: false }
    ]
    if (!isROM) {
      request.push(
        { sig: 'WE', value: `${regName}_wr_hit`, width: 1, held: false },
        { sig: 'DATA_WR', value: 'regs.DATA_WR', width: wordSize, held: true },
        { sig: 'WSTRB', value: 'regs.WSTRB', width: wordSize / 8, held: true })
    }
    let issue = hit
    for (const { sig, value, width, held } of request) {
      if (!registerRequest) {
        this.addAssign({ in: new Expr(value), out: `${regName}.${sig}` })
        continue
      }
      // RE and WE are one-cycle pulses; the address and write data hold until the next request
      const q = this.addSignal(`${regName}_${sig.toLowerCase()}_q`, { width })
      this.addRegister({ d: new Expr(value), clk: 'clk', reset: 'rst_b', q, ...(held ? { en: hit } : {}) })
      this.addAssign({ in: new Expr(q.toString()), out: `${regName}.${sig}` })
    }
    if (registerRequest) issue = isROM ? `${regName}_re_q` : `${regName}_re_q || ${regName}_we_q`

    const wait = this.addSignal(`${regName}_wait_q`, { width: 1 })
    this.addRegister({
      d: new Expr(`${issue} || (${wait.toString()} && !${regName}.READY)`),
      clk: 'clk',
      reset: 'rst_b',
      q: wait
    })
    const issuing = !registerRequest ? '' : isROM ? `!${issue} && ` : `!(${issue}) && `
    if (!registerResponse) {
      const settled = `!${wait.toString()} || ${regName}.READY`
      return { regName, ready: issuing === '' ? settled : `${issuing}(${settled})`, data: `${regName}.DATA_RD` }
    }
    const rdata = this.addSignal(`${regName}_rdata_q`, { width: wordSize })
    this.addRegister({
      d: `${regName}.DATA_RD`,
      clk: 'clk',
      reset: 'rst_b',
      en: new Expr(`${wait.toString()} && ${regName}.READY`),
      q: rdata
    })
    return { regName, ready: `${issuing}!${wait.toString()}`, data: rdata.toString() }
  }

  /** The register's definition, or the default for an `addrMap` entry with none: a full-word RW. */
  private resolveRegister (regName: keyof T): Register {
    return this.regDefs.registers[regName] ?? { type: RegisterType.RW, width: this.regDefs.wordSize }
  }

  /** `addr` as a sized hex literal at the bus address width */
  private addrLiteral (addr: bigint): string {
    return `${this.addrWidth()}'h${addr.toString(16)}`
  }

  private addrWidth (): number {
    return this.params.busAddressWidth ?? 32
  }

  /**
   * The full-width address decode for one register: `regs.ADDR` equal to `base`, or, with `size`
   * (`RAM`/`ROM`), inside the window `[base, base + size * wordSize/8)`. The write strobes and the
   * read multiplexer both use it, so the two decode the same addresses.
   */
  private decodeExpr (regName: keyof T, base: bigint, size?: bigint): string {
    const name = String(regName)
    const limit = 1n << BigInt(this.addrWidth())
    if (size === undefined) {
      if (base < 0n || base >= limit) {
        throw Error(`${name}: address 0x${base.toString(16)} doesn't fit in the ${this.addrWidth()}-bit bus address`)
      }
      return `regs.ADDR == ${this.addrLiteral(base)}`
    }
    if (size <= 0n) throw Error(`${name}: size must be at least 1, got ${size}`)
    const last = base + size * BigInt(this.regDefs.wordSize / 8) - 1n
    if (base < 0n || last >= limit) {
      throw Error(`${name}: window 0x${base.toString(16)}-0x${last.toString(16)} doesn't fit in the ${this.addrWidth()}-bit bus address`)
    }
    // An unsigned compare against 0 or the top address is always true, and Verilator flags it.
    const terms: string[] = []
    if (base > 0n) terms.push(`(regs.ADDR >= ${this.addrLiteral(base)})`)
    if (last < limit - 1n) terms.push(`(regs.ADDR <= ${this.addrLiteral(last)})`)
    return terms.length > 0 ? terms.join(' && ') : "1'b1"
  }

  /**
   * `value`, `width` bits wide, as a word-wide read-back value: zero-extended, or truncated to
   * the word if it is wider.
   */
  private toWord (value: string, width: number): string {
    const wordSize = this.regDefs.wordSize
    if (width === wordSize) return value
    if (width > wordSize) return `${value}[${wordSize - 1}:0]`
    return `{${wordSize - width}'b0, ${value}}`
  }

  /**
   * A field register's read-back value: each `<R>_field<i>` at its declared bit range, unused
   * bits 0. Throws if a range is reversed, past the word, or overlaps another field.
   */
  private fieldReadback (regName: string, fields: Record<string, Field>): string {
    const wordSize = this.regDefs.wordSize
    const placed = Object.entries(fields).map(([fieldName, field], index) => {
      const [hi, lo] = field.bitRange
      if (hi < lo) throw Error(`${regName}.${fieldName}: bitRange [${hi}, ${lo}] must be [msb, lsb]`)
      if (hi >= wordSize) throw Error(`${regName}.${fieldName}: bit ${hi} is past the ${wordSize}-bit word`)
      return { sig: `${regName}_field${index}`, name: fieldName, hi, lo }
    }).sort((a, b) => b.lo - a.lo)

    const parts: string[] = []
    let next = wordSize - 1 // highest bit not yet placed
    for (const f of placed) {
      if (f.hi > next) {
        const other = placed.find(o => o !== f && o.lo <= f.hi && o.hi >= f.lo)
        throw Error(`${regName}.${f.name}: bits [${f.hi}:${f.lo}] overlap ${regName}.${other?.name ?? 'another field'}`)
      }
      if (f.hi < next) parts.push(`${next - f.hi}'b0`)
      parts.push(f.sig)
      next = f.lo - 1
    }
    if (next >= 0) parts.push(`${next + 1}'b0`)
    return parts.length === 1 ? parts[0] : `{${parts.join(', ')}}`
  }

  /**
   * A constant `RO` register's read-back value, as a word-wide literal: its `reset`, or each
   * field's `reset` at its bit range. Throws if a value doesn't fit its width.
   */
  private constantValue (regName: string, reg: Register): string {
    const wordSize = this.regDefs.wordSize
    const fits = (value: bigint, width: number, what: string): bigint => {
      if (value < 0n || value >= (1n << BigInt(width))) {
        throw Error(`${what}: reset 0x${value.toString(16)} doesn't fit in ${width} bits`)
      }
      return value
    }
    let value = 0n
    if (reg.fields && Object.keys(reg.fields).length > 0) {
      this.fieldReadback(regName, reg.fields) // checks the bit ranges
      for (const [fieldName, field] of Object.entries(reg.fields)) {
        const [hi, lo] = field.bitRange
        value |= fits(field.reset ?? 0n, hi - lo + 1, `${regName}.${fieldName}`) << BigInt(lo)
      }
    } else {
      value = fits(reg.reset ?? 0n, reg.width ?? wordSize, regName) & ((1n << BigInt(wordSize)) - 1n)
    }
    return `${wordSize}'h${value.toString(16)}`
  }

  /**
   * The read path, in three parts. `read_mux` picks the next read value: the first readable
   * register, in `addrMap` order, whose `<R>_rd_hit` (its address decode and `regs.RE`) is high,
   * or 0 when none is. `rd_data_q` captures it on the edge after the `RE` pulse and holds it until
   * the next read. Each `RAM`/`ROM` window has a `<R>_last_q` flag that is set when the last
   * request was a read of the window, or a write to a `RAM`. `regs.DATA_RD` then comes from that
   * window, or else from `rd_data_q`. `regs.READY` is low while any window has an access in
   * flight.
   */
  private addReadMux (windows: WindowResponse[]): void {
    const wordSize = this.regDefs.wordSize
    const branches: string[] = []
    for (const regName in this.regDefs.addrMap) {
      const reg = this.resolveRegister(regName)
      const width = reg.width ?? wordSize
      const hasFields = reg.fields !== undefined && Object.keys(reg.fields).length > 0
      let value: string
      switch (reg.type) {
        case RegisterType.WO:
        case RegisterType.RAM:
        case RegisterType.ROM:
          continue
        case RegisterType.RO:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          value = reg.constant === true ? this.constantValue(regName, reg) : hasFields ? this.fieldReadback(regName, reg.fields!) : this.toWord(regName, width)
          break
        case RegisterType.RW:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          value = hasFields ? this.fieldReadback(regName, reg.fields!) : this.toWord(regName, width)
          break
        case RegisterType.RWU:
          value = this.toWord(regName, width)
          break
      }
      const kw = branches.length === 0 ? 'if' : 'end else if'
      branches.push(`    ${kw} (${regName}_rd_hit) begin\n      rd_data_nxt = ${value};`)
    }
    if (branches.length > 0) branches.push('    end')

    this.addSignal('rd_data_nxt', { width: wordSize })
    this.addSignal('rd_data_q', { width: wordSize })
    this.addCombAlways({ outputs: ['rd_data_nxt'] }, `
  begin : read_mux
    rd_data_nxt = '0;
${branches.join('\n')}
  end
`)
    this.addRegister({ d: 'rd_data_nxt', clk: 'clk', reset: 'rst_b', en: 'regs.RE', q: 'rd_data_q' })

    if (windows.length === 0) {
      this.addAssign({ in: new Expr("1'b1"), out: 'regs.READY' })
      this.addAssign({ in: new Expr('rd_data_q'), out: 'regs.DATA_RD' })
      return
    }
    // Only one access is in flight at a time, so at most one window's term is low
    this.addAssign({ in: new Expr(windows.map(w => `(${w.ready})`).join(' && ')), out: 'regs.READY' })

    const selects = windows.map(({ regName, data }, i) => {
      const isROM = this.resolveRegister(regName).type === RegisterType.ROM
      const last = this.addSignal(`${regName}_last_q`, { width: 1 })
      const hit = isROM ? `${regName}_rd_hit` : `${regName}_rd_hit || ${regName}_wr_hit`
      this.addRegister({ d: new Expr(hit), clk: 'clk', reset: 'rst_b', en: 'regs.RE || regs.WE', q: last })
      return `    ${i === 0 ? 'if' : 'end else if'} (${last.toString()}) begin
      regs.DATA_RD = ${data};`
    })
    this.addCombAlways({ outputs: ['regs.DATA_RD'] }, `
  begin : read_out
    regs.DATA_RD = rd_data_q;
${selects.join('\n')}
    end
  end
`)
  }

  writeRALF (): string {
    const blockName = this.params.name ?? 'unnamed'
    const wordBytes = (this.regDefs.wordSize ?? 32) / 8
    const lines: string[] = [`block ${blockName} {`, `    bytes ${wordBytes};`]

    for (const [regName, addr] of Object.entries(this.regDefs.addrMap)) {
      const reg = this.regDefs.registers[regName as keyof T]
      if (!reg) continue
      const access = ralfAccessType(reg.type)
      lines.push(`    register ${regName} @0x${addr.toString(16)} {`)

      if (reg.fields !== undefined && Object.keys(reg.fields).length > 0) {
        for (const [fieldName, field] of Object.entries(reg.fields)) {
          const hi = field.bitRange[0]
          const lo = field.bitRange[1]
          const width = hi - lo + 1
          const reset = `0x${(field.reset ?? 0n).toString(16)}`
          lines.push(`        field ${fieldName}${lo !== 0 ? ` @ ${lo}` : ''} {`)
          lines.push(`            bits ${width};`)
          lines.push(`            reset ${reset};`)
          lines.push(`            access ${access};`)
          lines.push(`        }`)
        }
      } else {
        const width = reg.width ?? this.regDefs.wordSize ?? 32
        const reset = `0x${(reg.reset ?? 0n).toString(16)}`
        lines.push(`        field ${regName.toLowerCase()} {`)
        lines.push(`            bits ${width};`)
        lines.push(`            reset ${reset};`)
        lines.push(`            access ${access};`)
        lines.push(`        }`)
      }

      lines.push(`    }`)
    }

    lines.push(`}`)
    return lines.join('\n') + '\n'
  }
}
