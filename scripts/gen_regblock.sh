#!/usr/bin/env bash
# gen_regblock.sh — Generate a TSSV RegisterBlock stub from a YAML definition.
#
# Usage:
#   ./scripts/gen_regblock.sh <path-to-regblock.yaml>
#
# Writes regs-<name>.ts next to the input YAML file.
#
# Dependencies:
#   node     — Node.js runtime (already required by this project)
#   js-yaml  — already present in node_modules (no extra install needed)

set -euo pipefail

if ! command -v node &>/dev/null; then
  echo "Error: 'node' is required but not installed." >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <regblock.yaml>" >&2
  exit 1
fi

YAML_FILE="$1"

if [[ ! -f "$YAML_FILE" ]]; then
  echo "Error: file not found: $YAML_FILE" >&2
  exit 1
fi

# Resolve paths so node can find project node_modules regardless of CWD
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
YAML_DIR="$(cd "$(dirname "$YAML_FILE")" && pwd)"
YAML_BASE="$(basename "$YAML_FILE" .yaml)"
ABS_YAML="$YAML_DIR/$(basename "$YAML_FILE")"
OUT_FILE="$YAML_DIR/regs-${YAML_BASE}.ts"

node --input-type=commonjs << NODEEOF
'use strict';
const path    = require('path');
const fs      = require('fs');
const yaml    = require(path.join('$PROJECT_ROOT', 'node_modules', 'js-yaml'));

const def = yaml.load(fs.readFileSync('$ABS_YAML', 'utf8'));

// ── helpers ──────────────────────────────────────────────────────────────────

const name      = def.name      ?? 'regBlock';
const wordSize  = def.wordSize  ?? 32;
const busIface  = def.busInterface ?? 'Memory';
const addrWidth = def.busAddressWidth ?? 32;
const regs      = def.registers ?? {};

const hexDigits = wordSize === 64 ? 16 : 8;

function normHex(s) {
  if (s == null) return null;
  let n = BigInt(String(s));
  if (n < 0n) {
    const bits = BigInt(hexDigits * 4);
    n = ((n % (1n << bits)) + (1n << bits)) % (1n << bits);
  }
  return '0x' + n.toString(16).toUpperCase().padStart(hexDigits, '0');
}

// Signed bigint literal: -1n for negatives, 0x...n for non-negatives
function resetLit(s) {
  const n = BigInt(String(s));
  return n < 0n ? n.toString() + 'n' : (normHex(s) ?? n.toString()) + 'n';
}

function pad(s, w) { return String(s ?? '').padEnd(w); }

function mdTable(header, rows) {
  const widths = header.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length))
  );
  const sep = widths.map(w => '-'.repeat(w));
  const fmt = row => '| ' + widths.map((w, i) => pad(row[i], w)).join(' | ') + ' |';
  return [fmt(header), fmt(sep), ...rows.map(fmt)].join('\n * ');
}

// ── repeatedRegister path (factory function) ─────────────────────────────────

