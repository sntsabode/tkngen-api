import { web3 } from '../web3'
import { ISolcExtract } from './compile'
import { TransactionReceipt } from 'web3-eth'
import { untyped } from '../utils'

export interface IDeployedContract {
  ABI: untyped
  addresses: string
}

export async function deploy(
  fromAccount: string,
  privateKey: string,
  extract: ISolcExtract
): Promise<TransactionReceipt> {
  const gas = 2000000

  const rawTX = {
    from: fromAccount,
    data: extract.evmBytecode,
    gas
  }
  return signAndSendTransaction(rawTX, privateKey)
}

export async function signAndSendTransaction(
  transaction: IRawTransaction,
  privateKey: string
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
}