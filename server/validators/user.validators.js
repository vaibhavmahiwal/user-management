const { body, query } = require('express-validator')
const { ROLES } = require('../config/constants')

const createUserValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Invalid role'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number')
]

const updateUserValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email'),

  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Invalid role'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number')
]

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number'),

  // Block role change from profile update
  body('role')
    .not().exists().withMessage('You cannot change your own role')
]

const userListQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Invalid role filter'),

  query('isActive')
    .optional()
    .isIn(['true', 'false']).withMessage('isActive must be true or false'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search term too long')
]

module.exports = {
  createUserValidator,
  updateUserValidator,
  updateProfileValidator,
  userListQueryValidator
}