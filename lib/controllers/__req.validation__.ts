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
// Can probably make this assertion in the regex
// test above, but... 
function DoesnotBeginWithNumber(
  input: string, meta: Meta
) {
  if (!isNaN(parseFloat(input.charAt(0))))
    throw new Error('Cannot begin with a number: ' + meta.path)

  return true
}

function AssertPrivateKeyLength(
  input: string
) {
  if (input.length !== 64 && input.length !== 66)
    throw new Error('Private Key has to be 64 or 66 chars long.')
  
  return true
}

export const RequestValidation = [
  validate('tokenName', 'Invalid token name')
    .isString()
    .escape()
    .trim()
    .custom(DoesnotBeginWithNumber)
    .custom(NoSpecialCharsValidation),

  validate('tokenDecimals', 'Invalid token decimals')
    .isNumeric()
    .escape()
    .trim(),

  validate('tokenSymbol', 'Invalid token symbol')
    .isString()
    .escape()
    .trim()
    .custom(DoesnotBeginWithNumber)
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