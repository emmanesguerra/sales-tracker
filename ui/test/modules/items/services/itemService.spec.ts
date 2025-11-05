import itemService from '@/modules/item-management/services/itemService';
import { apiRequest } from '@/core/services/apiService';
import { ItemModel } from '@/modules/item-management/models/ItemModel';

vi.mock('@/core/services/apiService'); // Mock the apiRequest function

describe('itemService', () => {
    const mockItemsData = [
        { id: 1, code: '001', name: 'Item 1', description: 'Description 1', price: 100, stock: 10 },
        { id: 2, code: '002', name: 'Item 2', description: 'Description 2', price: 150, stock: 5 },
    ];

    const mockItemData = { id: 1, code: '001', name: 'Item 1', description: 'Description 1', price: 100, stock: 10 };

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    it('fetchItems should return an array of ItemModel instances', async () => {
        // Mock the apiRequest response
        apiRequest.mockResolvedValue(mockItemsData);

        // Call the service method
        const items = await itemService.fetchItems();

        // Check if apiRequest was called with the correct parameters
        expect(apiRequest).toHaveBeenCalledWith('/items', { method: 'GET' });

        // Assert that the result is an array of ItemModel instances
        expect(items).toHaveLength(2);
        expect(items[0]).toBeInstanceOf(ItemModel);
        expect(items[0].code).toBe('001');
        
        expect(items[1]).toBeInstanceOf(ItemModel);
        expect(items[1].code).toBe('002');
    });

    it('createItem should create and return an ItemModel instance', async () => {
        // Mock the apiRequest response
        apiRequest.mockResolvedValue(mockItemData);

        // Create an ItemModel for the test
        const item = new ItemModel(1, '001', 'Item 1', 'Description 1', 100, 10);

        // Call the service method
        const createdItem = await itemService.createItem(item);

        // Check if apiRequest was called with the correct parameters
        expect(apiRequest).toHaveBeenCalledWith('/items', {
            method: 'POST',
            body: JSON.stringify({
                code: item.code,
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
            }),
        });

        // Assert that the result is an ItemModel instance with the correct data
        expect(createdItem).toBeInstanceOf(ItemModel);
        expect(createdItem.code).toBe('001');
    });

    it('updateItem should update and return an ItemModel instance', async () => {
        // Mock the apiRequest response
        apiRequest.mockResolvedValue(mockItemData);

        // Create an ItemModel for the test
        const item = new ItemModel(1, '001', 'Item 1', 'Description 1', 100, 10);

        // Call the service method
        const updatedItem = await itemService.updateItem(item);

        // Check if apiRequest was called with the correct parameters
        expect(apiRequest).toHaveBeenCalledWith(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                code: item.code,
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
            }),
        });

        // Assert that the result is an ItemModel instance with the correct data
        expect(updatedItem).toBeInstanceOf(ItemModel);
        expect(updatedItem.code).toBe('001');
    });

    it('deleteItem should call apiRequest with the correct parameters', async () => {
        // Mock the apiRequest response
        apiRequest.mockResolvedValue(undefined); // No response is needed for DELETE

        // Call the service method
        await itemService.deleteItem(1);

        // Check if apiRequest was called with the correct parameters
        expect(apiRequest).toHaveBeenCalledWith('/items/1', { method: 'DELETE' });
   
    });
});
