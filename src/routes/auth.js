/**
 * Authentication routes for user registration and login.
 *
 * @module routes/auth
 */
import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

const router = express.Router()

/**
 * Register a new user.
 *
 * Creates a user account with a unique email and a hashed password.
 *
 * @route POST /register
 * @param {Object} req.body - User registration data
 * @param {string} req.body.email - User's email address (required)
 * @param {string} req.body.password - User's password (required, min 8 characters)
 *
 * @returns {201} 201 - User created successfully
 * @returns {400} 400 - Bad request (missing fields, weak password)
 * @returns {409} 409 - Conflict (email already in use)
 * @returns {500} 500 - Server error
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters',
      })
    }

    // --- Check duplicate ---
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already in use',
      })
    }

    // --- Hash password ---
    const hashedPassword = await bcrypt.hash(password, 10)

    // --- Create user ---
    const user = await User.create({
      email,
      password: hashedPassword,
    })

    // --- Response ---
    res.status(201).json({
      message: 'User created',
      userId: user._id,
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
