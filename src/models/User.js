/**
 * User model representing an application user.
 * Stores authentication credentials.
 *
 * @module models/user
 */
import mongoose from 'mongoose'

/**
 * Mongoose schema for User.
 *
 * @typedef {Object} User
 * @property {string} email - User's email address (unique, required)
 * @property {string} password - Hashed password (required)
 * @property {Date} createdAt - Timestamp of user creation
 * @property {Date} updatedAt - Timestamp of last update
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    "username": {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('User', userSchema)
