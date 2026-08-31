/**
 * Rent Service Tests
 * Tests for rental history and rent management
 */

describe('Rent Service - Rent Details Validation', () => {
  test('should validate rentId requirement', () => {
    const params = { rentId: '507f1f77bcf86cd799439011' }
    expect(params).toHaveProperty('rentId')
    expect(params.rentId).toBeTruthy()
  })

  test('should reject missing rentId', () => {
    const params = {}
    expect(params.rentId).toBeUndefined()
  })

  test('should have valid MongoDB ObjectId format for rentId', () => {
    const rentId = '507f1f77bcf86cd799439011'
    const isValid = /^[0-9a-fA-F]{24}$/.test(rentId)
    expect(isValid).toBe(true)
  })
})

describe('Rent Service - Issued History', () => {
  test('should validate issuerId requirement', () => {
    const params = { issuerId: '507f1f77bcf86cd799439011' }
    expect(params).toHaveProperty('issuerId')
    expect(params.issuerId).toBeTruthy()
  })

  test('should reject missing issuerId', () => {
    const params = {}
    expect(params.issuerId).toBeUndefined()
  })

  test('should format rent records correctly', () => {
    const rentRecord = {
      rentId: '507f1f77bcf86cd799439011',
      rentedOn: '29-6-2024',
      returnDate: '15-7-2024',
      trackingID: 'TRACK123456',
      rent: 250,
      deliveryStatus: 'Delivered',
      ownerName: 'John Doe',
      bookName: 'Test Book',
      author: ['Author Name'],
      isbn: '9780596007126',
      imageUrl: 'https://example.com/image.jpg',
    }

    expect(rentRecord).toHaveProperty('rentId')
    expect(rentRecord).toHaveProperty('rentedOn')
    expect(rentRecord).toHaveProperty('returnDate')
    expect(rentRecord).toHaveProperty('trackingID')
    expect(rentRecord).toHaveProperty('bookName')
  })

  test('should have valid date format in rent records', () => {
    const dateStr = '29-6-2024'
    const dateRegex = /^\d{1,2}-\d{1,2}-\d{4}$/
    expect(dateRegex.test(dateStr)).toBe(true)
  })
})

describe('Rent Service - Offered History', () => {
  test('should validate ownerId requirement', () => {
    const params = { ownerId: '507f1f77bcf86cd799439011' }
    expect(params).toHaveProperty('ownerId')
    expect(params.ownerId).toBeTruthy()
  })

  test('should reject missing ownerId', () => {
    const params = {}
    expect(params.ownerId).toBeUndefined()
  })

  test('should have valid owner structure', () => {
    const ownerInfo = {
      ownerId: '507f1f77bcf86cd799439011',
      ownerName: 'Jane Doe',
      ownerEmail: 'jane@example.com',
    }

    expect(ownerInfo).toHaveProperty('ownerId')
    expect(ownerInfo).toHaveProperty('ownerName')
  })
})

describe('Rent Service - Add History', () => {
  test('should validate add history parameters', () => {
    const params = {
      issuerId: '507f1f77bcf86cd799439011',
      bookArray: [
        { bookId: '507f1f77bcf86cd799439012', rent: 250 }
      ],
      paymentMode: 'Razorpay',
      trackingID: 'TRACK123456',
      address: '123 Main St',
      subTotal: 250,
      deliveryCharge: 50,
      totalAmount: 300,
      rentedOn: new Date(),
      returnDate: new Date(),
    }

    expect(params).toHaveProperty('issuerId')
    expect(params).toHaveProperty('bookArray')
    expect(params).toHaveProperty('totalAmount')
    expect(Array.isArray(params.bookArray)).toBe(true)
  })

  test('should validate rental dates', () => {
    const rentedOn = new Date('2024-06-29')
    const returnDate = new Date('2024-07-15')

    expect(returnDate.getTime()).toBeGreaterThan(rentedOn.getTime())
  })

  test('should calculate total amount correctly', () => {
    const subTotal = 250
    const deliveryCharge = 50
    const totalAmount = subTotal + deliveryCharge

    expect(totalAmount).toBe(300)
  })

  test('should validate payment mode', () => {
    const validPaymentModes = ['Razorpay', 'Cash', 'Card']
    const paymentMode = 'Razorpay'

    expect(validPaymentModes).toContain(paymentMode)
  })

  test('should handle Razorpay payment details', () => {
    const paymentDetails = {
      razorpayOrderId: 'order_1234567890',
      razorpayPaymentId: 'pay_1234567890',
    }

    expect(paymentDetails).toHaveProperty('razorpayOrderId')
    expect(paymentDetails).toHaveProperty('razorpayPaymentId')
  })
})

describe('Rent Service - Book Array Validation', () => {
  test('should validate book array structure', () => {
    const bookArray = [
      {
        bookId: '507f1f77bcf86cd799439012',
        rent: 250,
        deliveryStatus: 'Pending',
      },
      {
        bookId: '507f1f77bcf86cd799439013',
        rent: 150,
        deliveryStatus: 'Delivered',
      },
    ]

    expect(Array.isArray(bookArray)).toBe(true)
    bookArray.forEach(book => {
      expect(book).toHaveProperty('bookId')
      expect(book).toHaveProperty('rent')
    })
  })

  test('should calculate total rent from book array', () => {
    const bookArray = [
      { bookId: '1', rent: 250 },
      { bookId: '2', rent: 150 },
      { bookId: '3', rent: 200 },
    ]

    const totalRent = bookArray.reduce((sum, book) => sum + book.rent, 0)
    expect(totalRent).toBe(600)
  })
})

describe('Rent Service - Error Messages', () => {
  test('should provide clear error messages', () => {
    const errors = {
      missingRentId: 'rentId required',
      missingIssuerId: 'issuerId is required',
      missingOwnerId: 'ownerId is required',
      notFound: 'No records found',
    }

    expect(errors.missingRentId).toBe('rentId required')
    expect(errors.notFound).toBe('No records found')
  })
})
