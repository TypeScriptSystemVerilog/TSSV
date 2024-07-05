import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UL level
 */
export class TL_UL extends Interface {
    /**
           * create a new TileLink interface bundle with either producer or responder port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or responder port interface
           * or just a bundle of interconnect wires
           */
    constructor(params, role = undefined) {
        super('TL_UL', {
            w: params.w || 4,
            a: params.a || 32,
            z: params.z || 2,
            o: params.o || 8,
            i: params.i || 8
        }, role);
        this.signals =
            {
                // a channel
                a_opcode: { width: 3 },
                a_param: { width: 3 },
                a_size: { width: this.params.z },
                a_source: { width: this.params.o },
                a_address: { width: this.params.a },
                a_mask: { width: this.params.w },
                a_data: { width: (this.params.w || 4) * 8 },
                a_corrupt: { width: 1 },
                a_valid: { width: 1 },
                a_ready: { width: 1 },
                // d channel
                d_opcode: { width: 3 },
                d_param: { width: 2 },
                d_size: { width: this.params.z },
                d_source: { width: this.params.o },
                d_sink: { width: this.params.i },
                d_denied: { width: 1 },
                d_data: { width: (this.params.w || 4) * 8 },
                d_corrupt: { width: 1 },
                d_valid: { width: 1 },
                d_ready: { width: 1 }
            };
        this.modports = {
            requester: {
                // a channel
                a_opcode: 'output',
                a_param: 'output',
                a_size: 'output',
                a_source: 'output',
                a_address: 'output',
                a_mask: 'output',
                a_data: 'output',
                a_corrupt: 'output',
                a_valid: 'output',
                a_ready: 'input',
                // d channel
                d_opcode: 'input',
                d_param: 'input',
                d_size: 'input',
                d_source: 'input',
                d_sink: 'input',
                d_denied: 'input',
                d_data: 'input',
                d_corrupt: 'input',
                d_valid: 'input',
                d_ready: 'output'
            }
        };
        this.modports.responder = Object.fromEntries(Object.entries(this.modports.requester).map(([key, value]) => [key, (value === 'input') ? 'output' : 'input']));
    }
}
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UH level
 */
export class TL_UH extends Interface {
    /**
           * create a new TileLink interface bundle with either producer or responder port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or responder port interface
           * or just a bundle of interconnect wires
           */
    constructor(params, role = undefined) {
        super('TL_UH', {
            w: params.w || 4,
            a: params.a || 32,
            z: params.z || 2,
            o: params.o || 8,
            i: params.i || 8
        }, role);
        this.signals =
            {
                // a channel
                a_opcode: { width: 3 },
                a_param: { width: 3 },
                a_size: { width: this.params.z },
                a_source: { width: this.params.o },
                a_address: { width: this.params.a },
                a_mask: { width: this.params.w },
                a_data: { width: (this.params.w || 4) * 8 },
                a_corrupt: { width: 1 },
                a_valid: { width: 1 },
                a_ready: { width: 1 },
                // d channel
                d_opcode: { width: 3 },
                d_param: { width: 2 },
                d_size: { width: this.params.z },
                d_source: { width: this.params.o },
                d_sink: { width: this.params.i },
                d_denied: { width: 1 },
                d_data: { width: (this.params.w || 4) * 8 },
                d_corrupt: { width: 1 },
                d_valid: { width: 1 },
                d_ready: { width: 1 }
            };
        this.modports = {
            requester: {
                // a channel
                a_opcode: 'output',
                a_param: 'output',
                a_size: 'output',
                a_source: 'output',
                a_address: 'output',
                a_mask: 'output',
                a_data: 'output',
                a_corrupt: 'output',
                a_valid: 'output',
                a_ready: 'input',
                // d channel
                d_opcode: 'input',
                d_param: 'input',
                d_size: 'input',
                d_source: 'input',
                d_sink: 'input',
                d_denied: 'input',
                d_data: 'input',
                d_corrupt: 'input',
                d_valid: 'input',
                d_ready: 'output'
            }
        };
        this.modports.responder = Object.fromEntries(Object.entries(this.modports.requester).map(([key, value]) => [key, (value === 'input') ? 'output' : 'input']));
    }
}
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UL level
 */
