const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

const loginUser = async (email, password) => {
  // Explicitly select password since select:false on model
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Your account has been deactivated. Contact admin.')
  }

  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const token = generateToken(user._id)

  // Return user without password (toJSON handles this)
  return { user, token }
}

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new ApiError(400, 'Email already registered')
  }

  const user = await User.create({ name, email, password })

  const token = generateToken(user._id)

  return { user, token }
}

module.exports = { loginUser, registerUser, generateToken }