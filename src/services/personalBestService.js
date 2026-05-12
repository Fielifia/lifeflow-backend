import Workout from '../models/Workout.js'
/**
 * Recalculates personal bests for a specific exercise.
 *
 * Used after workout create/update/delete to ensure
 * PB flags remain historically correct based on workout dates.
 *
 * @param {string} userId - Current user id
 * @param {string} exerciseId - Exercise id
 */
export const recalculateExercisePBs = async (
  userId,
  exerciseId
) => {
  let bestWeight = 0
  let bestReps = 0

  const workouts = await Workout.find({
    user: userId,
    'exercises.exerciseId': exerciseId,
  }).sort({ date: 1 })

  for (const workout of workouts) {

    for (const exercise of workout.exercises) {
      if (exercise.exerciseId.toString() !== exerciseId.toString()) {
        continue
      }

      for (const set of exercise.sets) {
        set.personalBest = false

        if (!set.completed) {
          continue
        }

        const weight = Number(set.weight)
        const reps = Number(set.reps)

        const isPB =
          weight > bestWeight ||
          (weight === bestWeight && reps > bestReps)

        if (isPB) {
          set.personalBest = true

          bestWeight = weight
          bestReps = reps

        }
      }
    }

    workout.personalBests = workout.exercises.reduce(
      (total, ex) =>
        total +
        ex.sets.filter((set) => set.personalBest).length,
      0
    )

    await workout.save()
  }
}
