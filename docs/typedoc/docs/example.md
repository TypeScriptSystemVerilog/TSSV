# Simple FIR Filter Example
### Implementation
```typescript
import {Module, TSSVParameters, IntRange, Sig, Expr} from 'tssv/lib/core/TSSV'


/**
 * configuration parameters of the FIR module
 */
export interface FIR_Parameters extends TSSVParameters {
    /**
     * Array containing the coefficients of the FIR filter
     */
    coefficients: Array<bigint>
    /**
     * bit width of the FIR input data
     */
    inWidth?:   IntRange<1,32> 
    /**
     * bit width of the FIR output data
     * @remarks result will be saturated or ign extended as needed
     */
    outWidth?:  IntRange<1,32> 
    /**
     * right to apply to the FIR result to scale down the output
     */
    rShift?:    IntRange<0,32>
}


export class FIR extends Module {
    declare params: FIR_Parameters
    constructor(params: FIR_Parameters) {            
        super({
            // define the default parameter values
            name: params.name,
            coefficients: params.coefficients,
            inWidth: params.inWidth || 8,
            outWidth: params.outWidth || 9,
            rShift: params.rShift || 2
        })

        // define IO signals
        this.IOs = {
            clk:      { direction: 'input', isClock: 'posedge' },
            rst_b:    { direction: 'input', isReset: 'lowasync'},
            en:       { direction: 'input', },
            data_in:  { direction: 'input', width: this.params.inWidth, isSigned: true },
            data_out: { direction: 'output', width: this.params.outWidth, isSigned: true }            
        }
        
        // construct logic
        let nextTapIn:Sig = new Sig("data_in")
        const products: Sig[] = []
        let coeffSum = 0;
        for(let i = 0; i < this.params.coefficients.length; i++) {
            // construct tap delay line
            const thisTap = this.addSignal(`tap_${i}`, { width:this.params.inWidth, isSigned: true})
            this.addRegister({d:nextTapIn, clk:'clk', reset:'rst_b', en:'en', q:thisTap})

            // construct tap multipliers
            products.push(this.addMultiplier({a:thisTap, b:this.params.coefficients[i]}))
            coeffSum += Math.abs(Number(this.params.coefficients[i]))

            nextTapIn = thisTap
        }

        // construct final vector sum
        const sumWidth = (this.params.inWidth||0) + this.bitWidth(coeffSum)
        const productsExt = products.map((p) => `${sumWidth}'(${p})`)
        this.addSignal('sum', { width: sumWidth,  isSigned: true })
        this.addRegister({
            d: new Expr(`${productsExt.join(' + ')}`),
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'sum'
        })

        // round and saturate to final output
        this.addSignal('rounded',{ width: sumWidth - (this.params.rShift||0) + 1,  isSigned: true })
        this.addRound({in: 'sum', out:'rounded', rShift:this.params.rShift||1})
        this.addSignal('saturated',{ width: this.params.outWidth,  isSigned: true })
        this.addSaturate({in:'rounded', out:'saturated'})
        this.addRegister({
            d: 'saturated',
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'data_out'
        })

    }
}

```
### Test Program
```typescript
import { FIR } from 'tssv/lib/modules/FIR'
import { writeFileSync } from 'fs';

const myFir = new FIR({name: 'myFIR', numTaps: 4, coefficients: [1n, 2n, 3n, 4n]})
try {
  writeFileSync('sv-examples/test_FIR_output/myFIR.sv', myFir.writeSystemVerilog());
} catch (err) {
  console.error(err);
}

const myFir2 = new FIR({numTaps: 5, coefficients: [2n, -2n, 4n, -4n, 8n]})
try {
  writeFileSync(`sv-examples/test_FIR_output/${myFir2.name}.sv`, myFir2.writeSystemVerilog());
} catch (err) {
  console.error(err);
}

