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
  | 'BINANCESMARTCHAIN_FORK'
  | 'BINANCESMARTCHAIN_TEST'

type Web3_Instances<URL extends string, T> = {
  [url in URL]: T
}

type NODE_URLs = Web3_Instances<SupportedNetwork, string>
const NODE_URLs: NODE_URLs = (() => {
  const assert_env_var = (env_var?: string): string => {
    if (!env_var) throw panic('ENV var undefined')
    return env_var
  }

  return ({
    MAINNET: assert_env_var(process.env.ETH_NODE_URL),
    MAINNET_FORK: 'http://localhost:7545',
    KOVAN: assert_env_var(process.env.ETH_NODE_URL_KOVAN),
    BINANCESMARTCHAIN: assert_env_var(process.env.BNSC_NODE_URL),
    BINANCESMARTCHAIN_FORK: 'http://localhost:8545',
    BINANCESMARTCHAIN_TEST: assert_env_var(process.env.BNSC_TEST_NODE_URL)
  })
})()

type IWeb3Instances = Web3_Instances<SupportedNetwork, () => Web3>
const Web3Instances: IWeb3Instances = (() => {
  const Web3wrapper = (nodeUrl: string) => new Web3(
    new Web3.providers.WebsocketProvider(nodeUrl)
  )

  const returnObj = ({} as IWeb3Instances)
  
  for (const [network, node_url] of Object.entries(NODE_URLs))
    returnObj[(network as SupportedNetwork)] = () => Web3wrapper(node_url)
  
  return returnObj
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