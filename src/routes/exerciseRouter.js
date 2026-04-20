/**
 * Exercise routes for retrieving exercises.
 *
 * @module routes/exercises
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getExercises, getCategories, getMuscles } from '../controllers/exerciseController.js'

const router = express.Router()

router.get('/', authMiddleware, getExercises)
router.get('/categories', authMiddleware, getCategories)
router.get('/muscles', authMiddleware, getMuscles)
router.get('/:id', authMiddleware, getExercises)

export default router
