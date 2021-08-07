import Web3 from 'web3'
import { panic } from './utils'
// eslint-disable-next-line
require('dotenv').config()

if (!process.env.ETH_NODE_URL)
  throw panic('ETH_NODE_URL undefined')

export type SupportedNetwork =
  | 'MAINNET'
  | 'MAINNET_FORK'
  | 'KOVAN'
  | 'BINANCESMARTCHAIN'
  | 'BINANCESMARTCHAIN_TEST'

const Web3Instances = (() => {
  // asserts env var is defined
  const Web3wrapper = (nodeUrl?: string) => {
    if (!nodeUrl) {
      throw panic(nodeUrl, 'undefined')
    }

    return new Web3(
      new Web3.providers.WebsocketProvider(nodeUrl)
    )
  }
  
  return ({
    MAINNET: () => Web3wrapper(process.env.ETH_NODE_URL),
    MAINNET_FORK: () => Web3wrapper('http://localhost:7545'),
    KOVAN: () => Web3wrapper(process.env.ETH_NODE_URL_KOVAN),
    BINANCESMARTCHAIN: () => Web3wrapper(process.env.BNSC_NODE_URL),
    BINANCESMARTCHAIN_FORK: () => Web3wrapper('http://localhost:8545'),
    BINANCESMARTCHAIN_TEST: () => Web3wrapper(process.env.BNSC_TEST_NODE_URL)
  })
})()

if (!process.env.LOCAL_INSTANCE) {
  console.log('LOCAL_INSTANCE var undefined')

  Web3Instances.BINANCESMARTCHAIN_FORK = () => {
    throw Error('Fork chain is not available')
  }

  Web3Instances.MAINNET_FORK = () => {
    throw Error('Fork chain is not available')
  }
}

export const Web3Fac = (instance: SupportedNetwork): Web3 => Web3Instances[instance]()