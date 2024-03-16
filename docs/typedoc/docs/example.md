<h1 id="simple-fir-filter-example">Simple FIR Filter Example</h1>
<h3 id="implementation">Implementation</h3>
<pre><code class="lang-typescript">import {Module, TSSVParameters, IntRange, Sig, Expr} from &#39;TSSV/lib/core/TSSV&#39;


/**
 * configuration parameters of the FIR module
 */
export interface FIR_Parameters extends TSSVParameters {
    /**
     * Array containing the coefficients of the FIR filter
     */
    coefficients: Array&lt;bigint&gt;
    /**
     * bit width of the FIR input data
     */
    inWidth?:   IntRange&lt;1,32&gt; 
    /**
     * bit width of the FIR output data
     * @remarks result will be saturated or ign extended as needed
     */
    outWidth?:  IntRange&lt;1,32&gt; 
    /**
     * right to apply to the FIR result to scale down the output
     */
    rShift?:    IntRange&lt;0,32&gt;
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
            clk:      { direction: &#39;input&#39;, isClock: &#39;posedge&#39; },
            rst_b:    { direction: &#39;input&#39;, isReset: &#39;lowasync&#39;},
            en:       { direction: &#39;input&#39;, },
            data_in:  { direction: &#39;input&#39;, width: this.params.inWidth, isSigned: true },
            data_out: { direction: &#39;output&#39;, width: this.params.outWidth, isSigned: true }            
        }

        // construct logic
        let nextTapIn:Sig = new Sig(&quot;data_in&quot;)
        const products: Sig[] = []
        let coeffSum = 0;
        for(let i = 0; i &lt; this.params.coefficients.length; i++) {
            // construct tap delay line
            const thisTap = this.addSignal(`tap_${i}`, { width:this.params.inWidth, isSigned: true})
            this.addRegister({d:nextTapIn, clk:&#39;clk&#39;, reset:&#39;rst_b&#39;, en:&#39;en&#39;, q:thisTap})

            // construct tap multipliers
            products.push(this.addMultiplier({a:thisTap, b:this.params.coefficients[i]}))
            coeffSum += Math.abs(Number(this.params.coefficients[i]))

            nextTapIn = thisTap
        }

        // construct final vector sum
        const sumWidth = (this.params.inWidth||0) + this.bitWidth(coeffSum)
        const productsExt = products.map((p) =&gt; `${sumWidth}&#39;(${p})`)
        this.addSignal(&#39;sum&#39;, { width: sumWidth,  isSigned: true })
        this.addRegister({
            d: new Expr(`${productsExt.join(&#39; + &#39;)}`),
            clk: &#39;clk&#39;,
            reset: &#39;rst_b&#39;,
            en: &#39;en&#39;,
            q: &#39;sum&#39;
        })

        // round and saturate to final output
        this.addSignal(&#39;rounded&#39;,{ width: sumWidth - (this.params.rShift||0) + 1,  isSigned: true })
        this.addRound({in: &#39;sum&#39;, out:&#39;rounded&#39;, rShift:this.params.rShift||1})
        this.addSignal(&#39;saturated&#39;,{ width: this.params.outWidth,  isSigned: true })
        this.addSaturate({in:&#39;rounded&#39;, out:&#39;saturated&#39;})
        this.addRegister({
            d: &#39;saturated&#39;,
            clk: &#39;clk&#39;,
            reset: &#39;rst_b&#39;,
            en: &#39;en&#39;,
            q: &#39;data_out&#39;
        })

    }
}

</code></pre>
<h3 id="test-program">Test Program</h3>
<pre><code class="lang-typescript">import { FIR } from &#39;TSSV/lib/modules/FIR&#39;
import { writeFileSync } from &#39;fs&#39;;

const myFir = new FIR({name: &#39;myFIR&#39;, numTaps: 4, coefficients: [1n, 2n, 3n, 4n]})
try {
  writeFileSync(&#39;sv-examples/test_FIR_output/myFIR.sv&#39;, myFir.writeSystemVerilog());
} catch (err) {
  console.error(err);
}

const myFir2 = new FIR({numTaps: 5, coefficients: [2n, -2n, 4n, -4n, 8n]})
try {
  writeFileSync(`sv-examples/test_FIR_output/${myFir2.name}.sv`, myFir2.writeSystemVerilog());
} catch (err) {
  console.error(err);
}

const myFir3 = new FIR({name: &#39;myFIR3&#39;, numTaps: 10, inWidth: 6, outWidth: 10, coefficients: [1n,-2n,3n,-4n,5n,-6n,7n,-8n,9n,-10n], rShift: 3})
try {
  writeFileSync(&#39;sv-examples/test_FIR_output/myFIR3.sv&#39;, myFir3.writeSystemVerilog());
} catch (err) {
  console.error(err);
}
</code></pre>
<h3 id="generated-systemverilog">Generated SystemVerilog</h3>
<h4 id="example-1">Example 1</h4>
<pre><code class="lang-systemverilog">



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

   assign prod_tap_0x1d1 = tap_0 * 1&#39;d1;
   assign prod_tap_1x2d2 = tap_1 * 2&#39;d2;
   assign prod_tap_2x2d3 = tap_2 * 2&#39;d3;
   assign prod_tap_3x3d4 = tap_3 * 3&#39;d4;
   assign rounded = 11&#39;((sum + (12&#39;d1&lt;&lt;(2-1)))&gt;&gt;&gt;2);
   assign saturated = (rounded &gt; 11&#39;sd255) ? 9&#39;sd255 :
                       ((rounded &lt; -11&#39;sd256) ? -9&#39;sd256 : 9&#39;(rounded));

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 &lt;= &#39;d0;
           tap_1 &lt;= &#39;d0;
           tap_2 &lt;= &#39;d0;
           tap_3 &lt;= &#39;d0;
           sum &lt;= &#39;d0;
           data_out &lt;= &#39;d0;
        end
      else if(en)
        begin
           tap_0 &lt;= data_in;
           tap_1 &lt;= tap_0;
           tap_2 &lt;= tap_1;
           tap_3 &lt;= tap_2;
           sum &lt;= 12&#39;(prod_tap_0x1d1) + 12&#39;(prod_tap_1x2d2) + 12&#39;(prod_tap_2x2d3) + 12&#39;(prod_tap_3x3d4);
           data_out &lt;= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        
</code></pre>
<h4 id="example-2">Example 2</h4>
<pre><code class="lang-systemverilog">



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

   assign prod_tap_0x2d2 = tap_0 * 2&#39;d2;
   assign prod_tap_1xm2sd2 = tap_1 * -2&#39;sd2;
   assign prod_tap_2x3d4 = tap_2 * 3&#39;d4;
   assign prod_tap_3xm3sd4 = tap_3 * -3&#39;sd4;
   assign prod_tap_4x4d8 = tap_4 * 4&#39;d8;
   assign rounded = 12&#39;((sum + (13&#39;d1&lt;&lt;(2-1)))&gt;&gt;&gt;2);
   assign saturated = (rounded &gt; 12&#39;sd255) ? 9&#39;sd255 :
                       ((rounded &lt; -12&#39;sd256) ? -9&#39;sd256 : 9&#39;(rounded));

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 &lt;= &#39;d0;
           tap_1 &lt;= &#39;d0;
           tap_2 &lt;= &#39;d0;
           tap_3 &lt;= &#39;d0;
           tap_4 &lt;= &#39;d0;
           sum &lt;= &#39;d0;
           data_out &lt;= &#39;d0;
        end
      else if(en)
        begin
           tap_0 &lt;= data_in;
           tap_1 &lt;= tap_0;
           tap_2 &lt;= tap_1;
           tap_3 &lt;= tap_2;
           tap_4 &lt;= tap_3;
           sum &lt;= 13&#39;(prod_tap_0x2d2) + 13&#39;(prod_tap_1xm2sd2) + 13&#39;(prod_tap_2x3d4) + 13&#39;(prod_tap_3xm3sd4) + 13&#39;(prod_tap_4x4d8);
           data_out &lt;= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        
</code></pre>
<h4 id="example-3">Example 3</h4>
<pre><code class="lang-systemverilog">



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

   assign prod_tap_0x1d1 = tap_0 * 1&#39;d1;
   assign prod_tap_1xm2sd2 = tap_1 * -2&#39;sd2;
   assign prod_tap_2x2d3 = tap_2 * 2&#39;d3;
   assign prod_tap_3xm3sd4 = tap_3 * -3&#39;sd4;
   assign prod_tap_4x3d5 = tap_4 * 3&#39;d5;
   assign prod_tap_5xm4sd6 = tap_5 * -4&#39;sd6;
   assign prod_tap_6x3d7 = tap_6 * 3&#39;d7;
   assign prod_tap_7xm4sd8 = tap_7 * -4&#39;sd8;
   assign prod_tap_8x4d9 = tap_8 * 4&#39;d9;
   assign prod_tap_9xm5sd10 = tap_9 * -5&#39;sd10;
   assign rounded = 10&#39;((sum + (12&#39;d1&lt;&lt;(3-1)))&gt;&gt;&gt;3);
   assign saturated = (rounded &gt; 10&#39;sd511) ? 10&#39;sd511 :
                       ((rounded &lt; -10&#39;sd512) ? -10&#39;sd512 : 10&#39;(rounded));

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 &lt;= &#39;d0;
           tap_1 &lt;= &#39;d0;
           tap_2 &lt;= &#39;d0;
           tap_3 &lt;= &#39;d0;
           tap_4 &lt;= &#39;d0;
           tap_5 &lt;= &#39;d0;
           tap_6 &lt;= &#39;d0;
           tap_7 &lt;= &#39;d0;
           tap_8 &lt;= &#39;d0;
           tap_9 &lt;= &#39;d0;
           sum &lt;= &#39;d0;
           data_out &lt;= &#39;d0;
        end
      else if(en)
        begin
           tap_0 &lt;= data_in;
           tap_1 &lt;= tap_0;
           tap_2 &lt;= tap_1;
           tap_3 &lt;= tap_2;
           tap_4 &lt;= tap_3;
           tap_5 &lt;= tap_4;
           tap_6 &lt;= tap_5;
           tap_7 &lt;= tap_6;
           tap_8 &lt;= tap_7;
           tap_9 &lt;= tap_8;
           sum &lt;= 12&#39;(prod_tap_0x1d1) + 12&#39;(prod_tap_1xm2sd2) + 12&#39;(prod_tap_2x2d3) + 12&#39;(prod_tap_3xm3sd4) + 12&#39;(prod_tap_4x3d5) + 12&#39;(prod_tap_5xm4sd6) + 12&#39;(prod_tap_6x3d7) + 12&#39;(prod_tap_7xm4sd8) + 12&#39;(prod_tap_8x4d9) + 12&#39;(prod_tap_9xm5sd10);
           data_out &lt;= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        
</code></pre>
