/**
 * Mock MongoDB models for testing
 */

export const mockUserModel = {
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
}

export const mockLibraryModel = {
  findOne: jest.fn(),
  updateOne: jest.fn(),
  create: jest.fn(),
}

export const mockBookModel = {
  findOne: jest.fn(),
  create: jest.fn(),
}

export const resetMocks = () => {
  jest.clearAllMocks()
}

export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  emailId: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '$2a$10$hashedpassword',
  toJSON: () => ({
    _id: '507f1f77bcf86cd799439011',
    emailId: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  })
}

export const mockBook = {
  _id: '507f1f77bcf86cd799439012',
  bookName: 'Test Book',
  author: ['Author Name'],
  isbn: '9780596007126',
  bookId: '507f1f77bcf86cd799439012',
}

export const mockLibrary = {
  _id: '507f1f77bcf86cd799439013',
  userId: '507f1f77bcf86cd799439011',
  books: [
    {
      bookId: '507f1f77bcf86cd799439012',
      availableBook: 2,
      rentExpected: 100
    }
  ]
}
