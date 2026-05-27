import {
  describe,
  expect,
  test,
} from 'vitest'

import {
  calculateWorkoutStatistics,
} from '../src/services/statsService.js'

describe('calculateWorkoutStatistics', () => {

  test('calculates aggregated workout statistics', () => {

    const workouts = [
      {
        duration: 3600,

        exercises: [
          {
            sets: [
              {
                reps: 10,
                weight: 100,
                personalBest: true,
              },

              {
                reps: 5,
                weight: 120,
                personalBest: false,
              },
            ],
          },
        ],
      },
    ]

    const result =
      calculateWorkoutStatistics(workouts)

    expect(result).toEqual({
      workouts: 1,
      sets: 2,
      reps: 15,
      volumeKg: 1600,
      durationMinutes: 60,
      personalBests: 1,
    })
  })

  test('handles invalid values safely', () => {

    const workouts = [
      {
        duration: null,

        exercises: [
          {
            sets: [
              {
                reps: 'abc',
                weight: undefined,
                personalBest: false,
              },
            ],
          },
        ],
      },
    ]

    const result =
      calculateWorkoutStatistics(workouts)

    expect(result).toEqual({
      workouts: 1,
      sets: 1,
      reps: 0,
      volumeKg: 0,
      durationMinutes: 0,
      personalBests: 0,
    })
  })
})
