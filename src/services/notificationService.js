/**
 * Notification service.
 *
 * Handles creation and management
 * of user notifications.
 */
import Notification from '../models/Notification.js'
import NotificationSubscription
  from '../models/NotificationSubscription.js'

/**
 * Creates and stores a notification.
 *
 * @param {object} notificationData - Notification data.
 * @param {string} notificationData.userId - User id.
 * @param {string} notificationData.type - Notification type.
 * @param {string} notificationData.title - Notification title.
 * @param {string} notificationData.message - Notification message.
 * @param {object} [notificationData.data] - Additional metadata.
 * @returns {Promise<object>} Created notification.
 */
export const createNotification = async ({
  userId,
  type,
  title,
  message,
  data,
}) => {
  return Notification.create({
    user: userId,
    type,
    title,
    message,
    data,
  })
}

/**
 * Gets all notifications for a user.
 *
 * @param {string} userId - User id.
 * @returns {Promise<object[]>} User notifications.
 */
export const getNotifications = async (userId) => {
  return Notification
    .find({ user: userId })
    .sort({ createdAt: -1 })
}

/**
 * Marks a notification as read.
 *
 * @param {string} notificationId - Notification id.
 * @param {string} userId - User id.
 * @returns {Promise<object | null>} Updated notification.
 */
export const markAsRead = async (
  notificationId,
  userId
) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user: userId,
    },
    {
      read: true,
    },
    {
      new: true,
    }
  )
}

/**
 * Marks all notifications as read.
 *
 * @param {string} userId - User id.
 * @returns {Promise<object>} Update result.
 */
export const markAllAsRead = async (
  userId
) => {
  return Notification.updateMany(
    {
      user: userId,
      read: false,
    },
    {
      read: true,
    }
  )
}

/**
 * Deletes a notification.
 *
 * @param {string} notificationId - Notification id.
 * @param {string} userId - User id.
 * @returns {Promise<object | null>} Deleted notification.
 */
export const deleteNotification = async (
  notificationId,
  userId
) => {
  return Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  })
}

/**
 * Creates or updates a push notification subscription.
 *
 * Stores the browser's Web Push subscription
 * for a user and updates existing subscriptions
 * when needed.
 *
 * @param {object} subscriptionData - Subscription data.
 * @param {string} subscriptionData.userId - User id.
 * @param {string} subscriptionData.endpoint - Push endpoint.
 * @param {{p256dh: string, auth: string}} subscriptionData.keys
 *   - Web Push encryption keys.
 * @returns {Promise<object>} Saved subscription.
 */
export const saveSubscription = async ({
  userId,
  endpoint,
  keys,
}) => {
  return NotificationSubscription.findOneAndUpdate(
    {
      endpoint,
    },
    {
      user: userId,
      endpoint,
      keys,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  )
}

/**
 * Deletes a push notification subscription.
 *
 * @param {string} endpoint - Push endpoint.
 * @returns {Promise<object | null>} Deleted subscription.
 */
export const deleteSubscription = async (
  endpoint
) => {
  return NotificationSubscription.findOneAndDelete({
    endpoint,
  })
}

/**
 * Gets all push notification subscriptions
 * for a user.
 *
 * @param {string} userId - User id.
 * @returns {Promise<object[]>} User subscriptions.
 */
export const getSubscriptions = async (
  userId
) => {
  return NotificationSubscription.find({
    user: userId,
  })
}
