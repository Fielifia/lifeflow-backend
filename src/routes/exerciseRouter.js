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

router.get('/:id', getExerciseById)
router.get('/', getExercises)

export default router
