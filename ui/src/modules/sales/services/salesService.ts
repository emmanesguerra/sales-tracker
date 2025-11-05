import { apiRequest } from '@/core/services/apiService';

export const salesService = {
  async fetchSales(date: string | null) {
    try {
      const url = date 
        ? `/sales-order?date=${encodeURIComponent(date)}`
        : `/sales-order`; 

      const response = await apiRequest(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return [];
    }
  },
  async generateReport(formData: { selectedDates: string[]; selectAll: boolean }): Promise<Blob> {
      try {
          return await apiRequest('/sales-order/generate', {
              method: 'POST',
              body: JSON.stringify({ items: formData}),
          }, 'blob');

      } catch (error) {
          console.error('Error submitting form:', error);
          throw new Error('Error submitting form to server.');
      }
  },
};