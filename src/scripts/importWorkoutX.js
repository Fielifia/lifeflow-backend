
import dotenv from 'dotenv'
import fs from 'fs'
import mongoose from 'mongoose'

import Exercise from '../models/Exercise.js'

dotenv.config()


/**
 * Base URL for hosted exercise images
 * Converts relative image paths → full URLs
 *
 * @type {string}
 */
const API_KEY = process.env.WORKOUTX_API_KEY
const BASE_URL = 'https://api.workoutxapp.com/v1'


async function fetchExercises() {
  const response = await fetch(`${BASE_URL}/exercises`, {
    headers: {
      'X-WorkoutX-Key': API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const exercises = await response.json()
  // exercises is an array of exercise objects
  console.log(exercises)
  return exercises
}

fetchExercises()

function mapExercises(exercises) {
    return exercises.filter((ex) => ex.id && ex.name)
    .map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      bodyPart: ex.bodyPart,
      equipment: ex.equipment,
      target: ex.target,
      secondaryMuscles: ex.secondaryMuscles || [],
      instructions: ex.instructions || [],
      images: ex.gifUrl ? [ex.gifUrl] : [],
      category: ex.category || 'unknown',
      difficulty: ex.difficulty || 'unknown',
      mechanic: ex.mechanic || 'unknown',
      force: ex.force || 'unknown',
      met: ex.met || null,
      caloriesPerMinute: ex.caloriesPerMinute || null,
      description: ex.description || '',
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
    const exercises = await fetchExercises()

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
