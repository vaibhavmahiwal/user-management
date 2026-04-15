const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
const User = require('../models/User')
const connectDB = require('../config/db')

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Manager User',
    email: 'manager@test.com',
    password: 'Manager@123',
    role: 'manager',
    isActive: true
  },
  {
    name: 'Regular User',
    email: 'user@test.com',
    password: 'User@123',
    role: 'user',
    isActive: true
  }
]

const seed = async () => {
  try {
    await connectDB()
    
    // Clear existing users
    await User.deleteMany({})
    console.log('Cleared existing users')

    // Create users one by one so pre-save hook hashes passwords
    for (const userData of seedUsers) {
      await User.create(userData)
      console.log(`Created: ${userData.email}`)
    }

    console.log('Seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

seed()