/**
 * Workout routes for logging training sessions.
 *
 * @module routes/workouts
 */

import express from 'express'
import Workout from '../models/Workout.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

/**
 * Create a new workout session
 *
 * @route POST /workouts
 * @returns {201} Workout created
 * @returns {401} Unauthorized
 */
router.post('/workouts', authMiddleware, async (req, res) => {
  try {
    const { exercises = [], notes } = req.body

    // Minimal logging allowed → exercises can be empty
    const workout = await Workout.create({
      user: req.userId,
      exercises,
      notes,
    })

    res.status(201).json({
      message: 'Workout created',
      workout,
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
