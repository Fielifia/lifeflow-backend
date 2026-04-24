/**
 * Workout model
 *
 * Represents a logged workout session with exercises and sets.
 */

import mongoose from 'mongoose'

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
})

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

    exercises: {
      type: [exerciseSchema],
      default: [],
    },

    notes: {
      type: String,
      default: '',
    },

    duration: {
      type: Number,
      default: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Workout', workoutSchema)
