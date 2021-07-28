import * as DeployMod from '../../lib/lib/deploy'
import * as CompileMod from '../../lib/lib/compile'
import { assert, expect } from 'chai'
import { web3 } from '../../lib/web3'

const privateKey = '0x304e050f221865e00bd2325473b46a9a72b2bc665212aec2d0087d2dc1172b63'
const account = '0xa542fa9b5c22925a848b2e1d6fcef56db4b2192f'

const contract = `
pragma solidity ^0.8.6;

contract Test {
  function x() public returns(uint) { return 1; }
}
`.trim()

const contractWithConstructor = `
pragma solidity ^0.8.6;

contract Test {
  uint256 immutable y;

  constructor(uint256 _y) public {
    y = _y;
  }

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
    }, privateKey, web3)
    
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
    const inputs = CompileMod.constructSolcInputs('Test.sol', contractWithConstructor)
    const output = CompileMod.compile(inputs)
    const solcExtract = CompileMod.extractFromSolcOutput(output.contracts)

    const receipt = await DeployMod.deploy(solcExtract, web3, ['2'], account)
    
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
})