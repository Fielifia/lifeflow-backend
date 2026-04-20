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
    wgerId: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
    },

    muscle: {
      type: [String],
    },

    equipment: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
ExerciseSchema.index({ name: 'text' })
ExerciseSchema.index({ category: 1 })
ExerciseSchema.index({ muscle: 1 })

export default mongoose.model('Exercise', ExerciseSchema)
