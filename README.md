# TSSV  (TypeScript SystemVerilog)

**DISCLAIMER:  This work is currently a demonstration and  not ready for production HDL development yet!**

TSSV is a meta-HDL language written in TypeScript for creating highly parameterized and configurable synthesizable
SystemVerilog components improving productivity of hardware designers. It is intended to serve a similar role as
Chisel(Scala) but has a focus on trying to have a design paradigm and syntax that will be more familiar to a
hardware design engineer familiar with SystemVerilog.


### Run the demo  (FIR Module)

Prerequite:  A modern version of NodeJS installed  (perhaps v18 or greater)

For MacBook M1/M2/M3 NodeJS installation: see link
https://dev.to/themodernpk/install-node-on-macos-m1-274d

For Ubuntu 22.04 NodeJS installation:
```bash
$ curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ sudo apt install nodejs
$ node -v
```


```bash
$ git clone https://github.com/avonancken/TSSV.git
$ cd TSSV
$ npm install
$ npx tsc
$ node out/test/test_FIR.js
```
### Run ESLint
Run ESlint to for additional code quality checks beyond the type checking specified by Typescript.
```bash
$ cd ~/TSSV
$ npx eslint .
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
            this.addRegister({d:nextTapIn, clk:'clk', reset:'rst_b', en:'en', q:thisTap})

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


### Next Steps
- implement addCombinationalAlways()
- implement addSeqentialAlways()
- implement addMemory()
- implement submodule instantiation and binding
- implement standard interfaces and signal bundles
- implement Control Register generator
- Decide approach to Bus fabrics and standardized interconnect
