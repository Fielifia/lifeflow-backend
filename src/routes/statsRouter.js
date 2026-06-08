/**
 * Statistics routes.
 *
 * @module routes/stats
 */
import express from 'express'

import { authMiddleware } from '../middleware/auth.js'

import {
  getOverviewStats,
  getStatistics,
} from '../controllers/statsController.js'

const router = express.Router()

router.use(authMiddleware)

// ===== GET STATISTICS OVERVIEW =====

router.get('/overview', getOverviewStats)

// ===== GET ALL STATISTICS =====

router.get('/', getStatistics)

export default router
