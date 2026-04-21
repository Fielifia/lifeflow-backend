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
  getCategories,
  getMuscles,
} from '../controllers/exerciseController.js'

const router = express.Router()

router.get('/categories', authMiddleware, getCategories)
router.get('/muscles', authMiddleware, getMuscles)

router.get('/', authMiddleware, getExercises)

router.get('/:id', authMiddleware, getExerciseById)

<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
export default router
