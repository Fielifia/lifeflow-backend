import Workout from '../models/Workout.js'

/**
 * Calculates overview workout statistics for a specific user.
 *
 * Aggregates workout statistics from the user's workout history,
 * including all-time statistics, current month statistics,
 * and current week statistics/activity.
 *
 * @param {string} userId - The authenticated user's ID.
 * @returns {Promise<{
 *   allTime: {
 *     workouts: number,
 *     sets: number,
 *     reps: number,
 *     volume: number,
 *     duration: number,
 *     personalBests: number
 *   },
 *   currentMonth: {
 *     workouts: number,
 *     sets: number,
 *     reps: number,
 *     volume: number,
 *     duration: number,
 *     personalBests: number
 *   },
 *   currentWeek: {
 *     workouts: number,
 *     sets: number,
 *     reps: number,
 *     volume: number,
 *     duration: number,
 *     personalBests: number,
 *     activity: {
 *       day: string,
 *       minutes: number
 *     }[]
 *   }
 * }>} Aggregated workout statistics.
 */
export const getOverviewStatistics = async (userId) => {
  const workouts = await Workout.find({ user: userId })

  // --- Date helpers ---
  const today = new Date()

  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const startOfWeek = new Date(today)

  const day = startOfWeek.getDay()

  const adjustedDay = day === 0 ? 7 : day

  startOfWeek.setDate(startOfWeek.getDate() - adjustedDay + 1)
  startOfWeek.setHours(0, 0, 0, 0)


  /**
   * Checks if a date belongs to the current month.
   *
   * @param {Date} date - Date to validate.
   * @returns {boolean} - True if current month
   */
  const isCurrentMonth = (date) => {
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    )
  }

  /**
   * Checks if a date belongs to the current week.
   *
   * @param {Date} date - Date to validate.
   * @returns {boolean} - True if current week
   */
  const isCurrentWeek = (date) => {
    return date >= startOfWeek
  }

  // --- All-time statistics ---
  let totalSets = 0
  let totalReps = 0
  let totalVolume = 0
  let totalDuration = 0
  let totalPBs = 0

  // --- Monthly statistics ---
  let monthlyWorkouts = 0
  let monthlySets = 0
  let monthlyReps = 0
  let monthlyVolume = 0
  let monthlyDuration = 0
  let monthlyPBs = 0

  // --- Weekly statistics ---
  let weeklyWorkouts = 0
  let weeklySets = 0
  let weeklyReps = 0
  let weeklyVolume = 0
  let weeklyDuration = 0
  let weeklyPBs = 0

  // --- Weekly activity ---
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

    const currentMonthWorkout = isCurrentMonth(workoutDate)
    const currentWeekWorkout = isCurrentWeek(workoutDate)


    
    // --- Duration ---
    totalDuration += workout.duration || 0

    if (currentMonthWorkout) {
      monthlyWorkouts += 1
      monthlyDuration += workout.duration || 0
    }

    if (currentWeekWorkout) {
      weeklyWorkouts += 1
      weeklyDuration += workout.duration || 0
    }

    // --- Weekly activity ---
    if (currentWeekWorkout) {
      const dayIndex = workoutDate.getDay()

      // Convert Sunday (0) to last index
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1

      weeklyActivity[adjustedIndex].minutes += Math.round(
        (workout.duration || 0) / 60
      )
    }

    // --- Exercise statistics ---
    workout.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        const setVolume = set.weight * set.reps

        // --- All time ---
        totalSets += 1
        totalReps += set.reps
        totalVolume += setVolume

        // --- Personal bests ---
        if (set.personalBest) {
          totalPBs += 1
        }

        // --- Current month ---
        if (currentMonthWorkout) {
          monthlySets += 1
          monthlyReps += set.reps
          monthlyVolume += setVolume

          if (set.personalBest) {
            monthlyPBs += 1
          }
        }

        // --- Current week ---
        if (currentWeekWorkout) {
          weeklySets += 1
          weeklyReps += set.reps
          weeklyVolume += setVolume

          if (set.personalBest) {
            weeklyPBs += 1
          }
        }
      })
    })
  })

  return {
    allTime: {
      workouts: workouts.length,
      sets: totalSets,
      reps: totalReps,
      volumeKg: totalVolume,
      durationMinutes: Math.round(totalDuration / 60),
      personalBests: totalPBs,
    },

    currentMonth: {
      workouts: monthlyWorkouts,
      sets: monthlySets,
      reps: monthlyReps,
      volumeKg: monthlyVolume,
      durationMinutes: Math.round(monthlyDuration / 60),
      personalBests: monthlyPBs,
    },

    currentWeek: {
      workouts: weeklyWorkouts,
      sets: weeklySets,
      reps: weeklyReps,
      volumeKg: weeklyVolume,
      durationMinutes: Math.round(weeklyDuration / 60),
      personalBests: weeklyPBs,
      activity: weeklyActivity,
    },
  }
}
