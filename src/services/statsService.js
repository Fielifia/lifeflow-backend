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
 * }}
 */
const calculateWorkoutStatistics = (workouts) => {
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
 * Builds weekly activity chart data.
 *
 * @param {Array<object>} workouts - Weekly workouts
 * @returns {{
 *   day: string,
 *   minutes: number
 * }[]}
 */
const buildWeeklyActivity = (workouts) => {
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
    const workoutDate = new Date(workout.date)

    const dayIndex = workoutDate.getDay()

    // Convert Sunday (0) to last index
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1

    weeklyActivity[adjustedIndex].minutes += Math.round(
      (workout.duration || 0) / 60,
    )
  })

  return weeklyActivity
}

/**
 * Checks if workout belongs to current month.
 *
 * @param {Date} date - Workout date
 * @returns {boolean}
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
 * @returns {boolean}
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
 * Calculates overview workout statistics for dashboard.
 *
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<object>} Dashboard statistics
 */
export const getOverviewStatistics = async (userId) => {
  const workouts = await Workout.find({
    user: userId,
  }).lean()

  const currentMonthWorkouts = workouts.filter((workout) =>
    isCurrentMonth(new Date(workout.date)),
  )

  const currentWeekWorkouts = workouts.filter((workout) =>
    isCurrentWeek(new Date(workout.date)),
  )

  return {
    allTime: calculateWorkoutStatistics(workouts),

    currentMonth: calculateWorkoutStatistics(currentMonthWorkouts),

    currentWeek: {
      ...calculateWorkoutStatistics(currentWeekWorkouts),

      activity: buildWeeklyActivity(currentWeekWorkouts),
    },
  }
}
