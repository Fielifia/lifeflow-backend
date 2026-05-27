import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../src/models/User.js'

import {
  registerUser,
  loginUser,
} from '../src/controllers/authController.js'

import {
  mockResponse,
} from './helpers/mockResponse.js'

vi.mock('../src/models/User.js')

vi.mock('bcrypt')

vi.mock('jsonwebtoken')

const mockResponse = () => {
  const res = {}

  res.status = vi.fn().mockReturnValue(res)

  res.json = vi.fn().mockReturnValue(res)

  return res
}

describe('authController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns 400 for invalid email format', async () => {

    const req = {
      body: {
        email: 'invalid-email',
        username: 'sofia',
        password: 'password123',
      },
    }

    const res = mockResponse()

    await registerUser(req, res)

    expect(res.status)
      .toHaveBeenCalledWith(400)

    expect(res.json)
      .toHaveBeenCalledWith({
        error: 'Invalid email format',
      })
  })

  test('returns 400 for short password', async () => {

    const req = {
      body: {
        email: 'test@test.com',
        username: 'sofia',
        password: '123',
      },
    }

    const res = mockResponse()

    await registerUser(req, res)

    expect(res.status)
      .toHaveBeenCalledWith(400)

    expect(res.json)
      .toHaveBeenCalledWith({
        error: 'Password must be at least 8 characters',
      })
  })

  test('returns 409 if email already exists', async () => {

    User.findOne.mockResolvedValue({
      email: 'test@test.com',
    })

    const req = {
      body: {
        email: 'test@test.com',
        username: 'sofia',
        password: 'password123',
      },
    }

    const res = mockResponse()

    await registerUser(req, res)

    expect(res.status)
      .toHaveBeenCalledWith(409)

    expect(res.json)
      .toHaveBeenCalledWith({
        error: 'Email already exists',
      })
  })

  test('returns token for valid login credentials', async () => {

    User.findOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: '123',
        email: 'test@test.com',
        username: 'sofia',
        password: 'hashed-password',
      }),
    })

    bcrypt.compare.mockResolvedValue(true)

    jwt.sign.mockReturnValue('mock-token')

    const req = {
      body: {
        email: 'test@test.com',
        password: 'password123',
      },
    }

    const res = mockResponse()

    await loginUser(req, res)

    expect(res.status)
      .toHaveBeenCalledWith(200)

    expect(res.json)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'mock-token',
        }),
      )
  })
})
