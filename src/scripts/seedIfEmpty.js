import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Exercise from '../models/Exercise.js'
import importExercises from './importExercises.js'

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)

const count = await Exercise.countDocuments()

if (count === 0) {
  console.log('No exercises found → seeding...')
  await importExercises()
} else {
  console.log('Exercises already exist → skipping seed')
}

await mongoose.disconnect()
process.exit(0)
