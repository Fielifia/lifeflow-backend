/**
 * Exercise controller handling exercise retrieval with search, filters, and pagination.
 *
 * @module controllers/exerciseController
 */

import Exercise from '../models/Exercise.js'

export const getExercises = async (req, res) => {
  try {
    console.log('NEW CONTROLLER RUNNING')
    const { category, muscle, page = 1, limit = 20 } = req.query

    const filter = {}

    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i')
    }

    if (muscle) {
      filter.muscle = new RegExp(`^${muscle}$`, 'i')
    }

    const skip = (page - 1) * limit

    const [exercises, total] = await Promise.all([
      Exercise.find(filter).skip(skip).limit(Number(limit)).lean(),
      Exercise.countDocuments(filter),
    ])

    const clean = exercises.map((ex) => ({
      id: ex._id,
      wgerId: ex.wgerId,
      name: ex.name,
      category: ex.category,
      muscle: ex.muscle,
      equipment: ex.equipment,
      image: ex.image,
    }))

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      results: clean,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercises' })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await Exercise.distinct('category')
    res.json(categories.sort())
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
}

export const getMuscles = async (req, res) => {
  try {
    const { category } = req.query

    const filter = category
      ? { category: new RegExp(`^${category}$`, 'i') }
      : {}

    const muscles = await Exercise.distinct('muscle', filter)

    res.json(muscles.sort())
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch muscles' })
  }
}

export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params
    const exercise = await Exercise.findById(id).lean()
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }
    res.json(exercise)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercise' })
  }
}

