/**
 * Main router for the application.
 *
 * @module routes/index
 */
import express from 'express'
import authRouter from './authRouter.js'
import userRouter from './userRouter.js'
import workoutRouter from './workoutRouter.js'
import exerciseRouter from './exerciseRouter.js'
import templateRouter from './templateRouter.js'
import statsRouter from './statsRouter.js'
import notificationRouter from './notificationRouter.js'

const router = express.Router()

// ===== AUTH =====

router.use('/auth', authRouter)

// ===== USER =====

router.use('/user', userRouter)

// ===== WORKOUTS =====

router.use('/workouts', workoutRouter)

// ===== EXERCISES =====

router.use('/exercises', exerciseRouter)

// ===== TEMPLATES =====

router.use('/templates', templateRouter)

// ===== STATISTICS =====

router.use('/stats', statsRouter)

// ===== NOTIFICATIONS =====

router.use('/notifications', notificationRouter)

export default router
