/**
 * Main application setup and configuration.
 * Initializes Express, connects to MongoDB, and sets up middleware and routes.
 *
 * @module app
 */
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import routes from './routes/index.js'

dotenv.config()

// --- Initialize Express app ---
const app = express()

// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// --- Middleware ---
app.use(cors())
// --- Body parser ---
app.use(express.json())

// --- Routes ---
app.use('/', routes)

export default app