const myFir3 = new FIR({name: 'myFIR3', numTaps: 10, inWidth: 6, outWidth: 10, coefficients: [1n,-2n,3n,-4n,5n,-6n,7n,-8n,9n,-10n], rShift: 3})
try {
  writeFileSync('sv-examples/test_FIR_output/myFIR3.sv', myFir3.writeSystemVerilog());
} catch (err) {
  console.error(err);
}
```
### Generated SystemVerilog
#### Example 1
```systemverilog

        

        
/* verilator lint_off WIDTH */        
module myFIR 
   (
   input logic  clk,
   input logic  rst_b,
   input logic  en,
   input logic signed [7:0] data_in,
   output logic signed [8:0] data_out
   );

   logic signed [7:0] tap_0;
   logic signed [8:0] prod_tap_0x1d1;
   logic signed [7:0] tap_1;
   logic signed [9:0] prod_tap_1x2d2;
   logic signed [7:0] tap_2;
   logic signed [9:0] prod_tap_2x2d3;
   logic signed [7:0] tap_3;
   logic signed [10:0] prod_tap_3x3d4;
   logic signed [11:0] sum;
   logic signed [10:0] rounded;
   logic signed [8:0] saturated;

   assign prod_tap_0x1d1 = tap_0 * 1'd1;
   assign prod_tap_1x2d2 = tap_1 * 2'd2;
   assign prod_tap_2x2d3 = tap_2 * 2'd3;
   assign prod_tap_3x3d4 = tap_3 * 3'd4;
   assign rounded = 11'((sum + (12'd1<<(2-1)))>>>2);
   assign saturated = (rounded > 11'sd255) ? 9'sd255 :
                       ((rounded < -11'sd256) ? -9'sd256 : 9'(rounded));

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           tap_2 <= 'd0;
           tap_3 <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           tap_0 <= data_in;
           tap_1 <= tap_0;
           tap_2 <= tap_1;
           tap_3 <= tap_2;
           sum <= 12'(prod_tap_0x1d1) + 12'(prod_tap_1x2d2) + 12'(prod_tap_2x2d3) + 12'(prod_tap_3x3d4);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        
```
#### Example 2
```systemverilog

        

        
/* verilator lint_off WIDTH */        
module FIR_1pmlbrs_8_9_2 
   (
   input logic  clk,
   input logic  rst_b,
   input logic  en,
   input logic signed [7:0] data_in,
   output logic signed [8:0] data_out
   );

   logic signed [7:0] tap_0;
   logic signed [9:0] prod_tap_0x2d2;
   logic signed [7:0] tap_1;
   logic signed [9:0] prod_tap_1xm2sd2;
   logic signed [7:0] tap_2;
   logic signed [10:0] prod_tap_2x3d4;
   logic signed [7:0] tap_3;
   logic signed [10:0] prod_tap_3xm3sd4;
   logic signed [7:0] tap_4;
   logic signed [11:0] prod_tap_4x4d8;
   logic signed [12:0] sum;
   logic signed [11:0] rounded;
   logic signed [8:0] saturated;

   assign prod_tap_0x2d2 = tap_0 * 2'd2;
   assign prod_tap_1xm2sd2 = tap_1 * -2'sd2;
   assign prod_tap_2x3d4 = tap_2 * 3'd4;
   assign prod_tap_3xm3sd4 = tap_3 * -3'sd4;
   assign prod_tap_4x4d8 = tap_4 * 4'd8;
   assign rounded = 12'((sum + (13'd1<<(2-1)))>>>2);
   assign saturated = (rounded > 12'sd255) ? 9'sd255 :
                       ((rounded < -12'sd256) ? -9'sd256 : 9'(rounded));

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           tap_2 <= 'd0;
           tap_3 <= 'd0;
           tap_4 <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           tap_0 <= data_in;
           tap_1 <= tap_0;
           tap_2 <= tap_1;
           tap_3 <= tap_2;
           tap_4 <= tap_3;
           sum <= 13'(prod_tap_0x2d2) + 13'(prod_tap_1xm2sd2) + 13'(prod_tap_2x3d4) + 13'(prod_tap_3xm3sd4) + 13'(prod_tap_4x4d8);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        
```
#### Example 3
```systemverilog

        

        
/* verilator lint_off WIDTH */        
module myFIR3 
   (
   input logic  clk,
   input logic  rst_b,
   input logic  en,
   input logic signed [5:0] data_in,
   output logic signed [9:0] data_out
   );

   logic signed [5:0] tap_0;
   logic signed [6:0] prod_tap_0x1d1;
   logic signed [5:0] tap_1;
   logic signed [7:0] prod_tap_1xm2sd2;
   logic signed [5:0] tap_2;
   logic signed [7:0] prod_tap_2x2d3;
   logic signed [5:0] tap_3;
   logic signed [8:0] prod_tap_3xm3sd4;
   logic signed [5:0] tap_4;
   logic signed [8:0] prod_tap_4x3d5;
   logic signed [5:0] tap_5;
   logic signed [9:0] prod_tap_5xm4sd6;
   logic signed [5:0] tap_6;
   logic signed [8:0] prod_tap_6x3d7;
   logic signed [5:0] tap_7;
   logic signed [9:0] prod_tap_7xm4sd8;
   logic signed [5:0] tap_8;
   logic signed [9:0] prod_tap_8x4d9;
   logic signed [5:0] tap_9;
   logic signed [10:0] prod_tap_9xm5sd10;
   logic signed [11:0] sum;
   logic signed [9:0] rounded;
   logic signed [9:0] saturated;

   assign prod_tap_0x1d1 = tap_0 * 1'd1;
   assign prod_tap_1xm2sd2 = tap_1 * -2'sd2;
   assign prod_tap_2x2d3 = tap_2 * 2'd3;
   assign prod_tap_3xm3sd4 = tap_3 * -3'sd4;
   assign prod_tap_4x3d5 = tap_4 * 3'd5;
   assign prod_tap_5xm4sd6 = tap_5 * -4'sd6;
   assign prod_tap_6x3d7 = tap_6 * 3'd7;
   assign prod_tap_7xm4sd8 = tap_7 * -4'sd8;
   assign prod_tap_8x4d9 = tap_8 * 4'd9;
   assign prod_tap_9xm5sd10 = tap_9 * -5'sd10;
   assign rounded = 10'((sum + (12'd1<<(3-1)))>>>3);
   assign saturated = (rounded > 10'sd511) ? 10'sd511 :
                       ((rounded < -10'sd512) ? -10'sd512 : 10'(rounded));

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           tap_2 <= 'd0;
           tap_3 <= 'd0;
           tap_4 <= 'd0;
           tap_5 <= 'd0;
           tap_6 <= 'd0;
           tap_7 <= 'd0;
           tap_8 <= 'd0;
           tap_9 <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           tap_0 <= data_in;
           tap_1 <= tap_0;
           tap_2 <= tap_1;
           tap_3 <= tap_2;
           tap_4 <= tap_3;
           tap_5 <= tap_4;
           tap_6 <= tap_5;
           tap_7 <= tap_6;
           tap_8 <= tap_7;
           tap_9 <= tap_8;
           sum <= 12'(prod_tap_0x1d1) + 12'(prod_tap_1xm2sd2) + 12'(prod_tap_2x2d3) + 12'(prod_tap_3xm3sd4) + 12'(prod_tap_4x3d5) + 12'(prod_tap_5xm4sd6) + 12'(prod_tap_6x3d7) + 12'(prod_tap_7xm4sd8) + 12'(prod_tap_8x4d9) + 12'(prod_tap_9xm5sd10);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        
```
