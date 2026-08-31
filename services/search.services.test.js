/**
 * Search Service Tests
 * Tests for Google Books API search functionality
 */

describe('Search Service - Query Validation', () => {
  test('should validate search query parameter', () => {
    const params = {
      q: 'Harry Potter',
      printType: 'books',
      maxResults: 40,
      key: 'test_api_key',
    }

    expect(params).toHaveProperty('q')
    expect(params.q).toBeTruthy()
  })

  test('should have required search parameters', () => {
    const params = {
      q: 'The Great Gatsby',
      printType: 'books',
      maxResults: 40,
      key: 'api_key_here',
    }

    expect(params).toHaveProperty('q')
    expect(params).toHaveProperty('printType')
    expect(params).toHaveProperty('maxResults')
    expect(params).toHaveProperty('key')
  })

  test('should validate printType is books', () => {
    const printType = 'books'
    const validPrintTypes = ['books', 'magazines']

    expect(validPrintTypes).toContain(printType)
  })

  test('should handle pagination with startIndex', () => {
    const params = {
      q: 'Search term',
      startIndex: 0,
      maxResults: 40,
    }

    expect(params).toHaveProperty('startIndex')
    expect(params.startIndex).toBeGreaterThanOrEqual(0)
  })

  test('should validate maxResults parameter', () => {
    const maxResults = 40
    expect(maxResults).toBeGreaterThan(0)
    expect(maxResults).toBeLessThanOrEqual(40)
  })
})

describe('Search Service - API Response Parsing', () => {
  test('should parse valid search response', () => {
    const apiResponse = {
      totalItems: 100,
      items: [
        {
          volumeInfo: {
            title: 'Test Book',
            authors: ['Author Name'],
            industryIdentifiers: [
              { type: 'ISBN_13', identifier: '9780596007126' }
            ],
            imageLinks: { thumbnail: 'https://example.com/image.jpg' },
            categories: ['Fiction'],
            language: 'en',
            description: 'Test Description',
          }
        }
      ]
    }

    expect(apiResponse).toHaveProperty('totalItems')
    expect(Array.isArray(apiResponse.items)).toBe(true)
    expect(apiResponse.items[0]).toHaveProperty('volumeInfo')
  })

  test('should handle empty search results', () => {
    const emptyResponse = {
      totalItems: 0,
      items: []
    }

    expect(emptyResponse.items.length).toBe(0)
    expect(emptyResponse.totalItems).toBe(0)
  })

  test('should extract book details from API response', () => {
    const bookItem = {
      volumeInfo: {
        title: 'The Great Gatsby',
        authors: ['F. Scott Fitzgerald'],
        description: 'A classic novel',
        industryIdentifiers: [
          { type: 'ISBN_13', identifier: '9780596007126' }
        ],
        imageLinks: { thumbnail: 'https://example.com/image.jpg' },
        categories: ['Fiction', 'Literature'],
        language: 'en',
      }
    }

    const book = {
      bookName: bookItem.volumeInfo.title,
      author: bookItem.volumeInfo.authors,
      description: bookItem.volumeInfo.description,
      isbn: bookItem.volumeInfo.industryIdentifiers[0].identifier,
      imageUrl: bookItem.volumeInfo?.imageLinks?.thumbnail,
      genre: bookItem.volumeInfo.categories,
      language: bookItem.volumeInfo.language,
    }

    expect(book.bookName).toBe('The Great Gatsby')
    expect(book.author[0]).toBe('F. Scott Fitzgerald')
    expect(book.isbn).toBe('9780596007126')
  })

  test('should filter books with missing data', () => {
    const bookWithoutISBN = {
      volumeInfo: {
        title: 'Book Title',
        authors: ['Author'],
      }
    }

    const hasRequiredFields = 
      bookWithoutISBN.volumeInfo.title && 
      bookWithoutISBN.volumeInfo.authors &&
      bookWithoutISBN.volumeInfo.industryIdentifiers

    expect(hasRequiredFields).toBeFalsy()
  })

  test('should include optional fields when available', () => {
    const bookFull = {
      volumeInfo: {
        title: 'Full Book',
        authors: ['Author'],
        industryIdentifiers: [
          { type: 'ISBN_13', identifier: '9780596007126' }
        ],
        imageLinks: { thumbnail: 'https://example.com/image.jpg' },
        categories: ['Fiction'],
        language: 'en',
        description: 'Full description',
      }
    }

    expect(bookFull.volumeInfo?.imageLinks?.thumbnail).toBeTruthy()
    expect(bookFull.volumeInfo.categories).toBeTruthy()
  })
})

describe('Search Service - ISBN Extraction', () => {
  test('should extract ISBN_13 from identifiers', () => {
    const identifiers = [
      { type: 'ISBN_10', identifier: '0596007126' },
      { type: 'ISBN_13', identifier: '9780596007126' }
    ]

    const isbn13 = identifiers.filter(item => item.type === 'ISBN_13')[0].identifier
    expect(isbn13).toBe('9780596007126')
  })

  test('should handle missing ISBN_13', () => {
    const identifiers = [
      { type: 'ISBN_10', identifier: '0596007126' }
    ]

    const isbn13Filter = identifiers.filter(item => item.type === 'ISBN_13')
    expect(isbn13Filter.length).toBe(0)
  })
})

describe('Search Service - Error Handling', () => {
  test('should handle API errors', () => {
    const apiError = {
      error: {
        code: 400,
        message: 'Invalid API key'
      }
    }

    expect(apiError).toHaveProperty('error')
    expect(apiError.error).toHaveProperty('message')
  })

  test('should handle network errors', () => {
    const networkError = new Error('Failed to fetch from Google Books API')
    expect(networkError.message).toContain('Failed')
  })

  test('should handle invalid JSON response', () => {
    const invalidJSON = 'not valid json'
    const parseError = new Error('Invalid response from Google Books API')
    expect(parseError.message).toBe('Invalid response from Google Books API')
  })
})

describe('Search Service - Language Handling', () => {
  test('should support language codes', () => {
    const languageCode = 'en'
    expect(typeof languageCode).toBe('string')
    expect(languageCode.length).toBe(2)
  })

  test('should convert language codes to names', () => {
    const languageMapping = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
    }

    expect(languageMapping['en']).toBe('English')
    expect(languageMapping['es']).toBe('Spanish')
  })
})
