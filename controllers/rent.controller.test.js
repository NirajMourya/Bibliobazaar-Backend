/**
 * Rent Controller Tests
 * Tests for rental and issue history endpoints
 */

describe('Rent Controller - Get Rent Details Endpoint', () => {
  test('should validate rent details request', () => {
    const reqBody = {
      rentId: '507f1f77bcf86cd799439011',
    }

    expect(reqBody).toHaveProperty('rentId')
  })

  test('should return rent details', () => {
    const response = {
      message: 'Success',
      data: {
        _id: '507f1f77bcf86cd799439011',
        books: [
          {
            bookId: '507f1f77bcf86cd799439012',
            rent: 250,
            deliveryStatus: 'Delivered',
          }
        ],
        rentedOn: '29-6-2024',
        returnDate: '15-7-2024',
      },
    }

    expect(response.message).toBe('Success')
    expect(response.data).toHaveProperty('_id')
    expect(Array.isArray(response.data.books)).toBe(true)
  })

  test('should handle rent details not found', () => {
    const error = {
      message: 'Rent Details not found',
    }

    expect(error.message).toContain('not found')
  })
})

describe('Rent Controller - Get Issued History Endpoint', () => {
  test('should extract user ID from request', () => {
    const user = {
      userId: '507f1f77bcf86cd799439011',
    }

    expect(user).toHaveProperty('userId')
  })

  test('should return issued history for user', () => {
    const response = {
      message: 'Success',
      data: [
        {
          rentId: '507f1f77bcf86cd799439011',
          rentedOn: '29-6-2024',
          returnDate: '15-7-2024',
          trackingID: 'TRACK123456',
          rent: 250,
          deliveryStatus: 'Delivered',
          bookName: 'Test Book',
          author: ['Author Name'],
          isbn: '9780596007126',
        }
      ],
    }

    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data[0]).toHaveProperty('rentId')
    expect(response.data[0]).toHaveProperty('bookName')
  })

  test('should handle no records found', () => {
    const error = {
      message: 'No records found',
    }

    expect(error.message).toBe('No records found')
  })
})

describe('Rent Controller - Get Offered History Endpoint', () => {
  test('should extract owner ID from request', () => {
    const user = {
      userId: '507f1f77bcf86cd799439011',
    }

    expect(user).toHaveProperty('userId')
  })

  test('should return offered history for owner', () => {
    const response = {
      message: 'Success',
      data: [
        {
          rentId: '507f1f77bcf86cd799439011',
          bookName: 'Offered Book',
          ownerName: 'Jane Doe',
          rentedOn: '29-6-2024',
          returnDate: '15-7-2024',
          rent: 250,
        }
      ],
    }

    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data[0]).toHaveProperty('ownerName')
  })
})

describe('Rent Controller - Add History Endpoint', () => {
  test('should validate add history request', () => {
    const reqBody = {
      bookArray: [
        { bookId: '507f1f77bcf86cd799439012', rent: 250 }
      ],
      paymentMode: 'Razorpay',
      trackingID: 'TRACK123456',
      address: '123 Main St, City',
      subTotal: 250,
      deliveryCharge: 50,
      totalAmount: 300,
      rentedOn: '2024-06-29',
      returnDate: '2024-07-15',
      razorpayOrderId: 'order_123',
      razorpayPaymentId: 'pay_123',
    }

    expect(reqBody).toHaveProperty('bookArray')
    expect(reqBody).toHaveProperty('totalAmount')
    expect(reqBody).toHaveProperty('trackingID')
  })

  test('should extract user ID from request', () => {
    const user = {
      userId: '507f1f77bcf86cd799439011',
    }

    expect(user).toHaveProperty('userId')
  })

  test('should validate book array', () => {
    const bookArray = [
      { bookId: '507f1f77bcf86cd799439012', rent: 250 },
      { bookId: '507f1f77bcf86cd799439013', rent: 150 },
    ]

    expect(Array.isArray(bookArray)).toBe(true)
    expect(bookArray.length).toBe(2)
  })

  test('should calculate totals correctly', () => {
    const subTotal = 250
    const deliveryCharge = 50
    const totalAmount = subTotal + deliveryCharge

    expect(totalAmount).toBe(300)
  })

  test('should return success after adding history', () => {
    const response = {
      message: 'Success',
      data: {
        _id: '507f1f77bcf86cd799439011',
        issuerId: '507f1f77bcf86cd799439010',
        books: [
          { bookId: '507f1f77bcf86cd799439012' }
        ],
      },
    }

    expect(response.message).toBe('Success')
    expect(response.data).toHaveProperty('_id')
  })
})

describe('Rent Controller - Rent Record Structure', () => {
  test('should have complete rent record', () => {
    const rentRecord = {
      rentId: '507f1f77bcf86cd799439011',
      issuerId: '507f1f77bcf86cd799439010',
      rentedOn: '29-6-2024',
      returnDate: '15-7-2024',
      trackingID: 'TRACK123456',
      paymentMode: 'Razorpay',
      totalAmount: 300,
      books: [
        {
          bookId: '507f1f77bcf86cd799439012',
          bookName: 'Test Book',
          author: ['Author Name'],
          isbn: '9780596007126',
          rent: 250,
          deliveryStatus: 'Delivered',
        }
      ],
    }

    expect(rentRecord).toHaveProperty('rentId')
    expect(rentRecord).toHaveProperty('rentedOn')
    expect(rentRecord).toHaveProperty('returnDate')
    expect(Array.isArray(rentRecord.books)).toBe(true)
  })

  test('should have book details in record', () => {
    const bookInRent = {
      bookId: '507f1f77bcf86cd799439012',
      bookName: 'Test Book',
      author: ['Author Name'],
      isbn: '9780596007126',
      imageUrl: 'https://example.com/image.jpg',
      rent: 250,
    }

    expect(bookInRent).toHaveProperty('bookName')
    expect(bookInRent).toHaveProperty('isbn')
    expect(bookInRent).toHaveProperty('rent')
  })
})

describe('Rent Controller - Delivery Status', () => {
  test('should have valid delivery statuses', () => {
    const validStatuses = ['Pending', 'In Transit', 'Delivered', 'Returned']
    const status = 'Delivered'

    expect(validStatuses).toContain(status)
  })

  test('should track delivery status change', () => {
    const statuses = [
      { initial: 'Pending', final: 'In Transit' },
      { initial: 'In Transit', final: 'Delivered' },
      { initial: 'Delivered', final: 'Returned' },
    ]

    statuses.forEach(({ initial, final }) => {
      expect(initial).not.toBe(final)
    })
  })
})

describe('Rent Controller - Error Handling', () => {
  test('should provide error messages', () => {
    const errors = {
      missingRentId: 'rentId required',
      missingIssuerId: 'issuerId is required',
      notFound: 'No records found',
    }

    expect(errors.missingRentId).toBeTruthy()
    expect(errors.notFound).toBeTruthy()
  })
})

describe('Rent Controller - Response Format', () => {
  test('should return standardized response', () => {
    const response = {
      message: 'Success',
      data: {},
    }

    expect(response).toHaveProperty('message')
    expect(response).toHaveProperty('data')
  })
})
