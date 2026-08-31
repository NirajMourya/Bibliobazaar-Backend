import {
  isValidEmail,
  isValidPassword,
  validateRequiredFields,
  isValidPhoneNumber,
  isValidMongoId,
  isValidISBN,
  sanitizeInput
} from '../utils/validators'

describe('Email Validation', () => {
  test('should validate correct email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true)
  })

  test('should reject invalid email format', () => {
    expect(isValidEmail('invalid.email')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail(null)).toBe(false)
  })

  test('should handle whitespace in email', () => {
    expect(isValidEmail('  test@example.com  ')).toBe(true)
  })
})

describe('Password Validation', () => {
  test('should validate strong password', () => {
    const result = isValidPassword('TestPassword123')
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
  })

  test('should reject weak passwords', () => {
    const result1 = isValidPassword('weak')
    expect(result1.isValid).toBe(false)
    expect(result1.errors.length).toBeGreaterThan(0)

    const result2 = isValidPassword('nouppercase123')
    expect(result2.isValid).toBe(false)

    const result3 = isValidPassword('NOLOWERCASE123')
    expect(result3.isValid).toBe(false)

    const result4 = isValidPassword('NoNumbers')
    expect(result4.isValid).toBe(false)
  })

  test('should handle empty/null password', () => {
    const result = isValidPassword('')
    expect(result.isValid).toBe(false)
    expect(result.errors[0]).toBe('Password is required')
  })
})

describe('Required Fields Validation', () => {
  test('should pass when all required fields are present', () => {
    const data = { email: 'test@example.com', name: 'John' }
    const result = validateRequiredFields(data, ['email', 'name'])
    expect(result.isValid).toBe(true)
    expect(result.missingFields).toEqual([])
  })

  test('should fail when required fields are missing', () => {
    const data = { email: 'test@example.com' }
    const result = validateRequiredFields(data, ['email', 'name', 'age'])
    expect(result.isValid).toBe(false)
    expect(result.missingFields).toContain('name')
    expect(result.missingFields).toContain('age')
  })

  test('should handle empty strings as missing', () => {
    const data = { email: '   ', name: 'John' }
    const result = validateRequiredFields(data, ['email', 'name'])
    expect(result.isValid).toBe(false)
    expect(result.missingFields).toContain('email')
  })
})

describe('Phone Number Validation', () => {
  test('should validate correct 10-digit phone number', () => {
    expect(isValidPhoneNumber('9876543210')).toBe(true)
    expect(isValidPhoneNumber(9876543210)).toBe(true)
  })

  test('should reject invalid phone numbers', () => {
    expect(isValidPhoneNumber('123')).toBe(false)
    expect(isValidPhoneNumber('abcdefghij')).toBe(false)
    expect(isValidPhoneNumber('')).toBe(false)
    expect(isValidPhoneNumber(null)).toBe(false)
  })
})

describe('MongoDB ObjectId Validation', () => {
  test('should validate correct MongoDB ObjectId', () => {
    expect(isValidMongoId('507f1f77bcf86cd799439011')).toBe(true)
    expect(isValidMongoId('507f191e810c19729de860ea')).toBe(true)
  })

  test('should reject invalid MongoDB ObjectId', () => {
    expect(isValidMongoId('invalid')).toBe(false)
    expect(isValidMongoId('507f1f77bcf86cd799439')).toBe(false) // Too short
    expect(isValidMongoId('')).toBe(false)
    expect(isValidMongoId(null)).toBe(false)
  })
})

describe('ISBN Validation', () => {
  test('should validate correct ISBN format', () => {
    expect(isValidISBN('978-0-596-00712-6')).toBe(true)
    expect(isValidISBN('9780596007126')).toBe(true)
  })

  test('should reject invalid ISBN', () => {
    expect(isValidISBN('invalid')).toBe(false)
    expect(isValidISBN('12345')).toBe(false)
    expect(isValidISBN('')).toBe(false)
    expect(isValidISBN(null)).toBe(false)
  })
})

describe('Input Sanitization', () => {
  test('should sanitize HTML tags', () => {
    expect(sanitizeInput('<script>alert("test")</script>')).toBe('scriptalert("test")/script')
    expect(sanitizeInput('<img src=x>')).toBe('img src=x')
  })

  test('should trim whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world')
  })

  test('should handle non-string input', () => {
    expect(sanitizeInput(123)).toBe(123)
    expect(sanitizeInput(null)).toBe(null)
  })
})
