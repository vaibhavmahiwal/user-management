import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#f8fafc'
    }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 800, color: '#e5e7eb' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/dashboard" style={{
        padding: '0.75rem 1.5rem', background: '#3b82f6',
        color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 500
      }}>
        Back to Dashboard
      </Link>
    </div>
  )
}

export default NotFound