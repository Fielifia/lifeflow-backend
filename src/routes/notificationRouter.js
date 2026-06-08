/**
 * Notification routes.
 *
 * @module routes/notifications
 */
import express from 'express'

import { authMiddleware } from '../middleware/auth.js'

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification,
} from '../controllers/notificationController.js'

const router = express.Router()

router.use(authMiddleware)

// ===== MARK AS READ =====

router.patch('/:id/read', markNotificationAsRead)

// ===== DELETE NOTIFICATION =====

router.delete('/:id', deleteNotification)

// ===== MARK ALL AS READ =====

router.patch('/read-all', markAllNotificationsAsRead)

// ===== GET ALL NOTIFICATIONS =====

router.get('/', getNotifications)

// ===== CREATE NOTIFICATION (TEST ROUTE) =====

router.post('/', createNotification)

export default router
