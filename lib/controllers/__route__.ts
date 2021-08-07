import {
  Request as req,
  Response as res
} from 'express'
import { validationResult } from 'express-validator'
import { IContract } from '../../__contracts__/icontract'
import { compile, constructSolcInputs, ISolcInputs } from '../lib/compile'
import { signAndSendTransaction } from '../lib/deploy'
import { Web3Fac } from '../web3'
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
  net1: 'MAINNET' | 'BINANCESMARTCHAIN',
  net2: 'KOVAN' | 'BINANCESMARTCHAIN_TEST',
  net3?: 'MAINNET_FORK',
  paramFunc?: (account: Account, req: IRequestBody, web3: Web3) => string
): Promise<res> => Route(req, res, tokenContractFac(
    tokenType, which
  ), net1, net2, tokenType, net3, paramFunc
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
  req: req, res: res, contract: IContract,
  net1: 'BINANCESMARTCHAIN' | 'MAINNET',
  net2: 'BINANCESMARTCHAIN_TEST' | 'KOVAN',
  tokenType: 'ERC20' | 'BEP20',
  net3?: 'MAINNET_FORK',
  paramFunc?: (account: Account, req: IRequestBody, web3: Web3) => string
): Promise<res> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).send(
    { success: false, err: errors }
  )

  const {
    tokenName, tokenDecimals, tokenSymbol,
    totalSupply, network
  } = <IRequestBody>req.body

  if (net3) if (
    network !== net1
    && (network as string) !== net2
    && (network as string) !== net3
  ) return res.status(400).send({
    success: false,
    msg: 'You\'ve entered an unsupported network'
  })

  if (!net3) if (
    network !== net1
    && (network as string) !== net2
  ) return res.status(400).send({
    success: false,
    msg: 'You\'ve entered an unsupported network'
  })

  return RouteHandler(constructSolcInputs(
    tokenName, contract(
      '0.8.6', tokenName, tokenSymbol,
      tokenDecimals, totalSupply.toString()
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