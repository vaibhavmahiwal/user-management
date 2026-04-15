import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import { createUserApi } from '../api/user.api'

const CreateUser = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { name: form.name, email: form.email, role: form.role }
      if (form.password) payload.password = form.password

      const res = await createUserApi(payload)
      if (res.data.generatedPassword) {
        setGeneratedPassword(res.data.generatedPassword)
        toast.success('User created! Auto-generated password shown below.')
      } else {
        toast.success('User created successfully!')
        navigate('/users')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb', borderRadius: '6px',
    fontSize: '0.95rem', boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', marginBottom: '0.5rem',
    fontWeight: 500, fontSize: '0.9rem', color: '#374151'
  }

  return (
    <Layout>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>
          Create New User
        </h1>

        {generatedPassword && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem 1.25rem',
            borderRadius: '8px', marginBottom: '1.5rem'
          }}>
            <strong style={{ color: '#16a34a' }}>✅ User Created!</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#374151' }}>
              Auto-generated password: <code style={{
                background: '#e5e7eb', padding: '0.2rem 0.5rem', borderRadius: '4px',
                fontWeight: 600, fontSize: '0.95rem'
              }}>{generatedPassword}</code>
            </p>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Share this password with the user. It won't be shown again.
            </p>
            <button onClick={() => navigate('/users')} style={{
              marginTop: '0.75rem', padding: '0.5rem 1rem', background: '#3b82f6',
              color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500
            }}>
              Go to Users
            </button>
          </div>
        )}

        <div style={{
          background: '#fff', padding: '2rem', borderRadius: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="john@example.com" required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>
                Password <span style={{ color: '#94a3b8', fontWeight: 400 }}>(leave blank to auto-generate)</span>
              </label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={labelStyle}>Role *</label>
              <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={loading} style={{
                flex: 1, padding: '0.85rem', background: loading ? '#93c5fd' : '#3b82f6',
                color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem',
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
              }}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
              <button type="button" onClick={() => navigate('/users')} style={{
                padding: '0.85rem 1.5rem', background: '#f1f5f9', color: '#374151',
                border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer',
                fontWeight: 500
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default CreateUser