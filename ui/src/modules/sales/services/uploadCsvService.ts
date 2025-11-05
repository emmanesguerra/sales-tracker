import { apiRequest } from '@/core/services/apiService'

const uploadCsv = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await apiRequest('/upload-csv', {
            method: 'POST',
            body: formData,
            headers: {}
        })
        return response
    } catch (error) {
        console.error('CSV Upload failed:', error)
        throw error
    }
}

export { uploadCsv }
