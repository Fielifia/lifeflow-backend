/**
 * Exercise routes for retrieving exercises.
 *
 * @module routes/exercises
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  getExercises,
  getExerciseById,
} from '../controllers/exerciseController.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getExercises)
router.get('/:id', getExerciseById)

export default router
