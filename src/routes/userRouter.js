
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'

import {
  getCurrentUser,
  updateUserSettings,
} from '../controllers/userController.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/me', getCurrentUser)

router.patch(
  '/settings',
  updateUserSettings
)

export default router
