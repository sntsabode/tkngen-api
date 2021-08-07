import {
  Request as req,
  Response as res
} from 'express'
import { RouteEntryPoint } from './__route__'

export const StandardERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  req, res, 'ERC20', 'Standard',
  ['MAINNET', 'KOVAN', 'MAINNET_FORK']
)

export const MintableERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  req, res, 'ERC20', 'Mintable', ['MAINNET', 'KOVAN', 'MAINNET_FORK'],
  (account, req, web3) => web3.eth.abi.encodeParameters(
    ['string memory', 'string memory', 'uint8', 'uint256'],
    [req.tokenName, req.tokenSymbol, req.tokenDecimals, req.totalSupply]
  ).slice(2)
)

export const BurnableERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  req, res, 'BEP20', 'Burnable', ['MAINNET', 'KOVAN', 'MAINNET_FORK'],
  (account, req, web3) => web3.eth.abi.encodeParameters(
    ['string memory', 'string memory', 'uint8', 'uint256'],
    [req.tokenName, req.tokenSymbol, req.tokenDecimals, req.totalSupply]
  ).slice(2)
)