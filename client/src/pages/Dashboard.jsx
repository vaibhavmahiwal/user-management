import Layout from '../components/layout/Layout'
import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const StatCard = ({ label, value, color }) => (
  <div style={{
    background: '#fff', padding: '1.5rem', borderRadius: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    borderLeft: `4px solid ${color}`
  }}>
    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{label}</p>
    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{value}</p>
  </div>
)

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <Layout>
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
          Welcome back, {user?.name} 👋
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
          You are logged in as{' '}
          <span style={{
            fontWeight: 600, textTransform: 'capitalize',
            color: user?.role === 'admin' ? '#ef4444' :
                   user?.role === 'manager' ? '#f59e0b' : '#3b82f6'
          }}>
            {user?.role}
          </span>
        </p>
      </div>

      {/* Admin Dashboard */}
      {user?.role === 'admin' && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <StatCard label="Your Role" value="Admin" color="#ef4444" />
            <StatCard label="Access Level" value="Full" color="#22c55e" />
          </div>

          <div style={{
            background: '#fff', padding: '1.5rem',
            borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/users" style={{
                padding: '0.6rem 1.2rem', background: '#3b82f6',
                color: '#fff', borderRadius: '6px', textDecoration: 'none',
                fontWeight: 500, fontSize: '0.9rem'
              }}>
                View All Users
              </Link>
              <Link to="/users/create" style={{
                padding: '0.6rem 1.2rem', background: '#22c55e',
                color: '#fff', borderRadius: '6px', textDecoration: 'none',
                fontWeight: 500, fontSize: '0.9rem'
              }}>
                + Create User
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Manager Dashboard */}
      {user?.role === 'manager' && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <StatCard label="Your Role" value="Manager" color="#f59e0b" />
            <StatCard label="Access Level" value="Limited" color="#f59e0b" />
          </div>

          <div style={{
            background: '#fff', padding: '1.5rem',
            borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
              Quick Actions
            </h2>
            <Link to="/users" style={{
              padding: '0.6rem 1.2rem', background: '#3b82f6',
              color: '#fff', borderRadius: '6px', textDecoration: 'none',
              fontWeight: 500, fontSize: '0.9rem'
            }}>
              View Users
            </Link>
          </div>
        </>
      )}

      {/* Regular User Dashboard */}
      {user?.role === 'user' && (
        <div style={{
          background: '#fff', padding: '2rem',
          borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
            Your Account
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            You can view and update your own profile.
          </p>
          <Link to="/profile" style={{
            padding: '0.6rem 1.2rem', background: '#3b82f6',
            color: '#fff', borderRadius: '6px', textDecoration: 'none',
            fontWeight: 500, fontSize: '0.9rem'
          }}>
            Go to My Profile
          </Link>
        </div>
      )}
    </Layout>
  )
}

export default Dashboard