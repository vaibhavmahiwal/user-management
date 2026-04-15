const express = require('express')
const router = express.Router()
const { login, register, getMe } = require('../controllers/auth.controller')
const authenticate = require('../middleware/authenticate')
const validate = require('../middleware/validate')
const {loginValidator,registerValidator} = require('../validators/auth.validators')

// Public routes
router.post('/login', loginValidator, validate, login)
router.post('/register', registerValidator, validate, register)

// Protected routes
router.get('/me', authenticate, getMe)

module.exports = router

