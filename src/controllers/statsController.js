import {
  getOverviewStatistics,
  getFilteredStatistics,
} from '../services/statsService.js'

/**
 * Retrieves overview workout statistics for the authenticated user.
 *
 * Returns aggregated workout statistics including total workouts,
 * total sets, and total training volume.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response
 */
export const getOverviewStats = async (req, res) => {
  try {
    const stats = await getOverviewStatistics(req.user.id)

    res.status(200).json(stats)
  } catch (error) {
    console.error('Get overview statistics error:', error)

    res.status(500).json({
      error: 'Failed to fetch overview statistics',
    })
  }
}

/**
 * Retrieves filtered workout statistics.
 *
 * Returns workout statistics based on selected range.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response
 */
export const getStatistics = async (req, res) => {
  try {
    const { range = '1m' } = req.query

    const stats = await getFilteredStatistics(req.user.id, range)

    return res.status(200).json(stats)
  } catch (error) {
    console.error('Get statistics error:', error)

    return res.status(500).json({
      error: 'Failed to fetch statistics',
    })
  }
}
