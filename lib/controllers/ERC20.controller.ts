import {
  Request as req,
  Response as res
} from 'express'
import { RouteEntryPoint, RouteEntryPoint_ } from './__route__'

export const StandardERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint_(
  req, res, 'ERC20', 'Standard',
  ['MAINNET', 'KOVAN', 'MAINNET_FORK']
)

export const MintableERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint('ERC20', 'Mintable', [
  'MAINNET', 'MAINNET_FORK', 'KOVAN'
])(req, res)

export const BurnableERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint('ERC20', 'Burnable', [
  'MAINNET', 'MAINNET_FORK', 'KOVAN'
])(req, res)

export const MintableBurnableERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint('ERC20', 'MintableBurnable', [
  'MAINNET', 'MAINNET_FORK', 'KOVAN'
])(req, res)