// src/modules/auth/services/authService
import { apiRequest } from '@/core/services/apiService'
import { retriveRequest } from '@/core/services/retrieveTokenService'

const AuthService = {
  async login(email: string, password: string) {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async retriveToken() {
    return retriveRequest('/retrieve-token', {
      method: 'GET'
    })
  },

  async getUserData(token: string) {
    return apiRequest('/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  async register(email: string, password: string, name: string) {
    return apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }
}

export default AuthService
