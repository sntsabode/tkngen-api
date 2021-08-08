/*
yarn run mocha -r ts-node/register tests/lib/deploy.test.ts --timeout 99999
*/
import * as DeployMod from '../../lib/lib/deploy'
import * as CompileMod from '../../lib/lib/compile'
import { assert, expect } from 'chai'
import { Web3Fac } from '../../lib/web3'

const web3 = Web3Fac('MAINNET_FORK')

const testAccount = web3.eth.accounts.create()

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

describe('deploy module test suite', () => {
  before(async () => {
    const web3accounts = await web3.eth.getAccounts()

    await web3.eth.sendTransaction({
      from: web3accounts[0],
      to: testAccount.address,
      value: web3.utils.toWei('1'),
      gas: 5000000,
      gasPrice: 18e9
    })
  })

  it('Should call the signAndSendTransaction function', async () => {
    const gas = 2000000
    const inputs = CompileMod.constructSolcInputs('Test.sol', contract)
    const output = CompileMod.compile(inputs).contracts
    const solcExtract = CompileMod.extractFromSolcOutput(output)

    const receipt = await DeployMod.signAndSendTransaction({
      from: testAccount.address,
      data: solcExtract.evmBytecode,
      gas, gasPrice: 18e9
    }, testAccount.privateKey, web3)
    
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

  it('Should call the signAndSendTransaction function with contract constructor arguments', async () => {
    const gas = 2000000
    const inputs = CompileMod.constructSolcInputs('Test.sol', contractWithConstructor)
    const output = CompileMod.compile(inputs).contracts
    const solcExtract = CompileMod.extractFromSolcOutput(output)

    const receipt = await DeployMod.signAndSendTransaction({
      from: testAccount.address,
      data: solcExtract.evmBytecode + web3.eth.abi.encodeParameters(
        ['uint256'], [200]
      ).slice(2),
      gas, gasPrice: 18e9
    }, testAccount.privateKey, web3)
    
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