if (def.repeatedRegister) {
  const rr         = def.repeatedRegister;
  const prefix     = rr.namePrefix    ?? 'REG_';
  const countParam = rr.countParam    ?? 'count';
  const stride     = rr.addressStride ?? wordSize / 8;
  const typ        = rr.type          ?? 'RW';
  const isSigned   = rr.isSigned      ?? false;
  const width      = rr.width         ?? wordSize;
  const desc       = rr.description   ?? '';
  const funcName   = 'create' + name.charAt(0).toUpperCase() + name.slice(1) + 'Def';

  const templateRow = [
    prefix + '{i}',
    '0x' + '0'.repeat(hexDigits - 1) + ' + i*' + stride,
    typ,
    String(width),
    desc.replace('{i}', '{i}')
  ];
  const templateTable = mdTable(
    ['Register', 'Address', 'Type', 'Width', 'Description'],
    [templateRow]
  );

  const ifaceImport = busIface === 'TL_UL'
    ? "import { TL_UL } from 'tssv/lib/interfaces/AMBA/TL_UL'"
    : "import { Memory } from 'tssv/lib/interfaces/Memory'";

  const jsdocLines = [
    '/**',
    ' * Register Block Factory: ' + name,
    ' *',
    ' * Generates one register per ' + countParam + '. Template (repeated \`' + countParam + '\` times):',
    ' *',
    ' * ' + templateTable,
    ' *',
    ' * @param ' + countParam + '   Number of registers to generate',
    ' * @param resetValues  Optional reset value per register (defaults to 0n)',
    ' */'
  ].join('\n');

  const signedLine = isSigned ? '\n      isSigned: true,' : '';
  const descTemplate = desc.replace('{i}', '\' + i + \'');

  // Build the factory function using string concatenation throughout
  // (avoids backtick template literals which would conflict with the bash heredoc)
  const retType = 'RegisterBlockDef<Record<string, bigint>>';
  const factoryFn =
    'export function ' + funcName + ' (' + countParam + ': number, resetValues?: bigint[]): { addrMap: Record<string, bigint>, def: ' + retType + ' } {\n' +
    '  const addrMap: Record<string, bigint> = {}\n' +
    '  const registers: RegisterBlockDef<Record<string, bigint>>[\'registers\'] = {}\n' +
    '  for (let i = 0; i < ' + countParam + '; i++) {\n' +
    '    const regName = \'' + prefix + '\' + i\n' +
    '    addrMap[regName] = BigInt(i * ' + stride + ')\n' +
    '    registers[regName] = {\n' +
    '      type: RegisterType.' + typ + ',' + signedLine + '\n' +
    '      width: ' + width + ',\n' +
    '      reset: resetValues?.[i] ?? 0n,\n' +
    '      description: \'' + descTemplate + '\'\n' +
    '    }\n' +
    '  }\n' +
    '  const def: ' + retType + ' = { wordSize: ' + wordSize + ', addrMap, registers }\n' +
    '  return { addrMap, def }\n' +
    '}';

  const outFile = '$OUT_FILE';
  const banner = '// THIS FILE IS AUTOGENERATED — DO NOT EDIT DIRECTLY. REGENERATE WITH gen_regblock.sh';
  const content = [
    banner,
    '',
    "import { type RegisterBlockDef, RegisterType } from 'tssv/lib/core/Registers'",
    ifaceImport,
    '',
    jsdocLines,
    factoryFn,
    '',
    banner,
  ].join('\n') + '\n';

  fs.writeFileSync(outFile, content);
  process.stderr.write('wrote ' + outFile + '\n');
  process.exit(0);
}

// ── register summary table (static path) ─────────────────────────────────────

const regNames = Object.keys(regs);

const regRows = regNames.map(rn => {
  const r = regs[rn];
  const typ = r.type ?? 'RW';
  const isMem = typ === 'RAM' || typ === 'ROM';
  return [
    rn,
    normHex(r.address) ?? '-',
    typ,
    isMem ? '-' : String(r.width ?? wordSize),
    isMem ? '-' : (r.reset != null ? String(BigInt(String(r.reset))) : '-'),
    r.description ?? ''
  ];
});

const regTable = mdTable(
  ['Register', 'Address', 'Type', 'Width', 'Reset', 'Description'],
  regRows
);

// ── per-register field tables ─────────────────────────────────────────────────

const fieldSections = regNames.flatMap(rn => {
  const fields = regs[rn].fields;
  if (!fields) return [];
  const fieldRows = Object.entries(fields).map(([fn, f]) => {
    const bitsStr = f.bits ??
      (Array.isArray(f.bitRange) ? f.bitRange[0] + ':' + f.bitRange[1] : '-');
    const parts = String(bitsStr).split(':');
    const msb = parts[0] ?? '-';
    const lsb = parts[1] ?? msb;
    const resetStr = f.reset != null ? String(BigInt(String(f.reset))) : '-';
    return [fn, '[' + msb + ':' + lsb + ']', resetStr, f.description ?? ''];
  });
  return [
    ' *',
    ' * ### ' + rn + ' Fields',
    ' * ' + mdTable(['Field', 'Bits', 'Reset', 'Description'], fieldRows)
  ];
});

// ── JSDoc comment ─────────────────────────────────────────────────────────────

