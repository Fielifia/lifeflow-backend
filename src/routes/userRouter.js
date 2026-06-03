
import express from 'express'
import { authMiddleware } from '../middleware/auth.js'

import {
  getCurrentUser,
  updateUserSettings,
  deleteAccount,
} from '../controllers/userController.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/me', getCurrentUser)

router.patch(
  '/settings',
  updateUserSettings
)

router.delete('/me', deleteAccount)

export default router
