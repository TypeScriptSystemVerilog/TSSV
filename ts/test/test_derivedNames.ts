/**
 * Self-checking test for the module name Module derives when `params.name` isn't set (#123,
 * doc/framework/concepts.md §2).
 *
 * Test 1: parameters are sorted by key with plain string comparison, not in insertion order
 * Test 2: each kind of value gives its segment: integers, booleans, `undefined`, strings of 1 to
 *         16 identifier characters as is, and every other value as an 8-character hash
 * Test 3: the hash is of the value's canonical JSON, so key order inside a value doesn't matter,
 *         and bigints are integers there
 * Test 4: each pair that shared a name under the old derivation gets two names
 * Test 5: RegisterBlock, ROM, APB_to_Memory and IpXactComponent put what shapes them into their
 *         parameters, and a file parameter's name depends on its contents, not its path
 * Test 6: every name derived above is a legal SV identifier
 */
import { Module, type TSSVParameters } from 'tssv/lib/core/TSSV'
import { RegisterBlock, type RegisterBlockDef } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import { APB_to_Memory } from 'tssv/lib/modules/APB_to_Memory'
import { ROM } from 'tssv/lib/modules/ROM'
import { IpXactComponent } from 'tssv/lib/modules/IpXactComponent'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'

const OUT = 'sv-examples/Core/derivedNames'
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

let passed = 0
let failed = 0

function check (label: string, ok: boolean, detail?: string): void {
  if (ok) {
    console.log(`PASS: ${label}`)
    passed++
  } else {
    console.error(`FAIL: ${label}${detail !== undefined ? `\n  ${detail}` : ''}`)
    failed++
  }
}

// Every name the test derives, for test 6
const derived: string[] = []

class M extends Module {
  constructor (params: TSSVParameters) {
    super(params)
    derived.push(this.name)
  }
}
const name = (params: TSSVParameters): string => new M(params).name
// The one segment that a single parameter gives
const segment = (value: TSSVParameters[string]): string => name({ p: value }).slice('M_'.length)
// An 8-character hash of 0-9 and a-z
const isHash = (s: string): boolean => /^[0-9a-z]{8}$/.test(s)

// ============================================ 1. order
check('the same values in a different key order give the same name',
  name({ a: 1, b: 2 }) === 'M_1_2' && name({ b: 2, a: 1 }) === 'M_1_2')
check('keys are sorted by plain string comparison, upper case first, whatever the locale',
  name({ b: 1, B: 2, a: 3 }) === 'M_2_3_1', name({ b: 1, B: 2, a: 3 }))

// ============================================ 2. segments
check('a non-negative integer is its decimal value, number or bigint', segment(8) === '8' && segment(8n) === '8' && segment(0) === '0')
check('a negative integer is m and its magnitude', segment(-1) === 'm1' && segment(-12n) === 'm12')
check('an integer too large for a safe number is written in full', segment(1e21) === '1000000000000000000000')
check('a boolean is true or false', segment(true) === 'true' && segment(false) === 'false')
check('undefined keeps its position as X', name({ a: 1, b: undefined }) === 'M_1_X' && name({ a: undefined, b: 1 }) === 'M_X_1')
check('the name key never gives a segment', name({ name: undefined, a: 1 }) === 'M_1')
check('a key missing from the parameters gives no segment', name({ a: 1 }) === 'M_1')
check('no parameters give the class name and an underscore', name({}) === 'M_')

const sixteen = 'abcdefghij012345'
check('a 16-character identifier is appended as is', segment(sixteen) === sixteen)
check('a string may start with a digit', segment('1rw') === '1rw' && segment('1r_1w') === '1r_1w')
check('_ and $ are identifier characters', segment('a_b$c') === 'a_b$c')
for (const [what, value] of [
  ['a 17-character string', sixteen + 'x'],
  ['a string with -', 'fast-path'],
  ['a string with /', 'a/b'],
  ['a string with .', 'a.b'],
  ['a string with a space', 'a b'],
  ['the empty string', '']
]) {
  check(`${what} is hashed`, isHash(segment(value)), segment(value))
}
check('arrays and objects are hashed', isHash(segment([1n, 2n])) && isHash(segment({ k: 1 })))
check('a non-integer number is hashed', isHash(segment(2.5)) && isHash(segment(NaN)) && isHash(segment(Infinity)))

// ============================================ 3. canonical JSON
check('key order inside an object doesn\'t matter', segment({ a: 1, b: 2 }) === segment({ b: 2, a: 1 }))
check('inside a value, 8n and 8 hash the same, and the string 8 differently',
  segment({ k: 8n }) === segment({ k: 8 }) && segment({ k: 8n }) !== segment({ k: '8' }))
