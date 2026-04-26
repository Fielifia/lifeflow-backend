/**
 * Template model
 *
 * Represents a template with exercises.
 */
import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    exercises: [
      {
        exerciseId: String,
        name: String,
        sets: [
          {
            reps: Number,
            weight: Number,
            _id: false,
          },
        ],
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.model('Template', templateSchema)
