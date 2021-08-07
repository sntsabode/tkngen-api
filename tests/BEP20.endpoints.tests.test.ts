/*
yarn run mocha -r ts-node/register tests/BEP20.endpoints.tests.test.ts --timeout 9999999999
*/
import chai, { assert, expect } from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../lib/app'
import { Web3Fac } from '../lib/web3'
import Web3 from 'web3'
require('dotenv').config()

chai.use(chaiHttp)

//const account = accounts.account

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
'BEP20 endpoints test suite',
() => {
  it(
  'Should call the /BEP-20/MintableBurnable endpoint',
  async () => {
    const [
      tokenName, tokenDecimals, tokenSymbol, totalSupply
    ] = ['TestBurnableTokenv3', 6, 'TV3', 100000]
    const privateKey = process.env.BNC_TEST_PVTK!

    const res = await server.post('/BEP-20/MintableBurnable').type('form')
    .send({
      tokenName, tokenDecimals, tokenSymbol,
      totalSupply, privateKey, network: 'BINANCESMARTCHAIN_TEST'
    })

    deployRouteAssertions(res)
    
    const [name, sym, decimals] = await interfaceWithDeployedTokenContract(
      res, Web3Fac('BINANCESMARTCHAIN_TEST')
    )

    assert.strictEqual(name, tokenName)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
  
  it(
  'Should call the /BEP-20/Standard endpoint',
  async () => {
    const [
      tokenName, tokenDecimals, tokenSymbol, totalSupply
    ] = ['PoiToken', 6, 'POI', 100000]
    const privateKey = process.env.BNC_TEST_PVTK!

    const res = await server.post('/BEP-20/Standard').type('form')
    .send({
      tokenName, tokenDecimals, tokenSymbol,
      totalSupply, privateKey, network: 'BINANCESMARTCHAIN_TEST'
    })

    deployRouteAssertions(res)
    
    const [name, sym, decimals] = await interfaceWithDeployedTokenContract(
      res, Web3Fac('BINANCESMARTCHAIN_TEST')
    )

    assert.strictEqual(name, tokenName)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
})