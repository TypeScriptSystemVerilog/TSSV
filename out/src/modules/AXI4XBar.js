import TSSV from 'tssv/lib/core/TSSV';
import { inspect } from 'util';
import { exec } from 'child_process';
import { AXI4 } from 'tssv/lib/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
// Function to create a temporary file and write a string to it
function saveStringToTempFile(data) {
    const tempFilePath = path.join(os.tmpdir(), `tempfile-${Date.now()}.txt`);
    fs.writeFileSync(tempFilePath, data);
    return tempFilePath;
}
export class AXI4XBar extends TSSV.Module {
    constructor(params) {
        super(params);
        this.IOs = {
            clock: { direction: 'input', isClock: 'posedge' },
            reset: { direction: 'input', isReset: 'highsync' }
        };
        console.log(inspect(params, { depth: null, colors: true }));
        const innerParams = {
            ...params,
            moduleName: `${params.name}_inner`
        };
        const jsonFile = saveStringToTempFile(TSSV.serialize(innerParams, undefined, ''));
        console.log('Generating AXI4XBar component using rocketdock container...');
        exec(`cat ${jsonFile};third-party/rocket-chip-component-gen/gen_rocket_component.sh AXI4XBar ${jsonFile}; rm ${jsonFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${inspect(error, { depth: null, colors: true })}`);
                return;
            }
            console.error(`stderr: ${stderr}`);
            console.log(`stdout: ${stdout}`);
        });
        const bindings = {
            "clock": "clock",
            "reset": "reset"
        };
        for (const m of this.params.masters) {
            const thisMaster = this.addInterface(m.name, new AXI4({
                AWID_WIDTH: params.idBits,
                WID_WIDTH: params.idBits,
                BID_WIDTH: params.idBits,
                ARID_WIDTH: params.idBits,
                RID_WIDTH: params.idBits,
                ADDR_WIDTH: params.addrBits,
                DATA_WIDTH: (params.beatBytes << 3),
                BURST_LEN_WIDTH: 4, // FIXME
                USER_WIDTH: 0,
                RESP_WIDTH: 2, // FIXME
                QOS: 'withQOS'
            }, 'inward'));
            for (const port in thisMaster.signals) {
                const regex = /^(AW|W|AR|R|B)(.*)$/;
                const match = port.match(regex);
                if (match) {
                    let prefix = match[1].toLowerCase();
                    const base = match[2].toLowerCase();
                    if ((base !== 'valid') && (base !== 'ready')) {
                        prefix += '_bits';
                    }
                    bindings[`${m.name}_${prefix}_${base}`] = `${m.name}.${port}`;
                }
            }
        }
        for (const s of this.params.slaves) {
            const thisSlave = this.addInterface(s.name, new AXI4({
                AWID_WIDTH: params.idBits,
                WID_WIDTH: params.idBits,
                BID_WIDTH: params.idBits,
                ARID_WIDTH: params.idBits,
                RID_WIDTH: params.idBits,
                ADDR_WIDTH: params.addrBits,
                DATA_WIDTH: (params.beatBytes << 3),
                BURST_LEN_WIDTH: 4, // FIXME
                USER_WIDTH: 0,
                RESP_WIDTH: 2, // FIXME
                QOS: 'withQOS'
            }, 'outward'));
            for (const port in thisSlave.signals) {
                const regex = /^(AW|W|AR|R|B)(.*)$/;
                const match = port.match(regex);
                if (match) {
                    let prefix = match[1].toLowerCase();
                    const base = match[2].toLowerCase();
                    if ((base !== 'valid') && (base !== 'ready')) {
                        prefix += '_bits';
                    }
                    bindings[`${s.name}_${prefix}_${base}`] = `${s.name}.${port}`;
                }
            }
        }
        this.addSystemVerilogSubmodule('inner', `third-party/rocket-chip-component-gen/componentgen/compile.dest/${innerParams.moduleName}.sv`, {}, bindings, true);
    }
}
