const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./utils/logger')

const app = express()

// Security headers
app.use(helmet())

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// Rate limiting — max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
})
app.use('/api', limiter)

// Body parser
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// Request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`)
  next()
})

// Routes
app.use('/api', routes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// Global error handler — must be last
app.use(errorHandler)

module.exports = app