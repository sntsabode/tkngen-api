import {
  Request as req,
  Response as res
} from 'express'
import { validationResult } from 'express-validator'
import { IContract } from '../../__contracts__/icontract'
import { compile, constructSolcInputs, ISolcInputs } from '../lib/compile'
import { signAndSendTransaction } from '../lib/deploy'
import { SupportedNetwork, Web3Fac } from '../web3'
import { IRequestBody } from './__req.body__'
import * as BEP20 from '../../__contracts__/BEP/__BEP20__'
import * as ERC20 from '../../__contracts__/ERC/__ERC20__'
import { convertToWei, SupportedDecimals } from '../utils'
import { Account } from 'web3-core'
import Web3 from 'web3'

const ContractMap = {
  BEP20, ERC20
}

export const RouteEntryPoint = (
  req: req, res: res,
  tokenType: 'ERC20' | 'BEP20',
  which:
    | 'Standard'
    | 'Mintable'
    | 'Burnable'
    | 'MintableBurnable',
  nets: SupportedNetwork[],
  paramFunc?: (account: Account, req: IRequestBody, web3: Web3) => string
): Promise<res> => Route(req, res, tokenContractFac(
    tokenType, which
  ), nets, tokenType, paramFunc
)

export const tokenContractFac = (
  tokenType: 'BEP20' | 'ERC20',
  which:
    | 'MintableBurnable'
    | 'Mintable'
    | 'Burnable'
    | 'Standard'
): IContract => (
  solver: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  totalSupply: string
) => ContractMap[tokenType][which](
  solver, tokenName, tokenSymbol, tokenDecimals, convertToWei(totalSupply,
    (tokenDecimals.toString() as SupportedDecimals)
  ).toString()
)

export async function Route(
  req: req,
  res: res,
  contract: IContract,
  nets: SupportedNetwork[],
  tokenType: 'ERC20' | 'BEP20',
  paramFunc?: (account: Account, req: IRequestBody, web3: Web3) => string
): Promise<res> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).send(
    { success: false, err: errors }
  )

  if (!nets.includes(req.body.network)) return res.status(400).send({
    success: false,
    msg: 'You\'ve enteredan unsupported network'
  })

  return RouteHandler(constructSolcInputs(
    req.body.tokenName, contract(
      '0.8.6', req.body.tokenName, req.body.tokenSymbol,
      req.body.tokenDecimals, req.body.totalSupply.toString()
    )
  ), res, tokenType, req.body, paramFunc)
}

export async function RouteHandler(
  inputs: ISolcInputs,
  res: res,
  tokenType: 'ERC20' | 'BEP20',
  req: IRequestBody,
  paramFunc?: (account: Account, req: IRequestBody, web3: Web3) => string
): Promise<res> {
  try {
    const web3 = Web3Fac(req.network)
    const outputs = compile(inputs)

    const ABI = outputs.contracts[req.tokenName][req.tokenName].abi
    const evmBytecode = outputs.contracts[req.tokenName][req.tokenName].evm.bytecode.object
    const account = web3.eth.accounts.privateKeyToAccount(req.privateKey)

    const data = paramFunc
      ? evmBytecode + paramFunc(account, req, web3)
      : evmBytecode

    return res.status(200).send({
      success: true,
      msg: `Successfuly deployed your ${tokenType} Token!`,
      data: {
        receipt: (await signAndSendTransaction({
          from: account.address,
          gas: 5000000,
          gasPrice: 18e9,
          data
        }, req.privateKey, web3)),

        solc: {
          ABI, evmBytecode
        }
      }
    })
  } catch (e) {
    console.error(e.message)
    return res.status(500).send({
      success: false,
      msg: `Failed to deploy your ${tokenType} contract. Internal Error.`
    })
  }
}