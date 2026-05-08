/**
 * Workout routes for logging training sessions.
 *
 * @module routes/workouts
 */
import express from 'express'
import {
  createWorkout,
  getWorkouts,
  getLatestWorkout,
  getPreviousExercise,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workoutController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware)

// Collection routes
router.get('/', getWorkouts)
router.post('/', createWorkout)

// Specific static routes
router.get('/latest', getLatestWorkout)

// ID-based routes
router.get('/:exerciseId/previous', getPreviousExercise)
router.get('/:id', getWorkoutById)
router.put('/:id', updateWorkout)
router.delete('/:id', deleteWorkout)

export default router
