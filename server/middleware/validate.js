const { validationResult } = require('express-validator')
const ApiError = require('../utils/ApiError')

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg)
    throw new ApiError(400, 'Validation failed', messages)
  }

  next()
}

module.exports = validate

//This middleware's job is to check that list
//  and block the request if anything is wrong
//if there are errors then we stop
//it collects all validation errors and throws them at once in a clean format.
