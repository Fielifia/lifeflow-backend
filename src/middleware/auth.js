/**
 * Authentication middleware for verifying JWT tokens.
 *
 * @module middleware/auth
 */
import jwt from 'jsonwebtoken'

/**
 * Authentication middleware using JWT.
 *
 * Verifies the provided token and attaches the user ID to the request.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Sends 401 if auth fails, otherwise calls next()
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded.userId) {
      return res.status(401).json({ error: 'Invalid token payload' })
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
    }

    return next()
  } catch (err) {
    console.error('Auth error:', err)

    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired token',
    })
  }
}
