import Web3 from 'web3'
import { panic } from './utils'
// eslint-disable-next-line
require('dotenv').config()

export type SupportedETHNetwork = 
  | 'MAINNET'
  | 'MAINNET_FORK'
  | 'KOVAN'

export type SupportedBSCNetwork =
  | 'BINANCESMARTCHAIN'
  | 'BINANCESMARTCHAIN_FORK'
  | 'BINANCESMARTCHAIN_TEST'

export type SupportedNetwork =
  | SupportedETHNetwork
  | SupportedBSCNetwork

const NODE_URLs: {
  readonly [url in SupportedNetwork]: string
} = (() => {
  const assert_env_var = (env_var?: string): string => {
    if (!env_var) throw panic('ENV var undefined')
    return env_var
  }

  return ({
    MAINNET: assert_env_var(process.env.ETH_NODE_URL),
    MAINNET_FORK: 'http://localhost:7545',
    KOVAN: assert_env_var(process.env.ETH_NODE_URL_KOVAN),
    BINANCESMARTCHAIN: assert_env_var(process.env.BSC_NODE_URL),
    BINANCESMARTCHAIN_FORK: 'http://localhost:8545',
    BINANCESMARTCHAIN_TEST: assert_env_var(process.env.BSC_TEST_NODE_URL)
  })
})()

export const Web3Fac = (instance: SupportedNetwork): Web3 => new Web3(
  new Web3.providers.HttpProvider(NODE_URLs[instance])
)