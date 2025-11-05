// src/modules/items/services/itemService.ts
import { apiRequest } from '@/core/services/apiService';
import { ItemModel } from '../models/ItemModel';

const itemService = {
    // Fetch items and return them as instances of ItemModel
    async fetchItems() {
        const response = await apiRequest('/items', {
            method: 'GET',
        });

        // Assuming API returns an array of items, transform them into ItemModel instances
        return response.map((itemData: any) => new ItemModel(
            itemData.id,
            itemData.code,
            itemData.name,
            itemData.description,
            itemData.price,
            itemData.stock
        ));
    },

    // Create an item
    async createItem(item: ItemModel) {
        const response = await apiRequest('/items', {
            method: 'POST',
            body: JSON.stringify({
                code: item.code,
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock
            }),
        });

        // Return the created item, transformed into an ItemModel
        return new ItemModel(
            response.id,
            response.code,
            response.name,
            response.description,
            response.price,
            response.stock
        );
    },
    
    // Update an existing item
    async updateItem(item: ItemModel) {
        const response = await apiRequest(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                code: item.code,
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock
            }),
        });

        // Return the updated item as an ItemModel
        return new ItemModel(
            response.id,
            response.code,
            response.name,
            response.description,
            response.price,
            response.stock
        );
    },

    // Delete an item by ID
    async deleteItem(id: number) {
        await apiRequest(`/items/${id}`, {
            method: 'DELETE',
        });
    },
};

export default itemService;
