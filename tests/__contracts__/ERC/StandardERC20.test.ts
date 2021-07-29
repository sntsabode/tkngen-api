import { compile } from '../../../lib/lib/compile'
import { StandardERC20 } from '../../../__contracts__/ERC/StandardERC20'
import { constructSolcInputs } from '../../../lib/lib/compile'
import { assert } from 'chai'
import { deploy } from '../../../lib/lib/deploy'
import { Web3Fac } from '../../../lib/web3'
const accounts = require('../../__accounts__')

const web3 = Web3Fac('MAINNET_FORK')
const account = accounts.account

describe(
'StandardERC20 contract test suite',
() => {
  it(
  'Should compile the StandardERC20 contract',
  done => {
    const inputs = constructSolcInputs('TestERC20', StandardERC20('0.8.6', 'TestERC20', 18))
    const outputs = compile(inputs)

    assert.isNotEmpty(outputs.contracts.TestERC20.TestERC20.evm.bytecode.object)
    assert.isNotEmpty(outputs.contracts.TestERC20.TestERC20.abi)
    
    done()
  })

  it(
  'Should compile and deploy the StandardERC20 contract',
  async () => {
    const TokenDecimals = 8

    const inputs = constructSolcInputs('TestERC20', StandardERC20('0.8.6', 'TestERC20', TokenDecimals))
    const outputs = compile(inputs)

    const ABI = outputs.contracts.TestERC20.TestERC20.abi
    const bytecode = outputs.contracts.TestERC20.TestERC20.evm.bytecode.object

    assert.isNotEmpty(bytecode)
    assert.isNotEmpty(ABI)

    const TokenName = 'TestToken'
    const TokenSym = 'TST'

    const receipt = await deploy({
      ABI,
      metadata: '',
      evmBytecode: bytecode
    }, web3, [TokenName, TokenSym], account)

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