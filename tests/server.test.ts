/*
yarn run mocha -r ts-node/register tests/server.test.ts --timeout 9999999999
*/
import chaiHttp from 'chai-http'
import chai, { expect, assert } from 'chai'
import { app } from '../lib/app'
import { Web3Fac } from '../lib/web3'
require('dotenv').config()

chai.use(chaiHttp)

const web3 = Web3Fac('MAINNET_FORK')

const server = chai.request(app).keepOpen()

const testAccounts = web3.eth.accounts.create()
const privateKey = testAccounts.privateKey

describe('tkngen-api server test suite', () => {
  it('Should call the /ping endpoint', async () => {
    const res = await server.get('/ping')
    expect(res).to.have.status(200)
  })

  require('./ERC20.endpoints.test')
  require('./BEP20.endpoints.test')

  // The same function handles all routes so only one needs to be tested
  describe('endpoints fail tests', () => {
    it('Should call the endpoint with an erroneous network parameter', async () => {
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
  
    it('Should call the endpoint with a tokenName with special characters', async () => {
      const [
        tokenName, tokenDecimals, tokenSymbol, totalSupply
      ] = ['TestERC&***20', 18, 'ERT', 10000]
  
      const requestBody = {
        tokenName, tokenDecimals, tokenSymbol,
        totalSupply, privateKey, network: 'MAINNET_FORK'
      }
  
      const res = await server.post('/ERC-20/Standard').type('form')
      .send(requestBody)
  
      expect(res.body).to.have.property('success')
      expect(res.body).to.have.property('err')
      expect(res.body.err).to.have.property('errors')
      assert.isArray(res.body.err.errors)
      assert.isNotEmpty(res.body.err.errors)
  
      expect(res).to.have.status(400)
    })
  
    it('Should call the endpoint with a tokenSymbol with special characters', async () => {
      const [
        tokenName, tokenDecimals, tokenSymbol, totalSupply
      ] = ['TestERC20', 18, 'E**T', 10000]
  
      const requestBody = {
        tokenName, tokenDecimals, tokenSymbol,
        totalSupply, privateKey, network: 'MAINNET_FORK'
      }
  
      const res = await server.post('/ERC-20/Standard').type('form')
      .send(requestBody)
  
      expect(res.body).to.have.property('success')
      expect(res.body).to.have.property('err')
      expect(res.body.err).to.have.property('errors')
      assert.isArray(res.body.err.errors)
      assert.isNotEmpty(res.body.err.errors)
  
      expect(res).to.have.status(400)
    })
  })
})