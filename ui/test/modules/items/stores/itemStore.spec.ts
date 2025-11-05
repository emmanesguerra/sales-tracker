import { createPinia, setActivePinia } from 'pinia';
import { useItemStore } from '@/modules/item-management/store/itemStore';
import itemService from '@/modules/item-management/services/itemService';
import { ItemModel } from '@/modules/item-management/models/ItemModel';

vi.mock('@/modules/item-management/services/itemService', () => ({
    default: {
        fetchItems: vi.fn(),
        createItem: vi.fn(),
        updateItem: vi.fn(),
        deleteItem: vi.fn(),
    },
}));

describe('itemStore', () => {
    let itemStore: ReturnType<typeof useItemStore>;

    const mockItemsData = [
        { id: 1, code: '001', name: 'Item 1', description: 'Description 1', price: 100, stock: 10 },
        { id: 2, code: '002', name: 'Item 2', description: 'Description 2', price: 150, stock: 5 },
    ];

    const mockItemData = { id: 1, code: '001', name: 'Item 1', description: 'Description 1', price: 100, stock: 10 };

    beforeEach(() => {
        setActivePinia(createPinia()); // Activate Pinia store for testing
        itemStore = useItemStore(); // Get the store instance
    });

    it('fetchItems should fetch and update store items', async () => {
        // Mock the apiService.fetchItems method
        itemService.fetchItems.mockResolvedValue(mockItemsData);

        // Call the store's fetchItems action
        await itemStore.fetchItems();

        // Assert that the items in the store are updated
        expect(itemStore.items).toHaveLength(2);
        expect(itemStore.items[0]).toBeInstanceOf(ItemModel);
        expect(itemStore.items[0].code).toBe('001');
        expect(itemService.fetchItems).toHaveBeenCalled();
    });

    it('getItemById should return the correct item from store', async () => {
        // Set some items in the store
        itemStore.items = mockItemsData.map((data) => new ItemModel(data.id, data.code, data.name, data.description, data.price, data.stock));

        // Call the getItemById action
        const item = await itemStore.getItemById(1);

        // Assert the item returned is the correct one
        expect(item).toBeInstanceOf(ItemModel);
        expect(item?.id).toBe(1);
        expect(item?.code).toBe('001');
    });

    it('createItem should add a new item to the store', async () => {
        // Mock the apiService.createItem method
        itemService.createItem.mockResolvedValue(mockItemData);

        // Call the store's createItem action
        await itemStore.createItem(mockItemData);

        // Assert the new item is added to the store
        expect(itemStore.items).toHaveLength(1);
        expect(itemStore.items[0].code).toBe('001');
        expect(itemService.createItem).toHaveBeenCalledWith(expect.any(ItemModel));
    });

    it('updateItem should update the existing item in the store', async () => {
        // Set initial items in the store
        const initialItems = [
            new ItemModel(1, '001', 'Item 1', 'Description 1', 100, 10),
            new ItemModel(2, '002', 'Item 2', 'Description 2', 150, 5),
        ];
        itemStore.items = initialItems;

        // Mock the apiService.updateItem method
        const updatedItem = { ...initialItems[0], code: '003' };
        itemService.updateItem.mockResolvedValue(updatedItem);

        // Call the store's updateItem action
        await itemStore.updateItem(updatedItem);

        // Assert that the item is updated in the store
        expect(itemStore.items[0].code).toBe('003');
        expect(itemService.updateItem).toHaveBeenCalledWith(updatedItem);
    });

    it('deleteItem should remove an item from the store', async () => {
        // Set initial items in the store
        itemStore.items = [
            new ItemModel(1, '001', 'Item 1', 'Description 1', 100, 10),
            new ItemModel(2, '002', 'Item 2', 'Description 2', 150, 5),
        ];

        // Mock the apiService.deleteItem method
        itemService.deleteItem.mockResolvedValue(undefined);

        // Call the store's deleteItem action
        await itemStore.deleteItem(1);

        // Assert that the item is removed from the store
        expect(itemStore.items).toHaveLength(1);
        expect(itemStore.items[0].id).toBe(2);
        expect(itemService.deleteItem).toHaveBeenCalledWith(1);
    });
});
