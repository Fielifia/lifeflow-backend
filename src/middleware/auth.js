/**
 * Authentication middleware using JWT.
 *
 * Verifies the provided token and attaches the user ID to the request.
 * Protects routes that require authentication.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  // Check if token is in correct format
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid token format' })
  }

  // Expected format: "Bearer TOKEN"
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user ID to request
    req.userId = decoded.userId

    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
