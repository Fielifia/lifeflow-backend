/**
 * Workout routes.
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

// ===== GET PREVIOUS EXERCISES (FOR VALUES) =====

router.get('/exercises/:exerciseId/previous', getPreviousExercise)

// ===== GET WORKOUT =====

router.get('/:id', getWorkoutById)

// ===== UPDATE WORKOUT =====

router.put('/:id', updateWorkout)

// ===== DELETE WORKOUT =====

router.delete('/:id', deleteWorkout)

// ===== CREATE WORKOUT =====

router.post('/', createWorkout)

// ===== GET ALL WORKOUTS =====

router.get('/', getWorkouts)

// ===== DELETE ALL WORKOUTS =====
router.delete('/', deleteAllWorkouts)

export default router
