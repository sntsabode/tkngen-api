import {
  Request as req,
  Response as res
} from 'express'
import { StandardBEP20 } from '../../__contracts__/BEP/StandardBEP20'
import { compile, constructSolcInputs } from '../lib/compile'
import { Web3Fac } from '../web3'

export async function StandardBEP20Route(
  req: req, res: res
): Promise<res> {
  const {
    tokenName, tokenDecimals, tokenSymbol,
    totalSupply, privateKey, network
  } = req.body

  if (
    network !== 'BINANCESMARTCHAIN'
    && network !== 'BINANCESMARTCHAIN_TEST'
  ) return res.status(400).send({
    success: false,
    msg: 'You\'ve entered an unsupported network'
  })

  const web3 = Web3Fac(network)

  try {
    const outputs = compile(constructSolcInputs(
      tokenName, StandardBEP20(
        '0.8.6', tokenName, tokenSymbol, 
        tokenDecimals, totalSupply
      )
    ))

    const ABI = outputs.contracts[tokenName][tokenName].abi
    const evmBytecode = outputs.contracts[tokenName][tokenName].evm.bytecode.object

    const account = web3.eth.accounts.privateKeyToAccount(privateKey)

    return res.status(200).send({
      success: true,
      msg: 'Successfuly deployed your BEP20 Token!',
      data: {
        receipt: (await web3.eth.accounts.signTransaction({
          from: account.address,
          gas: 5000000,
          gasPrice: 18e9,
          data: evmBytecode
        }, privateKey).then(signedTX => web3.eth.sendSignedTransaction(
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