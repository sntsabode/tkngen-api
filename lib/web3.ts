import Web3 from 'web3'
import { panic } from './utils'

if (!process.env.ETH_NODE_URL)
  throw panic('ETH_NODE_URL undefined')

export const web3 = process.env.NODE_ENV === 'production'
  ? new Web3(
    new Web3.providers.WebsocketProvider(process.env.ETH_NODE_URL)
  )
  : new Web3(
    new Web3.providers.WebsocketProvider('http://localhost:7545')
  )