import { describe, it, expect, vi } from 'vitest'
import AuthService from '@/modules/auth/services/authService'
import { apiRequest } from '@/core/services/apiService'

// Mock apiRequest
vi.mock('@/core/services/apiService', () => ({
  apiRequest: vi.fn()
}))

describe('AuthService', () => {
  it('calls login with correct parameters', async () => {
    const mockResponse = { token: 'fake-token' }
    apiRequest.mockResolvedValue(mockResponse)

    const result = await AuthService.login('test@example.com', 'password123')

    expect(apiRequest).toHaveBeenCalledWith('/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    })
    expect(result).toEqual(mockResponse)
  })

  it('calls getUserData with correct parameters', async () => {
    const mockResponse = { id: 1, name: 'John Doe' }
    apiRequest.mockResolvedValue(mockResponse)

    const result = await AuthService.getUserData('fake-token')

    expect(apiRequest).toHaveBeenCalledWith('/user', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer fake-token',
      },
    })
    expect(result).toEqual(mockResponse)
  })
})
