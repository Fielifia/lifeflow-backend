/**
 * Main application setup and configuration.
 * Initializes Express, connects to MongoDB,
 * seeds test database if necessary,
 * and sets up middleware and routes.
 *
 * @module app
 */

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import routes from './routes/index.js'
import seedIfEmpty from './scripts/seedIfEmpty.js'

dotenv.config()

// --- Initialize Express app ---
const app = express()

/**
 * Connect to MongoDB and seed test database if empty.
 */
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('Connected to MongoDB')

    // Seed test database automatically
    if (process.env.MONGO_URI.includes('lifeflow_test')) {
      await seedIfEmpty()
    }
  } catch (err) {
    console.error('MongoDB connection error:', err)
  }
}

await connectDatabase()

await seedIfEmpty()

// --- Middleware ---
const allowedOrigins = process.env.CLIENT_URLS.split(',')

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)

// --- Body parser ---
app.use(express.json())

// --- Routes ---
app.use('/', routes)

export default app
