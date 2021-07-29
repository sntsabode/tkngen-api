import chaiHttp from 'chai-http'
import chai, { assert, expect } from 'chai'
import { app } from '../lib/app'
import { Web3Fac } from '../lib/web3'
import Web3 from 'web3'
const accounts = require('./__accounts__')
require('dotenv').config()

chai.use(chaiHttp)

const account = accounts.account
const privateKey = accounts.privateKey

const server = chai.request(app).keepOpen()

function deployRouteAssertions(res: any) {
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
}

async function interfaceWithDeployedTokenContract(
  res: any, web3Instance: Web3
) {
  const tokenInstance = new web3Instance.eth.Contract(
    res.body.data.solc.ABI,
    res.body.data.receipt.contractAddress
  )

  return Promise.all([
    tokenInstance.methods.name().call(),
    tokenInstance.methods.symbol().call(),
    tokenInstance.methods.decimals().call()
  ])
}

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
      tokenName, tokenDecimals, tokenSymbol,
      fromAccount: account, accountPassword: privateKey,
      network: 'MAINNET_FORK'
    })

    deployRouteAssertions(res)
    const [name, sym, decimals] = await interfaceWithDeployedTokenContract(
      res,
      Web3Fac('MAINNET_FORK')
    )

    assert.strictEqual(tokenName, name)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })

  it(
  'Should call the /BEP-20/Standard endpoint',
  async () => {
    const [
      tokenName, tokenDecimals, tokenSymbol, totalSupply
    ] = ['PopiToken', 6, 'POPI', (100000 * 10**6)]
    const privateKey = process.env.BNC_TEST_PVTK!

    const res = await server.post('/BEP-20/Standard').type('form')
    .send({
      tokenName, tokenDecimals, tokenSymbol,
      totalSupply, privateKey, network: 'BINANCESMARTCHAIN_TEST'
    })

    console.log(res.body.data.receipt)

    deployRouteAssertions(res)
    
    const [name, sym, decimals] = await interfaceWithDeployedTokenContract(
      res, Web3Fac('BINANCESMARTCHAIN_TEST')
    )

    assert.strictEqual(name, tokenName)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
})