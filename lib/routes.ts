import { Router } from 'express'
import * as ERC20Controllers from './controllers/ERC20.controller'

const router = Router()

router.get('/ping', async (req, res) => {
  return res.status(200).send('ping')
})

router.post('/ERC-20/Standard', ERC20Controllers.StandardERC20Route)

export { router }