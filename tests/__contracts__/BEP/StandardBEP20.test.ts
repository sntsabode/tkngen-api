/*
yarn run mocha -r ts-node/register tests/__contracts__/BEP/StandardBEP20.test.ts --timeout 99999
*/
import { compile } from '../../../lib/lib/compile'
import { StandardBEP20 } from '../../../__contracts__/BEP/StandardBEP20'
import { constructSolcInputs } from '../../../lib/lib/compile'
import { assert } from 'chai'

describe('StandardBEP20 contract test suite', () => {
  it('Should compile the StandardBEP20 contract', done => {
    const inputs = constructSolcInputs('TestBEP20', StandardBEP20(
      '0.8.6', 'TestBEP20', 'BEP', 8, (100 * 10**8).toString()
    ))

    const outputs = compile(inputs)

    assert.isNotEmpty(outputs.contracts.TestBEP20.TestBEP20.evm.bytecode.object)
    assert.isNotEmpty(outputs.contracts.TestBEP20.TestBEP20.abi)
  
    done()
  })
})