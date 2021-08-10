/* eslint-disable */

const { spawn } = require('child_process')
const yargs = require('yargs')
require('dotenv').config()

const argv = yargs
  .option('ETH', {
    alias: 'e',
    describe: 'Run Ethereum Mainnet fork',
    default: false,
    type: 'boolean'
  })
  .option('BSC', {
    alias: 'b',
    describe: 'Run BinanceSmartChain Mainnet fork',
    default: false,
    type: 'boolean'
  })
  .option('quiet', {
    alias: 'q',
    describe: 'Run ganache in quiet mode',
    default: false,
    type: 'boolean'
  })
  .option('no_fork', {
    alias: 'nf',
    describe: 'Boot ganache without forks',
    default: false,
    type: 'boolean'
  })
  .option('work', {
    alias: 'w',
    describe: 'Confirm run',
    default: false,
    type: 'boolean'
  }).argv

const BSC_NODE_URL = process.env.BSC_NODE_URL
const ETH_NODE_URL = process.env.ETH_NODE_URL

const spawnGanache = (args) => spawn('yarn', ['run', 'ganache-cli', ...args], {
  stdio: 'inherit',
  cwd: process.cwd()
})

/**
 * @param {boolean} BSC 
 * @param {boolean} ETH 
 * @param {boolean} q
 */
const bootInstanceWithFork = async (BSC, ETH, q) => {
  const quiet = q
    ? '-q'
    : ''

  if (BSC) return spawnGanache(['--fork', BSC_NODE_URL, '--port', 8545, quiet])
  else if (ETH) return spawnGanache(['--fork', ETH_NODE_URL, '--port', 7545, quiet])
}

/**
 * 
 * @param {boolean} BSC 
 * @param {boolean} ETH 
 * @param {boolean} q 
 */
const bootInstanceWithoutFork = async (BSC, ETH, q) => {
  const quiet = q
    ? '-q'
    : ''

  if (BSC) return spawnGanache(['--port', 8545, quiet])
  else if (ETH) return spawnGanache(['--port', 7545, quiet])
}

const arg = (argv.BSC || argv.ETH)
if (argv.work && arg && !argv.no_fork)
bootInstanceWithFork(argv.BSC, argv.ETH, argv.quiet).then(
  () => setImmediate(() => process.exit(0)),
  e => {
    console.error(e)
    process.exit(1)
  }
)

if (argv.work && arg && argv.no_fork)
bootInstanceWithoutFork(argv.BSC, argv.ETH, argv.quiet).then(
  () => setImmediate(() => process.exit(0)),
  e => {
    console.error(e)
    process.exit(1)
  }
)

module.exports = {
  bootInstanceWithFork, spawnGanache
}