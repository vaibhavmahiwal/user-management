import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import Spinner from '../components/shared/Spinner'
import useAuth from '../hooks/useAuth'
import { getMeApi } from '../api/auth.api'
import { updateProfileApi } from '../api/user.api'

const Profile = () => {
  const { user, updateUserInContext } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMeApi()
        setProfile(res.data.user)
        setForm(f => ({ ...f, name: res.data.user.name }))
      } catch (err) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      const payload = { name: form.name }
      if (form.password) payload.password = form.password

      const res = await updateProfileApi(payload)
      setProfile(res.data.user)
      updateUserInContext(res.data.user)
      setEditing(false)
      setForm(f => ({ ...f, password: '', confirmPassword: '' }))
      toast.success('Profile updated!')
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

  const roleBadgeColor = { admin: '#ef4444', manager: '#f59e0b', user: '#3b82f6' }
  const p = profile || user

  return (
    <Layout>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>
          My Profile
        </h1>

        {/* Profile Card */}
        <div style={{
          background: '#fff', padding: '2rem', borderRadius: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem'
        }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 700, color: '#fff'
            }}>
              {p?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b' }}>{p?.name}</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{p?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{
              padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem',
              fontWeight: 600, textTransform: 'capitalize', color: '#fff',
              background: roleBadgeColor[p?.role] || '#6b7280'
            }}>
              {p?.role}
            </span>
            <span style={{
              padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem',
              fontWeight: 600, color: '#fff',
              background: p?.isActive ? '#22c55e' : '#ef4444'
            }}>
              {p?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Member since {new Date(p?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Edit Section */}
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{
            padding: '0.7rem 1.5rem', background: '#3b82f6', color: '#fff',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem'
          }}>
            Edit Profile
          </button>
        ) : (
          <div style={{
            background: '#fff', padding: '2rem', borderRadius: '10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: '#1e293b' }}>
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Name</label>
                <input name="name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required style={inputStyle} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>
                  New Password <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
                </label>
                <input type="password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep current" style={inputStyle} />
              </div>

              {form.password && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password" required style={inputStyle} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" disabled={saving} style={{
                  flex: 1, padding: '0.85rem', background: saving ? '#93c5fd' : '#3b82f6',
                  color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem',
                  fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer'
                }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => {
                  setEditing(false)
                  setForm({ name: p.name, password: '', confirmPassword: '' })
                }} style={{
                  padding: '0.85rem 1.5rem', background: '#f1f5f9', color: '#374151',
                  border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontWeight: 500
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Profile