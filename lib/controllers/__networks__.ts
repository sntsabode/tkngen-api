import { SupportedBSCNetwork, SupportedETHNetwork } from '../web3'
// eslint-disable-next-line
require('dotenv').config()

export interface INetworks {
  BEP20: SupportedBSCNetwork[]
  ERC20: SupportedETHNetwork []
}

export const Networks: INetworks = (() => {
  const nets: INetworks = {
    BEP20: ['BINANCESMARTCHAIN', 'BINANCESMARTCHAIN_TEST'],
    ERC20: ['MAINNET', 'KOVAN']
  }

  if (process.env.LOCAL_INSTANCE) {
    console.log('Local instance')
    nets.BEP20.push('BINANCESMARTCHAIN_FORK')
    nets.ERC20.push('MAINNET_FORK')
  }

  return nets
})()