/*
yarn run mocha -r ts-node/register tests/__contracts__/ERC/MintableERC20.test.ts --timeout 99999
*/
import { compile } from '../../../lib/lib/compile'
import { MintableERC20 } from '../../../__contracts__/ERC/MintableERC20'
import { constructSolcInputs } from '../../../lib/lib/compile'
import { Web3Fac } from '../../../lib/web3'
import accounts from '../../__eth.accounts__'
import { assert, expect } from 'chai'

const web3 = Web3Fac('MAINNET_FORK')

describe(
'MintableERC20 contract test suite',
() => {
  it(
  'Should compile and deploy the MintableERC20 contract',
  async () => {
    const tokenName = 'TestMintableToken'
    const tokenSym = 'ERC'
    const tokenDecimals = 6

    const initialBalance = (10000 * 10**tokenDecimals)

    const inputs = constructSolcInputs(tokenName, MintableERC20('0.8.6', tokenName))
    const outputs = compile(inputs)

    const ABI = outputs.contracts[tokenName][tokenName].abi
    const evmBytecode = outputs.contracts[tokenName][tokenName].evm.bytecode.object

    const account = web3.eth.accounts.privateKeyToAccount(accounts.privateKey)

    const tx = {
      from: account.address,
      gas: 5000000,
      gasPrice: 18e9,
      data: evmBytecode + web3.eth.abi.encodeParameters(
        ['string memory', 'string memory', 'uint8', 'uint256'],
        [tokenName, tokenSym, tokenDecimals, initialBalance]
      ).slice(2)
    }

    const signedTX = await account.signTransaction(tx)
    const receipt = await web3.eth.sendSignedTransaction(signedTX.rawTransaction!)

    expect(receipt).to.have.property('contractAddress')
    assert.isNotEmpty(receipt.contractAddress)

    const testTokenInstance = new web3.eth.Contract(ABI, receipt.contractAddress)

    const [name, sym, decimals] = await Promise.all([
      testTokenInstance.methods.name().call(),
      testTokenInstance.methods.symbol().call(),
      testTokenInstance.methods.decimals().call()
    ])

    assert.strictEqual(name, tokenName)
    assert.strictEqual(sym, tokenSym)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
})