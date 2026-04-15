const userService = require('../services/user.service')
const ApiResponse = require('../utils/ApiResponse')

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, role, isActive, search } = req.query
    const result = await userService.getAllUsers({
      page,
      limit,
      role,
      isActive,
      search
    })

    res.status(200).json(
      new ApiResponse(200, result, 'Users fetched successfully')
    )
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)

    res.status(200).json(
      new ApiResponse(200, { user }, 'User fetched successfully')
    )
  } catch (error) {
    next(error)
  }
}

const createUser = async (req, res, next) => {
  try {
    const { user, plainPassword } = await userService.createUser(
      req.body,
      req.user._id
    )

    // Only return plain password on creation if it was auto-generated
    const data = { user }
    if (plainPassword) data.generatedPassword = plainPassword

    res.status(201).json(
      new ApiResponse(201, data, 'User created successfully')
    )
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(
      req.params.id,
      req.body,
      req.user._id,
      req.user
    )

    res.status(200).json(
      new ApiResponse(200, { user }, 'User updated successfully')
    )
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user._id)

    res.status(200).json(
      new ApiResponse(200, null, 'User deleted successfully')
    )
  } catch (error) {
    next(error)
  }
}

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(
      req.params.id,
      req.user._id
    )

    res.status(200).json(
      new ApiResponse(
        200,
        { user },
        `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
      )
    )
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body)

    res.status(200).json(
      new ApiResponse(200, { user }, 'Profile updated successfully')
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateProfile
}