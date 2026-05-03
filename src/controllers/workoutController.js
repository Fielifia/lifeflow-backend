
import Workout from '../models/Workout.js'
import mongoose from 'mongoose'

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

    const workout = await Workout.create({
      name,
      exercises: exercises || [],
      user: userId,
    })

    return res.status(201).json(workout)
  } catch (err) {
    console.error('Create workout error:', err)

    return res.status(500).json({
      error: 'Failed to create workout',
    })
  }
}

/**
 * Get all workouts
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
 * Get the latest workout
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getLatestWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean()

    if (!workout) {
      return res.status(404).json({ error: 'No workouts found' })
    }

    return res.json(workout)
  } catch (err) {
    console.error('Get latest workout error:', err)
    return res.status(500).json({ error: 'Failed to fetch workout' })
  }
}

/**
 * Get previous values from exercise
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getPreviousExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params

    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return res.status(400).json({ error: 'Invalid exercise ID' })
    }

    const workout = await Workout.findOne({
      user: req.user.id,
      'exercises.exerciseId': exerciseId.toString(),
    })
      .sort({ createdAt: -1 })
      .lean()

    if (!workout) {
      return res.status(404).json({ error: 'No previous data' })
    }

    const exercise = workout.exercises.find(
      (e) => e.exerciseId.toString() === exerciseId,
    )

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found in workout' })
    }

    const completedSets = exercise.sets.filter((s) => s.completed)

    if (completedSets.length === 0) {
      return res.status(404).json({ error: 'No completed sets found' })
    }

    return res.json({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      sets: completedSets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
      })),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch previous exercise' })
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid workout ID' })
    }

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
 * Update a workout by id
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params
    const { name, exercises, duration } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid workout ID' })
    }

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({ error: 'Workout name cannot be empty' })
    }

    if (exercises !== undefined) {
      if (!Array.isArray(exercises) || exercises.length === 0) {
        return res
          .status(400)
          .json({ error: 'At least one exercise is required' })
      }

      for (const ex of exercises) {
        if (!ex.exerciseId || !ex.name) {
          return res.status(400).json({
            error: 'Exercise must have id and name',
          })
        }

        if (!Array.isArray(ex.sets) || ex.sets.length === 0) {
          return res.status(400).json({
            error: 'Each exercise must have at least one set',
          })
        }
      }
    }

    if (duration !== undefined && duration < 0) {
      return res.status(400).json({ error: 'Duration must be positive' })
    }

    const updated = await Workout.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true, runValidators: true },
    ).lean()

    if (!updated) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    return res.json(updated)
  } catch (err) {
    console.error('Update workout error:', err)
    return res.status(500).json({ error: 'Failed to update workout' })
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
