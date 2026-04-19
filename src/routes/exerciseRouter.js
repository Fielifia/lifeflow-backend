/**
 * Exercise routes for retrieving exercises.
 *
 * @module routes/exercises
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getExercises, getExerciseById } from '../controllers/exerciseController.js'

const router = express.Router()

router.get('/', authMiddleware, getExercises)
router.get('/:id', authMiddleware, getExerciseById)


export default router
