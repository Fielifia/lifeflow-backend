import { getOverviewStatistics } from '../services/statsService.js'

/**
 * Retrieves overview workout statistics for the authenticated user.
 *
 * Returns aggregated workout statistics including total workouts,
 * total sets, and total training volume.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} - 
 */
export const getOverviewStats = async (req, res) => {
  try {
    const stats = await getOverviewStatistics(req.user.id)

    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch statistics',
    }), error
  }
}
