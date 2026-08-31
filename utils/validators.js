/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  return EMAIL_REGEX.test(email.trim())
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
const isValidPassword = (password) => {
  const errors = []
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] }
  }
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Validate required fields
 * @param {object} data - Data object
 * @param {array} requiredFields - Array of required field names
 * @returns {object} - { isValid: boolean, missingFields: string[] }
 */
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = []
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missingFields.push(field)
    }
  })
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
const isValidPhoneNumber = (phone) => {
  if (!phone) return false
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.toString().trim())
}

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean}
 */
const isValidMongoId = (id) => {
  if (!id || typeof id !== 'string') return false
  return /^[0-9a-fA-F]{24}$/.test(id.trim())
}

/**
 * Validate ISBN format
 * @param {string} isbn - ISBN to validate
 * @returns {boolean}
 */
const isValidISBN = (isbn) => {
  if (!isbn || typeof isbn !== 'string') return false
  const cleanISBN = isbn.trim().replace(/-/g, '')
  return /^(97(8|9))?[0-9]{9}([0-9]|X)$/.test(cleanISBN)
}

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string}
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[<>]/g, '')
}

export {
  isValidEmail,
  isValidPassword,
  validateRequiredFields,
  isValidPhoneNumber,
  isValidMongoId,
  isValidISBN,
  sanitizeInput
}
