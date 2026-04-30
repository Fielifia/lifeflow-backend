/**
 * Exercise routes for retrieving exercises.
 *
 * @module routes/templates
 */
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  createTemplate, getTemplates, getTemplateById, updateTemplate,
} from '../controllers/templateController.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/', createTemplate)
router.get('/', getTemplates)
router.get('/:id', getTemplateById)
router.put('/:id', updateTemplate)

export default router
