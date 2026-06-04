import mongoose from 'mongoose'

/**
 * Notification model.
 *
 * Represents a notification that has been sent
 * or is available to a user.
 */
const notificationSchema =
  new mongoose.Schema(
    {
      /**
       * User receiving the notification.
       */
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      /**
       * Notification category.
       */
      type: {
        type: String,
        required: true,
        enum: [
          'goal',
          'achievement',
          'personal-best',
        ],
      },

      /**
       * Notification title.
       */
      title: {
        type: String,
        required: true,
      },

      /**
       * Notification body text.
       */
      message: {
        type: String,
        required: true,
      },

      /**
       * Indicates whether the notification
       * has been viewed by the user.
       */
      read: {
        type: Boolean,
        default: false,
      },

      /**
       * Optional metadata associated with
       * the notification.
       */
      data: {
        type: mongoose.Schema.Types.Mixed,
      },

      /**
       * Time when the notification was sent.
       */
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  )

export default mongoose.model(
  'Notification',
  notificationSchema
)
