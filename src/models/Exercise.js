import mongoose from 'mongoose'

const ExerciseSchema = new mongoose.Schema(
  {
<<<<<<< Updated upstream
    wgerId: {
      type: Number,
=======
    exerciseDbId: {
      type: String,
>>>>>>> Stashed changes
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

<<<<<<< Updated upstream
    category: {
      type: String,
    },

    muscle: {
      type: [String],
    },

    equipment: {
=======
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
>>>>>>> Stashed changes
      type: [String],
      default: [],
    },

<<<<<<< Updated upstream
    image: {
      type: String,
      default: null,
    },
=======
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
>>>>>>> Stashed changes
  },
  {
    timestamps: true,
  },
)

ExerciseSchema.index({ name: 'text' })
<<<<<<< Updated upstream
ExerciseSchema.index({ category: 1 })
ExerciseSchema.index({ muscle: 1 })
=======
ExerciseSchema.index({ bodyPart: 1 })
ExerciseSchema.index({ target: 1 })
ExerciseSchema.index({ primaryMuscles: 1 })
ExerciseSchema.index({ equipment: 1 })
>>>>>>> Stashed changes

export default mongoose.model('Exercise', ExerciseSchema)
