import { Module, type TSSVParameters, type Sig, Expr, type IOSignals, extractNumberFromPattern } from 'tssv/lib/core/TSSV'
import { type OriginationUnfold } from 'tssv/lib/tools/shared'
export type PortsType = 'RD2_HS' | 'RF2_HS' | 'RA1_HD' | 'RA1_HS' | 'RF1_HS' | 'RF1_HD' | 'VROM_HD'

export interface SRAM_WRAPPER_Parameters extends TSSVParameters {
  dataWidth: number
  depth: bigint
  ports: PortsType
  split_direction: 'depth' | 'width'
  writeEnableMask?: 'none' | 'bit'
  macroConfig?: string
  // subSrams?: Array<{
  //   instName: string
  //   module: string
  //   width: number
  //   depth: bigint
  //   bitBig: number
  //   type: string
  //   adr_mask: string
  //   en_ptn: string
  // }>
}

export class SRAM_WRAPPER extends Module {
  declare params: SRAM_WRAPPER_Parameters
  private readonly subSrams: OriginationUnfold[]

  constructor (params: SRAM_WRAPPER_Parameters, compSrams: OriginationUnfold[] = []) {
    super({
      name: params.name,
      dataWidth: params.dataWidth,
      depth: params.depth,
      ports: params.ports,
      split_direction: params.split_direction,
      writeEnableMask: params.writeEnableMask || 'none',
      macroConfig: params.macroConfig || 'default',
      subSrams: params.subSrams || []
    })
    this.IOs = this.setupIOs(this.params.depth, this.params.dataWidth, this.params.ports, this.params.writeEnableMask)
    this.subSrams = compSrams

    if (this.params.split_direction === 'depth') {
      this.subSrams.forEach(sram => {
        if (sram.type === 'SRAM' && (sram.en_ptn == null || sram.adr_mask == null)) {
          throw new Error(
        `SRAM submodule "${sram.instName}" is missing en_ptn or adr_mask`
          )
        }
      })
      this.splitDepth()
    } else if (this.params.split_direction === 'width') {
      this.splitWidth()
    }
  }

  /*
  setupIOs creates the input/output signals for the SRAM_WRAPPER module based on the specified parameters.
  */
  private setupIOs (depth: bigint, dataWidth: number, ports: PortsType, writeEnableMask: 'none' | 'bit' | undefined): IOSignals {
    switch (ports) {
      case 'VROM_HD': {
        const io: IOSignals = {
          CK: { direction: 'input', isClock: 'posedge' },
          CSN: { direction: 'input' },
          A: { direction: 'input', width: this.bitWidth(depth - 1n) },
          DOUT: { direction: 'output', width: dataWidth },
          MCS: { direction: 'input', width: 1 },
          KCS: { direction: 'input', width: 1 },
          PDE: { direction: 'input', width: 1 },
          PRN: { direction: 'output', width: 1 }
        }
        if (writeEnableMask === 'bit') {
          io.BWEN = { direction: 'input', width: dataWidth }
        }
        return io
      }
      case 'RF1_HD':
      case 'RF1_HS':
      case 'RA1_HD':
      case 'RA1_HS': {
        const io: IOSignals = {
          CK: { direction: 'input', isClock: 'posedge' },
          CSN: { direction: 'input' },
          WEN: { direction: 'input' },
          DI: { direction: 'input', width: dataWidth },
          A: { direction: 'input', width: this.bitWidth(depth - 1n) },
          DOUT: { direction: 'output', width: dataWidth },
          MCS: { direction: 'input', width: 2 },
          MCSW: { direction: 'input', width: 1 },
          RET: { direction: 'input', width: 1 },
          ADME: { direction: 'input', width: 3 }
        }
        if (writeEnableMask === 'bit') {
          io.BWEN = { direction: 'input', width: dataWidth }
        }
        return io
      }
      case 'RD2_HS': {
        const io: IOSignals = {
          CK: { direction: 'input', isClock: 'posedge' },
          REN: { direction: 'input' },
          WEN: { direction: 'input' },
          DI: { direction: 'input', width: dataWidth },
          RA: { direction: 'input', width: this.bitWidth(depth - 1n) },
          WA: { direction: 'input', width: this.bitWidth(depth - 1n) },
          DOUT: { direction: 'output', width: dataWidth },
          MCSRD: { direction: 'input', width: 2 },
          MCSWR: { direction: 'input', width: 2 },
          RET: { direction: 'input', width: 1 },
          ADME: { direction: 'input', width: 3 }
        }
        if (writeEnableMask === 'bit') {
          io.BWEN = { direction: 'input', width: dataWidth }
        }
        return io
      }
      case 'RF2_HS': {
        const io: IOSignals = {
          RCK: { direction: 'input', isClock: 'posedge' },
          WCK: { direction: 'input', isClock: 'posedge' },
          REN: { direction: 'input' },
          WEN: { direction: 'input' },
          DI: { direction: 'input', width: dataWidth },
          RA: { direction: 'input', width: this.bitWidth(depth - 1n) },
          WA: { direction: 'input', width: this.bitWidth(depth - 1n) },
          DOUT: { direction: 'output', width: dataWidth },
          MCSRD: { direction: 'input', width: 2 },
          MCSWR: { direction: 'input', width: 2 },
          RET: { direction: 'input', width: 1 },
          ADME: { direction: 'input', width: 3 },
          KCS: { direction: 'input', width: 1 }
        }
        if (writeEnableMask === 'bit') {
          io.BWEN = { direction: 'input', width: dataWidth }
        }
        return io
      }
    }
  }

