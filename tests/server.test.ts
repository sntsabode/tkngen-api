import chaiHttp from 'chai-http'
import chai, { assert, expect } from 'chai'
import { app } from '../lib/app'
const accounts = require('./__accounts__')

chai.use(chaiHttp)

const account = accounts.account
const privateKey = accounts.privateKey

const server = chai.request(app).keepOpen()

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
    const res = await server.post('/ERC-20/Standard').type('form')
    .send({
      tokenName: 'TestERC20',
      tokenDecimals: 18,
      tokenSymbol: 'TST',
      fromAccount: account,
      accountPassword: privateKey
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
  })
})