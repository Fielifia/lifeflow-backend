/**
 * Main router for the application.
 *
 * @module routes/index
 */
import express from 'express'
import authRoutes from './authRouter.js'
import workoutRoutes from './workoutRouter.js'
import exerciseRouter from './exerciseRouter.js'

const router = express.Router()

// --- Auth routes ---
router.use('/auth', authRoutes)

// --- Workout routes ---
router.use('/workouts', workoutRoutes)

// --- Exercise routes ---
router.use('/exercises', exerciseRouter)

export default router
