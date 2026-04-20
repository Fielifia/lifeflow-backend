/**
 * Exercise controller handling exercise retrieval with search, filters, and pagination.
 *
 * @module controllers/exerciseController
 */
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

    if (search) {
      filter.name = new RegExp(escapeRegex(search), 'i')
    }

    const skip = (page - 1) * limit

    const [exercises, total] = await Promise.all([
      Exercise.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),

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

export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).lean()

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    res.json(formatExercise(exercise))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercise' })
  }
}
