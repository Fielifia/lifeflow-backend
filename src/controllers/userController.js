import User from '../models/User.js'

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
