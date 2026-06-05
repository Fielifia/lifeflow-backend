/**
 * Exercise routes for notifications.
 *
 * @module routes/notifications
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../controllers/notificationController.js'

const router = express.Router()

router.use(authMiddleware)

// ===== COLLECTION ROUTES =====

router.get('/', getNotifications)

router.patch('/read-all', markAllNotificationsAsRead)

// ===== ID-BASED ROUTES =====

router.patch('/:id/read', markNotificationAsRead)
router.delete('/:id', deleteNotification)

export default router
