/*
yarn run mocha -r ts-node/register tests/__contracts__/BEP/StandardBEP20.test.ts --timeout 99999
*/
import { compile } from '../../../lib/lib/compile'
import { StandardBEP20 } from '../../../__contracts__/BEP/StandardBEP20'
import { constructSolcInputs } from '../../../lib/lib/compile'
import { assert, /* expect */ } from 'chai'
//import { Web3Fac } from '../../../lib/web3'
import { config } from 'dotenv'
config()

//const web3 = Web3Fac('BINANCESMARTCHAIN_TEST')

//const address = process.env.BNC_TEST_ACC!
//const privateKey = process.env.BNC_TEST_PVTK!

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

  /*it('Should compile and deploy the StandardBEP20 contract', async () => {
    const TokenName = 'TestToken'
    const TokenSym = 'BEP'
    const TokenDecimals = 8
    const TotalSupply = (1000 * 10**TokenDecimals)

    const inputs = constructSolcInputs(TokenName, StandardBEP20(
      '0.8.6', TokenName, TokenSym, TokenDecimals, TotalSupply.toString()
    ))

    const outputs = compile(inputs)

    const ABI = outputs.contracts[TokenName][TokenName].abi
    const evmBytecode = outputs.contracts[TokenName][TokenName].evm.bytecode.object

    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    
    const tx = {
      from: account.address,
      gas: 5000000,
      gasPrice: 18e9,
      data: evmBytecode
    }

    const signedTX = await web3.eth.accounts.signTransaction(tx, privateKey)
    const receipt = await web3.eth.sendSignedTransaction(signedTX.rawTransaction!)

    expect(receipt).to.have.property('contractAddress')
    assert.isNotEmpty(receipt.contractAddress)

    const testBEP20TokenInstance = new web3.eth.Contract(ABI, receipt.contractAddress)

    const [name, sym, decimals] = await Promise.all([
      testBEP20TokenInstance.methods.name().call(),
      testBEP20TokenInstance.methods.symbol().call(),
      testBEP20TokenInstance.methods.decimals().call()
    ])

    assert.strictEqual(name, TokenName)
    assert.strictEqual(sym, TokenSym)
    assert.strictEqual(decimals, TokenDecimals.toString())
  })*/
})