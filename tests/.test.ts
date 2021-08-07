/*
yarn run mocha -r ts-node/register tests/tests.test.ts --timeout 9999999999
*/

describe('tkngen-api test suite', () => {
  describe('lib function test suite', () => {
    require('./lib/compile.test')
    require('./lib/deploy.test')
  })

  describe('__contracts__ test suite', () => {
    require('./__contracts__/ERC.test')
    require('./__contracts__/BEP.test')
  })

  describe('tkngen-api server tests', () => {
    require('./server.test')
  })

  describe('utils test suite', () => {
    require('./utils.test')
  })

  // Web3 keeps an active connection causing the
  // process not to exit. 
  after(() => setTimeout(() => process.exit(0), 5000))
})