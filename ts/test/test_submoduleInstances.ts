/**
 * Module.submoduleInstances(), on node:test: a module's submodule instances as a test reads them,
 * instead of the SV (doc/framework/testbench.md, "What TS-side tests may check").
 *
 *   - each instance by name, in the order added, with the module it instantiates;
 *   - its bindings, those given and those addSubmodule() bound automatically;
 *   - a module with no submodules has none;
 *   - what it returns is a copy: changing it changes no submodule.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Expr, Module } from 'tssv/lib/core/TSSV'

/** A one-bit inverter: `y = ~a` */
class Inv extends Module {
  constructor () {
    super({ name: 'Inv' })
    this.IOs = {
      a: { direction: 'input' },
      y: { direction: 'output' }
    }
    this.addAssign({ in: new Expr('~a'), out: 'y' })
  }
}

/** Two inverters in a chain: `u0` bound by name, `u1` by addSubmodule()'s autoBind */
class Chain extends Module {
  readonly first = new Inv()
  readonly second = new Inv()
  constructor () {
    super({ name: 'Chain' })
    this.IOs = {
      a: { direction: 'input' },
      y: { direction: 'output' }
    }
    this.addSignal('mid', {})
    this.addSubmodule('u0', this.first, { a: 'a', y: 'mid' }, false)
    this.addSubmodule('u1', this.second, { a: 'mid' })
  }
}

void test('each instance by name, in the order added, with its module', () => {
  const chain = new Chain()
  const subs = chain.submoduleInstances()
  assert.deepEqual(Object.keys(subs), ['u0', 'u1'])
  assert.equal(subs.u0?.module, chain.first)
  assert.equal(subs.u1?.module, chain.second)
})

void test('the bindings given, and those autoBind added', () => {
  const subs = new Chain().submoduleInstances()
  assert.deepEqual(subs.u0?.bindings, { a: 'a', y: 'mid' })
  // u1 was given only `a`; autoBind bound `y` to the parent's signal of the same name
  assert.deepEqual(subs.u1?.bindings, { a: 'mid', y: 'y' })
})

void test('a module with no submodules has none', () => {
  assert.deepEqual(new Inv().submoduleInstances(), {})
})

void test('changing what it returns changes no submodule', () => {
  const chain = new Chain()
  const subs = chain.submoduleInstances()
  delete subs.u0
  if (subs.u1 !== undefined) subs.u1.bindings.a = 'changed'
  const again = chain.submoduleInstances()
  assert.deepEqual(Object.keys(again), ['u0', 'u1'])
  assert.equal(again.u1?.bindings.a, 'mid')
})
