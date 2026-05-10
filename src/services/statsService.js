import Workout from '../models/Workout.js'

/**
 * Calculates overview workout statistics for a specific user.
 * 
 * Aggregates basic statistics from the user's workout history,
 * including total workouts, total sets, and total training volume.
 * 
 * @param {string} userId - The authenticated user's ID.
 * @returns {Promise<{
 * totalWorkouts: number,
 * totalSets: number,
 * totalVolume: number
 * }>} - Aggregated workout statistics
 */
export const getOverviewStatistics = async (userId) => {
  const workouts = await Workout.find({ user: userId })

  const totalWorkouts = workouts.length

  let totalSets = 0
  let totalVolume = 0

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        totalSets += 1
        totalVolume += set.weight * set.reps
      })
    })
  })

  return {
    totalWorkouts,
    totalSets,
    totalVolume,
  }
}
