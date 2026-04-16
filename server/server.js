const dotenv = require('dotenv')
dotenv.config()

const app = require('./app')
const connectDB = require('./config/db')
const logger = require('./utils/logger')

// Render provides the PORT, default to 10000 if not found
const PORT = process.env.PORT || 10000 

const startServer = async () => {
  try {
    await connectDB()
    
    // Explicitly binding to '0.0.0.0' for cloud deployment
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    logger.error('❌ Failed to start server', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection! Shutting down...')
  logger.error(err.name, err.message)
  process.exit(1)
})

startServer()