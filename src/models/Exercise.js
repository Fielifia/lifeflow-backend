/**
 * Exercise model
 *
 * Represents an exercise that can be browsed, searched,
 * and added to workouts.
 *
 * Includes indexes for search (name) and filtering (target, equipment).
 */

import mongoose from 'mongoose'

const ExerciseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: String,
      required: true,
    },
    bodyPart: {
      type: String,
    },
    equipment: {
      type: String,
    },
    secondaryMuscles: {
      type: [String],
      default: [],
    },
    instructions: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
    },
    difficulty: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
ExerciseSchema.index({ name: 'text' })
ExerciseSchema.index({ target: 1 })
ExerciseSchema.index({ equipment: 1 })

export default mongoose.model('Exercise', ExerciseSchema)
