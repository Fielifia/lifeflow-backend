/**
 * Exercise routes.
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

// ===== ADD AS FAVORITE =====

router.post('/:id/favorite', addFavoriteExercise)

// ===== REMOVE AS FAVORITE =====

router.delete('/:id/favorite', removeFavoriteExercise)

// ===== GET ALL FAVORITES =====

router.get('/favorites', getFavoriteExercises)

// ===== GET EXERCISE =====

router.get('/:id', getExerciseById)

// ===== GET ALL EXERCISES =====

router.get('/', getExercises)

export default router
