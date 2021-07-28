describe(
'tkngen-api test suite',
() => {
  describe(
  'lib function test suite',
  () => {
    require('./lib/compile.test')
    require('./lib/deploy.test')
  })

  describe(
  '__contracts__ test suite',
  () => {
    require('./__contracts__/ERC.test')
  })

  describe(
  'tkngen-api server tests',
  () =>
    require('./server.test')
  )

  after(() => {
    // Web3 keeps an active connection causing the process not
    // to exit.
    // Async process... Will let mocha finish running the test suites
    // then exits.
    setTimeout(() => {
      process.exit(0)
    }, 5000)
  })
})