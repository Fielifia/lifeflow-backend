/**
 * Exercise controller handling exercise retrieval with search, filters, and pagination.
 *
 * @module controllers/exerciseController
 */

import Exercise from '../models/Exercise.js'

/**
 * Get all exercises with search, filters, and pagination
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getExercises = async (req, res) => {
  try {
    let { limit = 20, page = 1 } = req.query
    const { equipment, muscle, search } = req.query

    page = Math.max(1, parseInt(page) || 1)
    limit = Math.min(100, Math.max(1, parseInt(limit) || 20))

    const query = {}

    if (search?.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: 'i',
      }
    }

    if (muscle?.trim()) {
      query.target = muscle.trim()
    }

    if (equipment?.trim()) {
      query.equipment = equipment.trim()
    }

    const exercises = await Exercise.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .sort({ name: 1 })

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
 * Get a single exercise by id.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params

    const exercise = await Exercise.findById(id).lean()

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    return res.status(200).json(exercise)
  } catch (err) {
    console.error('Get exercise by ID error:', err)

    return res.status(500).json({
      error: 'Failed to fetch exercise',
    })
  }
}
