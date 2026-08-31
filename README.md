# BiblioBazaar

Bibliobazaar is a platform for rental and issue of books online

<br/>

# Table of Contents

1. [Demo](#demo)
2. [Installation](#installation)
3. [Testing](#testing)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Best Practices](#best-practices)
7. [Authors](#authors)
8. [License](#license)

<br/>

# Demo

[Live FE Demo](https://bibliobazaar.netlify.app/)

[Live BE Demo](https://bibliobazaar-backend.onrender.com)

<br/>

Test Credentials for User:

- Email: project@pesto.com
- Password: 11111111

 
<br/>

# Testing

This project includes comprehensive unit tests and validation tests.

### Run tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

**Documentation:** See [TESTING.md](./TESTING.md) for detailed testing guide.

<br/>

# Installation

- Fork or directly clone this repository to your local machine
- Copy `.env.example` to `.env` and fill in your credentials
- Use the `npm install` command to install dependencies
- Use the `npm start` command to start the development server
- Server runs on `http://localhost:8080` by default

**Setup Details:** See [SETUP.md](./SETUP.md) for detailed configuration guide.

<br/>

# Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middlewares/      # Authentication, error handling
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── services/         # Business logic
└── utils/            # Shared utilities (validators, helpers)
tests/
├── __mocks__/        # Mock data for testing
└── *.test.js         # Test files
```

<br/>

# Technology Stack

**Backend Framework:**
- [ExpressJS](https://expressjs.com/) - Web server framework
- [Node.js](https://nodejs.org/) - JavaScript runtime

**Database:**
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM

**External Services:**
- [Razorpay](https://razorpay.com/) - Payment gateway
- [Google Books API](https://developers.google.com/books) - Book search
- [ImageKit](https://imagekit.io/) - Image hosting and optimization

**Authentication:**
- [JWT](https://jwt.io/) - JSON Web Tokens
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing

**Testing:**
- [Jest](https://jestjs.io/) - Unit testing framework

<br/>

# Best Practices

This project follows best practices for:

✅ **Input Validation** - All user inputs are validated  
✅ **Error Handling** - Comprehensive error handling middleware  
✅ **Security** - Sensitive data protected with environment variables  
✅ **Code Quality** - Consistent naming conventions and code organization  
✅ **Testing** - Unit tests for validators and services  

**Detailed Guide:** See [BEST_PRACTICES.md](./BEST_PRACTICES.md)

<br/>

# Security Notes

⚠️ **Important:**
- Never commit `.env` file to version control
- Use strong JWT secrets and API keys
- Always validate and sanitize user input
- Hash passwords using bcryptjs before storing
- Keep dependencies updated regularly

<br/>

# API Endpoints

### User Management
- `POST /user/signUp` - Register new user
- `POST /user/login` - Login user
- `GET /user/account` - Get user profile

### Library Management
- `POST /library/add-book` - Add book to library
- `GET /library` - Get user's library
- `DELETE /library/book/:id` - Remove book from library

### Book Search
- `POST /library/search` - Search books from Google Books API

### Payments
- `POST /payment/checkout` - Create payment order
- `POST /payment/verify` - Verify payment

### Rentals
- `POST /rent` - Create rental
- `GET /rent` - Get user's rentals

<br/>

# Documentation Files

- [SETUP.md](./SETUP.md) - Setup and configuration guide
- [TESTING.md](./TESTING.md) - Testing guide and examples
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Code quality guidelines
- [.env.example](./.env.example) - Environment variables template

<br/>

# Authors

  

- [Yathendra](https://github.com/YATHENDRA1995)
- [Niraj Mourya](https://github.com/NirajMourya)

<br/>

  

# License

  

[MIT](https://opensource.org/licenses/MIT)