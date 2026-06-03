import mongoose from 'mongoose'
import dotenv from 'dotenv'

import Workout from '../models/Workout.js'
import Exercise from '../models/Exercise.js'

dotenv.config()

// ===== CONFIG =====

const USER_ID = '6a200e0b18591391a5e880b1'

const TOTAL_WORKOUTS = 90

const workoutNames = [
  'Push Day',
  'Pull Day',
  'Leg Day',
  'Upper Body',
  'Full Body',
  'Chest & Triceps',
  'Back & Biceps',
]

const motivationalNotes = [
  '',
  '',
  '',
  'Felt strong today',
  'Low energy but showed up',
  'Good pump',
  'Tried increasing weight',
  'Focused on form',
  'Pretty solid session',
]

// ===== HELPERS =====

/**
 * Generates a random integer
 * between min and max.
 *
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
const randomBetween = (min, max) =>
  Math.floor(
    Math.random() * (max - min + 1)
  ) + min

/**
 * Returns a random item from an array.
 *
 * @template T
 * @param {Array<T>} arr - Source array
 * @returns {T} Random array item
 */
const randomItem = (arr) =>
  arr[
    Math.floor(Math.random() * arr.length)
  ]

/**
 * Returns a shuffled copy of an array.
 *
 * @template T
 * @param {Array<T>} arr - Source array
 * @returns {Array<T>} Shuffled array
 */
const shuffle = (arr) =>
  [...arr].sort(() => Math.random() - 0.5)

/**
 * Returns true based on probability.
 *
 * Example:
 * chance(0.25) = 25% chance
 *
 * @param {number} percent - Probability value between 0 and 1
 * @returns {boolean} Random probability result
 */
const chance = (percent) =>
  Math.random() < percent

// ===== MAIN =====

/**
 * Seeds realistic workout history data
 * for development and statistics testing.
 *
 * Creates randomized workouts across
 * the past year using existing exercises.
 *
 * @returns {Promise<void>} Seed completion
 */
const seedWorkoutHistory = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    )

    console.log('Connected to MongoDB')

    // ===== FETCH EXERCISES =====

    const exercises =
      await Exercise.find()

    if (!exercises.length) {
      console.log(
        'No exercises found in database'
      )

      process.exit(0)
    }

    console.log(
      `Found ${exercises.length} exercises`
    )

    // ===== SAFETY CHECK =====

    const existingCount =
      await Workout.countDocuments({
        user: USER_ID,
      })

    if (existingCount > 50) {
      console.log(
        `User already has ${existingCount} workouts.`
      )

      console.log(
        'Aborting seed to avoid duplicates.'
      )

      process.exit(0)
    }

    // ===== CREATE WORKOUTS =====

    const workouts = []

    const now = new Date()

    for (
      let i = 0;
      i < TOTAL_WORKOUTS;
      i++
    ) {

      // Random date in past year

      const daysAgo =
        randomBetween(0, 365)

      const startTime =
        new Date(now)

      startTime.setDate(
        now.getDate() - daysAgo
      )

      startTime.setHours(
        randomBetween(6, 21),
        randomBetween(0, 59),
        0,
        0
      )

      // Simulate progression over time

      const progressionFactor =
        (365 - daysAgo) / 365

      // ===== TRAINING PHASES =====

      // Older workouts:
      // more machines / beginner style

      const beginnerKeywords = [
        'machine',
        'press',
        'pulldown',
        'curl',
        'extension',
      ]

      // Mid progression:
      // more hypertrophy

      const hypertrophyKeywords = [
        'bench',
        'row',
        'press',
        'fly',
        'curl',
        'lateral',
      ]

      // Recent workouts:
      // more strength focused

      const strengthKeywords = [
        'bench',
        'deadlift',
        'squat',
        'barbell',
        'row',
        'pull',
      ]

      // ===== PICK PHASE =====

      let activeKeywords = beginnerKeywords

      if (daysAgo < 120) {
        activeKeywords = strengthKeywords
      } else if (daysAgo < 240) {
        activeKeywords = hypertrophyKeywords
      }

      // ===== FILTER EXERCISES =====

      const prioritizedExercises =
        exercises.filter((ex) => {

          const name =
            ex.name.toLowerCase()

          return activeKeywords.some(
            (keyword) =>
              name.includes(keyword)
          )
        })

      // Fallback if too few matches

      const exercisePool =
        prioritizedExercises.length >= 6
          ? prioritizedExercises
          : exercises

      // ===== SELECT EXERCISES =====

      const selectedExercises =
        shuffle(exercisePool).slice(
          0,
          randomBetween(4, 7)
        )

      const mappedExercises =
        selectedExercises.map(
          (ex, index) => {

            const baseWeight =
              20 +
              index * 6 +
              progressionFactor * 70

            const setCount =
              randomBetween(3, 5)


            return {
              exerciseId: ex._id,

              muscle:
                ex.target ||
                ex.bodyPart ||
                'Other',

              bodyPart:
                ex.bodyPart || 'Other',

              primaryMuscles:
                ex.target
                  ? [ex.target]
                  : ex.bodyPart
                    ? [ex.bodyPart]
                    : [],

              name: ex.name,

              images:
                ex.images || [],

              rest:
                randomBetween(
                  60,
                  180
                ),

              notes:
                chance(0.15)
                  ? 'Focus on form'
                  : '',

              sets: Array.from({
                length: setCount,
              }).map((_, setIndex) => {

                const completed =
                  Math.random() > 0.05

                const isPR =
                  chance(0.04)

                const weight =
                  Math.round(
                    baseWeight +
                    setIndex * 2 +
                    randomBetween(-3, 5) +
                    (isPR ? 20 : 0)
                  )

                return {
                  reps:
                    randomBetween(
                      6,
                      12
                    ),

                  weight:
                    Math.max(
                      0,
                      weight
                    ),

                  completed,

                  personalBest: isPR,
                }
              }),
            }
          }
        )

      // Random duration
      // 40 min -> 2h

      const duration =
        randomBetween(
          2400,
          7200
        )

      workouts.push({
        user: USER_ID,

        name:
          randomItem(
            workoutNames
          ),

        personalBests: 0,

        exercises:
          mappedExercises,

        notes:
          randomItem(
            motivationalNotes
          ),

        duration,

        startTime,
      })
    }

    // ===== INSERT =====

    await Workout.insertMany(
      workouts
    )

    console.log(
      `Inserted ${workouts.length} workouts`
    )

    console.log(
      'Workout history seed completed'
    )

    await mongoose.disconnect()

    process.exit(0)

  } catch (err) {
    console.error(
      'Seed error:',
      err
    )

    process.exit(1)
  }
}

seedWorkoutHistory()
