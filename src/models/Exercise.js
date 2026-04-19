/**
 * Mongoose schema and model for Exercise
 *
 * Represents a single exercise that can be:
 * - browsed
 * - searched
 * - selected and added to workouts
 *
 * Data is sourced from an external dataset and normalized
 * for efficient querying and frontend usage.
 *
 * @module models/Exercise
 */

import mongoose from 'mongoose'

/**
 * Exercise schema definition
 *
 * Fields are optimized for:
 * - search (text index on name)
 * - filtering (target, equipment)
 * - frontend display (images, instructions)
 */
const ExerciseSchema = new mongoose.Schema(
  {
    /**
     * Unique identifier from external dataset
     * Used to prevent duplicates
     * @type {string}
     */
    id: {
      type: String,
      required: true,
      unique: true,
    },

    /**
     * Exercise name
     * Used for display and text search
     * @type {string}
     */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Primary muscle group (used for filtering)
     * @type {string}
     */
    target: {
      type: String,
      required: true
    },

    /**
     * Body part (can overlap with target)
     * @type {string}
     */
    bodyPart: {
      type: String,
    },

    /**
     * Equipment required (used for filtering)
     * @type {string}
     */
    equipment: {
      type: String
    },

    /**
     * Secondary muscles involved
     * @type {string[]}
     */
    secondaryMuscles: {
      type: [String],
      default: [],
    },

    /**
     * Step-by-step instructions
     * @type {string[]}
     */
    instructions: {
      type: [String],
      default: [],
    },

    /**
     * Exercise category (e.g. strength, cardio)
     * @type {string}
     */
    category: {
      type: String,
    },

    /**
     * Difficulty level (beginner, intermediate, etc.)
     * @type {string}
     */
    difficulty: {
      type: String,
    },

    /**
     * Array of image URLs (hosted externally)
     * @type {string[]}
     */
    images: {
      type: [String],
      default: [],
    },
  },
  {
    /**
     * Automatically adds:
     * - createdAt
     * - updatedAt
     */
    timestamps: true,
  },
)

/**
 * Text index for search functionality
 * Enables searching exercises by name
 */
ExerciseSchema.index({ name: 'text' })

/**
 * Indexes for efficient filtering
 */
ExerciseSchema.index({ target: 1 })
ExerciseSchema.index({ equipment: 1 })

/**
 * Exercise model
 */
export default mongoose.model('Exercise', ExerciseSchema)
