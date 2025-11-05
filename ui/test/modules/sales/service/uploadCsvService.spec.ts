import { vi, describe, it, expect, beforeEach } from 'vitest';
import { uploadCsv } from '@/modules/sales/services/uploadCsvService';
import { apiRequest } from '@/core/services/apiService';

// Mocking the apiRequest function
vi.mock('@/core/services/apiService', () => ({
    apiRequest: vi.fn(),
}));

describe('uploadCsv', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Clear any previous mocks before each test
    });

    it('uploads the CSV file successfully', async () => {
        const mockResponse = { success: true };
        const file = new File(['dummy content'], 'example.csv', { type: 'text/csv' });

        // Mock apiRequest to resolve with a successful response
        apiRequest.mockResolvedValue(mockResponse);

        const response = await uploadCsv(file);

        // Check if apiRequest was called with correct parameters
        expect(apiRequest).toHaveBeenCalledWith('/upload-csv', expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData),
            headers: {},
        }));

        // Check the response
        expect(response).toEqual(mockResponse);
    });

    it('handles error during CSV upload and throws an error', async () => {
        const file = new File(['dummy content'], 'example.csv', { type: 'text/csv' });
        const mockError = new Error('Upload failed');

        // Mock apiRequest to reject with an error
        apiRequest.mockRejectedValue(mockError);

        // Suppress console.error during this test
        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Expect the uploadCsv function to throw the error
        await expect(uploadCsv(file)).rejects.toThrowError('Upload failed');

        // Check if apiRequest was called
        expect(apiRequest).toHaveBeenCalledWith('/upload-csv', expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData),
            headers: {},
        }));

        // Restore the console.error function
        consoleErrorMock.mockRestore();
    });
});
