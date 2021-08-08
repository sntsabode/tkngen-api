/*
yarn run mocha -r ts-node/register tests/ERC20.endpoints.test.ts --timeout 9999999999
*/
import chai, { assert, expect } from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../lib/app'
import { Web3Fac } from '../lib/web3'
import Web3 from 'web3'
require('dotenv').config()

chai.use(chaiHttp)

const web3 = Web3Fac('MAINNET_FORK')

const testAccount = web3.eth.accounts.create()

//const account = accounts.account

const server = chai.request(app).keepOpen()

const testKovan = false
const network = 'MAINNET_FORK'
const privateKey = testAccount.privateKey

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

describe('ERC20 endpoints test suite', () => {
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

  it('Should call the /ERC-20/Standard endpoint', async () => {
    const [
      tokenName, tokenDecimals, tokenSymbol, totalSupply
    ] = ['TestERC20', 18, 'ERT', 10000]

    const requestBody = {
      tokenName, tokenDecimals, tokenSymbol,
      totalSupply, privateKey, network
    }

    const res = await server.post('/ERC-20/Standard').type('form')
    .send(requestBody)

    deployRouteAssertions(res)
    const [name, sym, decimals] = await interfaceWithDeployedTokenContract(
      res,
      Web3Fac('MAINNET_FORK')
    )

    assert.strictEqual(tokenName, name)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
  
  it('Should call the /ERC-20/Mintable endpoint', async () => {
    const [
      tokenName, tokenSymbol, tokenDecimals, totalSupply
    ] = ['TestMintable', 'TMT', 6, 1000000]

    const res = await server.post('/ERC-20/Mintable').type('form')
    .send({
      tokenName, tokenSymbol, tokenDecimals,
      totalSupply, privateKey, network
    })

    deployRouteAssertions(res)

    deployRouteAssertions(res)
    const [name, sym, decimals] = await interfaceWithDeployedTokenContract(
      res,
      Web3Fac('MAINNET_FORK')
    )

    assert.strictEqual(tokenName, name)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
  
  it('Should call the /ERC-20/Burnable endpoint', async () => {
    const [
      tokenName, tokenSymbol, tokenDecimals, totalSupply
    ] = ['TestBurnable', 'TBT', 6, 1000000]

    const res = await server.post('/ERC-20/Burnable').type('form')
    .send({
      tokenName, tokenSymbol, tokenDecimals,
      totalSupply, privateKey, network
    })

    deployRouteAssertions(res)

    deployRouteAssertions(res)
    const [name, sym, decimals] = await interfaceWithDeployedTokenContract(
      res,
      Web3Fac('MAINNET_FORK')
    )

    assert.strictEqual(tokenName, name)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
  
  it('Should call the /ERC-20/Standard endpoint with an erroneous network parameter', async () => {
    const [
      tokenName, tokenDecimals, tokenSymbol, totalSupply
    ] = ['TestERC20', 18, 'ERT', 10000]

    const requestBody = {
      tokenName, tokenDecimals, tokenSymbol,
      totalSupply, privateKey, network: 'KOFQuwbfw'
    }

    const res = await server.post('/ERC-20/Standard').type('form')
    .send(requestBody)

    expect(res).to.have.status(400)
  })
  
  // Run test if a KOVAN test account is set up.
    if (process.env.KOVAN_TEST_PVTK && testKovan)
  it('Should call the /ERC-20/Standard endpoint deploying to the kovan test network', async () => {
    const [
      tokenName, tokenDecimals, tokenSymbol, totalSupply
    ] = ['TestERC20', 18, 'ERT', 10000]

    const privateKey = process.env.KOVAN_TEST_PVTK
    const requestBody = {
      tokenName, tokenDecimals, tokenSymbol,
      totalSupply, privateKey, network: 'KOVAN'
    }

    const res = await server.post('/ERC-20/Standard').type('form')
    .send(requestBody)

    deployRouteAssertions(res)
    const [name, sym, decimals] = await interfaceWithDeployedTokenContract(
      res,
      Web3Fac('MAINNET_FORK')
    )

    assert.strictEqual(tokenName, name)
    assert.strictEqual(sym, tokenSymbol)
    assert.strictEqual(decimals, tokenDecimals.toString())
  })
})