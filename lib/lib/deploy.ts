import { ISolcExtract } from './compile'
import { TransactionReceipt } from 'web3-eth'
import { untyped } from '../utils'
import Web3 from 'web3'
import * as CompileMod from './compile'

export interface IDeployedContract {
  ABI: untyped
  addresses: string
}

export async function quickDeploy(
  contract: string,
  contractName: string,
  arguments_: untyped[],
  web3: Web3,
  fromAccount: string
): Promise<{
  receipt: TransactionReceipt
  extract: ISolcExtract
}> {
  const outputs = CompileMod.compile(CompileMod.constructSolcInputs(
    contractName, contract
  ))

  if (!outputs.contracts) throw new Error(
    'Contract failed to compile'
  )

  const extract = CompileMod.extractFromSolcOutput(
    outputs.contracts
  )

  return deploy(extract, web3, arguments_, fromAccount)
    .then(receipt => ({
      receipt,
      extract
    }), e => { throw e })
}

export async function deploy(
  extract: ISolcExtract,
  web3: Web3,
  arguments_: untyped[],
  fromAccount: string
): Promise<TransactionReceipt> {
  const gasPrice = await web3.eth.getGasPrice()
    .catch(e => { throw e })  

  const pendingDeployment = new web3.eth.Contract(extract.ABI).deploy({
    data: extract.evmBytecode,
    arguments: arguments_
  }).send({
    from: fromAccount,
    gas: 1500000,
    gasPrice
  })

  return new Promise((resolve, reject) => {
    pendingDeployment.on('error', err => reject(err))
    pendingDeployment.on('receipt', receipt => resolve(receipt))
  })
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
}