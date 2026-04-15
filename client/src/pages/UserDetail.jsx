import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import Spinner from '../components/shared/Spinner'
import useAuth from '../hooks/useAuth'
import { getUserByIdApi, deleteUserApi, toggleUserStatusApi } from '../api/user.api'

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await getUserByIdApi(id)
      setUser(res.data.user)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch user')
      navigate('/users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUser() }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${user.name}"? This cannot be undone.`)) return
    try {
      await deleteUserApi(id)
      toast.success('User deleted')
      navigate('/users')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggle = async () => {
    try {
      const res = await toggleUserStatusApi(id)
      setUser(res.data.user)
      toast.success('Status updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Toggle failed')
    }
  }

  if (loading) return <Layout><Spinner /></Layout>
  if (!user) return null

  const roleBadgeColor = { admin: '#ef4444', manager: '#f59e0b', user: '#3b82f6' }

  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ width: '140px', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
      <span style={{ color: '#1e293b', fontSize: '0.9rem' }}>{value}</span>
    </div>
  )

  return (
    <Layout>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/users" style={{ color: '#3b82f6', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Users</Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginTop: '0.5rem' }}>
              {user.name}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/users/${id}/edit`} style={{
              padding: '0.5rem 1rem', background: '#f59e0b', color: '#fff',
              borderRadius: '6px', textDecoration: 'none', fontWeight: 500, fontSize: '0.85rem'
            }}>Edit</Link>
            {currentUser?.role === 'admin' && (
              <>
                <button onClick={handleToggle} style={{
                  padding: '0.5rem 1rem', border: 'none', borderRadius: '6px',
                  cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', color: '#fff',
                  background: user.isActive ? '#6b7280' : '#22c55e'
                }}>
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={handleDelete} style={{
                  padding: '0.5rem 1rem', background: '#ef4444', color: '#fff',
                  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem'
                }}>Delete</button>
              </>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div style={{
          background: '#fff', padding: '1.5rem 2rem', borderRadius: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={
            <span style={{
              padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem',
              fontWeight: 600, textTransform: 'capitalize', color: '#fff',
              background: roleBadgeColor[user.role] || '#6b7280'
            }}>
              {user.role}
            </span>
          } />
          <InfoRow label="Status" value={
            <span style={{
              padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem',
              fontWeight: 600, color: '#fff',
              background: user.isActive ? '#22c55e' : '#ef4444'
            }}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          } />
          <InfoRow label="Created" value={new Date(user.createdAt).toLocaleString()} />
          <InfoRow label="Updated" value={new Date(user.updatedAt).toLocaleString()} />
          {user.createdBy && (
            <InfoRow label="Created By" value={`${user.createdBy.name} (${user.createdBy.email})`} />
          )}
          {user.updatedBy && (
            <InfoRow label="Updated By" value={`${user.updatedBy.name} (${user.updatedBy.email})`} />
          )}
        </div>
      </div>
    </Layout>
  )
}

export default UserDetail