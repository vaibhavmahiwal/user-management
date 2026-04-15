const crypto = require('crypto')

// Auto-generate a strong readable password
const generatePassword = () => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '@#$!'

  // Guarantee at least one of each required type
  const guaranteed =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    special[Math.floor(Math.random() * special.length)]

  // Fill remaining 4 chars from all combined
  const all = upper + lower + numbers + special
  let remaining = ''
  for (let i = 0; i < 4; i++) {
    remaining += all[Math.floor(Math.random() * all.length)]
  }

  // Shuffle so guaranteed chars aren't always at start
  return (guaranteed + remaining)
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

// Generate a secure random token (for future use — reset password etc.)
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

module.exports = { generatePassword, generateResetToken }