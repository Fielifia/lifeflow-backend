/**
 * Formats exercise payload data into
 * a consistent backend structure.
 *
 * @param {Array<object>} exercises - Raw exercise payload
 * @returns {Array<object>} Formatted exercises
 */
export function formatExercisePayload(exercises = []) {
  return exercises.map((e) => ({
    exerciseId: e.exerciseId,
    name: e.name,
    images: e.images || [],
    sets: e.sets || [],
    rest: e.rest ?? e.restTime ?? 120,
    notes: e.notes ?? '',
  }))
}
