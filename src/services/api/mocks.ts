import { vi } from 'vitest'

export const axiosPostMock = vi.fn()

vi.mock('axios', () => ({
  default: {
    post: axiosPostMock,
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}))
