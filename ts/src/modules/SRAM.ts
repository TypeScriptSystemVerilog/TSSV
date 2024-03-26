import {Module, TSSVParameters, IntRange} from 'tssv/lib/core/TSSV'


/**
 * configuration parameters of the SRAM module
 */
export interface SRAM_Parameters extends TSSVParameters {
    /**
     * bit width of SRAM data
     */
    dataWidth: IntRange<1,256> 
    /**
     * number of data words in the SRAM
     */
    depth: bigint
    /**
     * SRAM port configuration
     */
    ports: '1rw' | '1r_1w' | '2rw' 
    /**
     * select write enable mask control among 'none', 'bit', 'byte'
     * defaults to 'none'
     */
    writeEnableMask?: 'none' | 'bit' | 'byte'
    /**
     * define the behavior of the read data when writing during the same clock cycle
     * defaults to 'undefOnWrite' meaning the read data bus will be undefined after
     * writes until the next read. This gives the maximum flexibility for selecting
     * underlying SRAM macros and should be used in all cases unless the surrounding
     * logic requires simultaneous read of existing value and write of a new value
     * in the same clock cycle
     */
    readBehavior?:  'undefOnWrite' | 'readBeforeWrite'
    /**
     * macroConfig is a free form string parameter that allows selection of technology
     * specific SRAM macro generator parameters such as high-speed, high-density,
     * mux configuration,  leakage selection, etc.
     * This parameter has no influence on the behavior of the SRAM behavioral model and
     * is meant only to choose macro generation settings that effect the size, speed, and 
     * power performance of the resulting macro
     * 
     * TSSV will only write out an SRAM library of behavioral models for each SRAM for the 
     * purpose of simulation and FPGA implementation. The user should run a separate SRAM
     * library generation tool for the ASIC target technology to create the necessary
     * ASIC view SRAM library for the design   
     */
    macroConfig?: string
    
}


export class SRAM extends Module {
    declare params: SRAM_Parameters
    constructor(params: SRAM_Parameters) {            
        super({
            // define the default parameter values
            dataWidth: params.dataWidth,
            depth: params.depth,
            ports: params.ports,
            writeEnableMask: params.writeEnableMask || 'none',
            readBehavior:  params.readBehavior || 'undefOnWrite',
            macroConfig: params.macroConfig || 'default'
        })

        // define IO signals
        switch (this.params.ports) {
            case '1rw':
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: this.params.dataWidth },
                    a_data_out: { direction: 'output', width: this.params.dataWidth }
                }
                if (this.params.writeEnableMask == 'bit') {
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth }
                } else if (this.params.writeEnableMask == 'byte') {
                    if ((this.params.dataWidth % 8) != 0) throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask')
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth / 8 }
                }
                break;
            case '2rw':
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: this.params.dataWidth },
                    a_data_out: { direction: 'output', width: this.params.dataWidth },
                    b_re: { direction: 'input' },
                    b_we: { direction: 'input' },
                    b_data_in: { direction: 'input', width: this.params.dataWidth },
                    b_data_out: { direction: 'output', width: this.params.dataWidth }
                }
                if (this.params.writeEnableMask == 'bit') {
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth }
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth }
                } else if (this.params.writeEnableMask == 'byte') {
                    if ((this.params.dataWidth % 8) != 0) throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask')
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth / 8 }
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth / 8 }
                }
                break;
            case '1r_1w':
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_data_out: { direction: 'output', width: this.params.dataWidth },
                    b_we: { direction: 'input' },
                    b_data_in: { direction: 'input', width: this.params.dataWidth }
                }
                if (this.params.writeEnableMask == 'bit') {
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth }
                } else if (this.params.writeEnableMask == 'byte') {
                    if ((this.params.dataWidth % 8) != 0) throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask')
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth / 8 }
                }
                break;
        }

        this.body += "FIXME!!!!!!!"
        
    }
}
