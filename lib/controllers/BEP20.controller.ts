import {
  Request as req,
  Response as res
} from 'express'
import { validationResult } from 'express-validator'
import { MintableBurnableBEP20 } from '../../__contracts__/BEP/MintableBurnableBEP20'
import { StandardBEP20 } from '../../__contracts__/BEP/StandardBEP20'
import { compile, constructSolcInputs, ISolcInputs } from '../lib/compile'
import { Web3Fac } from '../web3'
import { IRequestBody } from './__req.body__'

export async function StandardBEP20Route(
  req: req, res: res
): Promise<res> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).send(
    { success: false, err: errors }
  )

  const {
    tokenName, tokenDecimals, tokenSymbol,
    totalSupply, privateKey, network
  } = <IRequestBody>req.body

  return Route({
    network, tokenName, privateKey
  }, constructSolcInputs(
    tokenName, StandardBEP20(
      '0.8.6', tokenName, tokenSymbol, 
      tokenDecimals, totalSupply
    )
  ), res)
}

export async function MintableBurnableBEP20Route(
  req: req, res: res
): Promise<res> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).send(
    { success: false, err: errors }
  )

  const {
    tokenName, tokenDecimals, tokenSymbol,
    totalSupply, privateKey, network
  } = <IRequestBody>req.body

  return Route({
    network, tokenName, privateKey
  }, constructSolcInputs(
    tokenName, MintableBurnableBEP20(
      '0.8.6', tokenName, tokenSymbol,
      tokenDecimals, totalSupply
    )
  ), res)
}

async function Route(
  { network, tokenName, privateKey }: Partial<IRequestBody>,
  inputs: ISolcInputs,
  res: res
): Promise<res> {
  if (
    network !== 'BINANCESMARTCHAIN'
    && network !== 'BINANCESMARTCHAIN_TEST'
  ) return res.status(400).send({
    success: false,
    msg: 'You\'ve entered an unsupported network'
  })

  try {
    const web3 = Web3Fac(network)
    const outputs = compile(inputs)

    /* eslint-disable */
    const ABI = outputs.contracts[tokenName!][tokenName!].abi
    const evmBytecode = outputs.contracts[tokenName!][tokenName!].evm.bytecode.object
    const account = web3.eth.accounts.privateKeyToAccount(privateKey!)
    /* eslint-enable */

    return res.status(200).send({
      success: true,
      msg: 'Successfuly deployed your BEP20 Token!',
      data: {
        receipt: (await web3.eth.accounts.signTransaction({
          from: account.address,
          gas: 5000000,
          gasPrice: 18e9,
          data: evmBytecode
          // eslint-disable-next-line
        }, privateKey!).then(signedTX => web3.eth.sendSignedTransaction(
          // eslint-disable-next-line
          signedTX.rawTransaction!
        ))),
        solc: {
          ABI, evmBytecode
        }
      }
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({
      success: false,
      msg: 'Failed to deploy your BEP20 contract. Internal Error.'
    })
  }
}