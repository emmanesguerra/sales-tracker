// src/modules/items/pages/Index.spec.ts
import { render, fireEvent, screen, waitFor } from '@testing-library/vue';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/modules/item-management/pages/Index.vue'
import { useItemStore } from '@/modules/item-management/store/itemStore';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify';
import ItemPage from '@/modules/item-management/pages/Index.vue';
import FormPage from '@/modules/item-management/pages/Form.vue';

vi.mock('@/modules/item-management/store/itemStore'); // Mocking the store

const vuetify = createVuetify({
    components,
    directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

// Mocking Vue Router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home', component: Index }, // Ensure HomePage is defined
        { path: '/item-management/create', name: 'CreateItemPage', component: ItemPage }, // Ensure FormPage is the right component
        { path: '/item-management/edit/:id', name: 'EditItemPage', component: FormPage }, // Ensure FormPage is the right component for editing as well
    ]
});

describe('Index.vue', () => {
    let mockItems = [
        { id: 1, code: 'ITEM001', name: 'Item 1', description: 'Description 1', price: 10, stock: 100, created_at: '2025-01-01', updated_at: '2025-02-01' },
        { id: 2, code: 'ITEM002', name: 'Item 2', description: 'Description 2', price: 20, stock: 200, created_at: '2025-01-02', updated_at: '2025-02-02' }
    ];

    beforeEach(() => {
        // Mock the store methods before each test
        useItemStore.mockReturnValue({
            items: mockItems,
            fetchItems: vi.fn(),
            deleteItem: vi.fn(),
        });
    });

    it('renders the item list with headers', async () => {
        render(Index, {
            global: {
                plugins: [vuetify, router],
            },
        });

        expect(screen.getByText('Item List')).toBeInTheDocument();

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Code')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Stock')).toBeInTheDocument();
    });

    it('displays the correct items in the list', () => {
        render(Index, {
            global: {
                plugins: [vuetify, router],
            },
        });

        // Check if the mock items are displayed
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('clicks "Add Item" button and redirects to CreateItemPage', async () => {
        render(Index, {
            global: {
                plugins: [vuetify, router],
            },
        });

        // Check if the "Add Item" button is rendered
        const addButton = screen.getByText('Add Item');
        expect(addButton).toBeInTheDocument();

        // Simulate clicking the "Add Item" button and check if it redirects
        await fireEvent.click(addButton);

        // Wait for the route to update, then check if the route name is 'CreateItemPage'
        await waitFor(() => expect(router.currentRoute.value.name).toBe('CreateItemPage'));
    });

    it('clicks "Edit" button and redirects to EditItemPage with correct params', async () => {
        render(Index, {
            global: {
                plugins: [vuetify, router],
            },
        });

        // Check if the edit button is rendered for each item
        const editButtons = await screen.findAllByTestId('edit-button');

        // Ensure at least one button exists before interacting
        expect(editButtons.length).toBeGreaterThan(0);

        // Click the first edit button
        await fireEvent.click(editButtons[0]);

        // Verify the navigation
        await waitFor(() => {
            expect(router.currentRoute.value.name).toBe('EditItemPage');
            expect(router.currentRoute.value.params.id).toBe('1');
        });
    });

    it('clicks "Delete" button and calls deleteItem', async () => {
        const deleteItemMock = vi.fn((id) => {
            mockItems = mockItems.filter(item => item.id !== id); // Updating mockItems with filtered items
        }); // Mock deleteItem function
    
        // Mocking the confirm dialog to automatically return true (simulate "OK")
        global.confirm = vi.fn().mockReturnValue(true);
    
        useItemStore.mockReturnValue({
            items: mockItems,
            fetchItems: vi.fn(),
            deleteItem: deleteItemMock, // Use mock function
        });
    
        render(Index, {
            global: { plugins: [vuetify, router] },
        });

        // mockItems should be 2
        expect(mockItems.length).toBe(2);
    
        const deleteButtons = await screen.findAllByTestId('delete-button');
        expect(deleteButtons.length).toBeGreaterThan(0);
    
        await fireEvent.click(deleteButtons[0]);
    
        await waitFor(() => {
            expect(deleteItemMock).toHaveBeenCalledTimes(1);
        });

        expect(mockItems.length).toBe(1); // mockItem should be 1
    });
});
