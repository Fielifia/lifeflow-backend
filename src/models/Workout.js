/**
 * Workout model
 *
 * Represents a logged workout session with exercises and sets.
 */

import mongoose from 'mongoose'

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
})

const exerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: String, // could be ObjectId if you want relation later
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
  },
  notes: String,
})

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exercises: {
      type: [exerciseSchema],
      default: [],
    },
    notes: String,
  },
  { timestamps: true }
)

export default mongoose.model('Workout', workoutSchema)
