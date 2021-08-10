import {
  Request as req,
  Response as res
} from 'express'
import { RouteEntryPoint, Route, tokenContractFac } from './__route__'
import { Networks } from './__networks__'

export const StandardBEP20Route = (
  req: req, res: res
): Promise<res> => Route(req, res, tokenContractFac(
  'BEP20', 'Standard'
), Networks.BEP20, 'BEP20')

export const MintableBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  'BEP20', 'Mintable', Networks.BEP20
)(req, res)

export const BurnableBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  'BEP20', 'Burnable', Networks.BEP20
)(req, res)

export const MintableBurnableBEP20Route = (
  req: req, res: res
): Promise<res> => RouteEntryPoint(
  'BEP20', 'MintableBurnable', Networks.BEP20
)(req, res)