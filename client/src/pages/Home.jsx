import { Link, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/shared/Spinner'

const Home = () => {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#f8fafc'
    }}>
      {/* Logo / Brand */}
      <div style={{
        width: '72px', height: '72px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        borderRadius: '18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
      }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>U</span>
      </div>

      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        marginBottom: '0.75rem',
        textAlign: 'center',
        letterSpacing: '-0.02em'
      }}>
        User Management System
      </h1>

      <p style={{
        fontSize: '1.1rem',
        color: '#94a3b8',
        maxWidth: '460px',
        textAlign: 'center',
        lineHeight: 1.6,
        marginBottom: '2.5rem'
      }}>
        A secure platform to manage users, roles, and permissions.
        Sign in to access your dashboard.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/login" style={{
          padding: '0.85rem 2rem',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: '#fff',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
          Sign In →
        </Link>
      </div>

      {/* Feature cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        maxWidth: '720px',
        width: '100%',
        marginTop: '4rem'
      }}>
        {[
          { icon: '🔐', title: 'Role-Based Access', desc: 'Admin, Manager & User roles with granular permissions' },
          { icon: '👥', title: 'User Management', desc: 'Create, edit, and manage user accounts easily' },
          { icon: '🛡️', title: 'Secure Auth', desc: 'JWT-based authentication with encrypted passwords' }
        ].map((f, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{f.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p style={{ marginTop: '4rem', fontSize: '0.8rem', color: '#475569' }}>
        © 2026 UserMS — Built with React & Express
      </p>
    </div>
  )
}

export default Home
