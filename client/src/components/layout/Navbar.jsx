import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    transition: 'background 0.2s'
  }

  return (
    <nav style={{
      background: '#1e293b',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{ ...linkStyle, fontWeight: 700, fontSize: '1.1rem' }}>
        UserMS
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        {/* Admin + Manager only */}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Link to="/users" style={linkStyle}>
            Users
          </Link>
        )}

        {/* Admin only */}
        {user?.role === 'admin' && (
          <Link to="/users/create" style={linkStyle}>
            + Create User
          </Link>
        )}

        <Link to="/profile" style={linkStyle}>
          Profile
        </Link>

        {/* User info + logout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginLeft: '1rem',
          paddingLeft: '1rem',
          borderLeft: '1px solid #334155'
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {user?.name} •{' '}
            <span style={{
              color: user?.role === 'admin' ? '#ef4444' :
                     user?.role === 'manager' ? '#f59e0b' : '#3b82f6',
              fontWeight: 600,
              textTransform: 'capitalize'
            }}>
              {user?.role}
            </span>
          </span>

          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '0.4rem 0.9rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar