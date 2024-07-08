import TSSV from 'tssv/lib/core/TSSV';
import { AXI4XBar } from 'tssv/lib/modules/AXI4XBar';
import { writeFileSync } from 'fs';
console.log('testAXI4XBar');
const test_1 = new AXI4XBar({
    name: 'AXI4XBar2x4',
    masters: [
        {
            name: 'master1',
            id: [0, 1]
        },
        {
            name: 'master2',
            id: [2, 3]
        }
    ],
    beatBytes: 16,
    addrBits: 48,
    idBits: 8,
    slaves: [
        {
            name: 'slave1',
            address: {
                base: 0x00000000n,
                mask: 0x0fffffffn
            },
            transferSizesWrite: [1, 128],
            transferSizesRead: [1, 128]
        },
        {
            name: 'slave2',
            address: {
                base: 0x10000000n,
                mask: 0x0fffffffn
            },
            transferSizesWrite: [1, 128],
            transferSizesRead: [1, 128]
        },
        {
            name: 'slave3',
            address: {
                base: 0x20000000n,
                mask: 0x0fffffffn
            },
            transferSizesWrite: [1, 128],
            transferSizesRead: [1, 128]
        },
        {
            name: 'slave4',
            address: {
                base: 0x30000000n,
                mask: 0x0fffffffn
            },
            transferSizesWrite: [1, 128],
            transferSizesRead: [1, 128]
        }
    ]
});
const tb_testRegBlock = new TSSV.Module({ name: 'tb_AXI4XBar' });
tb_testRegBlock.addSubmodule('dut', test_1, {}, true, true);
try {
    writeFileSync('sv-examples/tb_AXI4XBar.sv', tb_testRegBlock.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
