import express from 'express'
import mongoose from 'mongoose'
import unless from "express-unless"
import upload from 'express-fileupload'
import cors from "cors";
import * as dotenv from 'dotenv'
dotenv.config()

import { userRouter } from './routes/userRoute'
import { libraryRouter } from './routes/libraryRoute'
import { searchRouter } from './routes/searchRouter'
import { authenticateToken } from './middlewares/auth.js'
import { errorHandler } from './middlewares/errors'
import { uploadRouter } from './routes/uploadRoute'
import { paymentRouter } from './routes/paymentRoute'
import { RentRouter } from './routes/rentRoute'

const app = express()
app.use(cors());

const start = async () => {
  try {
    const mongoUrl = process.env.MONGO_CONNECT || 'mongodb://localhost:27017/biblio-bazaar'
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const port = process.env.PORT || 8080
    app.listen(port, () => console.log(`Listening on port ${port}`))
  } catch (err) {
    console.error('Database connection error:', err)
    process.exit(1)
  }
}

start()

authenticateToken.unless = unless;
app.use(
  authenticateToken.unless({
    path: [
      { url: "/library/search", methods: ["POST"] },
      { url: "/", methods: ["GET"] },
      { url: "/user/signUp", methods: ["POST"] },
      { url: "/user/login", methods: ["POST"] },
      // Added Temporarily to check payments
      { url: "/payment/checkout", methods: ["POST"] },
      { url: "/payment/verify", methods: ["POST"] },
    ],
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(upload())

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World, Server is working',
  })
})

app.use('/user', userRouter)
app.use('/',uploadRouter)
//Search Routes
app.use('/search', searchRouter)
//Library Routes
app.use('/library', libraryRouter)

// Payment Routes
app.use('/payment', paymentRouter)

// Rent Routes
app.use('/rent', RentRouter)

// middleware for error responses
app.use(errorHandler);


