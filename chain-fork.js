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
  .option('work', {
    alias: 'w',
    describe: 'Confirm run',
    default: false,
    type: 'boolean'
  }).argv

const BSC_NODE_URL = process.env.BNSC_NODE_URL
const ETH_NODE_URL = process.env.ETH_NODE_URL

const spawnGanache = (args) => spawn('node', ['./ganache.js', ...args], {
  stdio: 'inherit',
  cwd: process.cwd()
})

/**
 * @param {boolean} BSC 
 * @param {boolean} ETH 
 */
const bootInstance = async (BSC, ETH) => {
  if (BSC) return spawnGanache(['--fork', BSC_NODE_URL, '--port', '7545'])
  else if (ETH) return spawnGanache(['--fork', ETH_NODE_URL, '--port', '8545'])

  let [NODE_URL, PORT] = BSC
    ? [BSC_NODE_URL, 8545]
    : [ETH_NODE_URL, 7545]

  const childProcess = spawnGanache(['--fork', NODE_URL, '--port', PORT])

  return new Promise((resolve, reject) => {
    childProcess.on('error', (err) => reject(err))
    childProcess.on('close', (code, signal) => resolve({ code, signal }))
  })
}

if (argv.work) {
  (async () => {
    console.log('working')
    await bootInstance(argv.BSC, argv.ETH)
  })().then(() => console.log('Finished'))
}

module.exports = {
  bootInstance, spawnGanache
}