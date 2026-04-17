import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Already logged in
  if (user) return <Navigate to="/dashboard" replace />

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  // --- NEW FUNCTION: Auto-fills the form ---
  const handleQuickFill = (email, password) => {
    setForm({ email, password });
    setError('');
    toast.success(`${email.split('@')[0]} credentials loaded!`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            UserMS
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
              style={{
                width: '100%', padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb', borderRadius: '6px',
                fontSize: '0.95rem', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: '#374151' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb', borderRadius: '6px',
                fontSize: '0.95rem', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.85rem',
              background: loading ? '#93c5fd' : '#3b82f6',
              color: '#fff', border: 'none', borderRadius: '6px',
              fontSize: '1rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* --- UPDATED: Clickable Test Accounts --- */}
        <div style={{
          marginTop: '1.5rem', padding: '1rem',
          background: '#f1f5f9', borderRadius: '6px',
          fontSize: '0.8rem', color: '#64748b'
        }}>
          <strong style={{ display: 'block', marginBottom: '0.6rem' }}>Test Accounts (Click to fill):</strong>
          
          <button 
            type="button" 
            onClick={() => handleQuickFill('admin@test.com', 'Admin@123')}
            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '2px 0', display: 'block', fontSize: '0.8rem' }}
          >
            🚀 Admin: admin@test.com / Admin@123
          </button>

          <button 
            type="button" 
            onClick={() => handleQuickFill('manager@test.com', 'Manager@123')}
            style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: '2px 0', display: 'block', fontSize: '0.8rem' }}
          >
            📊 Manager: manager@test.com / Manager@123
          </button>

          <button 
            type="button" 
            onClick={() => handleQuickFill('user@test.com', 'User@123')}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px 0', display: 'block', fontSize: '0.8rem' }}
          >
            👤 User: user@test.com / User@123
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login