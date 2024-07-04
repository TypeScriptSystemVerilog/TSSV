import * as base from 'tssv/lib/core/Base';
import * as registers from 'tssv/lib/core/Registers';
export * from 'tssv/lib/core/Base';
export * from 'tssv/lib/core/Registers';
/*
export namespace TSSV {

  export type IntRange<
        START extends number,
        END extends number,
        ARR extends unknown[] = [],
        ACC extends number = never> = ARR['length'] extends END
          ? ACC | START | END
          : IntRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR['length']>

  export interface TSSVParameters extends ModuleLib.TSSVParameters {}
  export type IOSignals = ModuleLib.IOSignals
  export class Sig extends ModuleLib.Sig {}
  export type ExprParams = ModuleLib.ExprParams
  export class Expr extends ModuleLib.Expr {}
  export class Interface extends ModuleLib.Interface {}
  export class Module extends ModuleLib.Module {}

  export class RegAddr extends RegistersLib.RegAddr {}
  export interface RegisterBlockDef<T> extends RegistersLib.RegisterBlockDef<T> {}
  export interface RegisterBlockParameters extends RegistersLib.RegisterBlockParameters {}
  export class RegisterBlock<T> extends RegistersLib.RegisterBlock<T> {}

}
*/
export const TSSV = {
    base,
    registers
};
export default TSSV;