  /*  The setupIOs function is responsible for creating the input/output signals for the SRAM_WRAPPER module.
private setupIOs(depth: bigint, dataWidth: number, ports: PortsType, writeEnableMask: 'none' | 'bit' | undefined): IOSignals {
  const commonSignals = (additionalSignals: Record<string, any> = {}): IOSignals => ({
    ...additionalSignals,
    DOUT: { direction: 'output', width: dataWidth },
    ...(writeEnableMask === 'bit' ? { BWEN: { direction: 'input', width: dataWidth } } : {})
  });

  switch (ports) {
    case 'VROM_HD':
      return commonSignals({
        CK: { direction: 'input', isClock: 'posedge' },
        CSN: { direction: 'input' },
        A: { direction: 'input', width: this.bitWidth(depth - 1n) },
        MCS: { direction: 'input', width: 1 },
        KCS: { direction: 'input', width: 1 },
        PDE: { direction: 'input', width: 1 },
        PRN: { direction: 'output', width: 1 }
      });

    case 'RF1_HD':
    case 'RF1_HS':
    case 'RA1_HD':
    case 'RA1_HS':
      return commonSignals({
        CK: { direction: 'input', isClock: 'posedge' },
        CSN: { direction: 'input' },
        WEN: { direction: 'input' },
        DI: { direction: 'input', width: dataWidth },
        A: { direction: 'input', width: this.bitWidth(depth - 1n) },
        MCS: { direction: 'input', width: 2 },
        MCSW: { direction: 'input', width: 1 },
        RET: { direction: 'input', width: 1 },
        ADME: { direction: 'input', width: 3 }
      });

    case 'RD2_HS':
      return commonSignals({
        CK: { direction: 'input', isClock: 'posedge' },
        REN: { direction: 'input' },
        WEN: { direction: 'input' },
        DI: { direction: 'input', width: dataWidth },
        RA: { direction: 'input', width: this.bitWidth(depth - 1n) },
        WA: { direction: 'input', width: this.bitWidth(depth - 1n) },
        MCSRD: { direction: 'input', width: 2 },
        MCSWR: { direction: 'input', width: 2 },
        RET: { direction: 'input', width: 1 },
        ADME: { direction: 'input', width: 3 }
      });

    case 'RF2_HS':
      return commonSignals({
        RCK: { direction: 'input', isClock: 'posedge' },
        WCK: { direction: 'input', isClock: 'posedge' },
        REN: { direction: 'input' },
        WEN: { direction: 'input' },
        DI: { direction: 'input', width: dataWidth },
        RA: { direction: 'input', width: this.bitWidth(depth - 1n) },
        WA: { direction: 'input', width: this.bitWidth(depth - 1n) },
        MCSRD: { direction: 'input', width: 2 },
        MCSWR: { direction: 'input', width: 2 },
        RET: { direction: 'input', width: 1 },
        ADME: { direction: 'input', width: 3 },
        KCS: { direction: 'input', width: 1 }
      });
  }
}
*/
  /*
  private splitDepth (): void {
    const DOut_Tmp_list: string[] = []
    this.subSrams.forEach(sram => {
      if (sram.type === 'SRAM') {
        const DOut_sub: Sig = this.addSignal(`DOUT_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' })
        const DOut_tmp: Sig = this.addSignal(`DOUT_TMP_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' })
        const REN_sub: Sig = this.addSignal(`REN_${sram.instName.toUpperCase()}`, { width: 1, type: 'wire' })
        const REN_D0_sub: Sig = this.addSignal(`REN_${sram.instName.toUpperCase()}_D0`, { width: 1, type: 'reg' })

        const WEN_sub: Sig = this.addSignal(`WEN_${sram.instName.toUpperCase()}`, { width: 1, type: 'wire' })
        const RA_sub: Sig = this.addSignal(`RA_${sram.instName.toUpperCase()}`, { width: this.bitWidth(sram.depth - 1n), type: 'wire' })
        const WA_sub: Sig = this.addSignal(`WA_${sram.instName.toUpperCase()}`, { width: this.bitWidth(sram.depth - 1n), type: 'wire' })
        const decWidth: number | null = extractNumberFromPattern(sram.en_ptn)
        const raWidth: number = this.bitWidth(this.params.depth - 1n)
        if (decWidth != null && decWidth > 1) {
          this.addAssign({ in: new Expr(`( RA[${raWidth - 1}:${raWidth - decWidth}] != ${sram.en_ptn}) | REN`), out: REN_sub })
          this.addAssign({ in: new Expr(`( WA[${raWidth - 1}:${raWidth - decWidth}] != ${sram.en_ptn}) | WEN`), out: WEN_sub })
        } else if (decWidth != null && decWidth === 1) {
          this.addAssign({ in: new Expr(`( RA[${raWidth - 1}] != ${sram.en_ptn}) | REN`), out: REN_sub })
          this.addAssign({ in: new Expr(`( WA[${raWidth - 1}] != ${sram.en_ptn}) | WEN`), out: WEN_sub })
        } else {
          throw new Error(`Invalid enable pattern for SRAM ${sram.instName}: ${sram.en_ptn}`)
        }
        this.addAssign({ in: new Expr(`RA & ${sram.adr_mask}`), out: RA_sub })
        this.addAssign({ in: new Expr(`WA & ${sram.adr_mask}`), out: WA_sub })
        this.addAssign({ in: new Expr(`${DOut_sub.toString()} & {${sram.width}{${REN_D0_sub.toString()}}}`), out: DOut_tmp })
        this.addRegister({ d: new Expr(`~${REN_sub.toString()}`), clk: 'CK', q: REN_D0_sub })

        DOut_Tmp_list.push(DOut_tmp.toString())

        this.addSubmodule(sram.instName, new Module({
          name: sram.module
        }, this.setupIOs(sram.depth, sram.width, this.params.ports, this.params.writeEnableMask)), { REN: REN_sub, WEN: WEN_sub, RA: RA_sub, WA: WA_sub, DOUT: DOut_sub }, true, true, true)
      }
    })

    this.addAssign({ in: new Expr(`{${DOut_Tmp_list.join(' | ')}}`), out: 'DOUT' })
  }
*/
  private splitDepth (): void {
    const DOut_Tmp_list: string[] = []
    this.subSrams.forEach(sram => {
      if (sram.type === 'SRAM') {
        const DOut_sub: Sig = this.addSignal(`DOUT_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' })
        const DOut_tmp: Sig = this.addSignal(`DOUT_TMP_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' })

        const WEN_sub: Sig = this.addSignal(`WEN_${sram.instName.toUpperCase()}`, { width: 1, type: 'wire' })
        let WA_sub: Sig | null = null
        let A_sub: Sig | null = null
        if ('WA' in this.IOs) {
          WA_sub = this.addSignal(`WA_${sram.instName.toUpperCase()}`, { width: this.bitWidth(sram.depth - 1n), type: 'wire' })
        } else {
          A_sub = this.addSignal(`WA_${sram.instName.toUpperCase()}`, { width: this.bitWidth(sram.depth - 1n), type: 'wire' })
        }

        let REN_sub: Sig | null = null
        let REN_D0_sub: Sig | null = null
        let RA_sub: Sig | null = null
        if ('REN' in this.IOs) {
          REN_sub = this.addSignal(`REN_${sram.instName.toUpperCase()}`, { width: 1, type: 'wire' })
          REN_D0_sub = this.addSignal(`REN_${sram.instName.toUpperCase()}_D0`, { width: 1, type: 'reg' })
          RA_sub = this.addSignal(`RA_${sram.instName.toUpperCase()}`, { width: this.bitWidth(sram.depth - 1n), type: 'wire' })
        }

        const decWidth: number | null = extractNumberFromPattern(sram.en_ptn!)
        const raWidth: number = this.bitWidth(this.params.depth - 1n)

        if (decWidth != null) {
          if (REN_sub) {
            const renExpr = decWidth > 1
              ? `( RA[${raWidth - 1}:${raWidth - decWidth}] != ${sram.en_ptn}) | REN`
              : `( RA[${raWidth - 1}] != ${sram.en_ptn}) | REN`
            this.addAssign({ in: new Expr(renExpr), out: REN_sub })
          }
          if (WA_sub) {
            const wenExpr = decWidth > 1
              ? `( WA[${raWidth - 1}:${raWidth - decWidth}] != ${sram.en_ptn}) | WEN`
              : `( WA[${raWidth - 1}] != ${sram.en_ptn}) | WEN`
            this.addAssign({ in: new Expr(wenExpr), out: WEN_sub })
            this.addAssign({ in: new Expr(`WA & ${sram.adr_mask}`), out: WA_sub })
          } else if (A_sub) {
            const wenExpr = decWidth > 1
              ? `( A[${raWidth - 1}:${raWidth - decWidth}] != ${sram.en_ptn}) | WEN`
              : `( A[${raWidth - 1}] != ${sram.en_ptn}) | WEN`
            this.addAssign({ in: new Expr(wenExpr), out: WEN_sub })
            this.addAssign({ in: new Expr(`A & ${sram.adr_mask}`), out: A_sub })
          } else {
            throw new Error(`Invalid Write Address Signal for ${this.params.ports}`)
          }
        } else {
          throw new Error(`Invalid enable pattern for SRAM ${sram.instName}: ${sram.en_ptn}`)
        }

        if (REN_sub && REN_D0_sub && RA_sub != null) {
          this.addAssign({ in: new Expr(`RA & ${sram.adr_mask}`), out: RA_sub })
          this.addAssign({ in: new Expr(`${DOut_sub.toString()} & {${sram.width}{${REN_D0_sub.toString()}}}`), out: DOut_tmp })
          this.addRegister({ d: new Expr(`~${REN_sub.toString()}`), clk: 'CK' in this.IOs ? 'CK' : 'RCK', q: REN_D0_sub })
          // if ('WCK' in this.IOs) {
          //   this.addRegister({ d: new Expr(`~${WEN_sub.toString()}`), clk: 'WCK', q: WEN_D0_sub })
          // }
        } else {
          this.addAssign({ in: new Expr(DOut_sub.toString()), out: DOut_tmp })
        }

        DOut_Tmp_list.push(DOut_tmp.toString())
        const submoduleInputs: Record<string, Sig | string> = {
          WEN: WEN_sub,
          DOUT: DOut_sub,
          ...(REN_sub && RA_sub !== null
            ? {
                REN: REN_sub,
                RA: RA_sub
              }
            : {})
        }
        if (WA_sub) {
          submoduleInputs.WA = WA_sub
        } else if (A_sub) {
          submoduleInputs.A = A_sub
        }
        this.addSubmodule(
          sram.instName,
          new Module({
            name: sram.module
          }, this.setupIOs(sram.depth, sram.width, this.params.ports, this.params.writeEnableMask)),
          submoduleInputs,
          true, true, true
        )
      }
    })
    this.addAssign({ in: new Expr(`{${DOut_Tmp_list.join(' | ')}}`), out: 'DOUT' })
  }

  private splitWidth (): void {
    const DOut_list: string[] = []
    this.subSrams.forEach(sram => {
      if (sram.type === 'SRAM') {
        const DOut_sub: Sig = this.addSignal(`DOUT_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' })
        const DI_sub: Sig = this.addSignal(`DI_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' })
        let Bwen_sub: Sig | undefined
        if (this.params.writeEnableMask === 'bit') {
          Bwen_sub = this.addSignal(`BWEN_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' })
          this.addAssign({ in: new Expr(`BWEN[${sram.bitBig}:${sram.bitBig - (sram.width - 1)}]`), out: Bwen_sub })
        }

        if (sram.bitBig >= (sram.width - 1)) {
          this.addAssign({ in: new Expr(`DI[${sram.bitBig}:${sram.bitBig - (sram.width - 1)}]`), out: DI_sub })
          DOut_list.push(DOut_sub.toString())
        } else {
          this.addAssign({ in: new Expr(`{DI[${sram.bitBig}:0], ${sram.width - 1 - sram.bitBig}'d0}`), out: DI_sub })
          DOut_list.push(`${DOut_sub.toString()}[${sram.width - 1}:${sram.width - 1 - sram.bitBig}]`)
        }
        if (this.params.writeEnableMask === 'bit' && Bwen_sub) {
          this.addSubmodule(sram.instName, new Module({
            name: sram.module
          }, this.setupIOs(sram.depth, sram.width, this.params.ports, this.params.writeEnableMask)), { DI: DI_sub, DOUT: DOut_sub, BWEN: Bwen_sub }, true, true, true)
        } else {
          this.addSubmodule(sram.instName, new Module({
            name: sram.module
          }, this.setupIOs(sram.depth, sram.width, this.params.ports, this.params.writeEnableMask)), { DI: DI_sub, DOUT: DOut_sub }, true, true, true)
        }
      } else if (sram.type === 'REG') {
        this.genRegInWrapper('WA' in this.IOs ? 'WA' : 'A', 'RA' in this.IOs ? 'RA' : 'A', 'WCK' in this.IOs ? 'WCK' : 'CK', 'RCK' in this.IOs ? 'RCK' : 'CK', { width: sram.width, depth: sram.depth })
        DOut_list.push('DOUT_REG_0')
      }
    }

    )
    this.addAssign({ in: new Expr(`{${DOut_list.join(', ')}}`), out: 'DOUT' })
  }

  private genRegInWrapper (WAorA: string, RAorA: string, WCKorCK: string, RCKorCK: string, sram: { width: number, depth: bigint }): void {
    // 生成Verilog代码
    this.body += `
reg  [${sram.width - 1}:0]      DI_REG_0 [${sram.depth - 1n}:0];
reg  [${sram.width - 1}:0]      DOUT_REG_0;
always @(posedge ${WCKorCK}) begin
    if (~WEN) begin
        DI_REG_0[${WAorA}] <= DI[${sram.width - 1}:0];
    end
end

always @(posedge ${RCKorCK}) begin
    if (~REN) begin
        DOUT_REG_0 <= DI_REG_0[${RAorA}];
    end
end
    `
  }
}

export default SRAM_WRAPPER

// .A    (A   ),
// .CEN  (CEN ),
// .CLK  (CLK ),
// .D    (D   ),
// .GWEN (GWEN),
// .Q    (Q   ),
// .WEN  (WEN )
