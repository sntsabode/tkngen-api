import {
  Request as req,
  Response as res
} from 'express'
import { validationResult } from 'express-validator'
import { compile, constructSolcInputs, ISolcInputs } from '../lib/compile'
import { signAndSendTransaction } from '../lib/deploy'
import { SupportedNetwork, Web3Fac } from '../web3'
import { IRequestBody } from './__req.body__'
import * as BEP20 from '../../__contracts__/BEP/__BEP20__'
import * as ERC20 from '../../__contracts__/ERC/__ERC20__'
import { convertToWei, SupportedDecimals } from '../utils'
import { Account } from 'web3-core'
import Web3 from 'web3'

export type IContract = (
  solver: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  totalSupply: string
) => string

export type TokenType =
  | 'Standard'
  | 'Mintable'
  | 'Burnable'
  | 'MintableBurnable'

const ContractMap = {
  BEP20, ERC20
}

export const tokenContractFac = (
  tokenType: 'BEP20' | 'ERC20',
  which: TokenType
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

export const RouteEntryPoint = (
  tokenType: 'ERC20' | 'BEP20',
  contractType:
    | 'Mintable'
    | 'Burnable'
    | 'MintableBurnable',
  nets: SupportedNetwork[]
): (req: req, res: res) => Promise<res> => (
  req: req, res: res
) => Route(req, res, tokenContractFac(
  tokenType, contractType
), nets, tokenType, (acc, reqb, web3) => web3.eth.abi.encodeParameters(
  ['string memory', 'string memory', 'uint8', 'uint256'],
  [reqb.tokenName, reqb.tokenSymbol, reqb.tokenDecimals, reqb.totalSupply]
).slice(2))

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
    msg: 'You\'ve entered an unsupported network'
  })

  return RouteHandler(req.body, res, constructSolcInputs(
    req.body.tokenName, contract(
      '0.8.6', req.body.tokenName, req.body.tokenSymbol,
      req.body.tokenDecimals, req.body.totalSupply.toString()
    )
  ), tokenType, paramFunc)
}

export async function RouteHandler(
  reqbody: IRequestBody,
  res: res,
  inputs: ISolcInputs,
  tokenType: 'ERC20' | 'BEP20',
  paramFunc?: (account: Account, req: IRequestBody, web3: Web3) => string
): Promise<res> {
  try {
    const web3 = Web3Fac(reqbody.network)
    const outputs = compile(inputs)

    const ABI = outputs.contracts[reqbody.tokenName][reqbody.tokenName].abi
    const evmBytecode = outputs.contracts[reqbody.tokenName][reqbody.tokenName].evm.bytecode.object
    const account = web3.eth.accounts.privateKeyToAccount(reqbody.privateKey)

    const data = paramFunc
      ? evmBytecode + paramFunc(account, reqbody, web3)
      : evmBytecode

    return res.status(200).send({
      success: true,
      msg: `Successfully deployed your ${tokenType} Token!`,
      data: {
        receipt: (await signAndSendTransaction({
          from: account.address,
          gas: 5000000,
          gasPrice: 18e9,
          data
        }, reqbody.privateKey, web3)),

        solc: {
          ABI, evmBytecode
        }
      }
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({
      success: false,
      msg: `Failed to deploy your ${tokenType} contract. Internal Error.`,
      e: e.message ? e.message : null
    })
  }
}
