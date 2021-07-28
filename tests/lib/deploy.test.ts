import * as DeployMod from '../../lib/lib/deploy'
import * as CompileMod from '../../lib/lib/compile'
import { assert, expect } from 'chai'
//import { assert, expect } from 'chai'

const privateKey = '0xb864a8fb7cd9675b905b8c7ad831a649ef3759d0a88ae3f253abf51872fceb44'
const account = '0xb8a859e749e843c45ec1b755a5221596be7dd6e9'

const contract = `
pragma solidity ^0.8.6;

contract Test {
  function x() public returns(uint) { return 1; }
}
`.trim()

describe(
'deploy module test suite',
() => {
  it(
  'Should call the signAndSendTransaction function',
  async () => {
    const gas = 2000000
    const inputs = CompileMod.constructSolcInputs('Test.sol', contract)
    const output = CompileMod.compile(inputs).contracts
    const solcExtract = CompileMod.extractFromSolcOutput(output)

    const receipt = await DeployMod.signAndSendTransaction({
      from: account,
      data: solcExtract.evmBytecode,
      gas
    }, privateKey)
    
    expect(receipt).to.have.property('transactionHash')
    expect(receipt).to.have.property('transactionIndex')
    expect(receipt).to.have.property('blockHash')
    expect(receipt).to.have.property('blockNumber')
    expect(receipt).to.have.property('from')
    expect(receipt).to.have.property('to')
    expect(receipt).to.have.property('gasUsed')
    expect(receipt).to.have.property('cumulativeGasUsed')
    expect(receipt).to.have.property('contractAddress')
    assert.isNotEmpty(receipt.contractAddress)
    expect(receipt).to.have.property('logs')
    expect(receipt).to.have.property('status')
    expect(receipt).to.have.property('logsBloom')
  })

  it(
  'Should call the deploy function',
  async () => {
    const inputs = CompileMod.constructSolcInputs('Test.sol', contract)
    const output = CompileMod.compile(inputs).contracts
    const solcExtract = CompileMod.extractFromSolcOutput(output)

    const receipt = await DeployMod.deploy(account, privateKey, solcExtract)
    
    // Returns 'signAndSendTransaction' under the hood 
    // no need to assert the values again
    assert(receipt)
  })
})