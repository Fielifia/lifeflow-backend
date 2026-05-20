/**
 * Workout model
 *
 * Represents a completed workout session
 * with exercises, sets, timing and notes.
 */
import mongoose from 'mongoose'

/**
 * Workout exercise set schema.
 */
const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    default: 8,
    min: 0,
  },
  weight: {
    type: Number,
    default: 0,
    min: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  personalBest: {
    type: Boolean,
    default: false,
  },
})

/**
 * Workout exercise schema.
 *
 * Stores a snapshot of exercise data
 * at the time the workout was performed.
 */
const exerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  sets: {
    type: [setSchema],
    default: [],
  },
  rest: {
    type: Number,
    default: 120,
    min: 0,
  },
  notes: {
    type: String,
    default: '',
  },
})

/**
 * Workout schema.
 *
 * Stores completed workout sessions
 * including exercises, duration and timestamps.
 */
const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      default: '',
    },

    personalBests: {
      type: Number,
      default: 0,
    },

    exercises: {
      type: [exerciseSchema],
      default: [],
    },

    notes: {
      type: String,
      default: '',
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    duration: {
      type: Number,
      default: 0,
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

/**
 * Computed workout end time.
 *
 * Calculated from:
 * startTime + duration
 */
workoutSchema.virtual('endTime').get(function () {
  if (!this.startTime) {
    return null
  }

  return new Date(
    this.startTime.getTime() + this.duration * 1000
  )
})

export default mongoose.model('Workout', workoutSchema)
