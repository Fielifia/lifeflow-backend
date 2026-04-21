/**
 * Exercise controller
 */

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

    const query = {}

    if (search && search.trim() !== '') {
      query.name = {
        $regex: search.trim(),
        $options: 'i',
      }
    }

    if (muscle && muscle.trim() !== '') {
      query.$or = [
        { primaryMuscles: { $in: [muscle] } },
        { target: muscle.trim() },
      ]
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

    const total = await Exercise.countDocuments(query)

    res.status(200).json({
      page,
      limit,
      total,
      results: exercises.map(formatExercise),
    })
  } catch (err) {
    console.error('Get exercises error:', err)

    res.status(500).json({
      error: 'Failed to fetch exercises',
    })
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

/**
 * GET /exercises/:id
 */
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params

    const exercise = await Exercise.findOne({
      exerciseDbId: id,
    }).lean()

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    res.status(200).json(formatExercise(exercise))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercise' })
  }
}
