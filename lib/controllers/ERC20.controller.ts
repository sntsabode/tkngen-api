import {
  Request as req,
  Response as res
} from 'express'
import { Networks } from './__networks__'
import { RouteEntryPoint, RouteEntryPoint_ } from './__route__'

export const StandardERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint_(
  req, res, 'ERC20', 'Standard', Networks.ERC20
)

export const MintableERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  'ERC20', 'Mintable', Networks.ERC20
)(req, res)

export const BurnableERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  'ERC20', 'Burnable', Networks.ERC20
)(req, res)

export const MintableBurnableERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  'ERC20', 'MintableBurnable', Networks.ERC20
)(req, res)