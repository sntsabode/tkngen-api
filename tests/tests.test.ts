describe(
'tkngen-api test suite',
() => {
  describe(
  'lib function test suite',
  () => {
    require('./lib/compile.test')
    require('./lib/deploy.test')
  })
})