import Template from '../models/Template.js'
import mongoose from 'mongoose'

/**
 * Create a workout template
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

    const template = await Template.create({
      name,
      exercises,
      user: req.user.id,
    })

    return res.status(201).json(template)
  } catch (err) {
    console.error('Create template error:', err)
    return res.status(500).json({ error: 'Failed to create template' })
  }
}


/**
 * Get a workout template
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getTemplates = async (req, res) => {
  const templates = await Template.find({ user: req.user.id })
    .lean()
    .sort({ createdAt: -1 })

  res.json(templates)
}

/**
 * Get a workout template by id
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params

    const template = await Template.findOne({
      _id: id,
      user: req.user.id,
    })
      .lean()
      .select('-__v')

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid template ID' })
    }
      
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
