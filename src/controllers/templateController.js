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
    try {
      console.log('🔥 GET TEMPLATES CONTROLLER HIT')
      let { page = 1, limit = 5 } = req.query
  
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
  
      res.json({
        page,
        limit,
        total,
        results: templates,
      })
    } catch (err) {
      console.error('Get templates error:', err)
      res.status(500).json({ error: 'Failed to fetch templates' })
    }
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid template ID' })
    }

    const template = await Template.findOne({
      _id: id,
      user: req.user.id,
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
