/**
 * Exercise routes for retrieving exercises.
 *
 * @module routes/exercises
 */
import express from 'express'
import {
  getExercises,
  getExerciseById,
} from '../controllers/exerciseController.js'

const router = express.Router()

router.get('/', getExercises)
router.get('/:id', getExerciseById)

export default router
