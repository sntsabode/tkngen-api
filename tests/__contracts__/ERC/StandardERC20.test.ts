/*
yarn run mocha -r ts-node/register tests/__contracts__/ERC/StandardERC20.test.ts --timeout 99999
*/
import { compile } from '../../../lib/lib/compile'
import { StandardERC20 } from '../../../__contracts__/ERC/StandardERC20'
import { constructSolcInputs } from '../../../lib/lib/compile'
import { assert } from 'chai'
import { Web3Fac } from '../../../lib/web3'

const web3 = Web3Fac('MAINNET_FORK')

const testAccount = web3.eth.accounts.create()
const account = testAccount.address

const totalSupply = web3.utils.toWei('100000')

describe('StandardERC20 contract test suite', () => {
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

  it('Should compile the StandardERC20 contract', done => {
    const inputs = constructSolcInputs('TestERC20',
      StandardERC20('0.8.6', 'TestERC20', 'TERC', 18, totalSupply)
    )
    const outputs = compile(inputs)

    assert.isNotEmpty(outputs.contracts.TestERC20.TestERC20.evm.bytecode.object)
    assert.isNotEmpty(outputs.contracts.TestERC20.TestERC20.abi)
    
    done()
  })

  it('Should compile and deploy the StandardERC20 contract', async () => {
    const TokenDecimals = 8

    const inputs = constructSolcInputs('TestERC20',
      StandardERC20('0.8.6', 'TestERC20', 'TER', TokenDecimals, totalSupply)
    )
    const outputs = compile(inputs)

    const ABI = outputs.contracts.TestERC20.TestERC20.abi
    const bytecode = outputs.contracts.TestERC20.TestERC20.evm.bytecode.object

    assert.isNotEmpty(bytecode)
    assert.isNotEmpty(ABI)

    const TokenName = 'TestERC20'
    const TokenSym = 'TER'

    const signedTX = await testAccount.signTransaction({
      from: account,
      gas: 5000000,
      gasPrice: 18e9,
      data: bytecode
    })

    const receipt = await web3.eth.sendSignedTransaction(signedTX.rawTransaction!)

    const testERC20ContractInstance = new web3.eth.Contract(ABI, receipt.contractAddress)
    const [name, sym, decimals] = await Promise.all([
      testERC20ContractInstance.methods.name().call(),
      testERC20ContractInstance.methods.symbol().call(),
      testERC20ContractInstance.methods.decimals().call()
    ])

    assert.strictEqual(name, TokenName)
    assert.strictEqual(sym, TokenSym)

    // Returns uint as a string
    assert.strictEqual(decimals, TokenDecimals.toString())
  })
})