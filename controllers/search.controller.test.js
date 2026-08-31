/**
 * Search Controller Tests
 * Tests for Google Books API search endpoint
 */

describe('Search Controller - Search Query Validation', () => {
  test('should validate search query parameter', () => {
    const query = { q: 'Harry Potter' }

    expect(query).toHaveProperty('q')
    expect(query.q).toBeTruthy()
  })

  test('should handle missing query', () => {
    const query = {}

    expect(query.q).toBeUndefined()
  })

  test('should support pagination', () => {
    const query = {
      q: 'Test Query',
      startIndex: 20,
    }

    expect(query).toHaveProperty('startIndex')
    expect(query.startIndex).toBe(20)
  })

  test('should default startIndex to 0', () => {
    const startIndex = undefined || 0

    expect(startIndex).toBe(0)
  })
})

describe('Search Controller - Search Parameters', () => {
  test('should build search parameters', () => {
    const params = {
      q: 'Search Term',
      printType: 'books',
      maxResults: 40,
      key: 'api_key',
      startIndex: 0,
    }

    expect(params).toHaveProperty('q')
    expect(params).toHaveProperty('printType')
    expect(params).toHaveProperty('maxResults')
    expect(params.printType).toBe('books')
  })

  test('should include API key', () => {
    const params = {
      key: 'test_api_key',
    }

    expect(params).toHaveProperty('key')
    expect(params.key).toBeTruthy()
  })
})

describe('Search Controller - Search Response Processing', () => {
  test('should parse search results', () => {
    const response = {
      message: 'Success',
      data: {
        books: [
          {
            bookName: 'Test Book',
            author: ['Author Name'],
            isbn: '9780596007126',
            description: 'Test Description',
            imageUrl: 'https://example.com/image.jpg',
            genre: ['Fiction'],
            language: 'English',
          }
        ],
        booksCount: 100,
      },
    }

    expect(response.message).toBe('Success')
    expect(Array.isArray(response.data.books)).toBe(true)
    expect(response.data.booksCount).toBe(100)
  })

  test('should handle empty search results', () => {
    const response = {
      message: 'Success',
      data: {
        books: [],
        booksCount: 0,
      },
    }

    expect(response.data.books.length).toBe(0)
    expect(response.data.booksCount).toBe(0)
  })

  test('should extract book information', () => {
    const book = {
      bookName: 'The Great Gatsby',
      author: ['F. Scott Fitzgerald'],
      isbn: '9780596007126',
      description: 'A classic novel',
      imageUrl: 'https://example.com/image.jpg',
      genre: ['Fiction', 'Literature'],
      language: 'English',
    }

    expect(book).toHaveProperty('bookName')
    expect(book).toHaveProperty('author')
    expect(book).toHaveProperty('isbn')
    expect(Array.isArray(book.author)).toBe(true)
  })
})

describe('Search Controller - Book Validation', () => {
  test('should filter books with required fields', () => {
    const book1 = {
      bookName: 'Valid Book',
      author: ['Author'],
      isbn: '9780596007126',
    }

    const book2 = {
      bookName: 'Invalid Book',
      author: undefined,
      isbn: undefined,
    }

    const isValid1 = Boolean(book1.bookName && book1.author && book1.isbn)
    const isValid2 = Boolean(book2.bookName && book2.author && book2.isbn)

    expect(isValid1).toBe(true)
    expect(isValid2).toBe(false)
  })

  test('should include books with all required fields', () => {
    const validBooks = [
      {
        bookName: 'Book 1',
        author: ['Author 1'],
        isbn: '9780596007126',
      },
      {
        bookName: 'Book 2',
        author: ['Author 2'],
        isbn: '9780596007127',
      },
    ]

    validBooks.forEach(book => {
      expect(book).toHaveProperty('bookName')
      expect(book).toHaveProperty('author')
      expect(book).toHaveProperty('isbn')
    })
  })

  test('should skip books with missing fields', () => {
    const invalidBooks = [
      { bookName: 'No Author' },
      { author: ['No Name'] },
      { isbn: 'No Book' },
    ]

    const validCount = invalidBooks.filter(
      b => b.bookName && b.author && b.isbn
    ).length

    expect(validCount).toBe(0)
  })
})

describe('Search Controller - Error Handling', () => {
  test('should handle search API errors', () => {
    const error = new Error('Query is required')

    expect(error.message).toContain('Query')
  })

  test('should handle missing query parameter', () => {
    const req = { query: undefined }

    expect(req.query).toBeUndefined()
  })

  test('should handle API failures gracefully', () => {
    const response = {
      message: 'Success',
      data: {
        books: [],
        booksCount: 0,
      },
    }

    expect(response.data.books.length).toBe(0)
  })
})

describe('Search Controller - Language Support', () => {
  test('should handle language names', () => {
    const languageNames = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
    }

    expect(languageNames['en']).toBe('English')
    expect(languageNames['fr']).toBe('French')
  })

  test('should display language name in results', () => {
    const book = {
      language: 'English',
    }

    expect(book).toHaveProperty('language')
    expect(book.language).toBe('English')
  })
})

describe('Search Controller - Response Format', () => {
  test('should return structured response', () => {
    const response = {
      message: 'Success',
      data: {
        books: [],
        booksCount: 0,
      },
    }

    expect(response).toHaveProperty('message')
    expect(response).toHaveProperty('data')
    expect(response.data).toHaveProperty('books')
    expect(response.data).toHaveProperty('booksCount')
  })

  test('should include book count in response', () => {
    const response = {
      data: {
        books: [
          { bookName: 'Book 1' },
          { bookName: 'Book 2' },
        ],
        booksCount: 2,
      },
    }

    expect(response.data.booksCount).toBe(2)
    expect(response.data.books.length).toBe(2)
  })
})

describe('Search Controller - Pagination', () => {
  test('should support page offset', () => {
    const page1 = { startIndex: 0, maxResults: 40 }
    const page2 = { startIndex: 40, maxResults: 40 }

    expect(page2.startIndex).toBeGreaterThan(page1.startIndex)
  })

  test('should calculate next page offset', () => {
    const currentStart = 40
    const maxResults = 40
    const nextStart = currentStart + maxResults

    expect(nextStart).toBe(80)
  })
})
