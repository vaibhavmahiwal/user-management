const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const { generatePassword } = require('./password.service')
const { ROLES } = require('../config/constants')

const getAllUsers = async ({ page = 1, limit = 10, role, isActive, search }) => {
  const query = {}

  // Role filter
  if (role) query.role = role

  // Active status filter
  if (isActive !== undefined) query.isActive = isActive === 'true'

  // Search by name or email
  //$regex allows to search for strings that contain a certain pattern
  // , rather than looking for an exact match.
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }

  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    User.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query)
  ])

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  }
}

const getUserById = async (id) => {
  const user = await User.findById(id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')

  if (!user) throw new ApiError(404, 'User not found')

  return user
}

const createUser = async (data, createdById) => {
  const existing = await User.findOne({ email: data.email })
  if (existing) throw new ApiError(400, 'Email already registered')

  // Auto-generate password if not provided
  const plainPassword = data.password || generatePassword()

  const user = await User.create({
    ...data,
    password: plainPassword,
    createdBy: createdById
  })

  // Return plain password only on creation so admin can share it
  return { user, plainPassword: data.password ? null : plainPassword }
}

const updateUser = async (id, data, updatedById, requestingUser) => {
  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'User not found')

  // Manager cannot update admin users
  if (
    requestingUser.role === ROLES.MANAGER &&
    user.role === ROLES.ADMIN
  ) {
    throw new ApiError(403, 'Managers cannot update admin accounts')
  }

  // Manager cannot assign admin role
  if (
    requestingUser.role === ROLES.MANAGER &&
    data.role === ROLES.ADMIN
  ) {
    throw new ApiError(403, 'Managers cannot assign admin role')
  }

  // Apply updates
  Object.assign(user, { ...data, updatedBy: updatedById })

  // If password is being updated, let the pre-save hook hash it
  if (data.password) {
    user.password = data.password
  }

  await user.save()
  return user
}

const deleteUser = async (id, requestingUserId) => {
  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'User not found')

  // Cannot delete yourself
  if (user._id.toString() === requestingUserId.toString()) {
    throw new ApiError(400, 'You cannot delete your own account')
  }

  await User.findByIdAndDelete(id)
  return true
}

const toggleUserStatus = async (id, requestingUserId) => {
  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'User not found')

  if (user._id.toString() === requestingUserId.toString()) {
    throw new ApiError(400, 'You cannot deactivate your own account')
  }

  user.isActive = !user.isActive
  user.updatedBy = requestingUserId
  await user.save()

  return user
}

const updateProfile = async (id, data) => {
  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'User not found')

  if (data.name) user.name = data.name
  if (data.password) user.password = data.password

  user.updatedBy = id
  await user.save()

  return user
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