check('a hashed string and a number with the same text differ', segment('0.5') !== segment(0.5))
check('NaN, Infinity and null hash differently', new Set([segment(NaN), segment(Infinity), segment(null as unknown as object)]).size === 3)
check('a string, and an array holding it, hash differently', segment('a-b') !== segment(['a-b']))

// ============================================ 4. pairs the old derivation collided
check('different parameter sets with undefined in different places differ', name({ a: 1, b: undefined }) !== name({ a: undefined, b: 1 }))
check('objects whose JSON collided under the old 32-bit hash differ',
  segment([{ name: 'B0', offset: 0 }]) !== segment([{ name: 'AO', offset: 0 }]))
// M_, the hash of 'fast-path', then m1 for -1
check('a negative number and a string that isn\'t an identifier give a legal name',
  /^M_[0-9a-z]{8}_m1$/.test(name({ off: -1, mode: 'fast-path' })), name({ off: -1, mode: 'fast-path' }))
check('accepted: a number and a string with the same text give the same segment (#122 catches a clash)',
  name({ w: 8 }) === name({ w: '8' }))

// ============================================ 5. modules
const block = (addrMap: Record<string, bigint>, bus: Memory | APB4 = new Memory()): RegisterBlock<Record<string, bigint>> => {
  const regDefs: RegisterBlockDef<Record<string, bigint>> = { wordSize: 32, addrMap, registers: {} }
  const b = new RegisterBlock({ busAddressWidth: 32 }, regDefs, bus)
  derived.push(b.name)
  return b
}
const one = block({ A: 0n })
check('RegisterBlocks with different register maps get different names', one.name !== block({ B: 0n, C: 4n }).name, one.name)
check('a RegisterBlock\'s name holds its bus', one.name.includes('_Memory_') &&
  block({ A: 0n }, new APB4({ DATA_WIDTH: 32, ADDR_WIDTH: 32 })).name.includes('_APB_'))
check('RegisterBlock: the parameter comment gives the hash in the name',
  one.writeSystemVerilog().includes(`// regDefs = 1 register, hash ${one.name.split('_').pop() ?? ''}`))
let mismatch = ''
try {
  void new RegisterBlock({ busInterface: 'APB' }, { wordSize: 32, addrMap: { A: 0n }, registers: {} }, new Memory())
} catch (err) {
  mismatch = (err as Error).message
}
check('RegisterBlock: a params.busInterface that disagrees with the bus throws',
  mismatch.includes("params.busInterface is 'APB', but the bus interface argument is a Memory"), mismatch)

const rom = (contents: number[] | string): string => {
  const r = new ROM({ dataWidth: 8, ROMContents: contents })
  derived.push(r.name)
  return r.name
}
check('ROMs with different contents get different names', rom([1, 2]) !== rom([1, 3]))

const bridge = (DATA_WIDTH: 32 | 64): string => {
  const b = new APB_to_Memory({ DATA_WIDTH })
  derived.push(b.name)
  return b.name
}
check('APB_to_Memory bridges of different widths get different names', bridge(32) !== bridge(64), `${bridge(32)} ${bridge(64)}`)

// The adder sample, copied into `dir`, with `extra` appended to its SV file
const SAMPLE = 'ts/test/modules/IpxactComponent/Adder'
const adder = (dir: string, extra = ''): string => {
  const at = join(process.cwd(), OUT, dir)
  mkdirSync(at, { recursive: true })
  writeFileSync(join(at, 'adder.xml'), readFileSync(`${SAMPLE}/adder.xml`))
  writeFileSync(join(at, 'apb_adder.sv'), readFileSync(`${SAMPLE}/apb_adder.sv`, 'utf8') + extra)
  const c = new IpXactComponent({ xmlDataPath: join(at, 'adder.xml'), svFilePath: join(at, 'apb_adder.sv'), moduleName: 'apb_adder' })
  derived.push(c.name)
  return c.name
}
check('IpXactComponent: the same files at two paths give the same name', adder('copy_a') === adder('copy_b'), adder('copy_a'))
check('IpXactComponent: a changed SV file gives a different name', adder('copy_a') !== adder('changed', '// changed\n'))
check('ROM: the same contents at two paths give the same name, and other contents another',
  (() => {
    const file = (f: string, words: string[]): string => { writeFileSync(`${OUT}/${f}`, words.join('\n') + '\n'); return `${OUT}/${f}` }
    return rom(file('a.txt', ['0x01', '0x02'])) === rom(file('b.txt', ['0x01', '0x02'])) &&
      rom(file('a.txt', ['0x01', '0x02'])) !== rom(file('c.txt', ['0x01', '0x03']))
  })())

// ============================================ 6. legal names
// A legal SV identifier: a letter or '_', then letters, digits, '_' or '$'
const illegal = derived.filter(n => !/^[A-Za-z_][A-Za-z0-9_$]*$/.test(n))
check(`all ${derived.length} derived names are legal SV identifiers`, illegal.length === 0, illegal.join(' '))

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
