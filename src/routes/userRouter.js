/**
 * User routes.
 *
 * @module routes/user
 */
import express from 'express'

import { authMiddleware } from '../middleware/auth.js'

import {
  getCurrentUser,
  updateUserSettings,
  updateUserInformation,
  deleteAccount,
} from '../controllers/userController.js'

const router = express.Router()

router.use(authMiddleware)

// ===== GET CURRENT USER =====

router.get('/me', getCurrentUser)

// ===== UPDATE USER SETTING =====

router.patch('/settings', updateUserSettings)

// ===== UPDATE USER INFORMATION =====

router.patch('/', updateUserInformation)

// ===== DELETE USER (ACCOUNT) =====

router.delete('/', deleteAccount)

export default router
