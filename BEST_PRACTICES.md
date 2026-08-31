# Code Quality & Best Practices

## Overview

This document outlines best practices and code standards for the Bibliobazaar Backend project.

## Error Handling

### ✅ DO: Always use try-catch for async functions
```javascript
const signUpService = async (params, callback) => {
  try {
    const result = await users.create(params);
    return callback(null, result);
  } catch (error) {
    return callback(error);
  }
};
```

### ❌ DON'T: Mix callbacks and promises without proper error handling
```javascript
// Bad - potential unhandled rejection
const user = users.findOne({ email });
user.then(res => {
  // ...
}).catch(err => {
  // ...
});
```

### ✅ DO: Validate inputs early
```javascript
const { isValid, missingFields } = validateRequiredFields(params, ['email', 'password']);
if (!isValid) {
  return callback({ message: `Missing fields: ${missingFields.join(', ')}` });
}
```

### ❌ DON'T: Assume inputs are valid
```javascript
// Bad - will crash if params is undefined
const email = params.email.toLowerCase();
```

## Input Validation

### Required validations for every endpoint:

1. **Email inputs** - Use `isValidEmail()`
2. **Passwords** - Use `isValidPassword()`
3. **Phone numbers** - Use `isValidPhoneNumber()`
4. **MongoDB IDs** - Use `isValidMongoId()`
5. **ISBN values** - Use `isValidISBN()`

### Example validation pattern:
```javascript
import { isValidEmail, validateRequiredFields } from '../utils/validators';

const registerUser = (req, res, next) => {
  // 1. Validate required fields
  const { isValid, missingFields } = validateRequiredFields(
    req.body,
    ['email', 'password', 'firstName']
  );
  if (!isValid) {
    return res.status(400).json({ message: `Missing: ${missingFields.join(', ')}` });
  }

  // 2. Validate specific formats
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // 3. Proceed with business logic
  signUpService(req.body, (error, result) => {
    if (error) return next(error);
    return res.status(200).json({ message: 'Success', data: result });
  });
};
```

## Security Best Practices

### 1. Never expose sensitive data in responses
```javascript
// ✅ Good - sensitive fields excluded
return res.json({ 
  ...user.toJSON(), // Mongoose toJSON excludes password
  token: jwtToken 
});

// ❌ Bad - password exposed
return res.json({ 
  email: user.email,
  password: user.password, // SECURITY ISSUE!
  token: jwtToken 
});
```

### 2. Always use environment variables for credentials
```javascript
// ✅ Good
const apiKey = process.env.GOOGLE_API_KEY;

// ❌ Bad - hardcoded secrets
const apiKey = 'AIzaSyBzYYXoKcItVl1loiSM84E_HG2mkVAndfQ';
```

### 3. Sanitize user input to prevent XSS
```javascript
import { sanitizeInput } from '../utils/validators';

const profileName = sanitizeInput(req.body.firstName);
```

### 4. Hash passwords before storing
```javascript
// ✅ Good
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

// ❌ Bad - storing plain text password
users.create({ email, password: plainTextPassword });
```

## Async/Await Patterns

### Convert callback-based functions gradually:

```javascript
// Current pattern (callback-based):
const signUpService = async (params, callback) => {
  try {
    // ...
    return callback(null, result);
  } catch (error) {
    return callback(error);
  }
};

// Future pattern (Promise-based):
const signUpService = async (params) => {
  // ...
  return result;
};

// Usage
try {
  const result = await signUpService(params);
} catch (error) {
  // handle error
}
```

## Consistent Naming Conventions

### Variables and functions - camelCase
```javascript
const userEmail = 'test@example.com';
const getUserAccount = () => { /* ... */ };
```

### Constants - UPPER_SNAKE_CASE
```javascript
const MAX_RESULTS = 40;
const MONGO_CONNECT = process.env.MONGO_CONNECT;
```

### Classes - PascalCase
```javascript
class UserService { /* ... */ }
class BookModel { /* ... */ }
```

## Code Organization

### 1. Services layer - Business logic
```
services/
├── user.services.js      // User authentication, profile
├── library.services.js   // Book and library operations
├── payment.services.js   // Payment processing
└── search.services.js    // Search functionality
```

