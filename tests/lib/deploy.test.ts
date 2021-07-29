import * as DeployMod from '../../lib/lib/deploy'
import * as CompileMod from '../../lib/lib/compile'
import { assert, expect } from 'chai'
import { Web3Fac } from '../../lib/web3'
const accounts = require('../__accounts__')

const web3 = Web3Fac('MAINNET_FORK')
const account = accounts.account
const privateKey = accounts.privateKey

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
    expect(receipt).to.have.property('status')
    expect(receipt).to.have.property('logsBloom')

    const testContractInstance = new web3.eth.Contract(solcExtract.ABI, receipt.contractAddress)
    const shouldBe_one = await testContractInstance.methods.x().call()
    assert.strictEqual(shouldBe_one, '1')
  })

  it(
  'Should call the quickDeploy function',
  async () => {
    const res = await DeployMod.quickDeploy(
      contractWithConstructor,
      'Test', [10],
      web3, account
    )

    expect(res).to.have.property('receipt')
    expect(res).to.have.property('extract')

    const testContractInstance = new web3.eth.Contract(res.extract.ABI, res.receipt.contractAddress)
    const shouldBe_one = await testContractInstance.methods.x().call()

    assert.strictEqual(shouldBe_one, '1')
  })
})