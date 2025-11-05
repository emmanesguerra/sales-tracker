
import { render, fireEvent, screen, waitFor } from '@testing-library/vue';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { ref } from 'vue';
import FormPage from '@/modules/item-management/pages/Form.vue'
import { useItemStore } from '@/modules/item-management/store/itemStore';
import { useRouter, useRoute } from 'vue-router';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify';

vi.mock('@/modules/item-management/store/itemStore'); // Mocking the store

const vuetify = createVuetify({
    components,
    directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('vue-router');

describe('FormPage.vue', () => {
    let routerPushMock;
    let useRouteMock;

    beforeEach(() => {
        routerPushMock = vi.fn();
        useRouteMock = vi.fn();

        // Mock the return values of useRouter and useRoute
        useRouter.mockReturnValue({
            push: routerPushMock,
        });

        useRoute.mockReturnValue({
            params: {},
        });
    });

    it('displays "Create Item" when not in edit mode', () => {
        render(FormPage, {
            global: {
                plugins: [vuetify],
            },
        });

        expect(screen.getByText('Create Item')).toBeInTheDocument();
    });

    it('displays "Edit Item" and correct item code and name when in edit mode', async () => {
        // Mocking the store for the Edit mode
        useItemStore.mockReturnValue({
            getItemById: vi.fn().mockResolvedValue({
                id: 1,
                code: '001',
                name: 'Item 1',
                description: 'Item 1 description',
                price: 100,
                stock: 10,
            }),
            updateItem: vi.fn(),
            createItem: vi.fn(),
        });

        useRoute.mockReturnValue({
            params: { id: '1' },
        });

        render(FormPage, {
            global: {
                plugins: [vuetify],
            },
        });

        // Wait for the component to update after mounting
        await waitFor(() => screen.getByText('Edit Item'));

        // Assert that the page displays "Edit Item"
        expect(screen.getByText('Edit Item')).toBeInTheDocument();

        // Assert that the item code field has the correct value
        const itemCodeField = screen.getByLabelText('Item Code');
        expect(itemCodeField.value).toBe('001');  // Asserts the value of the input is '001'

        // Assert that the item name field has the correct value
        const itemNameField = screen.getByLabelText('Item Name');
        expect(itemNameField.value).toBe('Item 1');  // Asserts the value of the input is 'Item 1'
    });

    it('calls saveItem on form submission in create mode and updates store length', async () => {
        // Create a mock store with an empty initial state
        const mockStore = {
            items: [],
            getItemById: vi.fn().mockResolvedValue(null),  // No item to fetch for create mode
            updateItem: vi.fn(),
            createItem: vi.fn().mockImplementation((newItem) => {
                mockStore.items.push(newItem);  // Simulating adding the item to the store
            }),
        };

        // Mocking the useItemStore to return our mock store
        useItemStore.mockReturnValue(mockStore);

        const { getByText } = render(FormPage, {
            global: {
                plugins: [vuetify],
            },
        });

        // Wait for the component to load and ensure the "Create Item" title is displayed
        await waitFor(() => screen.getByText('Create Item'));

        // Assert that the store initially has 0 items
        expect(mockStore.items.length).toBe(0);

        // Get the Save Item button
        const saveButton = screen.getByText('Save Item');

        // Simulate filling in the form fields and submitting the form
        await fireEvent.update(screen.getByLabelText('Item Code'), '001');
        await fireEvent.update(screen.getByLabelText('Item Name'), 'New Item');
        await fireEvent.update(screen.getByLabelText('Description'), 'Description of new item');
        await fireEvent.update(screen.getByLabelText('Price'), '100');
        await fireEvent.update(screen.getByLabelText('Stock'), '10');

        // Simulate a click event on the Save Item button
        await fireEvent.click(saveButton);

        // Assert that the createItem method was called
        expect(mockStore.createItem).toHaveBeenCalledTimes(1);

        // Assert that the store now has 1 item after creation
        expect(mockStore.items.length).toBe(1);
        expect(mockStore.items[0].code).toBe('001');
    });

    it('calls updateItem on form submission in edit mode', async () => {
        // Create a mock store with an item
        const mockStore = {
            items: [
                {
                    id: 1,
                    code: '001',
                    name: 'Old Item',
                    description: 'Old item description',
                    price: 50,
                    stock: 5,
                },
            ],
            getItemById: vi.fn().mockResolvedValue({
                id: 1,
                code: '001',
                name: 'Old Item',
                description: 'Old item description',
                price: 50,
                stock: 5,
            }),  // Simulate the store returning an item for edit
            updateItem: vi.fn((updatedItem) => {
                // Update the items array to reflect the change
                const itemIndex = mockStore.items.findIndex(item => item.id === updatedItem.id);
                if (itemIndex !== -1) {
                    mockStore.items[itemIndex] = updatedItem;  // Update the item in the store
                }
            }),  // Mock the updateItem method
            createItem: vi.fn(),
        };

        // Mocking the useItemStore to return our mock store
        useItemStore.mockReturnValue(mockStore);

        // Mock the return value for useRoute to indicate we're in edit mode
        useRoute.mockReturnValue({
            params: { id: '1' },  // Simulate the route having an id, indicating edit mode
        });

        // Render the component in edit mode
        render(FormPage, {
            global: {
                plugins: [vuetify],
            },
        });

        // Wait for the component to load and ensure the "Edit Item" title is displayed
        await waitFor(() => screen.getByText('Edit Item'));

        // Assert that the store initially has 1 item
        expect(mockStore.items.length).toBe(1);

        // Get the Save Item button (in edit mode it should be "Update Item")
        const saveButton = screen.getByText('Update Item');

        // Simulate filling in the form fields with new values
        await fireEvent.update(screen.getByLabelText('Item Code'), '002');
        await fireEvent.update(screen.getByLabelText('Item Name'), 'Updated Item');
        await fireEvent.update(screen.getByLabelText('Description'), 'Updated item description');
        await fireEvent.update(screen.getByLabelText('Price'), '200');
        await fireEvent.update(screen.getByLabelText('Stock'), '20');

        // Simulate a click event on the Save Item button
        await fireEvent.click(saveButton);

        // Assert that the updateItem method was called
        expect(mockStore.updateItem).toHaveBeenCalledTimes(1);  // Ensure updateItem was called exactly once

        expect(mockStore.updateItem).toHaveBeenCalledWith({
            id: 1,
            code: '002',  // The updated item code
            name: 'Updated Item',  // The updated item name
            description: 'Updated item description',  // The updated item description
            price: '200',  // The updated item price
            stock: '20',  // The updated item stock
        });

        expect(mockStore.items.length).toBe(1);
        expect(mockStore.items[0].code).toBe('002');
    });

    
});
