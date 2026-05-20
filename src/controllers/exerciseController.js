/**
 * Exercise controller handling exercise retrieval
 * with search, filters, sorting, and pagination.
 *
 * @module controllers/exerciseController
 */

import Exercise from '../models/Exercise.js'

import {
  getExerciseUsageStats,
} from '../services/statsService.js'

/**
 * Get all exercises with filtering,
 * sorting, and pagination support.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getExercises = async (req, res) => {
  try {
    let { limit = 20, page = 1 } = req.query

    const {
      equipment,
      muscle,
      search,
      sort = 'a-z',
    } = req.query

    page = Math.max(
      1,
      parseInt(page) || 1
    )

    limit = Math.min(
      1000,
      Math.max(1, parseInt(limit) || 20)
    )

    const query = {}

    // ===== SEARCH =====

    if (search?.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: 'i',
      }
    }

    // ===== FILTERS =====

    if (muscle?.trim()) {
      query.target = muscle.trim()
    }

    if (equipment?.trim()) {
      query.equipment = equipment.trim()
    }

    // ===== FETCH =====

    const exercises = await Exercise.find(query)
      .lean()

    const total =
      await Exercise.countDocuments(query)

    // ===== SORT =====

    if (
      req.user?.id &&
      (
        sort === 'most-used' ||
        sort === 'recent'
      )
    ) {
      const stats =
        await getExerciseUsageStats(req.user.id)

      exercises.sort((a, b) => {

        const aStats =
          stats[a._id.toString()] || {}

        const bStats =
          stats[b._id.toString()] || {}

        // ===== MOST USED =====

        if (sort === 'most-used') {
          return (
            (bStats.count || 0) -
            (aStats.count || 0)
          )
        }

        // ===== RECENTLY USED =====

        if (sort === 'recent') {
          return (
            new Date(
              bStats.lastUsed || 0
            ) -
            new Date(
              aStats.lastUsed || 0
            )
          )
        }

        return 0
      })

    } else {

      // ===== ALPHABETICAL =====

      exercises.sort((a, b) => {

        if (sort === 'z-a') {
          return b.name.localeCompare(a.name)
        }

        return a.name.localeCompare(b.name)
      })
    }

    const paginatedExercises =
      exercises.slice(
        (page - 1) * limit,
        page * limit
      )

    return res.status(200).json({
      page,
      limit,
      total,
      results: paginatedExercises,
    })

  } catch (err) {
    console.error(
      'Get exercises error:',
      err
    )

    return res.status(500).json({
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

    const exercise =
      await Exercise.findById(id)
        .lean()

    if (!exercise) {
      return res.status(404).json({
        error: 'Exercise not found',
      })
    }

    return res.status(200).json(exercise)

  } catch (err) {
    console.error(
      'Get exercise by ID error:',
      err
    )

    return res.status(500).json({
      error: 'Failed to fetch exercise',
    })
  }
}
