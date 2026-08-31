import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080
const BASE_URL = process.env.BASE_URL || ''
const mongoConnect = process.env.MONGO_CONNECT || 'mongodb://localhost:27017/biblio-bazaar'
// Base url for Google Books API
const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes/'
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const maxResults = 40

if (!GOOGLE_API_KEY) {
  console.warn('Warning: GOOGLE_API_KEY is not set in environment variables')
}

export { PORT, BASE_URL, mongoConnect, API_BASE_URL, GOOGLE_API_KEY, maxResults }

