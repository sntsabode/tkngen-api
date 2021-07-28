import { solc } from '../solc'
import { untyped } from '../utils'

/**
 * Compiles a Solidity contract using solc. 
 * @param input 
 */
export async function compile(input: ISolcInputs): Promise<ISolcOutputs> {
  return JSON.parse(
    solc.compile(JSON.stringify(input))
  )
}

/**
 * Interface is not complete
 * https://docs.soliditylang.org/en/v0.8.6/using-the-compiler.html 
 * 
 * See above link for full ABI
 */
export interface ISolcOutputs {
  errors?: {
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
  }[]

  sources: {
    [solfile: string]: {
      id: number
      ast: untyped
    }
  }

  contracts: {
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
          }

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