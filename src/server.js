/**
 * Main server file for the LifeFlow backend application.
 * Starts the Express server and listens on the specified port.
 *
 * @module server
 */
import app from './app.js'

const port = process.env.PORT || 5000

// --- Start the server ---
app.listen(port, () => {
  console.log(`LifeFlow backend is running at http://localhost:${port}`)
})
