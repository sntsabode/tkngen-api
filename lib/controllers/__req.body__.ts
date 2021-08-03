import { SupportedNetwork } from '../web3'

export interface IRequestBody {
  tokenName: string
  tokenDecimals: number
  tokenSymbol: string
  totalSupply: number
  privateKey: string
  network: SupportedNetwork
}