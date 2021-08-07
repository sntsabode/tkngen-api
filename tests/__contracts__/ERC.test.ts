/*
yarn run mocha -r ts-node/register tests/__contracts__/ERC.test.ts --timeout 99999
*/
import { spawnGanache } from '../../chain-fork'
require('dotenv').config()

const ETH_NODE_URL = process.env.ETH_NODE_URL!

const ganacheInstance = spawnGanache(['--fork', ETH_NODE_URL, '--port', 7545])

describe(
'ERC Token test suite',
() => {
  before(async () => {
    // waiting for ganache to boot
    return new Promise((resolve) => setTimeout(() => resolve(), 5000))
  })

  it('', () => {
    require('./ERC/StandardERC20.test')
    require('./ERC/BurnableERC20.test')
    require('./ERC/MintableERC20.test')
    require('./ERC/MintableBurnableERC20.test')
  })

  after(() => ganacheInstance.kill(0))
})