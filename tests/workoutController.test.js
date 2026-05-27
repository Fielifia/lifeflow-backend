import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import mongoose from 'mongoose'

import Workout from '../src/models/Workout.js'

import {
  getWorkoutById,
} from '../src/controllers/workoutController.js'

import {
  mockResponse,
} from './helpers/mockResponse.js'

vi.mock('../src/models/Workout.js')

describe('workoutController', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns 400 for invalid workout id', async () => {

    vi.spyOn(
      mongoose.Types.ObjectId,
      'isValid',
    ).mockReturnValue(false)

    const req = {
      params: {
        id: 'invalid-id',
      },

      user: {
        id: 'user1',
      },
    }

    const res = mockResponse()

    await getWorkoutById(req, res)

    expect(res.status)
      .toHaveBeenCalledWith(400)

    expect(res.json)
      .toHaveBeenCalledWith({
        error: 'Invalid workout ID',
      })
  })

  test('returns 404 if workout does not exist', async () => {

    vi.spyOn(
      mongoose.Types.ObjectId,
      'isValid',
    ).mockReturnValue(true)

    Workout.findOne.mockReturnValue({
      lean: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      }),
    })

    const req = {
      params: {
        id: 'workout123',
      },

      user: {
        id: 'user1',
      },
    }

    const res = mockResponse()

    await getWorkoutById(req, res)

    expect(res.status)
      .toHaveBeenCalledWith(404)

    expect(res.json)
      .toHaveBeenCalledWith({
        error: 'Workout not found',
      })
  })

  test('returns workout successfully', async () => {

    vi.spyOn(
      mongoose.Types.ObjectId,
      'isValid',
    ).mockReturnValue(true)

    const workout = {
      _id: 'workout123',
      name: 'Push Day',
      exercises: [],
    }

    Workout.findOne.mockReturnValue({
      lean: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue(workout),
      }),
    })

    const req = {
      params: {
        id: 'workout123',
      },

      user: {
        id: 'user1',
      },
    }

    const res = mockResponse()

    await getWorkoutById(req, res)

    expect(res.status)
      .toHaveBeenCalledWith(200)

    expect(res.json)
      .toHaveBeenCalledWith(workout)
  })
})
