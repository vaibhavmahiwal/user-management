import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {children}
      </main>
    </div>
  )
}

export default Layout