import { Router } from 'express'
import * as ERC20Controllers from './controllers/ERC20.controller'
import * as BEP20Controllers from './controllers/BEP20.controller'
import { RequestValidation } from './controllers/__req.validation__'

const router = Router()

router.get('/ping', async (req, res) => {
  return res.status(200).send('ping')
})

router.post(
  '/ERC-20/Standard',
  RequestValidation,
  ERC20Controllers.StandardERC20Route
)

router.post(
  '/ERC-20/Mintable',
  RequestValidation,
  ERC20Controllers.MintableERC20Route
)

router.post(
  '/ERC-20/Burnable',
  RequestValidation,
  ERC20Controllers.BurnableERC20Route
)

router.post(
  '/ERC-20/MintableBurnable',
  RequestValidation,
  ERC20Controllers.MintableBurnableERC20Route
)

//////////////////////////////////////////////////

router.post(
  '/BEP-20/Standard',
  RequestValidation,
  BEP20Controllers.StandardBEP20Route
)

router.post(
  '/BEP-20/Mintable',
  RequestValidation,
  BEP20Controllers.MintableBEP20Route
)

router.post(
  '/BEP-20/Burnable',
  RequestValidation,
  BEP20Controllers.BurnableBEP20Route
)

router.post(
  '/BEP-20/MintableBurnable',
  RequestValidation,
  BEP20Controllers.MintableBurnableBEP20Route
)

export { router }