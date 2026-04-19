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
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid token format' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.userId

    return next()
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
