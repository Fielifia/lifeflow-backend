/**
 * Import exercise dataset into MongoDB.
 *
 * Responsibilities:
 * - Load exercise data from a local JSON dataset
 * - Transform external data into internal schema format
 * - Reset the exercises collection safely
 * - Insert mapped exercises into MongoDB
 *
 * Notes:
 * - Intended for development and test environments
 * - Database connection handled externally
 * - Should not be exposed as a public API endpoint
 *
 * Usage:
 *   import importExercises from './importExercises.js'
 *   await importExercises()
 *
 * @module scripts/importExercises
 */

import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import Exercise from '../models/Exercise.js'

/**
 * Resolve __dirname in ES module environment.
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Absolute path to exercise dataset file.
 *
 * @type {string}
 */
const filePath = path.join(__dirname, '../../data/exercises.json')

/**
 * Base URL for hosted exercise images.
 *
 * Converts relative image paths into absolute URLs.
 *
 * @type {string}
 */
const BASE_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

/**
 * Load and parse exercise dataset from JSON file.
 *
 * @returns {Array<object>} Parsed exercise dataset
 * @throws {Error} If dataset file does not exist
 */
function loadExercisesFromFile() {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Dataset not found at path: ${filePath}`)
  }

  const rawData = fs.readFileSync(filePath, 'utf-8')

  return JSON.parse(rawData)
}

/**
 * Map external exercise dataset to internal Exercise schema.
 *
 * Responsibilities:
 * - Filter invalid exercise entries
 * - Normalize optional fields
 * - Generate hosted image URLs
 *
 * @param {Array<object>} exercises - Raw dataset entries
 * @returns {Array<object>} Normalized exercise objects
 */
function mapExercises(exercises) {
  return exercises
    .filter((ex) => ex.id && ex.name)
    .map((ex) => ({
      id: ex.id,
      name: ex.name,

      target: ex.primaryMuscles?.[0] || 'unknown',
      bodyPart: ex.primaryMuscles?.[0] || 'unknown',

      equipment: ex.equipment || 'unknown',
      secondaryMuscles: ex.secondaryMuscles || [],

      instructions: ex.instructions || [],
      category: ex.category || 'strength',
      difficulty: ex.level || 'beginner',

      images: Array.isArray(ex.images)
        ? ex.images.map((img) => BASE_URL + img)
        : [],
    }))
}

/**
 * Reset exercises collection safely.
 *
 * Responsibilities:
 * - Delete all documents
 * - Drop collection to clear indexes if necessary
 *
 * Notes:
 * - Ignores NamespaceNotFound errors for fresh databases
 *
 * @returns {Promise<void>}
 */
async function resetCollection() {
  try {
    await Exercise.deleteMany({})
    await mongoose.connection.dropCollection('exercises')
  } catch (err) {
    if (err.codeName !== 'NamespaceNotFound') {
      throw err
    }
  }
}

/**
 * Import exercises into database.
 *
 * Responsibilities:
 * - Load dataset
 * - Transform data
 * - Reset collection
 * - Insert normalized exercises
 *
 * @async
 * @returns {Promise<void>}
 */
async function importExercises() {
  console.log('Loading dataset...')

  const exercises = loadExercisesFromFile()

  console.log(`Loaded ${exercises.length} raw exercises`)

  console.log('Mapping data...')

  const mappedExercises = mapExercises(exercises)

  console.log(`Mapped ${mappedExercises.length} valid exercises`)

  console.log('Resetting collection...')

  await resetCollection()

  console.log('Inserting exercises...')

  await Exercise.insertMany(mappedExercises)

  console.log(`✅ Successfully imported ${mappedExercises.length} exercises`)
}

export default importExercises
