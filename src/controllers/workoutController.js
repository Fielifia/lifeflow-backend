/**
 * Workout controller handling CRUD operations for user workouts.
 *
 * @module controllers/workoutController
 */

import Workout from '../models/Workout.js'
/**
 * Get all workouts for the authenticated user (with pagination)
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getWorkouts = async (req, res) => {
  try {
    let { limit = 20, page = 1 } = req.query

    page = Math.max(1, parseInt(page))
    limit = Math.min(100, Math.max(1, parseInt(limit)))

    const userId = req.user.id

    const workouts = await Workout.find({ user: userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .sort({ createdAt: -1 })

    const total = await Workout.countDocuments({ user: userId })

    res.status(200).json({
      page,
      limit,
      total,
      results: workouts,
    })
  } catch (err) {
    console.error('Get workouts error:', err)

    res.status(500).json({
      error: 'Failed to fetch workouts',
    })
  }
}


/**
 * Get a single workout by id
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const workout = await Workout.findOne({
      _id: id,
      user: userId,
    }).lean()

    if (!workout) {
      return res.status(404).json({
        error: 'Workout not found',
      })
    }

    return res.status(200).json(workout)
  } catch (err) {
    console.error('Get workout by ID error:', err)

    return res.status(500).json({
      error: 'Failed to fetch workout',
    })
  }
}

/**
 * Get the latest workout
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getLatestWorkout = async (req, res) => {
  const workout = await Workout.findOne({ user: req.user.id })
    .sort({ createdAt: -1 })
    .lean()

  if (!workout) {
    return res.status(404).json({ error: 'No workouts found' })
  }

  return res.json(workout)
}

/**
 * Create a new workout
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const createWorkout = async (req, res) => {
  try {
    const userId = req.user.id
    const { exercises, name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Workout name is required',
      })
    }

    const formattedExercises = exercises.map((e) => ({
      exerciseId: e.exerciseId,
      name: e.name,
      images: e.images || [],
      sets: e.sets || [],
      rest: e.rest ?? 120,
      notes: e.notes ?? '',
    }))

    const workout = await Workout.create({
      name,
      exercises: formattedExercises,
      user: userId,
    })

    console.log('BODY:', req.body)

    return res.status(201).json(workout)
  } catch (err) {
    console.error('Create workout error:', err)

    return res.status(500).json({
      error: 'Failed to create workout',
    })
  }
}

/**
 * Update a workout
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { exercises, name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Workout name is required',
      })
    }

    const formattedExercises = exercises.map((e) => ({
      exerciseId: e.exerciseId,
      name: e.name,
      images: e.images || [],
      sets: e.sets || [],
      rest: e.rest ?? 120,
      notes: e.notes ?? '',
    }))

    const updated = await Workout.findOneAndUpdate(
      { _id: id, user: userId },
      {
        name,
        exercises: formattedExercises,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updated) {
      return res.status(404).json({
        error: 'Workout not found',
      })
    }

    return res.status(200).json(updated)
  } catch (err) {
    console.error('Update workout error:', err)

    return res.status(500).json({
      error: 'Failed to update workout',
    })
  }
}

/**
 * Delete a workout
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const workout = await Workout.findOneAndDelete({
      _id: id,
      user: userId,
    })

    if (!workout) {
      return res.status(404).json({
        error: 'Workout not found',
      })
    }

    return res.status(200).json({
      message: 'Workout deleted successfully',
    })
  } catch (err) {
    console.error('Delete workout error:', err)

    return res.status(500).json({
      error: 'Failed to delete workout',
    })
  }
}
