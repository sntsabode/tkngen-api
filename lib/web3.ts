import Web3 from 'web3'
import { panic } from './utils'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

if (!process.env.ETH_NODE_URL)
  throw panic('ETH_NODE_URL undefined')

export type SupportedNetwork =
  | 'MAINNET'
  | 'MAINNET_FORK'
  | 'KOVAN'
  | 'BINANCESMARTCHAIN'
  | 'BINANCESMARTCHAIN_TEST'

/* eslint-disable */

const Web3Instances = {
  MAINNET: () => new Web3(
    new Web3.providers.WebsocketProvider(process.env.ETH_NODE_URL!)
  ),

  MAINNET_FORK: () => new Web3(
    new Web3.providers.WebsocketProvider('http://localhost:7545')
  ),

  KOVAN: () => new Web3(
    new Web3.providers.WebsocketProvider(process.env.ETH_NODE_URL_KOVAN!)
  ),

  BINANCESMARTCHAIN: () => new Web3(
    new Web3.providers.WebsocketProvider(process.env.BNSC_NODE_URL!)
  ),

  BINANCESMARTCHAIN_TEST: () => new Web3(
    'https://data-seed-prebsc-1-s1.binance.org:8545'
  )
}

/* eslint-enable */

export const Web3Fac = (instance: SupportedNetwork): Web3 => Web3Instances[instance]()