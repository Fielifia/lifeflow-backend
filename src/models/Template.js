/**
 * Template model
 *
 * Represents a template with exercises.
 */
import mongoose from 'mongoose'

const templateExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId, // 👈 ändra från String
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
  sets: [
    {
      reps: Number,
      weight: Number,
      _id: false,
    },
  ],
  rest: {
    type: Number,
    default: 120,
  },
  notes: {
    type: String,
    default: '',
  },
})

const templateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  exercises: {
    type: [templateExerciseSchema],
    default: [],
  },
})

export default mongoose.model('Template', templateSchema)
