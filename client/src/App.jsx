import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserList from './pages/UserList'
import UserDetail from './pages/UserDetail'
import CreateUser from './pages/CreateUser'
import EditUser from './pages/EditUser'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" />
        <Routes>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Any authenticated user */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Admin + Manager only */}
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <UserList />
            </ProtectedRoute>
          } />

          <Route path="/users/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <UserDetail />
            </ProtectedRoute>
          } />

          <Route path="/users/:id/edit" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <EditUser />
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/users/create" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateUser />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App