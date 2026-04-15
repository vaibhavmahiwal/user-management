const { loginUser, registerUser } = require('../services/auth.service')
const ApiResponse = require('../utils/ApiResponse')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { user, token } = await loginUser(email, password)

    res.status(200).json(
      new ApiResponse(200, { user, token }, 'Login successful')
    )
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const { user, token } = await registerUser({ name, email, password })

    res.status(201).json(
      new ApiResponse(201, { user, token }, 'Registration successful')
    )
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    res.status(200).json(
      new ApiResponse(200, { user: req.user }, 'Profile fetched successfully')
    )
  } catch (error) {
    next(error)
  }
}

module.exports = { login, register, getMe }

//this controllers are intentionallt thin
//no business logic here
//