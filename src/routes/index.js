/**
 * Main router for the application.
 *
 * @module routes/index
 */
import express from 'express'
import authRoutes from './authRouter.js'
import workoutRoutes from './workoutRouter.js'
import exerciseRouter from './exerciseRouter.js'
import templateRouter from './templateRouter.js'
import statsRouter from './statsRouter.js'

const router = express.Router()

// --- Auth routes ---
router.use('/auth', authRoutes)

// --- Workout routes ---
router.use('/workouts', workoutRoutes)

// --- Exercise routes ---
router.use('/exercises', exerciseRouter)

// --- Template routes ---
router.use('/templates', templateRouter)

// --- Statistics routes ---
router.use('/stats', statsRouter)
export default router
