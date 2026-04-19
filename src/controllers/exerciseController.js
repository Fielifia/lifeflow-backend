/**
 * Exercise controller
 *
 * Handles:
 * - retrieving exercises
 * - search
 * - filtering
 * - pagination
 *
 * @module controllers/exerciseController
 */

import Exercise from '../models/Exercise.js'

/**
 * Get exercises with search, filters, and pagination
 *
 * Query params:
 * - page (number, optional) → current page (default: 1)
 * - limit (number, optional) → items per page (default: 20)
 * - search (string, optional) → search by exercise name
 * - muscle (string, optional) → filter by target muscle
 * - equipment (string, optional) → filter by equipment
 *
 * Example:
 * GET /exercises?search=bench&muscle=chest&page=1&limit=20
 *
 * Response:
 * {
 *   page: number,
 *   total: number,
 *   results: Exercise[]
 * }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getExercises = async (req, res) => {
  try {
    let { page = 1, limit = 20, search, muscle, equipment } = req.query

    // 🔒 säkerställ rätt typer
    page = Math.max(1, parseInt(page))
    limit = Math.min(100, Math.max(1, parseInt(limit))) // cap på 100

    const query = {}

    /**
     * 🔍 Search (case-insensitive)
     * Uses regex for flexible matching
     */
    if (search && search.trim() !== '') {
      query.name = {
        $regex: search.trim(),
        $options: 'i',
      }
    }

    /**
     * 💪 Filter by muscle group
     */
    if (muscle && muscle.trim() !== '') {
      query.target = muscle.trim()
    }

    /**
     * 🏋️ Filter by equipment
     */
    if (equipment && equipment.trim() !== '') {
      query.equipment = equipment.trim()
    }

    /**
     * Fetch paginated results
     */
    const exercises = await Exercise.find(query)
      .skip((page - 1) * limit)
      .limit(limit)

    /**
     * Count total matching documents (for pagination)
     */
    const total = await Exercise.countDocuments(query)

    /**
     * Send response
     */
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
