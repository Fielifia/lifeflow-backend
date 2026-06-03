import User from '../models/User.js'
import Workout from '../models/Workout.js'
import Template from '../models/Template.js'

/**
 * Returns authenticated user.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const getCurrentUser = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    )
      .select(
        '-password -__v'
      )
      .lean()

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      })
    }

    return res.status(200).json(user)

  } catch (err) {
    console.error(
      'Get current user error:',
      err
    )

    return res.status(500).json({
      error: 'Failed to fetch user',
    })
  }
}

/**
 * Updates the authenticated user's information.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const updateUserInformation = async (req, res) => {
  try {
    const { username, email } = req.body

    const updates = {}

    if (username !== undefined) {
      if (!username.trim()) {
        return res.status(400).json({
          error: 'Username is required',
        })
      }

      updates.username = username.trim()
    }

    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({
          error: 'Email is required',
        })
      }

      updates.email = email.trim().toLowerCase()
    }

    const existingUser = await User.findOne({
      $or: [
        ...(updates.email ? [{ email: updates.email }] : []),
        ...(updates.username
          ? [{ username: updates.username }]
          : []),
      ],
      _id: { $ne: req.user.id },
    })

    if (existingUser) {
      return res.status(409).json({
        error: 'Username or email already in use',
      })
    }

    const updatedUser =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: updates,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .select('-password -__v')
        .lean()

    return res.status(200).json(updatedUser)
  } catch (err) {
    console.error(
      'Update user error:',
      err
    )

    return res.status(500).json({
      error: 'Failed to update user',
    })
  }
}

/**
 * Updates user settings.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const updateUserSettings =
  async (
    req,
    res
  ) => {
    try {
      const allowedSettings = [
        'monthlyGoal',
        'defaultRestTime',
        'restTimerEnabled',
        'soundEnabled',
      ]

      const updates = {}

      for (const key of allowedSettings) {
        if (req.body[key] !== undefined) {
          updates[
            `settings.${key}`
          ] = req.body[key]
        }
      }

      const updatedUser =
        await User.findByIdAndUpdate(
          req.user.id,
          {
            $set: updates,
          },
          {
            new: true,
            runValidators: true,
          }
        )
          .select(
            '-password -__v'
          )
          .lean()

      return res.status(200).json(
        updatedUser.settings
      )

    } catch (err) {
      console.error(
        'Update settings error:',
        err
      )

      return res.status(500).json({
        error: 'Failed to update settings',
      })
    }
  }

/**
 * Deletes the authenticated user's account.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
export const deleteAccount = async (
  req,
  res
) => {
  try {
    const userId = req.user.id

    await Workout.deleteMany({
      user: userId,
    })

    await Template.deleteMany({
      user: userId,
    })

    await User.findByIdAndDelete(
      userId
    )

    return res.status(204).send()
  } catch (err) {
    console.error(
      'Delete account error:',
      err
    )

    return res.status(500).json({
      error: 'Failed to delete account',
    })
  }
}
