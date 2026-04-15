import { createContext, useState, useEffect } from 'react'
import { loginApi } from '../api/auth.api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load — restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      console.log('Restoring session from localStorage...')
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    } else {
      console.log('No session found in localStorage.')
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await loginApi(email, password)
    const { user, token } = response.data

    // Persist to localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    setUser(user)
    setToken(token)

    return user // return user so Login page can redirect based on role
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }

  const updateUserInContext = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, updateUserInContext }}
    >
      {children}
    </AuthContext.Provider>
  )
}