import mongoose from 'mongoose'
import Workout from '../models/Workout.js'
import { recalculateExercisePBs } from '../services/personalBestService.js'
import { formatExercisePayload } from '../utils/formatExercisePayload.js'

/**
 * Create a new workout
 * Requires authenticated user
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const createWorkout = async (req, res) => {
  try {
    const userId = req.user.id
    const {
      exercises = [],
      name,
      duration = 0,
      notes = '',
    } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Workout name is required',
      })
    }

    const formattedExercises = formatExercisePayload(exercises)

    const workout = await Workout.create({
      name,
      exercises: formattedExercises,
      personalBests: 0,
      user: userId,
      duration,
      notes,
    })

    const affectedExerciseIds = [
      ...new Set(
        formattedExercises.map((e) =>
          e.exerciseId.toString()
        )
      ),
    ]

    for (const exerciseId of affectedExerciseIds) {
      await recalculateExercisePBs(userId, exerciseId)
    }

    const freshWorkout = await Workout.findById(workout._id)
      .lean()
      .select('-__v')

    return res.status(201).json(freshWorkout)
  } catch (err) {
    console.error('Create workout error:', err)

    return res.status(500).json({
      error: 'Failed to create workout',
    })
  }
}

/**
 * Get all workouts
 * Requires authenticated user
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
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .select('-__v')

    const total = await Workout.countDocuments({ user: userId })

    return res.status(200).json({
      page,
      limit,
      total,
      results: workouts,
    })
  } catch (err) {
    console.error('Get workouts error:', err)

    return res.status(500).json({
      error: 'Failed to fetch workouts',
    })
  }
}

/**
 * Get previous sets and best set for an exercise
 * Requires authenticated user
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

    const workouts = await Workout.find({
      user: req.user.id,
      'exercises.exerciseId': exerciseId.toString(),
    })
      .sort({ date: -1 })
      .lean()

    let bestSet = { weight: 0, reps: 0 }
    let latestSets = []

    for (const workout of workouts) {
      const exercise = workout.exercises.find(
        (e) => e.exerciseId.toString() === exerciseId
      )
      if (!exercise) continue

      const completedSets = exercise.sets.filter((s) => s.completed)

      if (workout._id.toString() === workouts[0]._id.toString()) {
        latestSets = completedSets
      }

      for (const set of completedSets) {
        if (set.weight > bestSet.weight || (set.weight === bestSet.weight && set.reps > bestSet.reps)) {
          bestSet = { weight: set.weight, reps: set.reps }
        }
      }
    }

    if (!latestSets.length) {
      latestSets = [{ reps: 10, weight: 0, completed: false }]
    }

    return res.status(200).json({
      exerciseId,
      bestSet,
      sets: latestSets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
      })),
    })
  } catch (err) {
    console.error('Get previous exercise error: ', err)

    return res.status(500).json({ error: 'Failed to fetch previous exercise' })
  }
}

/**
 * Get a single workout by ID
 * Requires authenticated user
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
    })
      .lean()
      .select('-__v')

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
 * Update a workout by ID
 * Requires authenticated user
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { exercises, name, duration } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid workout ID',
      })
    }

    const existingWorkout = await Workout.findOne({
      _id: id,
      user: userId,
    })

    if (!existingWorkout) {
      return res.status(404).json({
        error: 'Workout not found',
      })
    }

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({
        error: 'Workout name cannot be empty',
      })
    }

    if (exercises !== undefined) {
      if (!Array.isArray(exercises) || exercises.length === 0) {
        return res.status(400).json({
          error: 'At least one exercise is required',
        })
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

      req.body.exercises = formatExercisePayload(exercises)
    }

    if (duration !== undefined && duration < 0) {
      return res.status(400).json({
        error: 'Duration must be positive',
      })
    }

    if (req.body.date !== undefined) {
      const parsedDate = new Date(req.body.date)

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          error: 'Invalid workout date',
        })
      }
    }

    const updated = await Workout.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .lean()
      .select('-__v')

    const oldIds = existingWorkout.exercises.map((e) =>
      e.exerciseId.toString()
    )

    const newIds = (updated.exercises || []).map((e) =>
      e.exerciseId.toString()
    )

    const affectedExerciseIds = [
      ...new Set([...oldIds, ...newIds]),
    ]

    for (const exerciseId of affectedExerciseIds) {
      await recalculateExercisePBs(userId, exerciseId)
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
 * Requires authenticated user
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid workout ID',
      })
    }

    const existingWorkout = await Workout.findOne({
      _id: id,
      user: userId,
    })

    if (!existingWorkout) {
      return res.status(404).json({
        error: 'Workout not found',
      })
    }

    const affectedExerciseIds = [
      ...new Set(
        existingWorkout.exercises.map((e) =>
          e.exerciseId.toString()
        )
      ),
    ]

    await Workout.findOneAndDelete({
      _id: id,
      user: userId,
    })

    for (const exerciseId of affectedExerciseIds) {
      await recalculateExercisePBs(userId, exerciseId)
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
