import Template from '../models/Template.js'
/**
 * Create a workout template
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const createTemplate = async (req, res) => {
  try {
    const { name, exercises = [] } = req.body

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

    res.status(201).json(template)
  } catch (err) {
    console.error('Create template error:', err)
    res.status(500).json({ error: 'Failed to create template' })
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
