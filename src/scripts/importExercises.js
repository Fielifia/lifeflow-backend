/**
 * Script for importing exercises into MongoDB from a local JSON dataset.
 *
 * Responsibilities:
 * - Load exercise data from a JSON file
 * - Transform external data into internal schema format
 * - Reset the exercises collection safely
 * - Insert mapped exercises into MongoDB
 *
 * Usage:
 *   node src/scripts/importExercises.js
 *
 * Notes:
 * - Intended for development / initial data seeding
 * - Should NOT be exposed as a public API endpoint
 *
 * @module scripts/importExercises
 */

import dotenv from 'dotenv'
import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import Exercise from '../models/Exercise.js'

dotenv.config()

/**
 * Resolve __dirname in ES module environment
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Absolute path to exercises dataset
 *
 * @type {string}
 */
const filePath = path.join(__dirname, '../../data/exercises.json')

/**
 * Base URL for hosted exercise images
 * Converts relative image paths → full URLs
 *
 * @type {string}
 */
const BASE_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

/**
 * Load and parse exercise JSON file
 *
 * @returns {Array<object>} Parsed exercise data
 * @throws {Error} If file cannot be read or parsed
 */
function loadExercisesFromFile() {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Dataset not found at path: ${filePath}`)
  }

  const rawData = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(rawData)
}

/**
 * Transform external dataset → internal Exercise schema
 *
 * @param {Array<object>} exercises Raw dataset
 * @returns {Array<object>} Mapped exercises
 */
function mapExercises(exercises) {
  return exercises
    .filter((ex) => ex.id && ex.name) // 🔒 säkerställ att required fields finns
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
 * Reset exercises collection safely
 *
 * - Deletes all documents
 * - Drops collection (to clear indexes if needed)
 */
async function resetCollection() {
  try {
    await Exercise.deleteMany({})
    await mongoose.connection.dropCollection('exercises')
  } catch (err) {
    // Collection may not exist yet → ignore
    if (err.codeName !== 'NamespaceNotFound') {
      throw err
    }
  }
}

/**
 * Main import function
 */
async function importExercises() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in environment variables')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)

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
    process.exit(0)
  } catch (err) {
    console.error('❌ Import failed:', err.message)
    process.exit(1)
  }
}

/**
 * Execute script
 */
importExercises()
