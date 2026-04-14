const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided')
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check user still exists and is active
    const user = await User.findById(decoded.id)

    if (!user) {
      throw new ApiError(401, 'User no longer exists')
    }
     
    //verifying the user still exists in DB
    // after token was issued, and checking isActive
    if (!user.isActive) {
      throw new ApiError(401, 'Your account has been deactivated')
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authenticate

