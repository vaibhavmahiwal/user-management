const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')


const app = express()
const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./utils/logger')


// Security headers
app.use(helmet())
app.set('trust proxy', 1)
// for avoiding core issues
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Remove || '*' for production to keep it secure
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Crucial if you use cookies or specific Auth headers
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