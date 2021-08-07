import {
  Request as req,
  Response as res
} from 'express'
import { RouteEntryPoint, RouteEntryPoint_ } from './__route__'

export const StandardBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint_(
  req, res, 'BEP20', 'Standard',
  ['BINANCESMARTCHAIN', 'BINANCESMARTCHAIN_TEST']
)

export const MintableBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint('BEP20', 'Mintable', [
  'BINANCESMARTCHAIN', 'BINANCESMARTCHAIN_TEST'
])(req, res)

export const BurnableBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint('BEP20', 'Burnable', [
  'BINANCESMARTCHAIN', 'BINANCESMARTCHAIN_TEST'
])(req, res)

export const MintableBurnableBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint('BEP20', 'MintableBurnable', [
  'BINANCESMARTCHAIN', 'BINANCESMARTCHAIN_TEST'
])(req, res)