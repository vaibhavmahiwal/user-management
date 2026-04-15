import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Spinner from './Spinner'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  // Wait for localStorage restore before deciding
  if (loading) return <Spinner />

  // Not logged in
  if (!user) return <Navigate to="/login" replace />

  // Logged in but wrong role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute