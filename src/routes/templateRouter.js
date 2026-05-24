/**
 * Exercise routes for retrieving exercises.
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
} from '../controllers/templateController.js'

const router = express.Router()

router.use(authMiddleware)

// ===== COLLECTION ROUTES =====

router.post('/', createTemplate)
router.get('/', getTemplates)

// ===== ID-BASED ROUTES =====

router.get('/:id', getTemplateById)
router.put('/:id', updateTemplate)
router.delete('/:id', deleteTemplate)

export default router
