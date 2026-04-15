/**
 * Authentication routes for user registration and login.
 *
 * @module routes/auth
 */
import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
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
    const { email, password, username } = req.body

    // --- Validation ---
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, username, and password required' })
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
      username,
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

/**
 * Log in an existing user.
 *
 * Validates credentials and returns a JWT token if successful.
 *
 * @route POST /login
 * @param {Object} req.body - User login data
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 *
 * @returns {200} Login successful, returns JWT token
 * @returns {400} Missing input
 * @returns {401} Invalid credentials
 * @returns {500} Server error
 */

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // --- Validate input ---
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required',
      })
    }

    // --- Find user ---
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    // --- Compare password ---
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    // --- Generate token ---
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    // --- Response ---
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        username: user.username,
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
