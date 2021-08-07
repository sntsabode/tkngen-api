/*
yarn run mocha -r ts-node/register tests/server.test.ts --timeout 9999999999
*/
import chaiHttp from 'chai-http'
import chai, { expect } from 'chai'
import { app } from '../lib/app'
require('dotenv').config()

chai.use(chaiHttp)

describe('tkngen-api server test suite', () => {
  it('Should call the /ping endpoint', async () => {
    const res = await chai.request(app).get('/ping')
    expect(res).to.have.status(200)
  })

  require('./ERC20.endpoints.test')
  require('./BEP20.endpoints.test')
})