const jsdoc = [
  '/**',
  ' * Register Block: ' + name,
  ' *',
  ' * ' + regTable,
  ...fieldSections,
  ' */'
].join('\n');

// ── addrMap const ─────────────────────────────────────────────────────────────

const addrMapVar = name + 'AddrMap';
const defVar     = name + 'Def';
const nameWidth  = Math.max(...regNames.map(n => n.length));

const addrLines = regNames.map(rn => {
  const addr = normHex(regs[rn].address) ?? '0x00000000';
  return "  " + rn.padEnd(nameWidth) + ": BigInt('" + addr + "'),";
}).join('\n');

const addrMap =
  'const ' + addrMapVar + ' = {\n' +
  addrLines + '\n' +
  '} as const';

// ── RegisterBlockDef ──────────────────────────────────────────────────────────

function buildRegEntry(rn) {
  const r   = regs[rn];
  const typ = r.type ?? 'RW';
  const isMem = typ === 'RAM' || typ === 'ROM';
  const lines = ["      type: RegisterType." + typ + ","];

  if (!isMem && r.reset != null) {
    lines.push('      reset: ' + resetLit(r.reset) + ',');
  }
  if (r.description)
    lines.push("      description: '" + r.description + "',");
  if (r.width && !isMem && r.width !== wordSize)
    lines.push('      width: ' + r.width + ',');
  if (r.isSigned)
    lines.push('      isSigned: true,');
  if (isMem && r.size != null)
    lines.push('      size: ' + BigInt(String(r.size)).toString() + 'n,');

  if (r.fields) {
    lines.push('      fields: {');
    for (const [fn, f] of Object.entries(r.fields)) {
      const bitsStr = f.bits ??
        (Array.isArray(f.bitRange) ? f.bitRange[0] + ':' + f.bitRange[1] : '0:0');
      const parts = String(bitsStr).split(':');
      const msb = parseInt(parts[0], 10);
      const lsb = parseInt(parts[1] ?? parts[0], 10);
      const fieldParts = ['bitRange: [' + msb + ', ' + lsb + ']'];
      if (f.reset != null) {
        fieldParts.push('reset: ' + resetLit(f.reset));
      }
      if (f.description)
        fieldParts.push("description: '" + f.description + "'");
      lines.push('        ' + fn + ': { ' + fieldParts.join(', ') + ' },');
    }
    lines.push('      },');
  }

  return '    ' + rn + ': {\n' + lines.join('\n') + '\n    },';
}

const regEntries = regNames.map(buildRegEntry).join('\n');

const blockDef =
  'const ' + defVar + ': RegisterBlockDef<typeof ' + addrMapVar + '> = {\n' +
  '  wordSize: ' + wordSize + ',\n' +
  '  addrMap: ' + addrMapVar + ',\n' +
  '  registers: {\n' + regEntries + '\n  }\n}';

// ── RegisterBlock instantiation ───────────────────────────────────────────────

const ifaceArg = busIface === 'TL_UL' ? 'new TL_UL()' : 'new Memory()';

const instantiation =
  'const ' + name + ' = new RegisterBlock<typeof ' + addrMapVar + '>(\n' +
  "  { name: '" + name + "', busAddressWidth: " + addrWidth + " },\n" +
  '  ' + defVar + ',\n' +
  '  ' + ifaceArg + '\n)';

// ── assemble output ───────────────────────────────────────────────────────────

const ifaceImport = busIface === 'TL_UL'
  ? "import { TL_UL } from 'tssv/lib/interfaces/AMBA/TL_UL'"
  : "import { Memory } from 'tssv/lib/interfaces/Memory'";

const outFile = '$OUT_FILE';
const banner = '// THIS FILE IS AUTOGENERATED — DO NOT EDIT DIRECTLY. REGENERATE WITH gen_regblock.sh';
const content = [
  banner,
  '',
  "import { type RegisterBlockDef, RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'",
  ifaceImport,
  '',
  jsdoc,
  'export ' + addrMap,
  '',
  'export ' + blockDef,
  '',
  'export ' + instantiation,
  '',
  banner,
].join('\n') + '\n';

fs.writeFileSync(outFile, content);
process.stderr.write('wrote ' + outFile + '\n');
NODEEOF
