/**
 * Declaring port contracts (doc/framework/concepts.md, "Port contracts"), with no simulation and
 * no Verilator. test_checkPortContracts.ts runs the check itself.
 *
 * The checks read only the object model and the contract manifest's names, never the generated
 * SV (doc/framework/testbench.md, "What TS-side tests may check"):
 *
 *   - ports() lists the plain ports, then each interface port's modport signals;
 *   - the contracts a module declares are kept in order, and written to <name>.contracts.json;
 *   - a module without contracts writes no manifest;
 *   - bad endpoints are refused, naming the module and the contract.
 */
import { Module } from 'tssv/lib/core/TSSV'
import { ReadyPaths } from './models/ReadyPaths.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

void test('ports() lists the plain ports, then each interface port with its modport signals', () => {
  const { plain, interfaces } = new ReadyPaths().ports()
  assert.deepEqual(plain.slice(0, 4).map(p => `${p.direction} ${p.name} ${p.width}`),
    ['input clk 1', 'input rst_b 1', 'input a_in_valid 1', 'input a_out_ready 1'])
  assert.deepEqual(plain.filter(p => p.name.startsWith('v_')).map(p => `${p.direction} ${p.name} ${p.width}`),
    ['input v_in_valid 2', 'input v_out_ready 2', 'output v_in_ready 2', 'output v_out_valid 2'])
  assert.deepEqual(interfaces.map(i => ({ port: i.port, type: i.type, signals: i.signals.map(s => `${s.direction} ${s.name} ${s.width}`) })), [
    { port: 's_in', type: 'handshake_8', signals: ['input valid 1', 'input data 8', 'output ready 1'] },
    { port: 's_out', type: 'handshake_8', signals: ['output valid 1', 'output data 8', 'input ready 1'] }
  ])
})

void test('a module keeps its contracts in the order declared, and returns copies', () => {
  const m = new ReadyPaths()
  m.addNoCombinationalPathContract('b_out_ready', 'b_in_ready')
  assert.deepEqual(m.portContracts, [
    { from: 'a_out_ready', to: 'a_in_ready' },
    { from: 's_out.ready', to: 's_in.ready' },
    { from: 'v_out_ready[1]', to: 'v_in_ready[1]' },
    { from: 'b_out_ready', to: 'b_in_ready' }
  ])
  const copy = m.portContracts[0] as { from: string }
  copy.from = 'changed'
  assert.equal(m.portContracts[0]?.from, 'a_out_ready')
})

void test('writeSystemVerilogFiles writes <name>.contracts.json, with an open wrapper and one per contract', () => {
  const dir = mkdtempSync(join(tmpdir(), 'port-contract-test-'))
  try {
    const m = new ReadyPaths()
    const written = m.writeSystemVerilogFiles(dir)
    const path = join(dir, `${m.name}.contracts.json`)
    assert.ok(!written.includes(path), 'the manifest is not among the SV paths returned')
    const manifest = JSON.parse(readFileSync(path, 'utf8')) as { module: string, open: { top: string }, contracts: Array<{ contract: string, top: string }> }
    assert.equal(manifest.module, m.name)
    assert.equal(manifest.open.top, `${m.name}__contract_open`)
    assert.deepEqual(manifest.contracts.map(c => [c.contract, c.top]), [
      ['no combinational path from a_out_ready to a_in_ready', `${m.name}__contract_0`],
      ['no combinational path from s_out.ready to s_in.ready', `${m.name}__contract_1`],
      ['no combinational path from v_out_ready[1] to v_in_ready[1]', `${m.name}__contract_2`]
    ])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

void test('a module without contracts writes no manifest', () => {
  class Plain extends Module {
    constructor () {
      super({ name: 'plain_no_contracts' }, { a: { direction: 'input' }, y: { direction: 'output' } })
      this.addBody('assign y = a;')
    }
  }
  const dir = mkdtempSync(join(tmpdir(), 'port-contract-test-'))
  try {
    new Plain().writeSystemVerilogFiles(dir)
    assert.ok(!existsSync(join(dir, 'plain_no_contracts.contracts.json')))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

void test('bad endpoints are refused, naming the module and the contract', () => {
  const refused: Array<[string, string, RegExp]> = [
    ['b_in_ready', 'b_out_ready', /^Error: ReadyPaths_false_false: no combinational path from b_in_ready to b_out_ready: b_in_ready is an output; a contract runs from an input to an output$/],
    ['a_out_ready', 'b_out_ready', /b_out_ready is an input; a contract runs from an input to an output/],
    ['c_out_ready', 'a_in_ready', /there is no port c_out_ready/],
    ['t_out.ready', 's_in.ready', /there is no interface port t_out/],
    ['s_out.rdy', 's_in.ready', /interface port s_out has no signal rdy/],
    ['s_in.valid', 's_out.data', /s_out\.data is 8 bits wide; name one bit, as s_out\.data\[i\]/],
    ['v_out_ready', 'v_in_ready[0]', /v_out_ready is 2 bits wide; name one bit, as v_out_ready\[i\]/],
    ['a_out_ready[0]', 'a_in_ready', /a_out_ready is 1 bit wide; name it without \[0\]/],
    ['v_out_ready[2]', 'v_in_ready[1]', /v_out_ready has bits 1 to 0, so it has no bit 2/],
    ['v_out_ready[1:0]', 'v_in_ready[1]', /'v_out_ready\[1:0\]' isn't a port or port\.signal, with an optional bit \[i\]/],
    ['a_out_ready', 'a_in_ready', /no combinational path from a_out_ready to a_in_ready is already declared/]
  ]
  for (const [from, to, message] of refused) {
    const m = new ReadyPaths()
    assert.throws(() => { m.addNoCombinationalPathContract(from, to) }, message)
  }
})
