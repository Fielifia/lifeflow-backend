import mongoose from 'mongoose'
import Template from '../models/Template.js'
import { formatExercisePayload } from '../utils/formatExercisePayload.js'

/**
 * Create a new workout template
 * Requires authenticated user
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const createTemplate = async (req, res) => {
  try {
    const { exercises = [], name, notes = '' } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Template name is required',
      })
    }

    const formattedExercises = formatExercisePayload(exercises)

    const template = await Template.create({
      name,
      notes,
      exercises: formattedExercises,
      user: req.user.id,
    })

    return res.status(201).json(template)
  } catch (err) {
    console.error('Create template error:', err)

    return res.status(500).json({
      error: 'Failed to create template',
    })
  }
}

/**
 * Get all workout templates
 * Requires authenticated user
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getTemplates = async (req, res) => {
  try {
    let { limit = 5, page = 1 } = req.query

    page = Math.max(1, parseInt(page))
    limit = Math.min(100, Math.max(1, parseInt(limit)))

    const userId = req.user.id

    const templates = await Template.find({ user: userId })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .select('-__v')

    const total = await Template.countDocuments({ user: userId })

    return res.status(200).json({
      page,
      limit,
      total,
      results: templates,
    })
  } catch (err) {
    console.error('Get templates error:', err)

    return res.status(500).json({ error: 'Failed to fetch templates' })
  }
}

/**
 * Get a single workout template by ID
 * Requires authenticated user
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid template ID' })
    }

    const template = await Template.findOne({
      _id: id,
      user: userId,
    })
      .lean()
      .select('-__v')

    if (!template) {
      return res.status(404).json({
        error: 'Template not found',
      })
    }

    return res.status(200).json(template)
  } catch (err) {
    console.error('Get template by ID error:', err)

    return res.status(500).json({
      error: 'Failed to fetch template',
    })
  }
}

/**
 * Update a workout template by ID
 * Requires authenticated user
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { exercises, name } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid template ID',
      })
    }

    const existingTemplate = await Template.findOne({
      _id: id,
      user: userId,
    })

    if (!existingTemplate) {
      return res.status(404).json({
        error: 'Template not found',
      })
    }

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({
        error: 'Template name cannot be empty',
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

        if (!Array.isArray(ex.sets)) {
          return res.status(400).json({
            error: 'Exercise sets must be an array',
          })
        }
      }

      req.body.exercises = formatExercisePayload(exercises)
    }

    const updated = await Template.findOneAndUpdate(
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

    return res.status(200).json(updated)
  } catch (err) {
    console.error('Update template error:', err)

    return res.status(500).json({
      error: 'Failed to update template',
    })
  }
}

/**
 * Delete a workout template
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid template ID',
      })
    }

    const existingTemplate = await Template.findOne({
      _id: id,
      user: userId,
    })

    if (!existingTemplate) {
      return res.status(404).json({
        error: 'Template not found',
      })
    }

    await Template.findOneAndDelete({
      _id: id,
      user: userId,
    })

    return res.status(200).json({
      message: 'Template deleted successfully',
    })
  } catch (err) {
    console.error('Delete template error:', err)

    return res.status(500).json({
      error: 'Failed to delete template',
    })
  }
}
