# TSSV  (TypeScript SystemVerilog)

**DISCLAIMER:  This work is currently a demonstration and  not ready for production HDL development yet!**

TSSV is a meta-HDL language written in TypeScript for creating highly parameterized and configurable synthesizable
SystemVerilog components improving productivity of hardware designers. It is intended to serve a similar role as
Chisel(Scala) but has a focus on trying to have a design paradigm and syntax that will be more familar to a
hardware design engineer familar with SystemVerilog.


### Run the demo  (FIR Module)

Prerequite:  A modern version of NodeJS installed  (perhaps v18 or greater)

```bash
$ git clone https://github.com/avonancken/TSSV.git
$ cd TSSV
$ npm install
$ npx tsc
$ node out/test_FIR.js
```

### The Implementation of the example simple FIR Filter module

```typescript
import {Module, TSSVParameters, IntRange, Sig, Expr} from './TSSV'

// define the parameters of the FIR module
export interface FIR_Parameters extends TSSVParameters {
    coefficients: Array<bigint>
    numTaps?:   IntRange<1,100>
    inWidth?:   IntRange<1,32> 
    outWidth?:  IntRange<1,32> 
    rShift?:    IntRange<0,32>
}

export class FIR extends Module {
    declare params: FIR_Parameters
    constructor(params: FIR_Parameters) {            
        super({
            // define the default parameter values
            name: params.name,
            coefficients: params.coefficients,
            numTaps: params.numTaps || 10,
            inWidth: params.inWidth || 8,
            outWidth: params.outWidth || 9,
            rShift: params.rShift || 2
        })

        // define IO signals
        this.IOs = {
            clk:      { type: 'input', isClock: 'posedge' },
            rst_b:    { type: 'input', isReset: 'lowasync'},
            en:       { type: 'input', },
            data_in:  { type: 'input', width: this.params.inWidth, isSigned: true },
            data_out: { type: 'output', width: this.params.outWidth, isSigned: true }            
        }
        
        // construct logic
        let nextTapIn:Sig = new Sig("data_in")
        let products: Sig[] = []
        let coeffSum = 0;
        for(var i = 0; i < (this.params.numTaps||0); i++) {
            // construct tap delay line
            const thisTap = this.addSignal(`tap_${i}`, {type:'reg', width:this.params.inWidth, isSigned: true})
            this.addRegister({d:nextTapIn, clk:'clk', reset:'rst_b', en:'en'})

            // construct tap multipliers
            products.push(this.addMultiplier({a:thisTap, b:this.params.coefficients[i]}))
            coeffSum += Math.abs(Number(this.params.coefficients[i]))

            nextTapIn = thisTap
        }

        // construct final vector sum
        const sumWidth = (this.params.inWidth||0) + this.bitWidth(coeffSum)
        this.addSignal('sum', { type: 'reg', width: sumWidth,  isSigned: true })
        this.addRegister({
            d: new Expr(`${products.join(' + ')}`),
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'sum'
        })

        // round and saturate to final output
        this.addSignal('rounded',{ type: 'wire', width: sumWidth - (this.params.rShift||0) + 1,  isSigned: true })
        this.addRound({in: 'sum', out:'rounded', rShift:this.params.rShift||1})
        this.addSignal('saturated',{ type: 'wire', width: this.params.outWidth,  isSigned: true })
        this.addSaturate({in:'sum', out:'saturated'})
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

### The test program to use the example FIR filter module to generate 3 example SystemVerilog FIR filter modules

```typescript
import {FIR, FIR_Parameters} from './FIR'

let myFir = new FIR({name: 'myFIR', numTaps: 4, coefficients: [1n, 2n, 3n, 4n]})
console.log('Example #1\n\n')
console.log(myFir.writeSystemVerilog())

let myFir2 = new FIR({numTaps: 5, coefficients: [2n, -2n, 4n, -4n, 8n]})
console.log('\n\n\nExample #2\n\n')
console.log(myFir2.writeSystemVerilog())

