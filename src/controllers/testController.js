/**
 * Get a test message from the backend.
 * This is a simple endpoint to verify that the backend is working correctly.
 *
 * @route GET /
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export const getTestMessage = (req, res) => {
  res.json('Hello from the backend 🚀')
}
