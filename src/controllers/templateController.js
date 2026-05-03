import Template from '../models/Template.js'
import mongoose from 'mongoose'

/**
 * Create a new workout template
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const createTemplate = async (req, res) => {
  try {
    const { exercises = [], name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Template name is required',
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

    const template = await Template.create({
      name,
      exercises: formattedExercises,
      user: req.user.id,
    })

    return res.status(201).json(template)
  } catch (err) {
    console.error('Create template error:', err)
    return res.status(500).json({ error: 'Failed to create template' })
  }
}

/**
 * Get all workout templates
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

    const query = { user: req.user.id }

    const templates = await Template.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .select('-__v')

    const total = await Template.countDocuments(query)

    return res.json({
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
 * Get the latest workout template
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getLatestTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean()
      .select('-__v')

    if (!template) {
      return res.status(404).json({ error: 'No templates found' })
    }

    return res.json(template)
  } catch (err) {
    console.error('Get latest template error:', err)
    return res.status(500).json({ error: 'Failed to fetch template' })
  }
}

/**
 * Get a single workout template by id
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

    return res.json(template)
  } catch (err) {
    console.error('Get template by ID error:', err)

    return res.status(500).json({
      error: 'Failed to fetch template',
    })
  }
}

/**
 * Update a workout template by id
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid template ID' })
    }

    if (!req.body.name || req.body.name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' })
    }

    if (
      req.body.exercises !== undefined &&
      !Array.isArray(req.body.exercises)
    ) {
      return res.status(400).json({ error: 'Exercises must be an array' })
    }

    if (req.body.exercises) {
      for (const ex of req.body.exercises) {
        if (!ex.exerciseId || !ex.name) {
          return res
            .status(400)
            .json({ error: 'Exercise must have id and name' })
        }
      }
    }

    const updated = await Template.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    ).lean()
    

    if (!updated) {
      return res.status(404).json({ error: 'Template not found' })
    }

    return res.json(updated)
  } catch (err) {
    console.error('Update template error:', err)
    return res.status(500).json({ error: 'Failed to update template' })
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

    const deleted = await Template.findOneAndDelete({
      _id: id,
      user: req.user.id,
    })

    if (!deleted) {
      return res.status(404).json({ error: 'Template not found' })
    }

    return res.json({ message: 'Template deleted' })
  } catch (err) {
    console.error('Delete template error:', err)
    return res.status(500).json({ error: 'Failed to delete template' })
  }
}
