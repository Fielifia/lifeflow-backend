/**
 * Workout routes for logging training sessions.
 *
 * @module routes/workouts
 */
import express from 'express'
import Workout from '../models/Workout.js'
import { authMiddleware } from '../middleware/auth.js'
import mongoose from 'mongoose'

const router = express.Router()

/**
 * Create a new workout session.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { duration, exercises = [], notes } = req.body

    for (const ex of exercises) {
      if (!mongoose.Types.ObjectId.isValid(ex.exerciseId)) {
        return res.status(400).json({
          error: 'Invalid exerciseId',
        })
      }
    }

    const sanitizedExercises = exercises.map((ex) => ({
      ...ex,
      sets: (ex.sets || []).map((s) => ({
        reps: Number(s.reps) || 8,
        weight: Number(s.weight) || 0,
        completed: Boolean(s.completed),
      })),
    }))

    const workout = await Workout.create({
      user: req.userId,
      exercises: sanitizedExercises,
      notes,
      duration,
    })

    return res.status(201).json({
      message: 'Workout created',
      workout,
    })
  } catch (_err) {
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router
