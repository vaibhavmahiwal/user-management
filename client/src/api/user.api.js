import api from './axios'

export const getUsersApi = async (params = {}) => {
  const response = await api.get('/users', { params })
  return response.data
}

export const getUserByIdApi = async (id) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const createUserApi = async (data) => {
  const response = await api.post('/users', data)
  return response.data
}

export const updateUserApi = async (id, data) => {
  const response = await api.patch(`/users/${id}`, data)
  return response.data
}

export const deleteUserApi = async (id) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}

export const toggleUserStatusApi = async (id) => {
  const response = await api.patch(`/users/${id}/toggle-status`)
  return response.data
}

export const updateProfileApi = async (data) => {
  const response = await api.patch('/users/profile', data)
  return response.data
}