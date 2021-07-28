import * as CompileMod from '../../lib/lib/compile'
import { assert, expect } from 'chai'

const contract = `
pragma solidity ^0.8.6;

contract Test {
  function x() public returns(uint) { return 1; }
}
`.trim()

describe(
'compile module test suite',
() => {
  it(
  'Should call the constructSolcInputs function',
  async () => {
    const inputs = CompileMod.constructSolcInputs('Test.sol', contract)

    expect(inputs).to.have.property('language')
    expect(inputs).to.have.property('sources')
    expect(inputs.sources).to.have.property('Test.sol')
    expect(inputs.sources['Test.sol']).to.have.property('content')
    assert.isString(inputs.sources['Test.sol'].content)
  })

  it(
  'Should call the compile function',
  async () => {
    const inputs = CompileMod.constructSolcInputs('Test.sol', contract)
    const outputs = await CompileMod.compile(inputs)

    expect(outputs).to.have.property('sources')
    // An SDPX-License identifier error
    expect(outputs).to.have.property('errors')
    expect(outputs).to.have.property('contracts')

    expect(outputs.contracts).to.have.property('Test.sol')
    expect(outputs.contracts['Test.sol']).to.have.property('Test')

    expect(outputs.contracts['Test.sol'].Test).to.have.property('abi')
    expect(outputs.contracts['Test.sol'].Test).to.have.property('devdoc')
    expect(outputs.contracts['Test.sol'].Test).to.have.property('evm')
    expect(outputs.contracts['Test.sol'].Test).to.have.property('ewasm')
    expect(outputs.contracts['Test.sol'].Test).to.have.property('metadata')
    assert.isObject(JSON.parse(outputs.contracts['Test.sol'].Test.metadata))

    expect(outputs.contracts['Test.sol'].Test).to.have.property('storageLayout')
    expect(outputs.contracts['Test.sol'].Test).to.have.property('userdoc')
  })
})