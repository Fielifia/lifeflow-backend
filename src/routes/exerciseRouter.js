/**
 * Exercise routes for retrieving exercises.
 *
 * @module routes/exercises
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  getFavoriteExercises,
  addFavoriteExercise,
  removeFavoriteExercise,
  getExercises,
  getExerciseById,
} from '../controllers/exerciseController.js'

const router = express.Router()

router.use(authMiddleware)

// ===== FAVORITES =====

router.get('/favorites', getFavoriteExercises)
router.post('/:id/favorite', addFavoriteExercise)
router.delete('/:id/favorite', removeFavoriteExercise)

// ===== EXERCISES =====

router.get('/', getExercises)
router.get('/:id', getExerciseById)

export default router
