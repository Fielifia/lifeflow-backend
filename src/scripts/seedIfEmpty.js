/**
 * Seed exercise data if the collection is empty.
 *
 * Responsibilities:
 * - Check whether exercises already exist
 * - Import exercise dataset only if collection is empty
 *
 * Notes:
 * - Prevents duplicate seed imports
 * - Intended for development and test environments
 * - Database connection handled externally
 *
 * @module scripts/seedIfEmpty
 */

import Exercise from '../models/Exercise.js'
import importExercises from './importExercises.js'

/**
 * Seed exercises if collection is empty.
 *
 * @async
 * @returns {Promise<void>}
 */
async function seedIfEmpty() {
  console.log('Checking existing exercises...')

  const count = await Exercise.countDocuments()

  if (count === 0) {
    console.log('No exercises found → seeding...')

    await importExercises()
  } else {
    console.log('Exercises already exist → skipping seed')
  }
}

export default seedIfEmpty