### 2. Controllers layer - Request handling
```
controllers/
├── user.controller.js
├── library.controller.js
└── payment.controller.js
```

### 3. Models layer - Data schemas
```
models/
├── userModel.js
├── bookModel.js
├── libraryModel.js
└── rentModel.js
```

### 4. Routes layer - API endpoints
```
routes/
├── userRoute.js
├── libraryRoute.js
└── paymentRoute.js
```

### 5. Middlewares layer - Cross-cutting concerns
```
middlewares/
├── auth.js      // Authentication
└── errors.js    // Error handling
```

### 6. Utils layer - Shared utilities
```
utils/
├── validators.js
└── helpers.js
```

## Comments and Documentation

### ✅ DO: Write comments for complex logic
```javascript
/**
 * Check if book already exists in user's library
 * @param {Array} books - Array of book objects
 * @param {String} bookId - ID of book to check
 * @returns {Boolean} true if book exists, false otherwise
 */
const bookExists = (books, bookId) => {
  return books.some(book => book.bookId.toString() === bookId.toString());
};
```

### ❌ DON'T: Write obvious comments
```javascript
// Bad - obvious from code
const email = params.email; // Get email from params
```

## Testing Requirements

### Minimum test coverage:
- Validators: 90%+
- Service functions: 70%+
- Controllers: 60%+

### Test each function with:
1. Valid inputs
2. Invalid inputs
3. Edge cases
4. Error scenarios

Example:
```javascript
describe('isValidEmail', () => {
  // Valid inputs
  test('should accept valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  // Invalid inputs
  test('should reject invalid emails', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });

  // Edge cases
  test('should handle whitespace', () => {
    expect(isValidEmail('  test@example.com  ')).toBe(true);
  });

  // Error scenarios
  test('should handle null input', () => {
    expect(isValidEmail(null)).toBe(false);
  });
});
```

## Performance Considerations

### 1. Database queries
```javascript
// ✅ Good - index-friendly queries
await users.findOne({ emailId: email.toLowerCase() });

// ❌ Bad - might scan entire collection
await users.find({ firstName: { $regex: firstName } });
```

### 2. Error logging
```javascript
// ✅ Good - structured logging
console.error('Database error:', { code: error.code, message: error.message });

// ❌ Bad - might expose sensitive data
console.error('Error:', error);
```

### 3. Connection handling
```javascript
// ✅ Good - proper error handling
const mongoUrl = process.env.MONGO_CONNECT || 'mongodb://localhost:27017/db';
await mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ❌ Bad - no error handling
await mongoose.connect('mongodb://localhost');
```

## Deployment Checklist

- [ ] All sensitive data moved to `.env` file
- [ ] `.env` file added to `.gitignore`
- [ ] Tests passing: `npm test`
- [ ] No console.log statements in production code
- [ ] All error types handled properly
- [ ] Input validation on all endpoints
- [ ] Passwords hashed before storing
- [ ] API keys not hardcoded
- [ ] Proper CORS configuration
- [ ] Rate limiting configured

## Migration Guide: Callbacks to Async/Await

### Step 1: Identify callback functions
```javascript
// Current
const getUser = (params, callback) => { /* ... */ };
```

### Step 2: Refactor to async
```javascript
// New
const getUser = async (params) => {
  try {
    return await users.findOne(params);
  } catch (error) {
    throw error;
  }
};
```

### Step 3: Update usage
```javascript
// Old usage
getUser({ id }, (err, result) => {
  if (err) return next(err);
  res.json(result);
});

// New usage
try {
  const result = await getUser({ id });
  res.json(result);
} catch (err) {
  next(err);
}
```

## Common Pitfalls to Avoid

1. ❌ Not validating user input
2. ❌ Storing sensitive data in logs
3. ❌ Not handling database connection errors
4. ❌ Mixing callback and promise patterns
5. ❌ Not using environment variables for secrets
6. ❌ Insufficient error messages
7. ❌ Not sanitizing user input
8. ❌ Returning sensitive data in responses

## References

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Security Guidelines](https://owasp.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Mongoose Best Practices](https://mongoosejs.com/docs/best-practices.html)
