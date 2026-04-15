const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.5rem 1rem', border: '1px solid #e5e7eb',
          borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          background: currentPage === 1 ? '#f9fafb' : '#fff',
          color: currentPage === 1 ? '#9ca3af' : '#111827'
        }}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '0.5rem 1rem', border: '1px solid #e5e7eb',
            borderRadius: '6px', cursor: 'pointer',
            background: page === currentPage ? '#3b82f6' : '#fff',
            color: page === currentPage ? '#fff' : '#111827',
            fontWeight: page === currentPage ? 600 : 400
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.5rem 1rem', border: '1px solid #e5e7eb',
          borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          background: currentPage === totalPages ? '#f9fafb' : '#fff',
          color: currentPage === totalPages ? '#9ca3af' : '#111827'
        }}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination