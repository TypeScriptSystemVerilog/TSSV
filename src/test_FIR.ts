import {FIR, FIR_Parameters} from './FIR'

let myFir = new FIR({name: 'myFIR', numTaps: 4, coefficients: [1n, 2n, 3n, 4n]})
console.log('Example #1\n\n')
console.log(myFir.writeSystemVerilog())

let myFir2 = new FIR({numTaps: 5, coefficients: [2n, -2n, 4n, -4n, 8n]})
console.log('\n\n\nExample #2\n\n')
console.log(myFir2.writeSystemVerilog())
