import { TransactionReceipt } from 'web3-eth'
import { untyped } from '../utils'
import Web3 from 'web3'

export interface IDeployedContract {
  ABI: untyped
  addresses: string
}

export async function signAndSendTransaction(
  transaction: IRawTransaction,
  privateKey: string,
  web3: Web3
): Promise<TransactionReceipt> {
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transaction, privateKey
  ).catch(e => { throw e })

  if (!signedTransaction.rawTransaction)
    throw new Error('TX failed to sign')

  const pendingTransaction = web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  )

  return new Promise((resolve, reject) => {
    pendingTransaction.on('error', err => reject(err))
    pendingTransaction.on('receipt', receipt => resolve(receipt))
  })
}

export interface IRawTransaction {
  from: string
  data: string
  gas: string | number
  gasPrice: string | number
}