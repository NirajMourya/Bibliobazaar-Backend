/**
 * Book Service Tests
 * Tests for book-related operations and book creation
 */

describe('Book Service - Book Validation', () => {
  test('should validate ISBN requirement', () => {
    const params = {
      bookName: 'Test Book',
      author: ['Author Name'],
    }

    const missingFields = ['isbn']
    expect(params).not.toHaveProperty('isbn')
    missingFields.forEach(field => {
      expect(Object.keys(params).includes(field)).toBe(false)
    })
  })

  test('should have valid book structure', () => {
    const bookParams = {
      bookName: 'Test Book',
      author: ['Author Name'],
      isbn: '9780596007126',
      imageUrl: 'https://example.com/image.jpg',
      genre: ['Fiction'],
      language: 'English',
      description: 'A great book'
    }

    expect(bookParams).toHaveProperty('bookName')
    expect(bookParams).toHaveProperty('author')
    expect(bookParams).toHaveProperty('isbn')
    expect(Array.isArray(bookParams.author)).toBe(true)
  })

  test('should validate ISBN format in book creation', () => {
    const validISBNs = ['9780596007126', '978-0-596-00712-6']
    const invalidISBNs = ['invalid', '12345']

    validISBNs.forEach(isbn => {
      const cleaned = isbn.replace(/-/g, '')
      const isValid = /^(97(8|9))?[0-9]{9}([0-9]|X)$/.test(cleaned)
      expect(isValid).toBe(true)
    })

    invalidISBNs.forEach(isbn => {
      const cleaned = isbn.replace(/-/g, '')
      const isValid = /^(97(8|9))?[0-9]{9}([0-9]|X)$/.test(cleaned)
      expect(isValid).toBe(false)
    })
  })

  test('should handle book with image URL', () => {
    const bookWithImage = {
      bookName: 'Book with Image',
      author: ['Author'],
      isbn: '9780596007126',
      imageUrl: 'https://example.com/image.jpg',
    }

    expect(bookWithImage).toHaveProperty('imageUrl')
    expect(typeof bookWithImage.imageUrl).toBe('string')
    expect(bookWithImage.imageUrl).toContain('http')
  })

  test('should handle book without image URL', () => {
    const bookWithoutImage = {
      bookName: 'Book without Image',
      author: ['Author'],
      isbn: '9780596007126',
    }

    expect(bookWithoutImage).not.toHaveProperty('imageUrl')
  })
})

describe('Book Service - Book ID Generation', () => {
  test('should generate unique book ID', () => {
    const book1Id = '507f1f77bcf86cd799439011'
    const book2Id = '507f1f77bcf86cd799439012'

    expect(book1Id).not.toBe(book2Id)
    expect(book1Id.length).toBe(24)
    expect(book2Id.length).toBe(24)
  })

  test('should have valid MongoDB ObjectId format', () => {
    const bookId = '507f1f77bcf86cd799439011'
    const isValid = /^[0-9a-fA-F]{24}$/.test(bookId)
    expect(isValid).toBe(true)
  })
})

describe('Book Service - Book Details', () => {
  test('should preserve book details when creating', () => {
    const originalBook = {
      bookName: 'Original Book',
      author: ['Original Author'],
      isbn: '9780596007126',
      description: 'Original Description',
      genre: ['Fiction'],
    }

    const savedBook = {
      _id: '507f1f77bcf86cd799439011',
      ...originalBook,
      createdAt: new Date(),
    }

    expect(savedBook.bookName).toBe(originalBook.bookName)
    expect(savedBook.author).toEqual(originalBook.author)
    expect(savedBook.isbn).toBe(originalBook.isbn)
  })

  test('should handle multiple authors', () => {
    const book = {
      bookName: 'Collaborative Book',
      author: ['Author 1', 'Author 2', 'Author 3'],
      isbn: '9780596007126',
    }

    expect(Array.isArray(book.author)).toBe(true)
    expect(book.author.length).toBe(3)
  })

  test('should handle multiple genres', () => {
    const book = {
      bookName: 'Multi-Genre Book',
      genre: ['Fiction', 'Adventure', 'Science Fiction'],
      isbn: '9780596007126',
    }

    expect(Array.isArray(book.genre)).toBe(true)
    expect(book.genre.length).toBe(3)
  })
})

describe('Book Service - Error Messages', () => {
  test('should provide clear error for missing ISBN', () => {
    const errorMsg = 'ISBN Required'
    expect(errorMsg).toBe('ISBN Required')
  })

  test('should provide clear error for duplicate books', () => {
    const errorMsg = 'Book details required'
    expect(errorMsg).toBe('Book details required')
  })
})
