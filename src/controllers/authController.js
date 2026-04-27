/**
 * Authentication controller handling user registration and login logic.
 *
 * @module controllers/authController
 */
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Register a new user.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success message or error
 */
export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body

    const normalizeEmail = email?.trim().toLowerCase()
    const normalizedUsername = username?.trim()

    if (!normalizeEmail || !password || !normalizedUsername) {
      return res.status(400).json({
        error: 'Email, username, and password required',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters',
      })
    }

    const existingUser = await User.findOne({ email: normalizeEmail })
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already in use',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      email: normalizeEmail,
      password: hashedPassword,
      username: normalizedUsername,
    })

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )

    return res.status(201).json({
      message: 'User created',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

/**
 * Log in an existing user.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} - Sends JSON response with success message or error
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const normalizeEmail = email?.trim().toLowerCase()

    if (!normalizeEmail || !password) {
      return res.status(400).json({
        error: 'Email and password required',
      })
    }

    const user = await User.findOne({ email: normalizeEmail }).lean()
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
