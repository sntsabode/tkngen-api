describe(
'ERC Token test suite',
() => {
  require('./ERC/StandardERC20.test')
  require('./ERC/BurnableERC20.test')
  require('./ERC/MintableERC20.test')
})