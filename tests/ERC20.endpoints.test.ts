/*
yarn run mocha -r ts-node/register tests/ERC20.endpoints.test.ts --timeout 9999999999
*/
import { spawnGanache } from '../chain-fork'
// eslint-disable-next-line
require('dotenv').config()

const ETH_NODE_URL = process.env.ETH_NODE_URL!

describe('ERC20 endpoints test suite', () => {
  const ganacheInstance = spawnGanache(['--fork', ETH_NODE_URL, '--port', 7545])
  
  before(async () => {
    // waiting for ganache to boot and write test address and private keys to
    // `__.accounts__` files. not pretty
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 10000))
  })

  // require files only once ganache has written new test accounts
  it('', () => require('./ERC20.endpoints.tests.test'))

  after(() => ganacheInstance.kill(0))
  process.on('SIGINT', () => ganacheInstance.kill(0))
  if (process.platform === 'win32') require('readline').createInterface({
    input: process.stdin, output: process.stdout
  }).on('SIGINT', () => ganacheInstance.kill(0))
})