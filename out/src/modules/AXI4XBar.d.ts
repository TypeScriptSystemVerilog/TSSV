import TSSV from 'tssv/lib/core/TSSV';
import { type AXI4_inward, type AXI4_outward } from 'tssv/lib/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4';
export interface AXI4XBarParams extends TSSV.TSSVParameters {
    masters: Array<{
        name: string;
        id: [number, number];
    }>;
    beatBytes: 4 | 8 | 16 | 32 | 64 | 128;
    addrBits: TSSV.IntRange<16, 64>;
    idBits: TSSV.IntRange<1, 16>;
    slaves: Array<{
        name: string;
        address: {
            base: bigint;
            mask: bigint;
        };
        transferSizesWrite: [number, number];
        transferSizesRead: [number, number];
    }>;
}
export interface AXI4XBarPorts extends TSSV.IOSignals {
    clock: {
        direction: 'input';
        isClock: 'posedge';
    };
    reset: {
        direction: 'input';
        isReset: 'highsync';
    };
}
export type AXI4XBarInterfaces = Record<string, AXI4_inward | AXI4_outward>;
export declare class AXI4XBar extends TSSV.Module {
    params: AXI4XBarParams;
    IOs: AXI4XBarPorts;
    interfaces: AXI4XBarInterfaces;
    constructor(params: AXI4XBarParams);
}
