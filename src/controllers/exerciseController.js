/**
 * Exercise controller
 */
<<<<<<< Updated upstream
import Exercise from '../models/Exercise.js'

const formatExercise = (ex) => ({
  id: ex._id.toString(),
  wgerId: ex.wgerId,
  name: ex.name,
  category: ex.category,
  muscle: ex.muscle,
  equipment: ex.equipment || [],
  image: ex.image || null,
})

const muscleMap = {
  chest: ['Pectoralis major'],
  back: ['Latissimus dorsi', 'Trapezius'],
  shoulders: ['Anterior deltoid'],
  arms: ['Biceps brachii', 'Triceps brachii', 'Forearm flexors'],
  legs: ['Quadriceps femoris', 'Hamstrings', 'Gluteus maximus'],
  core: ['Rectus abdominis'],
}

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getExercises = async (req, res) => {
  try {
    let { category, muscle, search, page = 1, limit = 20 } = req.query

    page = Math.max(1, Number(page))
    limit = Math.min(100, Number(limit))
=======

import Exercise from '../models/Exercise.js'

/**
 * Format exercise for frontend
 */
const formatExercise = (ex) => ({
  id: ex.exerciseDbId,
  name: ex.name,
  bodyPart: ex.bodyPart,
  target: ex.target,
  equipment: ex.equipment,
  images: ex.images || [],
  primaryMuscles: ex.primaryMuscles || [],
  secondaryMuscles: ex.secondaryMuscles || [],
  instructions: ex.instructions || [],
})

/**
 * GET /exercises
 */
export const getExercises = async (req, res) => {
  try {
    let { limit = 20, page = 1 } = req.query
    const { equipment, muscle, search, bodyPart } = req.query

    page = Math.max(1, parseInt(page))
    limit = Math.min(100, Math.max(1, parseInt(limit)))
>>>>>>> Stashed changes

    const filter = {}

    if (category) {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i')
    }

    if (muscle) {
      const mapped = muscleMap[muscle.toLowerCase()]

      if (mapped) {
        filter.muscle = { $in: mapped }
      } else {
        filter.muscle = new RegExp(escapeRegex(muscle), 'i')
      }
    }

<<<<<<< Updated upstream
    if (search) {
      filter.name = new RegExp(escapeRegex(search), 'i')
    }

    const skip = (page - 1) * limit

    const [exercises, total] = await Promise.all([
      Exercise.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
=======
    if (muscle) {
      query.primaryMuscles = { $in: [muscle] }
    }

    if (muscle && muscle.trim() !== '') {
      query.target = muscle.trim()
    }

    if (bodyPart && bodyPart.trim() !== '') {
      query.bodyPart = bodyPart.trim()
    }

    if (equipment && equipment.trim() !== '') {
      query.equipment = equipment.trim()
    }

    const exercises = await Exercise.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
>>>>>>> Stashed changes

      Exercise.countDocuments(filter),
    ])

    res.json({
      page,
      limit,
      total,
      results: exercises.map(formatExercise),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch exercises' })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await Exercise.distinct('category')
    res.json(categories.filter(Boolean).sort())
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
}

export const getMuscles = async (req, res) => {
  try {
    const { category } = req.query

    const filter = category
      ? { category: new RegExp(`^${escapeRegex(category)}$`, 'i') }
      : {}

    const muscles = await Exercise.distinct('muscle', filter)

    res.json(muscles.filter(Boolean).sort())
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch muscles' })
  }
}

<<<<<<< Updated upstream
export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).lean()
=======
/**
 * GET /exercises/:id
 */
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params

    const exercise = await Exercise.findOne({
      exerciseDbId: id,
    }).lean()
>>>>>>> Stashed changes

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

<<<<<<< Updated upstream
    res.json(formatExercise(exercise))
=======
    res.status(200).json(formatExercise(exercise))
>>>>>>> Stashed changes
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercise' })
  }
}
