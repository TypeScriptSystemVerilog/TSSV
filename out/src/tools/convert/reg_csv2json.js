import * as fs from 'fs';
const csvFilePath = process.argv[2];
const regMapFilePath = process.argv[3];
const registersFilePath = process.argv[4];
if (!csvFilePath || !regMapFilePath || !registersFilePath) {
    console.error('Please provide the paths for CSV file, regMap JSON file, and registers JSON file.');
    process.exit(1);
}
const WORD_SIZE = 32;
async function parseCSV(csvFilePath) {
    return await new Promise((resolve, reject) => {
        fs.readFile(csvFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const rows = data.split('\n').map(row => row.trim().split(','));
            resolve(rows);
        });
    });
}
function parseBitRange(bitRange) {
    if (bitRange.includes(':')) {
        const parts = bitRange.split(':').map(part => parseInt(part.trim(), 10));
        return [parts[0], parts[1]];
    }
    else {
        const singleValue = parseInt(bitRange.trim(), 10);
        return [singleValue, singleValue];
    }
}
async function generateRegMapAndRegs() {
    const rows = await parseCSV(csvFilePath);
    const regMapEntries = [];
    const registers = {};
    let currentBlockName = '';
    let curBlkOffset = '';
    let curRegName = '';
    for (let i = 1; i < rows.length; i++) {
        const [blockName, blockOffset, registerName, regOffset, type, repeat, description, field, bitRange, accessType, reset, , fieldDescription] = rows[i];
        if (blockName) {
            currentBlockName = blockName;
            curBlkOffset = blockOffset;
            continue;
        }
        if (registerName) {
            const startAddr = parseInt(curBlkOffset, 16) + parseInt(regOffset, 16);
            const startAddrHex = '0x' + startAddr.toString(16);
            regMapEntries.push([registerName, startAddrHex]);
            curRegName = registerName;
            if (!registers[curRegName]) {
                registers[curRegName] = {
                    type,
                    startAddr: startAddrHex,
                    repeat: repeat || 1,
                    description: description || `Description for ${curRegName}`
                };
            }
            continue;
        }
        if (field) {
            if (!registers[curRegName].fields) {
                registers[curRegName].fields = {};
            }
            registers[curRegName].fields[field] = {
                bitRange: bitRange ? parseBitRange(bitRange) : undefined,
                reset: reset ? BigInt(reset) : undefined,
                fieldDescription: fieldDescription || `Description for ${field}`
            };
        }
    }
    fs.writeFileSync(regMapFilePath, JSON.stringify(regMapEntries, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2));
    fs.writeFileSync(registersFilePath, JSON.stringify(registers, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2));
}
generateRegMapAndRegs().catch(console.error);
