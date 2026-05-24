/**
 * Authentication routes for user registration and login.
 *
 * @module routes/auth
 */
import express from 'express'
import { loginUser, registerUser } from '../controllers/authController.js'

const router = express.Router()

// ===== REGISTER ROUTE =====

router.post('/register', registerUser)

// ===== LOGIN ROUTE =====

router.post('/login', loginUser)

export default router
