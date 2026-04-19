/**
 * Exercise controller handling exercise retrieval with search, filters, and pagination.
 *
 * @module controllers/exerciseController
 */

import mongoose from 'mongoose'
import Exercise from '../models/Exercise.js'

/**
 * Get exercises with search, filters, and pagination
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getExercises = async (req, res) => {
  try {
    let { limit = 20, page = 1 } = req.query
    const { equipment, muscle, search } = req.query

    page = Math.max(1, parseInt(page))
    limit = Math.min(100, Math.max(1, parseInt(limit))) // cap på 100

    const query = {}

    if (search && search.trim() !== '') {
      query.name = {
        $regex: search.trim(),
        $options: 'i',
      }
    }

    if (muscle && muscle.trim() !== '') {
      query.target = muscle.trim()
    }

    if (equipment && equipment.trim() !== '') {
      query.equipment = equipment.trim()
    }

    const exercises = await Exercise.find(query)
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await Exercise.countDocuments(query)

    res.status(200).json({
      page,
      limit,
      total,
      results: exercises,
    })
  } catch (err) {
    console.error('Get exercises error:', err)

    res.status(500).json({
      error: 'Failed to fetch exercises',
    })
  }
}

/**
 * Get single exercise by ID
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }

    const exercise = await Exercise.findById(id)

    if (!exercise) {
      return res.status(404).json({
        error: 'Exercise not found',
      })
    }

    res.status(200).json(exercise)
  } catch (err) {
    console.error('Get exercise by ID error:', err)

    res.status(500).json({
      error: 'Failed to fetch exercise',
    })
  }
}
