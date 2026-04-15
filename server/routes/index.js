const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')

router.use('/auth', authRoutes)
router.use('/users', userRoutes)

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

module.exports = router