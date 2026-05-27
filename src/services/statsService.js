import Workout from '../models/Workout.js'

/**
 * Calculates aggregated workout statistics.
 *
 * @param {Array<object>} workouts - Filtered workouts
 * @returns {{
 *   workouts: number,
 *   sets: number,
 *   reps: number,
 *   volumeKg: number,
 *   durationMinutes: number,
 *   personalBests: number
 * }} - Workout statistics
 */
export const calculateWorkoutStatistics = (workouts) => {
  let totalSets = 0
  let totalReps = 0
  let totalVolume = 0
  let totalDuration = 0
  let totalPBs = 0

  workouts.forEach((workout) => {
    totalDuration += workout.duration || 0

    workout.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        const reps = Number(set.reps) || 0
        const weight = Number(set.weight) || 0

        totalSets += 1
        totalReps += reps
        totalVolume += reps * weight

        if (set.personalBest) {
          totalPBs += 1
        }
      })
    })
  })

  return {
    workouts: workouts.length,
    sets: totalSets,
    reps: totalReps,
    volumeKg: totalVolume,
    durationMinutes: Math.round(totalDuration / 60),
    personalBests: totalPBs,
  }
}

/**
 * Calculates days since last workout.
 *
 * @param {Array<object>} workouts - User workouts
 * @returns {number | null} Days since last workout
 */
export const calculateDaysSinceWorkout = (workouts) => {
  if (!workouts.length) {
    return null
  }

  const sorted = [...workouts].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  )

  const latestWorkout = new Date(sorted[0].startTime)

  const today = new Date()

  const diffTime = today - latestWorkout

  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Builds weekly activity chart data.
 *
 * @param {Array<object>} workouts - Weekly workouts
 * @returns {{
 *   day: string,
 *   minutes: number
 * }[]} - Weekly activity data
 */
export const buildWeeklyActivity = (workouts) => {
  const weeklyActivity = [
    { day: 'Mon', minutes: 0 },
    { day: 'Tue', minutes: 0 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 0 },
    { day: 'Fri', minutes: 0 },
    { day: 'Sat', minutes: 0 },
    { day: 'Sun', minutes: 0 },
  ]

  workouts.forEach((workout) => {
    const workoutDate = new Date(workout.startTime)

    const dayIndex = workoutDate.getDay()

    // Convert Sunday (0) to last index
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1

    weeklyActivity[adjustedIndex].minutes += Math.round(
      (workout.duration || 0) / 60
    )
  })

  return weeklyActivity
}

/**
 * Checks if workout belongs to current month.
 *
 * @param {Date} date - Workout date
 * @returns {boolean} - True if current month
 */
const isCurrentMonth = (date) => {
  const today = new Date()

  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Checks if workout belongs to current week.
 *
 * @param {Date} date - Workout date
 * @returns {boolean} - True if current week
 */
const isCurrentWeek = (date) => {
  const today = new Date()

  const startOfWeek = new Date(today)

  const day = startOfWeek.getDay()

  const adjustedDay = day === 0 ? 7 : day

  startOfWeek.setDate(startOfWeek.getDate() - adjustedDay + 1)

  startOfWeek.setHours(0, 0, 0, 0)

  return date >= startOfWeek
}

/**
 * Filters workouts by selected range.
 *
 * @param {Array<object>} workouts - User workouts
 * @param {string} range - Selected range
 * @returns {Array<object>} Filtered workouts
 */
const filterWorkoutsByRange = (workouts, range) => {
  if (range === 'all') {
    return workouts
  }

  const now = new Date()

  const startDate = new Date(now)

  switch (range) {
  case '7d':
    startDate.setDate(now.getDate() - 7)
    break

  case '1m':
    startDate.setMonth(now.getMonth() - 1)
    break

  case '3m':
    startDate.setMonth(now.getMonth() - 3)
    break

  case '6m':
    startDate.setMonth(now.getMonth() - 6)
    break

  case '1y':
    startDate.setFullYear(now.getFullYear() - 1)
    break

  default:
    return workouts
  }

  return workouts.filter((workout) => new Date(workout.startTime) >= startDate)
}

/**
 * Calculates filtered workout statistics.
 *
 * @param {string} userId - Authenticated user ID
 * @param {string} range - Range to filter
 * @returns {Promise<object>} Filtered statistics
 */
export const getFilteredStatistics = async (userId, range) => {
  const workouts = await Workout.find({
    user: userId,
  }).lean()

  const filtered = filterWorkoutsByRange(workouts, range)

  return {
    ...calculateWorkoutStatistics(filtered),

    daysSinceLastWorkout:
      calculateDaysSinceWorkout(workouts),

    mostCommonExercise:
      calculateMostCommonExercise(filtered),

    bestVolumeSession:
      calculateBestVolumeSession(filtered),

    maxWeight:
      calculateMaxWeight(filtered),

    maxReps:
      calculateMaxReps(filtered),

    bestEstimated1RM:
      calculateBestEstimated1RM(filtered),
  }
}

/**
 * Calculates overview workout statistics.
 *
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<object>} Overview statistics
 */
export const getOverviewStatistics = async (userId) => {
  const workouts = await Workout.find({
    user: userId,
  }).lean()

  const currentMonthWorkouts = workouts.filter((workout) =>
    isCurrentMonth(new Date(workout.startTime))
  )

  const currentWeekWorkouts = workouts.filter((workout) =>
    isCurrentWeek(new Date(workout.startTime))
  )

  return {
    allTime: calculateWorkoutStatistics(workouts),

    currentMonth: calculateWorkoutStatistics(currentMonthWorkouts),

    currentWeek: {
      ...calculateWorkoutStatistics(currentWeekWorkouts),

      activity: buildWeeklyActivity(currentWeekWorkouts),
    },

    daysSinceLastWorkout: calculateDaysSinceWorkout(workouts),
  }
}

/**
 * Calculates exercise usage statistics.
 *
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<object>} Exercise usage statistics
 */
export const getExerciseUsageStats = async (userId) => {
  const workouts = await Workout.find({
    user: userId,
  })
    .select('startTime exercises.exerciseId')
    .lean()

  const stats = {}

  for (const workout of workouts) {

    for (const exercise of workout.exercises) {

      const id =
        exercise.exerciseId.toString()

      if (!stats[id]) {
        stats[id] = {
          count: 0,
          lastUsed: null,
        }
      }

      stats[id].count += 1

      if (
        !stats[id].lastUsed ||
        new Date(workout.startTime) >
        new Date(stats[id].lastUsed)
      ) {
        stats[id].lastUsed = workout.startTime
      }
    }
  }

  return stats
}
/**
 * Calculates the most frequently used exercise.
 *
 * @param {Array<object>} workouts - Filtered workouts
 * @returns {{
 *   name: string,
 *   count: number
 * } | null} Most used exercise
 */
const calculateMostCommonExercise = (workouts) => {
  const counts = {}

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const name = exercise.name

      counts[name] =
        (counts[name] || 0) + 1
    })
  })

  let topExercise = null

  Object.entries(counts).forEach(
    ([name, count]) => {

      if (
        !topExercise ||
        count > topExercise.count
      ) {
        topExercise = {
          name,
          count,
        }
      }
    }
  )

  return topExercise
}

