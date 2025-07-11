import { fileURLToPath } from 'url';
import * as fs from 'fs';
import { dirname } from 'path';
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
const registersFilePath = process.argv[2];
const outputSvFilePath = process.argv[3];
const outputJsonFilePath = process.argv[4];
if (!registersFilePath || !outputSvFilePath || !outputJsonFilePath) {
    console.error('Please provide the paths for registers JSON file, SV output file, and JSON output file.');
    process.exit(1);
}
const WORD_SIZE = 32;
const BITS_OF_BYTE = 8;
const AIGC_DEMO_regs = JSON.parse(fs.readFileSync(registersFilePath, 'utf8'));
const svFile = fs.createWriteStream(outputSvFilePath);
const pkgName = path.basename(outputSvFilePath, path.extname(outputSvFilePath));
svFile.write(`package ${pkgName};

`);
svFile.write('// =============================================================================\n');
svFile.write('// Generated Register Block 1.0\n');
svFile.write(`// Commit ID: ${commitId}\n`);
svFile.write('// =============================================================================\n\n');
const AIGC_DEMO_regs_wofields = {};
function padZeroes(address, width) {
    const padLength = width - address.length;
    if (padLength <= 0)
        return address;
    return '0'.repeat(padLength) + address;
}
function genPackedCalReset(registerName, register) {
    const fields = register.fields;
    let result = 'typedef struct packed {\n';
    const sortedFields = Object.entries(fields).sort((a, b) => b[1].bitRange[0] - a[1].bitRange[0]);
    let resCount = -1;
    let lastBit = WORD_SIZE;
    sortedFields.forEach(([name, field], index) => {
        const [msb, lsb] = field.bitRange;
        if (lastBit > msb + 1) {
            resCount++;
        }
        lastBit = lsb;
    });
    lastBit = WORD_SIZE;
    let reset = '';
    let fieldBinStr = '';
    let resBinStr = '';
    sortedFields.forEach(([name, field], index) => {
        const [msb, lsb] = field.bitRange;
        if (lastBit > msb + 1) {
            result += `  logic [${lastBit - msb - 2}:0] res_${resCount--};\n`;
            resBinStr = '0'.repeat(lastBit - msb - 1);
            reset += resBinStr;
        }
        fieldBinStr = padZeroes(Number(field.reset).toString(2), msb - lsb + 1);
        reset += fieldBinStr;
        if (msb === lsb) {
            result += `  logic ${name};\n`;
        }
        else {
            result += `  logic [${msb - lsb}: 0] ${name};\n`;
        }
        lastBit = lsb;
    });
    if (lastBit > 0) {
        result += `  logic [${lastBit}:0] res_${resCount--};\n`;
    }
    result += `} ${registerName}_t;\n`;
    register.reset = `0x${padZeroes(parseInt(reset, 2).toString(16).toUpperCase(), 8)}`;
    return result;
}
function generateAllStructs(registers) {
    let result = '';
    for (const [registerName, register] of Object.entries(registers)) {
        result += genPackedCalReset(registerName, register);
        result += '\n';
    }
    Object.keys(registers).forEach(key => {
        let { startAddr, repeat, fields, ...rest } = registers[key];
        const registerStartAddr = parseInt(startAddr, 16);
        const packName = `${key}_t`;
        if (repeat && repeat > 1) {
            for (let i = 0; i < repeat; i++) {
                const newRegisterName = `${key}_${i}`;
                startAddr = `0x${(registerStartAddr + i * WORD_SIZE / BITS_OF_BYTE).toString(16)}`;
                AIGC_DEMO_regs_wofields[newRegisterName] = { startAddr, packName, ...rest };
            }
        }
        else {
            AIGC_DEMO_regs_wofields[key] = { startAddr, packName, ...rest };
        }
    });
    return result;
}
const structsCode = generateAllStructs(AIGC_DEMO_regs);
svFile.write(structsCode, 'utf8', () => {
    svFile.write(`endpackage : ${pkgName}\n`);
    svFile.end(() => {
        console.log(`SystemVerilog package written successfully to: ${outputSvFilePath}`);
    });
});
fs.writeFileSync(outputJsonFilePath, JSON.stringify(AIGC_DEMO_regs_wofields, null, 2));
console.log(`Updated JSON with reset values written to: ${outputJsonFilePath}`);