export class TL_C extends Interface {
    /**
           * create a new TileLink interface bundle with either producer or responder port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or responder port interface
           * or just a bundle of interconnect wires
           */
    constructor(params, role = undefined) {
        super('TL_UL', {
            w: params.w || 4,
            a: params.a || 32,
            z: params.z || 2,
            o: params.o || 8,
            i: params.i || 8
        }, role);
        this.signals =
            {
                // a channel
                a_opcode: { width: 3 },
                a_param: { width: 3 },
                a_size: { width: this.params.z },
                a_source: { width: this.params.o },
                a_address: { width: this.params.a },
                a_mask: { width: this.params.w },
                a_data: { width: (this.params.w || 4) * 8 },
                a_corrupt: { width: 1 },
                a_valid: { width: 1 },
                a_ready: { width: 1 },
                // d channel
                d_opcode: { width: 3 },
                d_param: { width: 2 },
                d_size: { width: this.params.z },
                d_source: { width: this.params.o },
                d_sink: { width: this.params.i },
                d_denied: { width: 1 },
                d_data: { width: (this.params.w || 4) * 8 },
                d_corrupt: { width: 1 },
                d_valid: { width: 1 },
                d_ready: { width: 1 },
                // b channel
                b_opcode: { width: 3 },
                b_param: { width: 3 },
                b_size: { width: this.params.z },
                b_source: { width: this.params.o },
                b_address: { width: this.params.a },
                b_mask: { width: this.params.w },
                b_data: { width: (this.params.w || 4) * 8 },
                b_corrupt: { width: 1 },
                b_valid: { width: 1 },
                b_ready: { width: 1 },
                // c channel
                c_opcode: { width: 3 },
                c_param: { width: 3 },
                c_size: { width: this.params.z },
                c_source: { width: this.params.o },
                c_address: { width: this.params.a },
                c_data: { width: (this.params.w || 4) * 8 },
                c_corrupt: { width: 1 },
                c_valid: { width: 1 },
                c_ready: { width: 1 },
                // e channel
                e_sink: { width: this.params.i },
                e_valid: { width: 1 },
                e_ready: { width: 1 }
            };
        this.modports = {
            requester: {
                // a channel
                a_opcode: 'output',
                a_param: 'output',
                a_size: 'output',
                a_source: 'output',
                a_address: 'output',
                a_mask: 'output',
                a_data: 'output',
                a_corrupt: 'output',
                a_valid: 'output',
                a_ready: 'input',
                // d channel
                d_opcode: 'input',
                d_param: 'input',
                d_size: 'input',
                d_source: 'input',
                d_sink: 'input',
                d_denied: 'input',
                d_data: 'input',
                d_corrupt: 'input',
                d_valid: 'input',
                d_ready: 'output',
                // b channel
                b_opcode: 'output',
                b_param: 'output',
                b_size: 'output',
                b_source: 'output',
                b_address: 'output',
                b_mask: 'output',
                b_data: 'output',
                b_corrupt: 'output',
                b_valid: 'output',
                b_ready: 'input',
                // c channel
                c_opcode: 'output',
                c_param: 'output',
                c_size: 'output',
                c_source: 'output',
                c_address: 'output',
                c_data: 'output',
                c_corrupt: 'output',
                c_valid: 'output',
                c_ready: 'input',
                // e channel
                e_sink: 'input',
                e_valid: 'input',
                e_ready: 'output'
            }
        };
        this.modports.responder = Object.fromEntries(Object.entries(this.modports.requester).map(([key, value]) => [key, (value === 'input') ? 'output' : 'input']));
    }
}
