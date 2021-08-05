import {
  Request as req,
  Response as res
} from 'express'
import { RouteEntryPoint } from './__route__'

export const StandardERC20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  req, res, 'ERC20', 'Standard',
  'MAINNET', 'KOVAN', 'MAINNET_FORK'
)