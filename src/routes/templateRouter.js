/**
 * Template routes.
 *
 * @module routes/templates
 */
import express from 'express'

import { authMiddleware } from '../middleware/auth.js'
import {
  createTemplate, 
  getTemplates, 
  getTemplateById, 
  updateTemplate, 
  deleteTemplate,
  deleteAllTemplates,
} from '../controllers/templateController.js'

const router = express.Router()

router.use(authMiddleware)

// ===== GET TEMPLATE =====

router.get('/:id', getTemplateById)

// ===== UPDATE TEMPLATE =====

router.put('/:id', updateTemplate)

// ===== DELETE TEMPLATE =====

router.delete('/:id', deleteTemplate)

// ===== CREATE TEMPLATE =====

router.post('/', createTemplate)

// ===== GET ALL TEMPLATES =====

router.get('/', getTemplates)

// ===== DELETE ALL TEMPLATES =====

router.delete('/', deleteAllTemplates)

export default router
