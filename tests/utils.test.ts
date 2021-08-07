/*
yarn run mocha -r ts-node/register tests/utils.test.ts --timeout 99999
*/
import { assert } from 'chai'
import * as Utils from '../lib/utils'

describe('Utils module test suite', () => {
  it('Should call the convertToWei function with 6 decimals', done => {
    const valBefore = 1
    const valAfter = Utils.convertToWei(valBefore.toString(), '6').toString()

    assert.strictEqual(valAfter, '1000000')
    assert.strictEqual(valAfter.length, 7)

    done()
  })

  it('Should call the convertToWei function with 8 decimals', done => {
    const valBefore = 1
    const valAfter = Utils.convertToWei(valBefore.toString(), '8').toString()

    assert.strictEqual(valAfter, '100000000')
    assert.strictEqual(valAfter.length, 9)

    done()
  })

  it('Should call the convertToWei function with 12 decimals', done => {
    const valBefore = 1
    const valAfter = Utils.convertToWei(valBefore.toString(), '12').toString()

    assert.strictEqual(valAfter, '1000000000000')
    assert.strictEqual(valAfter.length, 13)

    done()
  })

  it('Should call the convertToWei function with 18 decimals', done => {
    const valBefore = 1
    const valAfter = Utils.convertToWei(valBefore.toString(), '18').toString()

    assert.strictEqual(valAfter, '1000000000000000000')
    assert.strictEqual(valAfter.length, 19)

    done()
  })
})