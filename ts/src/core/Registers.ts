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
  /** RWU only: which update source wins when both assert in the same cycle. Default 'hw'. */
  updatePriority?: 'hw' | 'sw'
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
 * `RE` pulse and held until the next request. A `RAM`/`ROM` window drives `READY` and `DATA_RD`
 * itself after an access to it.
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
    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const baseAddr = this.regDefs.addrMap[regName]
      const matchExpr = this.addSignal(`${regName}_matchExpr`, { width: 1 })
      const thisReg = this.resolveRegister(regName)

      if (thisReg.type === RegisterType.RW) {
        const wstrbWidth = (params.busAddressWidth || 8) / 8
        const wstrb = this.addSignal(`${regName}_wstrb`, { width: wstrbWidth })

        this.addAssign({ in: new Expr(this.decodeExpr(regName, baseAddr)), out: matchExpr })

        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig })

        // new code
        this.addAssign({ in: new Expr('regs.WSTRB'), out: wstrb })

        if (thisReg.fields && Object.keys(thisReg.fields).length > 0) {
          Object.keys(thisReg.fields).forEach((fieldName, index) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const field = thisReg.fields![fieldName]
            const fieldSigName = `${regName}_field${index}`
            this.IOs[fieldSigName] = {
              direction: 'output',
              width: field.bitRange[0] - field.bitRange[1] + 1,
              isSigned: field.isSigned
            }
            this.addRegister({
              d: new Expr(`regs.DATA_WR[${field.bitRange[0]}:${field.bitRange[1]}]`),
              clk: 'clk',
              reset: 'rst_b',
              q: fieldSigName,
              en: `${regName}_WE && ${wstrb.toString()}`, // added && ${wstrb.toString()}
              resetVal: field.reset || 0n
            })
          })
        } else {
          this.IOs[regName.toString()] = {
            direction: 'output',
            width: thisReg.width || regDefs.wordSize,
            isSigned: thisReg.isSigned
          }

          this.addSignal(`${regName}_d`, { width: regDefs.wordSize })
          // new
          this.addAssign({ in: new Expr(`regs.DATA_WR & ${wstrb.toString()}`), out: `${regName}_d` })

          this.addRegister({
            d: 'regs.DATA_WR', // added & wstrb
            clk: 'clk',
            reset: 'rst_b',
            q: regName.toString(),
            en: `${regName}_WE`,
            resetVal: thisReg.reset || 0n
          })
        }
      } else if (thisReg.type === RegisterType.RWU) {
        const width = thisReg.width || regDefs.wordSize
        const resetHex = (thisReg.reset ?? 0n).toString(16)

        this.addAssign({ in: new Expr(this.decodeExpr(regName, baseAddr)), out: matchExpr })
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig })

        this.IOs[regName] = { direction: 'output', width, isSigned: thisReg.isSigned, type: 'reg' }
        this.IOs[`${regName}_hw_update`] = { direction: 'input', width: 1 }
        this.IOs[`${regName}_hw_update_val`] = { direction: 'input', width, isSigned: thisReg.isSigned }

        const hwFirst = (thisReg.updatePriority ?? 'hw') === 'hw'
        const firstCond = hwFirst ? `${regName}_hw_update` : `${regName}_WE`
        const firstVal = hwFirst ? `${regName}_hw_update_val` : `regs.DATA_WR[${width - 1}:0]`
        const secondCond = hwFirst ? `${regName}_WE` : `${regName}_hw_update`
        const secondVal = hwFirst ? `regs.DATA_WR[${width - 1}:0]` : `${regName}_hw_update_val`
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
        this.addAssign({ in: new Expr(this.decodeExpr(regName, baseAddr)), out: matchExpr })

        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.IOs[regName.toString()] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
      } else if (thisReg.type === RegisterType.WO) {
        const wstrbWidth = (params.busAddressWidth || 8) / 8
        const wstrb = this.addSignal(`${regName}_wstrb`, { width: wstrbWidth })

        this.addAssign({ in: new Expr(this.decodeExpr(regName, baseAddr)), out: matchExpr })
        this.addAssign({ in: new Expr('regs.WSTRB'), out: wstrb })

        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig })
        this.IOs[regName.toString()] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.addAssign({ in: new Expr('regs.DATA_WR'), out: regName.toString() })
      } else if (thisReg.type === RegisterType.ROM) {
        this.addAssign({ in: new Expr(this.decodeExpr(regName, baseAddr, thisReg.size)), out: matchExpr })
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const ROM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr('regs.ADDR'), out: ROM_ADDR })
        this.IOs[`${regName}_rdata`] = { // changed from input
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName}_re`] = {
          direction: 'output',
          width: 1
        }
        this.IOs[`${regName}_ready`] = {
          direction: 'output',
          width: 1
        }
        this.addRegister({
          d: 'regs.READY',
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: `${regName}_ready`
        })
      } else if (thisReg.type === RegisterType.RAM) {
        this.addAssign({ in: new Expr(this.decodeExpr(regName, baseAddr, thisReg.size)), out: matchExpr })
        const RAM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig })
        this.addAssign({ in: new Expr('regs.ADDR'), out: RAM_ADDR }) // remove  & ${PASS_MASK}
        this.IOs[`${regName}_rdata`] = { // changed input to output
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName}_re`] = {
          direction: 'output',
          width: 1
        }
        this.IOs[`${regName}_we`] = {
          direction: 'output',
          width: 1
        }
        this.IOs[`${regName}_wdata`] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName}_wstrb`] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize
        }
        this.IOs[`${regName}_ready`] = {
          direction: 'output',
          width: 1
        }
        this.addRegister({
          d: 'regs.READY',
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_ready`
        })
        this.addRegister({
          d: 'regs.DATA_WR',
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_wdata`
        })
        this.addRegister({
          d: RE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_re`
        })
        this.addRegister({
          d: WE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_we`
        })
        this.addRegister({
          d: new Expr('1'), // Assuming a simple write strobe signal
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_wstrb`
        })
      }
    }
    this.addReadMux()
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
   * The read path, in three parts. `read_mux` picks the next read value: the first readable
   * register, in `addrMap` order, whose `<R>_RE` (its address decode and `regs.RE`) is high, or
   * 0 when none is. `rd_data_q` captures it on the edge after the `RE` pulse and holds it until
   * the next read. Each `RAM`/`ROM` window has a `<R>_last_q` flag that is set when the last
   * request (read or write) hit it. `regs.DATA_RD` and `regs.READY` then come from that window,
   * or else from `rd_data_q` with `READY` high: a register access has no wait states.
   */
  private addReadMux (): void {
    const wordSize = this.regDefs.wordSize
    const branches: string[] = []
    const windows: string[] = []
    for (const regName in this.regDefs.addrMap) {
      const reg = this.resolveRegister(regName)
      const width = reg.width ?? wordSize
      let value: string
      switch (reg.type) {
        case RegisterType.WO:
          continue
        case RegisterType.RAM:
        case RegisterType.ROM:
          windows.push(regName)
          continue
        case RegisterType.RW:
          value = reg.fields && Object.keys(reg.fields).length > 0
            ? this.fieldReadback(regName, reg.fields)
            : this.toWord(regName, width)
          break
        case RegisterType.RO:
        case RegisterType.RWU:
          value = this.toWord(regName, width)
          break
      }
      const kw = branches.length === 0 ? 'if' : 'end else if'
      branches.push(`    ${kw} (${regName}_RE) begin\n      rd_data_nxt = ${value};`)
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
      this.addAssign({ in: new Expr('rd_data_q'), out: 'regs.DATA_RD' })
      this.addAssign({ in: new Expr("1'b1"), out: 'regs.READY' })
      return
    }

    // The data and ready a window drives after an access to it. They stay on the old flat
    // ports until #80 replaces them with an outward Memory port per window.
    const source = (regName: string): { data: string, ready: string } => {
      const reg = this.resolveRegister(regName)
      const data = reg.type === RegisterType.RAM ? `${regName}_wdata` : `${regName}_rdata`
      return { data: this.toWord(data, reg.width ?? wordSize), ready: `${regName}_ready` }
    }
    const selects = windows.map((regName, i) => {
      const last = this.addSignal(`${regName}_last_q`, { width: 1 })
      this.addRegister({ d: `${regName}_matchExpr`, clk: 'clk', reset: 'rst_b', en: 'regs.RE || regs.WE', q: last })
      const { data, ready } = source(regName)
      return `    ${i === 0 ? 'if' : 'end else if'} (${last.toString()}) begin
      regs.DATA_RD = ${data};
      regs.READY   = ${ready};`
    })
    this.addCombAlways({ outputs: ['regs.DATA_RD', 'regs.READY'] }, `
  begin : read_out
    regs.DATA_RD = rd_data_q;
    regs.READY   = 1'b1;
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
