import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import SearchBar from '../components/shared/SearchBar'
import Pagination from '../components/shared/Pagination'
import Spinner from '../components/shared/Spinner'
import useAuth from '../hooks/useAuth'
import { getUsersApi, deleteUserApi, toggleUserStatusApi } from '../api/user.api'

const UserList = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '' })

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (filters.search) params.search = filters.search
      if (filters.role) params.role = filters.role
      if (filters.isActive) params.isActive = filters.isActive

      const res = await getUsersApi(params)
      setUsers(res.data.users)
      setPagination(res.data.pagination)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [filters.role, filters.isActive])

  const handleSearch = (search) => {
    setFilters(f => ({ ...f, search }))
    fetchUsers(1)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await deleteUserApi(id)
      toast.success('User deleted')
      fetchUsers(pagination.page)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id)
      toast.success('Status updated')
      fetchUsers(pagination.page)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Toggle failed')
    }
  }

  const roleBadge = (role) => {
    const colors = { admin: '#ef4444', manager: '#f59e0b', user: '#3b82f6' }
    return (
      <span style={{
        padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem',
        fontWeight: 600, textTransform: 'capitalize', color: '#fff',
        background: colors[role] || '#6b7280'
      }}>
        {role}
      </span>
    )
  }

  const statusBadge = (isActive) => (
    <span style={{
      padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem',
      fontWeight: 600, color: '#fff',
      background: isActive ? '#22c55e' : '#ef4444'
    }}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
          Users ({pagination.total})
        </h1>
        {currentUser?.role === 'admin' && (
          <Link to="/users/create" style={{
            padding: '0.6rem 1.2rem', background: '#22c55e', color: '#fff',
            borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
          }}>
            + Create User
          </Link>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search by name or email..." />
        </div>
        <select
          value={filters.role}
          onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
          style={{
            padding: '0.6rem 1rem', border: '1px solid #e5e7eb', borderRadius: '6px',
            fontSize: '0.9rem', background: '#fff'
          }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
        <select
          value={filters.isActive}
          onChange={e => setFilters(f => ({ ...f, isActive: e.target.value }))}
          style={{
            padding: '0.6rem 1rem', border: '1px solid #e5e7eb', borderRadius: '6px',
            fontSize: '0.9rem', background: '#fff'
          }}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? <Spinner /> : (
        <>
          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                  {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{roleBadge(u.role)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{statusBadge(u.isActive)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/users/${u._id}`} style={{
                          padding: '0.3rem 0.7rem', background: '#3b82f6', color: '#fff',
                          borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem'
                        }}>View</Link>
                        <Link to={`/users/${u._id}/edit`} style={{
                          padding: '0.3rem 0.7rem', background: '#f59e0b', color: '#fff',
                          borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem'
                        }}>Edit</Link>
                        {currentUser?.role === 'admin' && (
                          <>
                            <button onClick={() => handleToggleStatus(u._id)} style={{
                              padding: '0.3rem 0.7rem', border: 'none', borderRadius: '4px',
                              cursor: 'pointer', fontSize: '0.8rem', color: '#fff',
                              background: u.isActive ? '#6b7280' : '#22c55e'
                            }}>
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDelete(u._id, u.name)} style={{
                              padding: '0.3rem 0.7rem', background: '#ef4444', color: '#fff',
                              border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                            }}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => fetchUsers(p)}
          />
        </>
      )}
    </Layout>
  )
}

export default UserList