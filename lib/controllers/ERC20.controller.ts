import {
  Request as req,
  Response as res
} from 'express'
import { validationResult } from 'express-validator'
import { StandardERC20 } from '../../__contracts__/ERC/StandardERC20'
import { compile, constructSolcInputs } from '../lib/compile'
import { deploy } from '../lib/deploy'
import { Web3Fac } from '../web3'
import { IRequestBody } from './__req.body__'
import { convertToWei, SupportedDecimals } from '../utils'

const AccountUnlockDuration = 10000

export async function StandardERC20Route(
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

  const web3 = Web3Fac(network)
  if (!web3) return res.status(400).send({
    success: false,
    msg: 'You\'ve entered an unsupported network'
  })
  
  try {
    const fromAccount = web3.eth.accounts.privateKeyToAccount(privateKey)
    const outputs = compile(constructSolcInputs(
      tokenName, StandardERC20('0.8.6', tokenName, tokenDecimals, convertToWei(
        totalSupply.toString(), (tokenDecimals.toString() as SupportedDecimals)
      ).toString())
    ))

    const ABI = outputs.contracts[tokenName][tokenName].abi
    const evmBytecode = outputs.contracts[tokenName][tokenName].evm.bytecode.object

    await web3.eth.personal.unlockAccount(
      fromAccount.address,
      fromAccount.privateKey,
      AccountUnlockDuration
    )

    return res.status(200).send({
      success: true,
      msg: 'Successfuly deployed your ERC20 Token!',
      data: {
        receipt: (await deploy({
          ABI,
          metadata: '',
          evmBytecode
        }, web3, [tokenName, tokenSymbol], fromAccount.address)),
        solc: { ABI, evmBytecode }
      }
    })
  } catch (e) {
    console.error(e)

    return res.status(500).send({
      success: false,
      msg: 'Failed to deploy your ERC20 Token. Internal error'
    })
  }
}