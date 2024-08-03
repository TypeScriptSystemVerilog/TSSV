import * as fs from 'fs';
import { Module, Expr } from 'tssv/lib/core/TSSV';
import { SRAM } from 'tssv/lib/modules/SRAM';
function readVerilogFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}
function extractSramModules(verilogCode) {
    const sramModules = [];
    const sramPattern = /module\s+pc_spsram_\d+x\d+[^]*?\(\s+[^]*?endmodule/gs;
    const matches = Array.from(verilogCode.matchAll(sramPattern));
    for (const match of matches) {
        const moduleDeclaration = match[0];
        const moduleNamePattern = /module\s+(pc_spsram_\d+x\d+_?[^;\s]*)/;
        const moduleNameMatch = moduleDeclaration.match(moduleNamePattern);
        const moduleName = moduleNameMatch ? moduleNameMatch[1] : 'Unknown';
        // console.log('Module Declaration:', moduleDeclaration)
        // console.log('Module Name:', moduleName)
        if (!moduleName) {
            console.error('Module name not found in match:', match);
            continue;
        }
        const depthWidthPattern = /pc_spsram_(\d+)x(\d+)/;
        const depthWidthMatch = moduleName.match(depthWidthPattern);
        if (!depthWidthMatch) {
            console.error('Depth and width not found in module name:', moduleName);
            continue;
        }
        const [, depth, dataWidth] = depthWidthMatch;
        const addressWidthPattern = /parameter\s+ADDR_WIDTH\s*=\s*(\d+);/;
        const dataWidthPattern = /parameter\s+DATA_WIDTH\s*=\s*(\d+);/;
        const addressWidthMatch = moduleDeclaration.match(addressWidthPattern);
        const dataWidthMatch = moduleDeclaration.match(dataWidthPattern);
        const sramModule = {
            name: moduleName,
            depth: parseInt(depth, 10),
            dataWidth: parseInt(dataWidthMatch ? dataWidthMatch[1] : dataWidth, 10),
            addressWidth: parseInt(addressWidthMatch ? addressWidthMatch[1] : '0', 10)
            // code: moduleDeclaration.trim()
        };
        sramModules.push(sramModule);
    }
    return sramModules;
}
function removeSramInstances(verilogCode) {
    // Regex pattern to match SRAM module instances
    const sramInstancePattern = /pc_spsram_\d+x\d+_[^;\s]*?\s*\([^]*?endmodule/g;
    // Remove SRAM instances from the Verilog code
    return verilogCode.replace(sramInstancePattern, '');
}
function removeLastCharacter(str) {
    return str.slice(0, -1);
}
function createLibrary(sramModules) {
    // const overall Module = new Module({})
    let libraryCode = '';
    // const sramArray: SRAM[] = []
    // const addrArray: number[] = []
    // const dataArray: number[] = []
    sramModules.forEach((sram, index) => {
        const module = new Module({ name: `${removeLastCharacter(sram.name)}` }, {
            a: { direction: 'input', width: sram.addressWidth },
            cen: { direction: 'input' },
            clk: { direction: 'input', isClock: 'posedge' },
            d: { direction: 'input', width: sram.dataWidth },
            gwen: { direction: 'input' },
            wen: { direction: 'input', width: sram.dataWidth },
            q: { direction: 'output', width: sram.dataWidth }
        });
        const sramM = new SRAM({
            name: 'sram',
            depth: BigInt(sram.depth),
            dataWidth: sram.dataWidth,
            ports: '1rw',
            writeEnableMask: 'bit'
        });
        const writeExpr = new Expr('cen | wen & gwen');
        module.addSignal('we', {});
        module.addAssign({ in: writeExpr, out: 'we' });
        module.addSubmodule('sram', sramM, { clk: 'clk', a_re: 'cen', a_we: 'we', a_data_in: 'd', a_data_out: 'q', a_addr: 'a', a_wmask: 'wen' });
        libraryCode += module.writeSystemVerilog() + '\n';
    });
    return libraryCode;
}
function main() {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('Usage: node extractSram.js <path-to-verilog-file>');
        process.exit(1);
    }
    const filePath = args[0];
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }
    const verilogCode = readVerilogFile(filePath);
    const sramModules = extractSramModules(verilogCode);
    //   sramModules.forEach((sram, index) => {
    //     console.log(`SRAM Module ${index + 1}:\n${sram.code}\n${'='.repeat(40)}\n`)
    //   })
    const sramModulesJson = JSON.stringify(sramModules, null, 2);
    // console.log('SRAM Modules JSON:')
    // console.log(sramModulesJson)
    fs.writeFileSync('/Users/bennettva/TSSV/ts/src/tools/sram_modules.json', sramModulesJson);
    const libString = createLibrary(sramModules);
    fs.writeFileSync('/Users/bennettva/TSSV/ts/src/tools/library.sv', libString);
    const rest = removeSramInstances(verilogCode);
    fs.writeFileSync('/Users/bennettva/TSSV/ts/src/tools/pc_top.v', rest);
}
main();
