/**
 * Workout model representing a logged workout session.
 *
 * @module models/Workout
 */

import mongoose from 'mongoose'

/**
 * Schema for a set within an exercise
 */
const setSchema = new mongoose.Schema({
  reps: Number,
  weight: Number,
  completed: { type: Boolean, default: false },
})

/**
 * Schema for an exercise in a workout
 */
const exerciseSchema = new mongoose.Schema({
  exerciseId: String,
  name: String,
  sets: [setSchema],
  rest: { type: Number, default: 120 },
  notes: String,
})

/**
 * Workout schema
 */
const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exercises: [exerciseSchema],
    notes: String, // session-level notes
  },
  { timestamps: true },
)

export default mongoose.model('Workout', workoutSchema)
