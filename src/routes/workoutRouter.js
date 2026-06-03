/**
 * Workout routes for logging training sessions.
 *
 * @module routes/workouts
 */
import express from 'express'
import {
  createWorkout,
  getWorkouts,
  getPreviousExercise,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  deleteAllWorkouts,
} from '../controllers/workoutController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware)

// ===== COLLECTION ROUTES =====

router.get('/', getWorkouts)
router.post('/', createWorkout)

// ===== ID-BASED ROUTES =====

router.get('/exercises/:exerciseId/previous', getPreviousExercise)
router.get('/:id', getWorkoutById)
router.put('/:id', updateWorkout)
router.delete('/:id', deleteWorkout)
router.delete('/', deleteAllWorkouts)

export default router
