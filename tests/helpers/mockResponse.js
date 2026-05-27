import { vi } from 'vitest'

export const mockResponse = () => {
  const res = {}

  res.status = vi.fn().mockReturnValue(res)

  res.json = vi.fn().mockReturnValue(res)

  return res
}
