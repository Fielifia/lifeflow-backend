/**
 * Exercise routes for retrieving exercises.
 *
 * @module routes/exercises
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getExercises } from '../controllers/exerciseController.js'

const router = express.Router()

router.get('/', authMiddleware, getExercises)

export default router
