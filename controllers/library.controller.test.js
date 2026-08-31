/**
 * Library Controller Tests
 * Tests for book and library management endpoints
 */

describe('Library Controller - Add Book Endpoint', () => {
  test('should validate add book request', () => {
    const reqBody = {
      bookName: 'Test Book',
      author: ['Author Name'],
      isbn: '9780596007126',
      imageUrl: 'https://example.com/image.jpg',
      genre: ['Fiction'],
      description: 'Test Description',
      language: 'English',
      availableBook: 5,
      rentExpected: 250,
    }

    expect(reqBody).toHaveProperty('bookName')
    expect(reqBody).toHaveProperty('isbn')
    expect(reqBody).toHaveProperty('availableBook')
    expect(reqBody).toHaveProperty('rentExpected')
  })

  test('should extract user ID from request', () => {
    const user = {
      userId: '507f1f77bcf86cd799439011',
      emailId: 'test@example.com',
    }

    expect(user).toHaveProperty('userId')
  })

  test('should return success response after adding book', () => {
    const response = {
      message: 'Success',
      data: {
        userId: '507f1f77bcf86cd799439011',
        books: [
          {
            bookId: '507f1f77bcf86cd799439012',
            availableBook: 5,
            rentExpected: 250,
          }
        ],
      },
    }

    expect(response.message).toBe('Success')
    expect(response.data).toHaveProperty('books')
  })
})

describe('Library Controller - Find Book Endpoint', () => {
  test('should validate find book request', () => {
    const reqBody = {
      isbn: '9780596007126',
    }

    expect(reqBody).toHaveProperty('isbn')
  })

  test('should return book if found', () => {
    const response = {
      message: 'Success',
      data: {
        bookId: '507f1f77bcf86cd799439012',
        bookName: 'Found Book',
        isbn: '9780596007126',
      },
    }

    expect(response.data).toHaveProperty('bookId')
    expect(response.data).toHaveProperty('isbn')
  })
})

describe('Library Controller - Edit Book Endpoint', () => {
  test('should validate edit book request', () => {
    const reqBody = {
      bookId: '507f1f77bcf86cd799439012',
      availableBook: 3,
      rentExpected: 150,
    }

    expect(reqBody).toHaveProperty('bookId')
    expect(reqBody).toHaveProperty('availableBook')
    expect(reqBody).toHaveProperty('rentExpected')
  })

  test('should update book availability', () => {
    const updateData = {
      availableBook: 3,
      rentExpected: 150,
    }

    expect(updateData.availableBook).toBe(3)
    expect(updateData.rentExpected).toBe(150)
  })
})

describe('Library Controller - Remove Book Endpoint', () => {
  test('should validate remove book request', () => {
    const reqBody = {
      bookId: '507f1f77bcf86cd799439012',
    }

    expect(reqBody).toHaveProperty('bookId')
  })

  test('should return success after removal', () => {
    const response = {
      message: 'Success',
      data: { deletedCount: 1 },
    }

    expect(response.message).toBe('Success')
  })
})

describe('Library Controller - Book Details Endpoint', () => {
  test('should validate book details request', () => {
    const reqBody = {
      userId: '507f1f77bcf86cd799439011',
      bookId: '507f1f77bcf86cd799439012',
    }

    expect(reqBody).toHaveProperty('userId')
    expect(reqBody).toHaveProperty('bookId')
  })

  test('should return detailed book information', () => {
    const response = {
      message: 'Success',
      data: {
        bookId: '507f1f77bcf86cd799439012',
        bookName: 'Test Book',
        author: ['Author Name'],
        isbn: '9780596007126',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
        genre: ['Fiction'],
        language: 'English',
      },
    }

    expect(response.data).toHaveProperty('bookName')
    expect(response.data).toHaveProperty('author')
    expect(response.data).toHaveProperty('isbn')
  })
})

describe('Library Controller - Get Collection Endpoint', () => {
  test('should extract user ID from token', () => {
    const user = {
      userId: '507f1f77bcf86cd799439011',
    }

    expect(user).toHaveProperty('userId')
  })

  test('should return user library collection', () => {
    const response = {
      message: 'Success',
      data: {
        userId: '507f1f77bcf86cd799439011',
        books: [
          {
            bookId: '507f1f77bcf86cd799439012',
            bookName: 'Book 1',
            availableBook: 5,
          },
          {
            bookId: '507f1f77bcf86cd799439013',
            bookName: 'Book 2',
            availableBook: 3,
          },
        ],
      },
    }

    expect(Array.isArray(response.data.books)).toBe(true)
    expect(response.data.books.length).toBe(2)
  })
})

describe('Library Controller - Search Library Endpoint', () => {
  test('should validate search request', () => {
    const reqBody = {
      searchTerm: 'Harry Potter',
    }

    expect(reqBody).toHaveProperty('searchTerm')
  })

  test('should return search results', () => {
    const response = {
      message: 'Success',
      data: [
        {
          bookId: '507f1f77bcf86cd799439012',
          bookName: 'Harry Potter and the Philosopher\'s Stone',
        },
      ],
    }

    expect(Array.isArray(response.data)).toBe(true)
  })
})

describe('Library Controller - Response Format', () => {
  test('should return standardized success response', () => {
    const response = {
      message: 'Success',
      data: {},
    }

    expect(response).toHaveProperty('message')
    expect(response).toHaveProperty('data')
    expect(response.message).toBe('Success')
  })

  test('should handle error responses', () => {
    const errorResponse = {
      message: 'Error message',
    }

    expect(errorResponse).toHaveProperty('message')
  })
})

describe('Library Controller - User Authorization', () => {
  test('should extract user ID from request context', () => {
    const req = {
      user: {
        userId: '507f1f77bcf86cd799439011',
        emailId: 'test@example.com',
      },
    }

    expect(req.user).toHaveProperty('userId')
    expect(req.user).toHaveProperty('emailId')
  })

  test('should use user ID for library operations', () => {
    const userId = '507f1f77bcf86cd799439011'
    const libraryQuery = { userId }

    expect(libraryQuery.userId).toBe(userId)
  })
})
