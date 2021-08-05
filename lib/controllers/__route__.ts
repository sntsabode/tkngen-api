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

const ContractMap = {
  BEP20, ERC20
}

export const RouteEntryPoint = (
  req: req, res: res,
  tokenType: 'ERC20' | 'BEP20',
  which: 'Standard' | 'MintableBurnable',
  net1: 'MAINNET' | 'BINANCESMARTCHAIN',
  net2: 'KOVAN' | 'BINANCESMARTCHAIN_TEST',
  net3?: 'MAINNET_FORK'
): Promise<res> => Route(req, res, tokenContractFac(
    tokenType, which
  ), net1, net2, net3
)

export const tokenContractFac = (
  tokenType: 'BEP20' | 'ERC20',
  which: 'MintableBurnable' | 'Standard'
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
  net3?: 'MAINNET_FORK'
): Promise<res> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).send(
    { success: false, err: errors }
  )

  const {
    tokenName, tokenDecimals, tokenSymbol,
    totalSupply, privateKey, network
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

  return RouteHandler(
    network, tokenName, privateKey, constructSolcInputs(
    tokenName, contract(
      '0.8.6', tokenName, tokenSymbol,
      tokenDecimals, totalSupply.toString()
    )
  ), res, 'BEP20')
}

export async function RouteHandler(
  network: SupportedNetwork,
  tokenName: string,
  privateKey: string,
  inputs: ISolcInputs,
  res: res,
  tokenType: 'ERC20' | 'BEP20'
): Promise<res> {
  try {
    const web3 = Web3Fac(network)
    const outputs = compile(inputs)

    const ABI = outputs.contracts[tokenName][tokenName].abi
    const evmBytecode = outputs.contracts[tokenName][tokenName].evm.bytecode.object
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)

    return res.status(200).send({
      success: true,
      msg: `Successfuly deployed your ${tokenType} Token!`,
      data: {
        receipt: (await signAndSendTransaction({
          from: account.address,
          gas: 5000000,
          gasPrice: 18e9,
          data: evmBytecode
        }, privateKey, web3)),

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