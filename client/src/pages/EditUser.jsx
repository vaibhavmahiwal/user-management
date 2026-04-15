import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import Spinner from '../components/shared/Spinner'
import useAuth from '../hooks/useAuth'
import { getUserByIdApi, updateUserApi } from '../api/user.api'

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUserByIdApi(id)
        const u = res.data.user
        setForm({ name: u.name, email: u.email, role: u.role, password: '' })
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load user')
        navigate('/users')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { name: form.name, email: form.email, role: form.role }
      if (form.password) payload.password = form.password

      await updateUserApi(id, payload)
      toast.success('User updated successfully!')
      navigate(`/users/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
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

  if (loading) return <Layout><Spinner /></Layout>

  const isManager = currentUser?.role === 'manager'

  return (
    <Layout>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>
          Edit User
        </h1>

        <div style={{
          background: '#fff', padding: '2rem', borderRadius: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Role</label>
              <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                {!isManager && <option value="admin">Admin</option>}
              </select>
              {isManager && (
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                  Managers cannot assign the Admin role.
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={labelStyle}>
                New Password <span style={{ color: '#94a3b8', fontWeight: 400 }}>(leave blank to keep current)</span>
              </label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={saving} style={{
                flex: 1, padding: '0.85rem', background: saving ? '#fcd34d' : '#f59e0b',
                color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem',
                fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer'
              }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => navigate(`/users/${id}`)} style={{
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

export default EditUser