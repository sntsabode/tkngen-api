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
  }).argv

const BSC_NODE_URL = process.env.BNSC_NODE_URL
const ETH_NODE_URL = process.env.ETH_NODE_URL

const spawnGanache = (args) => new Promise((resolve, reject) => {
  const dir = process.cwd()
  const childProcess = spawn('node', ['./ganache.js', ...args], {
    stdio: 'inherit',
    cwd: dir
  })

  childProcess.on('error', (err) => reject(err))
  childProcess.on('close', (code, signal) => resolve({ code, signal }))
})

/**
 * @param {boolean} BSC 
 * @param {boolean} ETH 
 */
const bootInstance = async (BSC, ETH) => {
  if (BSC) return spawnGanache(['--fork', BSC_NODE_URL, '--port', '7545'])
  else if (ETH) return spawnGanache(['--fork', ETH_NODE_URL, '--port', '8545'])
}

;(async () => {
  await bootInstance(argv.BSC, argv.ETH)
})().then(() => console.log('Finished'))

module.export = {
  bootInstances, spawnGanache
}