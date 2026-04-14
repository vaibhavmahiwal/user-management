const ApiError = require('../utils/ApiError')

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required')
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      )
    }

    next()
  }
}

module.exports = authorize

//RBAC (Role-Based Access Control) Engine.
//this file is used to check if te logged in user has right to access a specific route
//we can import this directly in routes