/**
 * Calculates the highest volume workout session.
 *
 * Volume = reps × weight across all sets.
 *
 * @param {Array<object>} workouts - Filtered workouts
 * @returns {{
 *   workoutName: string,
 *   volume: number,
 *   startTime: Date
 * } | null} Highest volume session
 */
const calculateBestVolumeSession = (
  workouts
) => {

  let best = null

  workouts.forEach((workout) => {

    let volume = 0

    workout.exercises.forEach(
      (exercise) => {

        exercise.sets.forEach(
          (set) => {

            volume +=
              (set.reps || 0) *
              (set.weight || 0)
          }
        )
      }
    )

    if (
      !best ||
      volume > best.volume
    ) {
      best = {
        workoutName:
          workout.name,

        volume,

        startTime:
          workout.startTime,
      }
    }
  })

  return best
}

/**
 * Calculates the heaviest lifted set.
 *
 * @param {Array<object>} workouts - Filtered workouts
 * @returns {{
 *   exercise: string,
 *   weight: number,
 *   reps: number,
 *   startTime: Date
 * } | null} Heaviest set
 */
const calculateMaxWeight = (
  workouts
) => {

  let max = null

  workouts.forEach((workout) => {

    workout.exercises.forEach(
      (exercise) => {

        exercise.sets.forEach(
          (set) => {

            if (
              !max ||
              set.weight > max.weight
            ) {
              max = {
                exercise:
                  exercise.name,

                weight:
                  set.weight,

                reps:
                  set.reps,

                startTime:
                  workout.startTime,
              }
            }
          }
        )
      }
    )
  })

  return max
}

/**
 * Calculates the highest rep set.
 *
 * @param {Array<object>} workouts - Filtered workouts
 * @returns {{
 *   exercise: string,
 *   reps: number,
 *   weight: number,
 *   startTime: Date
 * } | null} Highest rep set
 */
const calculateMaxReps = (
  workouts
) => {

  let max = null

  workouts.forEach((workout) => {

    workout.exercises.forEach(
      (exercise) => {

        exercise.sets.forEach(
          (set) => {

            if (
              !max ||
              set.reps > max.reps
            ) {
              max = {
                exercise:
                  exercise.name,

                reps:
                  set.reps,

                weight:
                  set.weight,

                startTime:
                  workout.startTime,
              }
            }
          }
        )
      }
    )
  })

  return max
}

/**
 * Calculates the highest estimated one-rep max.
 *
 * Uses the Epley formula:
 * 1RM = weight × (1 + reps / 30)
 *
 * @param {Array<object>} workouts - Filtered workouts
 * @returns {{
 *   exercise: string,
 *   estimated1RM: number,
 *   weight: number,
 *   reps: number,
 *   startTime: Date
 * } | null} Highest estimated 1RM
 */
const calculateBestEstimated1RM = (
  workouts
) => {

  let best = null

  workouts.forEach((workout) => {

    workout.exercises.forEach(
      (exercise) => {

        exercise.sets.forEach(
          (set) => {

            const weight =
              set.weight || 0

            const reps =
              set.reps || 0

            const estimated1RM =
              weight * (
                1 + reps / 30
              )

            if (
              !best ||
              estimated1RM >
              best.estimated1RM
            ) {
              best = {
                exercise:
                  exercise.name,

                estimated1RM:
                  Math.round(
                    estimated1RM
                  ),

                weight,

                reps,

                startTime:
                  workout.startTime,
              }
            }
          }
        )
      }
    )
  })

  return best
}
