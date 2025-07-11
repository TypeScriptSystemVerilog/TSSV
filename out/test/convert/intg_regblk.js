import { RegisterBlock } from 'tssv/lib/core/Registers';
import * as fs from 'fs';
const WORD_SIZE = 32;
function parseRegisterData(regsPath) {
    return JSON.parse(fs.readFileSync(regsPath, 'utf8'));
}
function createRegisterMap(regs) {
    return Object.entries(regs).reduce((acc, [regName, regDetails]) => {
        acc[regName] = BigInt(regDetails.startAddr);
        return acc;
    }, {});
}
function createRegisters(regs) {
    return Object.entries(regs).reduce((acc, [regName, regData]) => {
        acc[regName] = {
            type: regData.type,
            reset: BigInt(regData.reset),
            description: regData.description
        };
        return acc;
    }, {});
}
function modifySignalTypes(content, wordSize) {
    const dynamicPattern = new RegExp(`^logic\\s+\\[${wordSize - 1}:0\\]\\s+(reg_[a-z0-9][a-z0-9_]*)\\s*`);
    return content
        .split('\n')
        .map(line => {
        const trimmedLine = line.trim();
        const match = trimmedLine.match(dynamicPattern);
        if (match) {
            const signalName = match[1];
            return trimmedLine.replace(dynamicPattern, `${signalName}_t ${signalName};`);
        }
        return trimmedLine;
    })
        .join('\n');
}
function generateVerilog(testRegBlock, outputSvFilePath) {
    const rawVerilog = testRegBlock.writeSystemVerilog();
    let adjustedVerilog = modifySignalTypes(rawVerilog, WORD_SIZE);
    const importStatement = `import ${testRegBlock.name}_pkg::*;`;
    adjustedVerilog = `${importStatement}

// =============================================================================
// Register module
// =============================================================================
${adjustedVerilog} : ${testRegBlock.name}_pkg
`;
    fs.writeFileSync(outputSvFilePath, adjustedVerilog);
}
function main() {
    const regsPath = process.argv[2];
    const outputSvFilePath = process.argv[3];
    const regs = parseRegisterData(regsPath);
    const myRegMap = createRegisterMap(regs);
    const registers = createRegisters(regs);
    const myRegs = {
        wordSize: WORD_SIZE,
        addrMap: myRegMap,
        registers
    };
    const testRegBlock = new RegisterBlock({
        name: 'AIGC_DEMO_reg',
        busAddressWidth: 12
    }, myRegs, {});
    try {
        generateVerilog(testRegBlock, outputSvFilePath);
        console.log(`Verilog file generated successfully: ${outputSvFilePath}`);
    }
    catch (err) {
        console.error('Error generating Verilog file:', err);
    }
}
main();