let myFir3 = new FIR({name: 'myFIR3', numTaps: 10, inWidth: 6, outWidth: 10, coefficients: [1n,-2n,3n,-4n,5n,-6n,7n,-8n,9n,-10n], rShift: 3})
console.log('\n\n\nExample #3\n\n')
console.log(myFir3.writeSystemVerilog())
```

### The output of the test program  (3 SystemVerilog FIR filter modules)
#### Example #1
```verilog
module myFIR 
   (
   input  clk,
   input  rst_b,
   input  en,
   input signed [7:0] data_in,
   output reg signed [8:0] data_out
   )

   reg signed [7:0] tap_0;
   reg signed [7:0] data_in_q;
   wire signed [8:0] prod_tap_0x1d1;
   reg signed [7:0] tap_1;
   reg signed [7:0] tap_0_q;
   wire signed [9:0] prod_tap_1x2d2;
   reg signed [7:0] tap_2;
   reg signed [7:0] tap_1_q;
   wire signed [9:0] prod_tap_2x2d3;
   reg signed [7:0] tap_3;
   reg signed [7:0] tap_2_q;
   wire signed [10:0] prod_tap_3x3d4;
   reg signed [11:0] sum;
   wire signed [10:0] rounded;
   wire signed [8:0] saturated;

   assign prod_tap_0x1d1 = tap_0 * 1'd1;
   assign prod_tap_1x2d2 = tap_1 * 2'd2;
   assign prod_tap_2x2d3 = tap_2 * 2'd3;
   assign prod_tap_3x3d4 = tap_3 * 3'd4;
   assign rounded = (sum + (1'd1<<(2-1)))>>>2;
   assign saturated = (sum > 9'sd255) ? 9'sd255 :
                       ((sum < -9'sd256) ? -9'sd256 : sum);

   always @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           data_in_q <= 'd0;
           tap_0_q <= 'd0;
           tap_1_q <= 'd0;
           tap_2_q <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           data_in_q <= data_in;
           tap_0_q <= tap_0;
           tap_1_q <= tap_1;
           tap_2_q <= tap_2;
           sum <= prod_tap_0x1d1 + prod_tap_1x2d2 + prod_tap_2x2d3 + prod_tap_3x3d4;
           data_out <= saturated;
        end


endmodule
```

#### Example #2
```verilog
module FIR_1pmlbrs_5_8_9_2 
   (
   input  clk,
   input  rst_b,
   input  en,
   input signed [7:0] data_in,
   output reg signed [8:0] data_out
   )

   reg signed [7:0] tap_0;
   reg signed [7:0] data_in_q;
   wire signed [9:0] prod_tap_0x2d2;
   reg signed [7:0] tap_1;
   reg signed [7:0] tap_0_q;
   wire signed [9:0] prod_tap_1xm2sd2;
   reg signed [7:0] tap_2;
   reg signed [7:0] tap_1_q;
   wire signed [10:0] prod_tap_2x3d4;
   reg signed [7:0] tap_3;
   reg signed [7:0] tap_2_q;
   wire signed [10:0] prod_tap_3xm3sd4;
   reg signed [7:0] tap_4;
   reg signed [7:0] tap_3_q;
   wire signed [11:0] prod_tap_4x4d8;
   reg signed [12:0] sum;
   wire signed [11:0] rounded;
   wire signed [8:0] saturated;

   assign prod_tap_0x2d2 = tap_0 * 2'd2;
   assign prod_tap_1xm2sd2 = tap_1 * -2'sd2;
   assign prod_tap_2x3d4 = tap_2 * 3'd4;
   assign prod_tap_3xm3sd4 = tap_3 * -3'sd4;
   assign prod_tap_4x4d8 = tap_4 * 4'd8;
   assign rounded = (sum + (1'd1<<(2-1)))>>>2;
   assign saturated = (sum > 9'sd255) ? 9'sd255 :
                       ((sum < -9'sd256) ? -9'sd256 : sum);

   always @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           data_in_q <= 'd0;
           tap_0_q <= 'd0;
           tap_1_q <= 'd0;
           tap_2_q <= 'd0;
           tap_3_q <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           data_in_q <= data_in;
           tap_0_q <= tap_0;
           tap_1_q <= tap_1;
           tap_2_q <= tap_2;
           tap_3_q <= tap_3;
           sum <= prod_tap_0x2d2 + prod_tap_1xm2sd2 + prod_tap_2x3d4 + prod_tap_3xm3sd4 + prod_tap_4x4d8;
           data_out <= saturated;
        end


endmodule
```

#### Example #3
```verilog
module myFIR3 
   (
   input  clk,
   input  rst_b,
   input  en,
   input signed [5:0] data_in,
   output reg signed [9:0] data_out
   )

   reg signed [5:0] tap_0;
   reg signed [5:0] data_in_q;
   wire signed [6:0] prod_tap_0x1d1;
   reg signed [5:0] tap_1;
   reg signed [5:0] tap_0_q;
   wire signed [7:0] prod_tap_1xm2sd2;
   reg signed [5:0] tap_2;
   reg signed [5:0] tap_1_q;
   wire signed [7:0] prod_tap_2x2d3;
   reg signed [5:0] tap_3;
   reg signed [5:0] tap_2_q;
   wire signed [8:0] prod_tap_3xm3sd4;
   reg signed [5:0] tap_4;
   reg signed [5:0] tap_3_q;
   wire signed [8:0] prod_tap_4x3d5;
   reg signed [5:0] tap_5;
   reg signed [5:0] tap_4_q;
   wire signed [9:0] prod_tap_5xm4sd6;
   reg signed [5:0] tap_6;
   reg signed [5:0] tap_5_q;
   wire signed [8:0] prod_tap_6x3d7;
   reg signed [5:0] tap_7;
   reg signed [5:0] tap_6_q;
   wire signed [9:0] prod_tap_7xm4sd8;
   reg signed [5:0] tap_8;
   reg signed [5:0] tap_7_q;
   wire signed [9:0] prod_tap_8x4d9;
   reg signed [5:0] tap_9;
   reg signed [5:0] tap_8_q;
   wire signed [10:0] prod_tap_9xm5sd10;
   reg signed [11:0] sum;
   wire signed [9:0] rounded;
   wire signed [9:0] saturated;

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
   assign rounded = (sum + (1'd1<<(3-1)))>>>3;
   assign saturated = (sum > 10'sd511) ? 10'sd511 :
                       ((sum < -10'sd512) ? -10'sd512 : sum);

   always @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           data_in_q <= 'd0;
           tap_0_q <= 'd0;
           tap_1_q <= 'd0;
           tap_2_q <= 'd0;
           tap_3_q <= 'd0;
           tap_4_q <= 'd0;
           tap_5_q <= 'd0;
           tap_6_q <= 'd0;
           tap_7_q <= 'd0;
           tap_8_q <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           data_in_q <= data_in;
           tap_0_q <= tap_0;
           tap_1_q <= tap_1;
           tap_2_q <= tap_2;
           tap_3_q <= tap_3;
           tap_4_q <= tap_4;
           tap_5_q <= tap_5;
           tap_6_q <= tap_6;
           tap_7_q <= tap_7;
           tap_8_q <= tap_8;
           sum <= prod_tap_0x1d1 + prod_tap_1xm2sd2 + prod_tap_2x2d3 + prod_tap_3xm3sd4 + prod_tap_4x3d5 + prod_tap_5xm4sd6 + prod_tap_6x3d7 + prod_tap_7xm4sd8 + prod_tap_8x4d9 + prod_tap_9xm5sd10;
           data_out <= saturated;
        end


endmodule

```

### Next Steps
- implement addAssign()
- implement addCombinationalAlways()
- implement addSeqentialAlways()
- implement addMux()
- implement submodule instantiation and binding
- implement standard interfaces and signal bundles
- implement Control Register generator
- Decide approach to Bus fabrics and standardized interconnect
