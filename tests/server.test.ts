/*
yarn run mocha -r ts-node/register tests/server.test.ts --timeout 9999999999
*/
import chaiHttp from 'chai-http'
import chai, { expect } from 'chai'
import { app } from '../lib/app'
import { spawnGanache } from '../chain-fork'
require('dotenv').config()

chai.use(chaiHttp)

const ETH_NODE_URL = process.env.ETH_NODE_URL!

describe(
'tkngen-api server test suite',
() => {
  it(
  'Should call the /ping endpoint',
  async () => {
    const res = await chai.request(app).get('/ping')
    expect(res).to.have.status(200)
  })

  describe('ERC20 endpoints test suite', () => {
    const ganacheInstanceETH = spawnGanache(['--fork', ETH_NODE_URL, '--port', 7545])
    
    before(async () => {
      // waiting for ganache to boot
      return new Promise((resolve) => setTimeout(() => resolve(), 5000))
    })

    it('', () => require('./ERC20.endpoints.test'))

    after(() => ganacheInstanceETH.kill(0))
  })
  require('./BEP20.endpoints.test')
})