import * as notificationService
  from '../services/notificationService.js'

/**
 * Gets all notifications for the current user.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response.
 */
export const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await notificationService.getNotifications(
        req.user.id
      )

    return res.status(200).json(notifications)
  } catch (_error) {
    return res.status(500).json({
      error: 'Failed to fetch notifications',
    })
  }
}

/**
 * Marks a notification as read.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response.
 */
export const markNotificationAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await notificationService.markAsRead(
        req.params.id,
        req.user.id
      )

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found',
      })
    }

    return res.status(200).json(
      notification
    )
  } catch (_error) {
    return res.status(500).json({
      error: 'Failed to update notification',
    })
  }
}

/**
 * Marks all notifications as read.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response.
 */
export const markAllNotificationsAsRead =
  async (req, res) => {
    try {
      await notificationService.markAllAsRead(
        req.user.id
      )

      return res.status(200).json({
        message:
          'Notifications marked as read',
      })
    } catch (_error) {
      return res.status(500).json({
        error:
          'Failed to update notifications',
      })
    }
  }

/**
 * Deletes a notification.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends response.
 */
export const deleteNotification = async (
  req,
  res
) => {
  try {
    const deleted =
      await notificationService
        .deleteNotification(
          req.params.id,
          req.user.id
        )

    if (!deleted) {
      return res.status(404).json({
        error: 'Notification not found',
      })
    }

    return res.sendStatus(204)
  } catch (_error) {
    return res.status(500).json({
      error: 'Failed to delete notification',
    })
  }
}

/**
 * To test endpoint
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const createNotification = async (
  req,
  res
) => {
  try {
    const notification =
      await notificationService.createNotification({
        userId: req.user.id,
        type: req.body.type,
        title: req.body.title,
        message: req.body.message,
        data: req.body.data,
      })

    return res.status(201).json(
      notification
    )
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: error.message,
    })
  }
}
