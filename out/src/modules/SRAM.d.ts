import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
/**
 * configuration parameters of the SRAM module
 */
export interface SRAM_Parameters extends TSSVParameters {
    /**
       * bit width of SRAM data
       */
    dataWidth: IntRange<1, 256>;
    /**
       * number of data words in the SRAM
       */
    depth: bigint;
    /**
       * SRAM port configuration
       */
    ports: '1rw' | '1r_1w' | '2rw';
    /**
       * select write enable mask control among 'none', 'bit', 'byte'
       * defaults to 'none'
       */
    writeEnableMask?: 'none' | 'bit' | 'byte';
    /**
       * define the behavior of the read data when writing during the same clock cycle
       * defaults to 'undefOnWrite' meaning the read data bus will be undefined after
       * writes until the next read. This gives the maximum flexibility for selecting
       * underlying SRAM macros and should be used in all cases unless the surrounding
       * logic requires simultaneous read of existing value and write of a new value
       * in the same clock cycle
       */
    readBehavior?: 'undefOnWrite' | 'readBeforeWrite';
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
    macroConfig?: string;
}
/**
 * Static Random Access Memory (SRAM) module
 * supports FPGA inference with generated behavioral model SRAM library
 * ASIC macro library can be swapped in for ASIC synthesis/implemenation
 */
export declare class SRAM extends Module {
    params: SRAM_Parameters;
    constructor(params: SRAM_Parameters);
}
