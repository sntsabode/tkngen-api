import { 
  check as validate
} from 'express-validator'

export const RequestValidation = [
  validate('tokenName', 'Invalid token name')
    .isString()
    .escape()
    .trim(),

  validate('tokenDecimals', 'Invalid token decimals')
    .isNumeric()  
    .escape()
    .trim(),

  validate('tokenSymbol', 'Invalid token symbol')
    .isString()
    .escape()
    .trim(),

  validate('totalSupply', 'Invalid total supply')
    .isNumeric()
    .escape()
    .trim(),

  validate('privateKey', 'Invalid private key')
    .isString()
    .escape()
    .trim(),

  validate('network', 'Invalid network')
    .isString()
    .escape()
    .trim()
]