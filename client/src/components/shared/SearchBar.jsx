import { useState } from 'react'

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', padding: '0.6rem 2.5rem 0.6rem 1rem',
            border: '1px solid #e5e7eb', borderRadius: '6px',
            fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
          }}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute', right: '0.5rem', top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        )}
      </div>
      <button
        type="submit"
        style={{
          padding: '0.6rem 1.2rem', background: '#3b82f6',
          color: '#fff', border: 'none', borderRadius: '6px',
          cursor: 'pointer', fontWeight: 500
        }}
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar