# Bibliobazaar Backend - Setup Guide

## Updated (2024)

This backend has been updated with:
- ✅ Latest package versions
- ✅ Secure environment variable handling
- ✅ Modern Node.js best practices
- ✅ Deprecated dependency removal

## Prerequisites

- Node.js >= 16.x
- MongoDB (local or Atlas connection string)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment Variables:**
   - Copy `.env.example` to `.env`
   - Fill in all required credentials
   ```bash
   cp .env.example .env
   ```

3. **Get Required Credentials:**

   **Google Books API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a project and enable "Books API"
   - Create an API key
   - Add to `.env` as `GOOGLE_API_KEY`

   **Razorpay (Payments):**
   - Sign up at [Razorpay](https://razorpay.com)
   - Get Key ID and Key Secret from dashboard
   - Add to `.env` as `RAZORPAY_ID` and `RAZORPAY_SECRET`

   **ImageKit (Image Management):**
   - Sign up at [ImageKit](https://imagekit.io)
   - Get Public Key, Private Key, and URL Endpoint
   - Add to `.env` as `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL`

   **JWT Secret:**
   - Generate a secure secret for JWT (e.g., using `openssl rand -hex 32`)
   - Add to `.env` as `TOKEN_SECRET`

## Running the Server

**Development:**
```bash
npm start
```

The server will start on the port specified in `.env` (default: 8080)

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to version control
- `.env` is already added to `.gitignore`
- Always use environment variables for sensitive data
- Regenerate API keys periodically
- Use strong JWT secrets

## Package Updates

**Major Updates:**
- mongoose: 6.8.0 → 8.2.3
- jsonwebtoken: 8.5.1 → 9.1.2
- express: 4.18.2 → 4.19.2
- dotenv: 16.0.3 → 16.4.5
- Removed deprecated `request` package

## API Endpoints

### User Routes
- `POST /user/signUp` - User registration (Public)
- `POST /user/login` - User login (Public)

### Library Routes
- `POST /library/search` - Search books (Public)
- `GET /library` - Get library (Protected)

### Search Routes
- `GET /search` - Search books (Protected)

### Payment Routes
- `POST /payment/checkout` - Create payment order (Public)
- `POST /payment/verify` - Verify payment (Public)

### Upload Routes
- `POST /upload` - Upload image (Protected)

### Rent Routes
- `GET /rent` - Get rentals (Protected)
- `POST /rent` - Create rental (Protected)

## Troubleshooting

**"GOOGLE_API_KEY is not set"**
- Ensure `.env` file exists with `GOOGLE_API_KEY` value

**MongoDB connection error**
- Verify `MONGO_CONNECT` URL in `.env`
- Ensure MongoDB service is running

**ImageKit upload failures**
- Verify ImageKit credentials in `.env`
- Check file size limits

## Support

For issues with specific APIs:
- Google Books: [API Documentation](https://developers.google.com/books)
- Razorpay: [API Documentation](https://razorpay.com/docs/)
- ImageKit: [API Documentation](https://docs.imagekit.io/)
