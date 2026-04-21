import mongoose from 'mongoose'

const ExerciseSchema = new mongoose.Schema(
  {
    exerciseDbId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    bodyPart: {
      type: String,
      required: true,
    },

    target: {
      type: String,
      required: true,
    },

    equipment: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    primaryMuscles: {
      type: [String],
      default: [],
    },

    secondaryMuscles: {
      type: [String],
      default: [],
    },

    instructions: {
      type: [String],
      default: [],
    },

    level: String,
    mechanic: String,
    force: String,
  },
  {
    timestamps: true,
  },
)

ExerciseSchema.index({ name: 'text' })
ExerciseSchema.index({ bodyPart: 1 })
ExerciseSchema.index({ target: 1 })
ExerciseSchema.index({ primaryMuscles: 1 })
ExerciseSchema.index({ equipment: 1 })

export default mongoose.model('Exercise', ExerciseSchema)
