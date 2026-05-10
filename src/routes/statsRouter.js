/**
 * Exercise routes for retrieving statistics.
 *
 * @module routes/stats
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getOverviewStats } from '../controllers/templateController.js'

const router = express.Router()

router.use(authMiddleware)

// Collection routes
router.get('/overview', getOverviewStats)

export default router
