const Spinner = ({ size = '40px', color = '#3b82f6' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div
        style={{
          width: size,
          height: size,
          border: `4px solid #e5e7eb`,
          borderTop: `4px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default Spinner