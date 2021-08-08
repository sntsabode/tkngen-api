import { 
  check as validate, Meta
} from 'express-validator'

function NoSpecialCharsValidation(
  input: string, meta: Meta
) {
  if (/[^a-zA-Z0-9_]/.test(input))
    throw new Error('Found special characters: ' + meta.path)

  return true
}

function AssertPrivateKeyLength(
  input: string, meta: Meta
) {
  if (input.length !== 66)
    throw new Error('Private Key has to be 66 chars long: ' + meta.path)
  
  return true
}

export const RequestValidation = [
  validate('tokenName', 'Invalid token name')
    .isString()
    .escape()
    .trim()
    .custom(NoSpecialCharsValidation),

  validate('tokenDecimals', 'Invalid token decimals')
    .isNumeric()
    .escape()
    .trim(),

  validate('tokenSymbol', 'Invalid token symbol')
    .isString()
    .escape()
    .trim()
    .custom(NoSpecialCharsValidation),

  validate('totalSupply', 'Invalid total supply')
    .isNumeric()
    .escape()
    .trim(),

  validate('privateKey', 'Invalid private key')
    .isString()
    .escape()
    .trim()
    .custom(AssertPrivateKeyLength),

  validate('network', 'Invalid network')
    .isString()
    .escape()
    .trim()
]