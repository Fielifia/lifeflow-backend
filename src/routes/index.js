/**
 * Main router for the application.
 *
 * @module routes/index
 */
import express from 'express'
import { getTestMessage } from '../controllers/testController.js'
import authRoutes from './auth.js'
import workoutRoutes from './workouts.js'

const router = express.Router()

// --- Test route ---
router.get('/', getTestMessage)

// --- Auth routes ---
router.use('/auth', authRoutes)

// --- Workout routes ---
router.use('/workouts', workoutRoutes)

export default router
