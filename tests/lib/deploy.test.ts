import * as DeployMod from '../../lib/lib/deploy'
import * as CompileMod from '../../lib/lib/compile'
import { assert, expect } from 'chai'

const contract = `
pragma solidity ^0.8.6;

contract Test {
  function x() public returns(uint) { return 1; }
}
`.trim()

const contractByteCode = `608060405234801561001057600080fd5b5060b68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80630c55699c14602d575b600080fd5b60336047565b604051603e9190605d565b60405180910390f35b60006001905090565b6057816076565b82525050565b6000602082019050607060008301846050565b92915050565b600081905091905056fea264697066735822122023204e3fdcbae9a56db2c2a209c56d5511c0b39600a1e2461f97843f1ee2d1de64736f6c63430008060033`

describe(
'deploy module test suite',
() => {
  it(
  'Should call the ',
  async () => {
    const inputs = CompileMod.constructSolcInputs('Test.sol', contract)
    const outputs = await CompileMod.compile(inputs)

    const gas = 2000000

    const rawTx = DeployMod.makeRawTransaction(outputs.contracts, '0x', gas)
    
    expect(rawTx).to.have.property('from')
    expect(rawTx).to.have.property('data')
    expect(rawTx).to.have.property('gas')

    assert.strictEqual(rawTx.gas, gas)
    assert.strictEqual(rawTx.data, contractByteCode)
    assert.strictEqual('0x', rawTx.from)
  })
})