/*
yarn run mocha -r ts-node/register tests/__contracts__/ERC.test.ts --timeout 99999
*/

// assumes ganache instance is running with new test accounts
// written to __eth.accounts__.js
describe('ERC Token test suite', () => {
  require('./ERC/StandardERC20.test')
  require('./ERC/BurnableERC20.test')
  require('./ERC/MintableERC20.test')
  require('./ERC/MintableBurnableERC20.test')
})