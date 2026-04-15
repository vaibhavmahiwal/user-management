// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Get role badge color
export const getRoleBadgeColor = (role) => {
  const colors = {
    admin: '#ef4444',
    manager: '#f59e0b',
    user: '#3b82f6'
  }
  return colors[role] || '#6b7280'
}

// Get status badge color
export const getStatusColor = (isActive) => {
  return isActive ? '#22c55e' : '#ef4444'
}