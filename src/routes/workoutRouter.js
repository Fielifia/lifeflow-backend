/**
 * Workout routes for logging training sessions.
 *
 * @module routes/workouts
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getWorkouts, getWorkoutById, createWorkout, deleteWorkout, getLatestWorkout } from '../controllers/workoutController.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getWorkouts)
router.post('/', createWorkout)

router.get('/:id', getWorkoutById)
router.delete('/:id', deleteWorkout)

router.get('/latest', getLatestWorkout)



export default router
