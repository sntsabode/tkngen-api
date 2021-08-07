import { solc } from '../solc'
import { untyped } from '../utils'

export interface ISolcExtract {
  ABI: untyped
  metadata: string
  evmBytecode: string
}

/**
 * Helper function to return the necessary data from the solc
 * output.
 * @param coutputs 
 * @returns 
 */
export function extractFromSolcOutput(
  coutputs: ISolcOutputContracts
): ISolcExtract {
  const contractFile = Object.keys(coutputs)[0]
  const contractName = Object.keys(coutputs[contractFile])[0]

  return {
    ABI: coutputs[contractFile][contractName].abi,
    metadata: coutputs[contractFile][contractName].metadata,
    evmBytecode: coutputs[contractFile][contractName].evm.bytecode.object
  }
}

/**
 * Compiles a Solidity contract using solc. 
 * @param input 
 */
export function compile(input: ISolcInputs): ISolcOutputs {
  return JSON.parse(
    solc.compile(JSON.stringify(input))
  )
}

export interface ISolcOutputs {
  errors?: ISolcOutputErrors[]
  sources: ISolcOutputSources
  contracts: ISolcOutputContracts
}

export interface ISolcOutputErrors {
  component: string
  errorCode: number
  formattedMessage: string
  message: string
  severity: string
  sourceLocation: {
    end: number
    file: string
    start: number
  }
  type: string
}

export interface ISolcOutputSources {
  [solfile: string]: {
    id: number
    ast: untyped
  }
}

/**
 * Interface is not complete
 * https://docs.soliditylang.org/en/v0.8.6/using-the-compiler.html 
 * 
 * See above link for full API
 */
export interface ISolcOutputContracts {
  [solfile: string]: {
    [contractname: string]: {
      abi: untyped
      metadata: untyped
      userdoc: untyped
      devdoc: untyped
      ir: string
      storageLayout: {
        storage: untyped
        types: untyped
      }
      evm: {
        assembly: string
        legacyAssembly: untyped
        bytecode: {
          functionDebugData: {
            [functionName: string]: {
              entryPoint: number
              id: number
              parameterSlots?: number
              returnSlots?: number
            }
          }
          object: string
        }

      }
    }
  }
}

export interface ISolcInputs {
  language: string
  sources: {
    [key: string]: {
      content: string
    }
  }
  settings?: untyped
}

export const constructSolcInputs = (
  contractName: string,
  solFile: string
): ISolcInputs => ({
  language: 'Solidity',
  sources: {
    [contractName]: {
      content: solFile
    }
  },

  settings: {
    outputSelection: { "*": { "*": [ "*" ], "": [ "*" ] } }
  }
})
