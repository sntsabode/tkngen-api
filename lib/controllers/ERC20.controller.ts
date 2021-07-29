import {
  Request as req,
  Response as res
} from 'express'
import { StandardERC20 } from '../../__contracts__/ERC/StandardERC20'
import { compile, constructSolcInputs } from '../lib/compile'
import { deploy } from '../lib/deploy'
import { Web3Fac } from '../web3'

const AccountUnlockDuration = 10000

export async function StandardERC20Route(
  req: req, res: res
): Promise<res> {
  const {
    tokenName,
    tokenDecimals,
    tokenSymbol,
    fromAccount,
    accountPassword,
    network
  } = req.body

  const web3 = Web3Fac(network)
  if (!web3) return res.status(400).send({
    success: false,
    msg: 'You\'ve entered an unsupported network'
  })
  
  const ERC20Contract = StandardERC20('0.8.6', tokenName, tokenDecimals)

  try {
    const outputs = compile(constructSolcInputs(tokenName, ERC20Contract))

    const ABI = outputs.contracts[tokenName][tokenName].abi
    const evmBytecode = outputs.contracts[tokenName][tokenName].evm.bytecode.object

    await web3.eth.personal.unlockAccount(
      fromAccount,
      accountPassword,
      AccountUnlockDuration
    )

    const receipt = await deploy({
      ABI,
      metadata: '',
      evmBytecode
    }, web3, [tokenName, tokenSymbol], fromAccount)

    return res.status(200).send({
      success: true,
      msg: 'Successfuly deployed your ERC20 Token!',
      data: {
        receipt,
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