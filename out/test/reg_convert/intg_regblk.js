import { RegisterBlock } from 'tssv/lib/core/Registers';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
const __dirname = dirname(fileURLToPath(import.meta.url));
const getCommitId = () => {
    try {
      const tssvDir = __dirname;
      return execSync('git rev-parse HEAD', { cwd: tssvDir }).toString().trim();
    } catch (err) {
      console.error('Failed to get Git commit ID:', err.message);
      return 'unknown_commit';
    }
};
const commitId = getCommitId();

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
function modifySignalTypes(content, wordSize, regs) {
    // const dynamicPattern = new RegExp(
    //   `^logic\\s+\\[${wordSize - 1}:0\\]\\s+(reg_[a-z0-9][a-z0-9_]*)\\s*`
    // )
    return content
        .split('\n')
        .map(line => {
        const trimmedLine = line.trim();
        if (!(trimmedLine.includes('reg_wdata') || trimmedLine.includes('*reg_rdata*'))) {
            for (const [key, reg] of Object.entries(regs)) {
                const keyPattern = `reg_${key.toLowerCase()};`;
                if (trimmedLine.includes(keyPattern)) {
                    return trimmedLine.replace(`logic [${wordSize - 1}:0]`, reg.packName);
                }
            }
        }
        return trimmedLine;
    })
        .join('\n');
}
function generateSVerilog(testRegBlock, outputSvFilePath, regs) {
    const rawVerilog = testRegBlock.writeSystemVerilog();
    let adjustedVerilog = modifySignalTypes(rawVerilog, WORD_SIZE, regs);
    const importStatement = `import ${testRegBlock.name}_pkg::*;`;
    adjustedVerilog = `${importStatement}

// =============================================================================
// Generated Register Block 1.0
// =============================================================================

// Commit ID: ${commitId}
` +
        adjustedVerilog + ` : ${testRegBlock.name}
`;
    fs.writeFileSync(outputSvFilePath, adjustedVerilog);
}
function generateVerilog(testRegBlock, outVFilePath) {
    let rawVerilog = testRegBlock.writeVerilog();
    const importStatement = `import ${testRegBlock.name}_pkg::*;`;
    rawVerilog = `${importStatement}

// =============================================================================
// Generated Register Block 1.0
// =============================================================================
${rawVerilog} : ${testRegBlock.name}
`;
    fs.writeFileSync(outVFilePath, rawVerilog);
}
function main() {
    const regsPath = process.argv[2];
    const outputSvFilePath = process.argv[3];
    const busAddrW = process.argv[4];
    const regName = path.basename(outputSvFilePath, path.extname(outputSvFilePath));

    const outVFilePath = outputSvFilePath.replace('.sv', '.v');
    const regs = parseRegisterData(regsPath);
    const myRegMap = createRegisterMap(regs);
    const registers = createRegisters(regs);

    const myRegs = {
        wordSize: WORD_SIZE,
        addrMap: myRegMap,
        registers
    };
    const testRegBlock = new RegisterBlock({
        name: regName,
        busAddressWidth: busAddrW
    }, myRegs, {});
    
    const testRegBlockV = new RegisterBlock({
        name: regName,
        busAddressWidth: busAddrW
    }, myRegs, {});
    try {
        generateSVerilog(testRegBlock, outputSvFilePath, regs);
        generateVerilog(testRegBlockV, outVFilePath);
        console.log(`SystemVerilog file generated successfully: ${outputSvFilePath}`);
        console.log(`Verilog file generated successfully: ${outVFilePath}`);
    }
    catch (err) {
        console.error('Error generating Verilog file:', err);
    }
}
main();
