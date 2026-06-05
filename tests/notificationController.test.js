import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import * as notificationService
  from '../src/services/notificationService.js'

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../src/controllers/notificationController.js'

import {
  mockResponse,
} from './helpers/mockResponse.js'

vi.mock(
  '../src/services/notificationService.js'
)

describe(
  'notificationController',
  () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    test(
      'returns notifications successfully',
      async () => {
        const notifications = [
          {
            _id: '1',
            title: 'Test',
          },
        ]

        notificationService
          .getNotifications
          .mockResolvedValue(
            notifications
          )

        const req = {
          user: {
            id: 'user1',
          },
        }

        const res = mockResponse()

        await getNotifications(
          req,
          res
        )

        expect(res.status)
          .toHaveBeenCalledWith(200)

        expect(res.json)
          .toHaveBeenCalledWith(
            notifications
          )
      }
    )

    test(
      'returns 404 when notification is not found',
      async () => {
        notificationService
          .markAsRead
          .mockResolvedValue(null)

        const req = {
          params: {
            id: 'notification1',
          },

          user: {
            id: 'user1',
          },
        }

        const res = mockResponse()

        await markNotificationAsRead(
          req,
          res
        )

        expect(res.status)
          .toHaveBeenCalledWith(404)

        expect(res.json)
          .toHaveBeenCalledWith({
            error:
              'Notification not found',
          })
      }
    )

    test(
      'marks notification as read',
      async () => {
        const notification = {
          _id: 'notification1',
          read: true,
        }

        notificationService
          .markAsRead
          .mockResolvedValue(
            notification
          )

        const req = {
          params: {
            id: 'notification1',
          },

          user: {
            id: 'user1',
          },
        }

        const res = mockResponse()

        await markNotificationAsRead(
          req,
          res
        )

        expect(res.status)
          .toHaveBeenCalledWith(200)

        expect(res.json)
          .toHaveBeenCalledWith(
            notification
          )
      }
    )

    test(
      'marks all notifications as read',
      async () => {
        notificationService
          .markAllAsRead
          .mockResolvedValue({})

        const req = {
          user: {
            id: 'user1',
          },
        }

        const res = mockResponse()

        await markAllNotificationsAsRead(
          req,
          res
        )

        expect(res.status)
          .toHaveBeenCalledWith(200)

        expect(res.json)
          .toHaveBeenCalledWith({
            message:
              'Notifications marked as read',
          })
      }
    )

    test(
      'deletes notification',
      async () => {
        notificationService
          .deleteNotification
          .mockResolvedValue({
            _id: 'notification1',
          })

        const req = {
          params: {
            id: 'notification1',
          },

          user: {
            id: 'user1',
          },
        }

        const res = mockResponse()

        await deleteNotification(
          req,
          res
        )

        expect(
          res.sendStatus
        ).toHaveBeenCalledWith(
          204
        )
      }
    )

    test(
      'returns 404 when notification does not exist during delete',
      async () => {
        notificationService
          .deleteNotification
          .mockResolvedValue(null)

        const req = {
          params: {
            id: 'notification1',
          },

          user: {
            id: 'user1',
          },
        }

        const res = mockResponse()

        await deleteNotification(
          req,
          res
        )

        expect(res.status)
          .toHaveBeenCalledWith(404)

        expect(res.json)
          .toHaveBeenCalledWith({
            error: 'Notification not found',
          })
      }
    )
  }
)
