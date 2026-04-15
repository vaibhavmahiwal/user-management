const express = require('express')
const router = express.Router()
const ApiResponse = require('../utils/ApiResponse')
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateProfile
} = require('../controllers/user.controller')

const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const validate = require('../middleware/validate')
const {
  createUserValidator,
  updateUserValidator,
  updateProfileValidator,
  userListQueryValidator
} = require('../validators/user.validators')
const { ROLES } = require('../config/constants')

// All routes require authentication
router.use(authenticate)

// Profile route — any authenticated user
//can edit or update their own details
router.get('/profile', (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { user: req.user }, 'Profile fetched successfully')
  )
})
router.patch(
  '/profile',
  updateProfileValidator,
  validate,
  updateProfile
)

// Admin + Manager routes

router.get(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  userListQueryValidator,
  validate,
  getAllUsers
)

router.get(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  getUserById
)

// Admin only routes
router.post(
  '/',
  authorize(ROLES.ADMIN),
  createUserValidator,
  validate,
  createUser
)

router.patch(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  updateUserValidator,
  validate,
  updateUser
)

router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  deleteUser
)

router.patch(
  '/:id/toggle-status',
  authorize(ROLES.ADMIN),
  toggleUserStatus
)

module.exports = router


