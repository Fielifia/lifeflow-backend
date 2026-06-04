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
 * @param {Object} notificationData - Notification data.
 * @param {string} notificationData.userId - User id.
 * @param {string} notificationData.type - Notification type.
 * @param {string} notificationData.title - Notification title.
 * @param {string} notificationData.message - Notification message.
 * @param {Object} [notificationData.data] - Additional metadata.
 * @returns {Promise<Object>} Created notification.
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
 * @returns {Promise<Array>} User notifications.
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
 * @returns {Promise<Object|null>} Updated notification.
 */
export const markAsRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(
    notificationId,
    {
      read: true,
    },
    {
      new: true,
    },
  )
}

/**
 * Creates or updates a push notification subscription.
 *
 * Stores the browser's Web Push subscription
 * for a user and updates existing subscriptions
 * when needed.
 *
 * @param {Object} subscriptionData - Subscription data.
 * @param {string} subscriptionData.userId - User id.
 * @param {string} subscriptionData.endpoint - Push endpoint.
 * @param {Object} subscriptionData.keys - Web Push encryption keys.
 * @param {string} subscriptionData.keys.p256dh - Public encryption key.
 * @param {string} subscriptionData.keys.auth - Authentication secret.
 * @returns {Promise<Object>} Saved subscription.
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
    },
  )
}

/**
 * Deletes a push notification subscription.
 *
 * @param {string} endpoint - Push endpoint.
 * @returns {Promise<Object|null>} Deleted subscription.
 */
export const deleteSubscription = async (endpoint) => {
  return NotificationSubscription.findOneAndDelete({
    endpoint,
  })
}

/**
 * Gets all push notification subscriptions
 * for a user.
 *
 * @param {string} userId - User id.
 * @returns {Promise<Object[]>} User subscriptions.
 */
export const getSubscriptions = async (userId) => {
  return NotificationSubscription.find({
    user: userId,
  })
}

/**
 * Gets all push notification subscriptions
 * for a user.
 *
 * @param {string} userId - User id.
 * @returns {Promise<Object[]>} User subscriptions.
 */
export const getSubscriptions = async (userId) => {
  return NotificationSubscription.find({
    user: userId,
  })
}
