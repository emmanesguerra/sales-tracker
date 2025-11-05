import { vi } from 'vitest';
import { qrCodeService } from '@/modules/qrcode/services/qrCodeService';
import { apiRequest } from '@/core/services/apiService';

// Mocking the `apiRequest` function used in the service
vi.mock('@/core/services/apiService', () => ({
  apiRequest: vi.fn(),
}));

describe('qrCodeService', () => {
  it('should submit the form and return a Blob', async () => {
    const mockBlob = new Blob(['test content'], { type: 'application/csv' }); // Mock Blob content

    // Mock the `apiRequest` to return the Blob
    apiRequest.mockResolvedValue(mockBlob);

    const selectedItems = [1, 2, 3]; // Example selected items

    // Call the submitForm method and capture the response
    const result = await qrCodeService.submitForm(selectedItems);

    // Check that the result is a Blob
    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBeGreaterThan(0); // Ensure the Blob has content

    // Ensure that apiRequest was called with the correct parameters
    expect(apiRequest).toHaveBeenCalledWith('/qr-code/generate', {
      method: 'POST',
      body: JSON.stringify({ items: selectedItems }),
    }, 'blob');
  });

  it('should throw an error if apiRequest fails', async () => {
    // Mock the apiRequest to simulate a failed request
    apiRequest.mockRejectedValue(new Error('API request failed'));
  
    const selectedItems = [1, 2, 3];
  
    // Mock console.error to suppress the error output
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    // Test that the error is thrown
    await expect(qrCodeService.submitForm(selectedItems)).rejects.toThrow('Error submitting form to server.');
  
    // Ensure that apiRequest was called with the correct parameters
    expect(apiRequest).toHaveBeenCalledWith('/qr-code/generate', {
      method: 'POST',
      body: JSON.stringify({ items: selectedItems }),
    }, 'blob');
  
    // Restore the console.error function
    consoleErrorMock.mockRestore();
  });
});
