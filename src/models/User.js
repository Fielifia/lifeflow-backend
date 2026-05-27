/**
 * User model
 *
 * Stores user credentials
 * and user-specific preferences.
 */

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: '',
    },

    avatar: {
      type: String,
      default: '',
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],

    settings: {
      monthlyGoal: {
        type: Number,
        default: 12,
      },

      defaultRestTime: {
        type: Number,
        default: 120,
      },

      restTimerEnabled: {
        type: Boolean,
        default: true,
      },

      soundEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
