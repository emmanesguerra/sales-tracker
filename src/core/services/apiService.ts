// src/core/services/apiService.ts
import { useAuthStore } from '@/modules/auth/store/authStore'

const apiRequest = async (
    endpoint: string,
    options: RequestInit = {},
    responseType: 'json' | 'blob' = 'json'
) => {
    const authStore = useAuthStore()
    let API_URL = `http://${import.meta.env.VITE_API_DOMAIN}/api`
    if (authStore.subdomain) {
        API_URL = `http://${authStore.subdomain}.${import.meta.env.VITE_API_DOMAIN}/api`
    }

    const headers: { [key: string]: string } = {
        'Accept': responseType === 'blob' ? 'application/pdf' : 'application/json',
        ...(options.headers as { [key: string]: string }),
        Authorization: authStore.token ? `Bearer ${authStore.token}` : '',
    }

    if (options.body) {
        if (options.body instanceof FormData) {
            // Do nothing
        } else if (options.body instanceof Blob) {
            headers['Content-Type'] = 'application/csv'
        } else {
            headers['Content-Type'] = 'application/json'
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        const error: any = new Error(data.message || `API request failed: ${response.statusText}`)
        error.status = response.status
        error.data = data
        throw error
    }

    if (responseType === 'blob') {
        return await response.blob()
    }

    return data
}

export { apiRequest }
