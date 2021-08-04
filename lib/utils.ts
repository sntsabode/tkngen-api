// eslint-disable-next-line
export type untyped = any
import BN from 'bn.js'
import Web3 from 'web3'
import { Unit } from 'web3-utils'

const Decimals = {
  '18': 'ether',
  '12': 'szabo',
  '6': 'mwei'
}

export type SupportedDecimals =
  | '18'
  | '12'
  | '8'
  | '6'

export function convertToWei(
  val: string,
  decimals: SupportedDecimals,
): BN {
  if (decimals === '8')
    return new BN(val).mul(new BN(10 ** 8))
    
  return new BN(new Web3().utils.toWei(val, (Decimals[decimals] as Unit)))
}

export function panic<E>(...msg: E[]): never {
  console.error(...msg)
  process.exit(1)
}