import { ISolcOutputContracts } from './compile'

export function makeRawTransaction(
  coutputs: ISolcOutputContracts,
  fromAccount: string,
  gas: number
): {
  from: string
  data: string
  gas:  number
} {
  const contractFile = Object.keys(coutputs)[0]
  const contractName = Object.keys(coutputs[contractFile])[0]
  const contractCode = coutputs[contractFile][contractName].evm.bytecode.object
  
  return {
    from: fromAccount,
    data: contractCode,
    gas
  }
}