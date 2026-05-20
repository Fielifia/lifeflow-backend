/**
 * Formats exercise payload data into
 * a consistent backend structure.
 *
 * @param {Array<object>} exercises - Raw exercise payload
 * @returns {Array<object>} Formatted exercises
 */
export const formatExercisePayload = (exercises = []) => {
  return exercises.map((ex) => ({
    exerciseId: ex.id || ex.exerciseId,
    name: ex.name,
    images: ex.images || [],
    sets: ex.sets || [],
    rest: ex.rest ?? ex.restTime ?? 120,
    notes: ex.notes ?? '',
  }))
}
