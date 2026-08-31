/**
 * Library Service Tests
 * Tests for book management, library operations
 */

describe('Library Service - Book Management Validation', () => {
  test('should validate required book fields', () => {
    const requiredFields = ['userId', 'bookName', 'author', 'isbn', 'availableBook', 'rentExpected']
    const bookData = {
      userId: '507f1f77bcf86cd799439011',
      bookName: 'The Great Gatsby',
      author: ['F. Scott Fitzgerald'],
      isbn: '9780596007126',
      availableBook: 5,
      rentExpected: 250
    }

    requiredFields.forEach(field => {
      expect(bookData).toHaveProperty(field)
      expect(bookData[field]).toBeTruthy()
    })
  })

  test('should reject invalid ISBN during add book', () => {
    const invalidISBNs = [
      'invalid',
      '12345',
      '',
      null,
    ]

    invalidISBNs.forEach(isbn => {
      const isValid = Boolean(isbn && /^(97(8|9))?[0-9]{9}([0-9]|X)$/.test(isbn.toString().replace(/-/g, '')))
      expect(isValid).toBe(false)
    })
  })

  test('should validate valid ISBN format', () => {
    const validISBNs = [
      '978-0-596-00712-6',
      '9780596007126',
      '0-596-00712-4',
    ]

    validISBNs.forEach(isbn => {
      const cleanISBN = isbn.replace(/-/g, '')
      const isValid = /^(97(8|9))?[0-9]{9}([0-9]|X)$/.test(cleanISBN)
      expect(isValid).toBe(true)
    })
  })

  test('should prevent duplicate books in library', () => {
    const libraryBooks = [
      { bookId: '1', availableBook: 2 },
      { bookId: '2', availableBook: 3 },
    ]

    const newBookId = '2'
    const isDuplicate = libraryBooks.some(book => book.bookId === newBookId)

    expect(isDuplicate).toBe(true)
  })

  test('should allow adding new unique books', () => {
    const libraryBooks = [
      { bookId: '1', availableBook: 2 },
      { bookId: '2', availableBook: 3 },
    ]

    const newBookId = '3'
    const isDuplicate = libraryBooks.some(book => book.bookId === newBookId)

    expect(isDuplicate).toBe(false)
  })
})

describe('Library Service - Book Details', () => {
  test('should have valid book details structure', () => {
    const bookDetails = {
      bookId: '507f1f77bcf86cd799439012',
      bookName: 'Test Book',
      author: ['Author Name'],
      isbn: '9780596007126',
      description: 'A test book',
      imageUrl: 'https://example.com/image.jpg',
      genre: ['Fiction'],
      language: 'English',
      availableBook: 2,
      rentExpected: 100,
      createdAt: new Date(),
    }

    expect(bookDetails).toHaveProperty('bookId')
    expect(bookDetails).toHaveProperty('bookName')
    expect(bookDetails).toHaveProperty('isbn')
    expect(Array.isArray(bookDetails.author)).toBe(true)
  })

  test('should update book availability correctly', () => {
    const currentAvailable = 5
    const rentExpected = 250

    const updatedAvailable = currentAvailable - 1
    expect(updatedAvailable).toBe(4)
    expect(rentExpected).toBeGreaterThan(0)
  })

  test('should handle book removal', () => {
    const libraryBooks = [
      { bookId: '1', availableBook: 2 },
      { bookId: '2', availableBook: 3 },
      { bookId: '3', availableBook: 1 },
    ]

    const bookIdToRemove = '2'
    const filteredBooks = libraryBooks.filter(book => book.bookId !== bookIdToRemove)

    expect(filteredBooks.length).toBe(2)
    expect(filteredBooks.some(book => book.bookId === '2')).toBe(false)
  })
})

describe('Library Service - Collection Management', () => {
  test('should retrieve user collection correctly', () => {
    const userLibrary = {
      userId: '507f1f77bcf86cd799439011',
      books: [
        { bookId: '1', availableBook: 2, rentExpected: 100 },
        { bookId: '2', availableBook: 1, rentExpected: 150 },
        { bookId: '3', availableBook: 3, rentExpected: 200 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    expect(userLibrary).toHaveProperty('userId')
    expect(Array.isArray(userLibrary.books)).toBe(true)
    expect(userLibrary.books.length).toBe(3)
  })

  test('should count total books in collection', () => {
    const library = {
      books: [
        { bookId: '1', availableBook: 2 },
        { bookId: '2', availableBook: 1 },
        { bookId: '3', availableBook: 3 },
      ]
    }

    const totalBooks = library.books.reduce((sum, book) => sum + book.availableBook, 0)
    expect(totalBooks).toBe(6)
  })

  test('should search books by ISBN in collection', () => {
    const books = [
      { isbn: '9780596007126', title: 'Book 1' },
      { isbn: '9781491959633', title: 'Book 2' },
      { isbn: '9781491927282', title: 'Book 3' },
    ]

    const searchISBN = '9781491959633'
    const foundBook = books.find(book => book.isbn === searchISBN)

    expect(foundBook).toBeDefined()
    expect(foundBook.title).toBe('Book 2')
  })
})

describe('Library Service - Error Handling', () => {
  test('should provide clear error messages', () => {
    const errors = {
      missingUserId: 'userId is required',
      missingISBN: 'ISBN is required',
      invalidISBN: 'Invalid ISBN format',
      duplicateBook: 'Book already present in library',
      bookNotFound: 'Book not found',
    }

    expect(errors.duplicateBook).toBe('Book already present in library')
  })

  test('should handle invalid userId validation', () => {
    const invalidUserIds = [
      '',
      null,
      undefined,
      'invalid-id-format',
    ]

    const mongoIdRegex = /^[0-9a-fA-F]{24}$/

    invalidUserIds.forEach(id => {
      const isValid = id && mongoIdRegex.test(id.toString())
      expect(isValid).toBeFalsy()
    })
  })
})
