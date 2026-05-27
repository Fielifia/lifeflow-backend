import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import Workout from '../src/models/Workout.js'

import {
  recalculateExercisePBs,
} from '../src/services/personalBestService.js'

import {
  mockResponse,
} from './helpers/mockResponse.js'

vi.mock('../src/models/Workout.js')

describe('recalculateExercisePBs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('marks historical personal bests correctly', async () => {

    const workouts = [
      {
        exercises: [
          {
            exerciseId: 'bench',
            sets: [
              {
                weight: 100,
                reps: 5,
                completed: true,
                personalBest: false,
              },
            ],
          },
        ],

        personalBests: 0,

        save: vi.fn(),
      },

      {
        exercises: [
          {
            exerciseId: 'bench',
            sets: [
              {
                weight: 105,
                reps: 5,
                completed: true,
                personalBest: false,
              },

              {
                weight: 105,
                reps: 6,
                completed: true,
                personalBest: false,
              },

              {
                weight: 90,
                reps: 10,
                completed: true,
                personalBest: false,
              },
            ],
          },
        ],

        personalBests: 0,

        save: vi.fn(),
      },
    ]

    Workout.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue(workouts),
    })

    await recalculateExercisePBs(
      'user1',
      'bench',
    )

    expect(
      workouts[0]
        .exercises[0]
        .sets[0]
        .personalBest,
    ).toBe(true)

    expect(
      workouts[1]
        .exercises[0]
        .sets[0]
        .personalBest,
    ).toBe(true)

    expect(
      workouts[1]
        .exercises[0]
        .sets[1]
        .personalBest,
    ).toBe(true)

    expect(
      workouts[1]
        .exercises[0]
        .sets[2]
        .personalBest,
    ).toBe(false)

    expect(workouts[0].personalBests)
      .toBe(1)

    expect(workouts[1].personalBests)
      .toBe(2)

    expect(workouts[0].save)
      .toHaveBeenCalled()

    expect(workouts[1].save)
      .toHaveBeenCalled()
  })
})
