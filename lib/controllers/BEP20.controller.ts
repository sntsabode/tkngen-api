import {
  Request as req,
  Response as res
} from 'express'
import { RouteEntryPoint } from './__route__'

export const StandardBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  req, res, 'BEP20', 'Standard',
  'BINANCESMARTCHAIN', 'BINANCESMARTCHAIN_TEST'
)

export const MintableBurnableBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  req, res, 'BEP20', 'MintableBurnable',
  'BINANCESMARTCHAIN', 'BINANCESMARTCHAIN_TEST'
)