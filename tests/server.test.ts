import chaiHttp from 'chai-http'
import chai, { assert, expect } from 'chai'
import { app } from '../lib/app'
import { Web3Fac } from '../lib/web3'
const accounts = require('./__accounts__')

chai.use(chaiHttp)

const account = accounts.account
const privateKey = accounts.privateKey

const server = chai.request(app).keepOpen()

const web3 = Web3Fac('MAINNET_FORK')

describe(
'tkngen-api server test suite',
() => {
  it(
  'Should call the /ping endpoint',
  async () => {
    const res = await server.get('/ping')
    expect(res).to.have.status(200)
  })

  it(
  'Should call the /ERC-20/Standard endpoint',
  async () => {
    const tokenName = 'TestERC20'
    const tokenDecimals = 18
    const tokenSymbol = 'TST'

    const res = await server.post('/ERC-20/Standard').type('form')
    .send({
      tokenName,
      tokenDecimals,
      tokenSymbol,
      fromAccount: account,
      accountPassword: privateKey,
      network: 'MAINNET_FORK'
    })

    expect(res).to.have.status(200)
    expect(res.body).to.have.property('success')
    assert.isTrue(res.body.success)
    expect(res.body).to.have.property('msg')
    expect(res.body).to.have.property('data')

    expect(res.body.data).to.have.property('receipt')
    expect(res.body.data.receipt).to.have.property('transactionHash')
    assert.isNotEmpty(res.body.data.receipt.transactionHash)
    expect(res.body.data.receipt).to.have.property('contractAddress')
    assert.isNotEmpty(res.body.data.receipt.contractAddress)
    expect(res.body.data.receipt).to.have.property('gasUsed')

    expect(res.body.data).to.have.property('solc')
    expect(res.body.data.solc).to.have.property('ABI')
    expect(res.body.data.solc).to.have.property('evmBytecode')
    assert.isNotEmpty(res.body.data.solc.ABI)
    assert.isNotEmpty(res.body.data.solc.evmBytecode)

    const tokenInstance = new web3.eth.Contract(
      res.body.data.solc.ABI,
      res.body.data.receipt.contractAddress
    )

    const [name, sym, decimals] = await Promise.all([
      tokenInstance.methods.name().call(),
      tokenInstance.methods.symbol().call(),
      tokenInstance.methods.decimals().call()
    ])

    assert.strictEqual(name, tokenName)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
})