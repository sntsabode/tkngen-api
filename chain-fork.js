/* eslint-disable */
const ganache = require('ganache-cli')
const Web3 = require('web3')
require('dotenv').config()

if (!process.env.ETH_NODE_URL) throw new Error(
  'ETH_NODE_URL undefined.'
)

const formatIntoMB = (param) => {
  return Math.round(param / 1024 / 1024 * 100) / 100
}

/*setInterval(() => {
  console.log(`\nMemory\n${line}`)
  for (const [key, value] of Object.entries(process.memoryUsage())) {
    console.log(`\n${key}: ${formatIntoMB(value)} MB`)
  }
  console.log('\n')
}, 300000)*/

const server = ganache.server({
  port: 7545,
  default_balance_ether: 100,
  fork: new Web3.providers.WebsocketProvider(process.env.ETH_NODE_URL),
  ws: true,
  debug: true,
  vmErrorsOnRPCResponse: true,
  verbose: true,
  logger: console
})

const PORT = 7545
const line = '===================='

server.listen(PORT, onboot)

function onboot(err, blockchain) {
  if (err) {
    console.error(`Error booting ganache: ${err}`)
    return process.exit(1)
  }

  let count = 1
  console.log(`\nAccounts\n${line}\n`)

  for (let [key, value] of Object.entries(blockchain.accounts)) {
    const address = '0x' + value.secretKey.toString('hex')

    console.log(`${count} Account: ${key} ::: Private Key: ${address}`)
    count++
  }

  console.log(`\n${line}\n`)

  console.log(`\nForked Chain\n${line}\n`)
  console.log(`Block:       `, blockchain.blockchain.forkBlockNumber)
  console.log(`Network ID:  `, blockchain.net_version)
  console.log(`Time:        `, (blockchain.blockchain.startTime || new Date()).toString())  

  console.log(`\n${line}\n`)
  console.log(`Ganache booted successfuly: ${('http://localhost:' + PORT)}`)
  console.log(`\n${line}\n`)
}

/* eslint-enable */