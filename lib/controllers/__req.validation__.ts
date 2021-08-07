import { 
  check as validate, Meta
} from 'express-validator'

function NoSpecialCharsValidation(
  input: string, meta: Meta
) {
  if (/[^a-zA-Z0-9_]/.test(input)) {
    throw new Error('Found special characters: ' + meta.path)
  }

  return true
}

export const RequestValidation = [
  validate('tokenName', 'Invalid token name')
    .isString()
    .custom(NoSpecialCharsValidation)
    .escape()
    .trim(),

  validate('tokenDecimals', 'Invalid token decimals')
    .isNumeric()  
    .escape()
    .trim(),

  validate('tokenSymbol', 'Invalid token symbol')
    .isString()
    .custom(NoSpecialCharsValidation)
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