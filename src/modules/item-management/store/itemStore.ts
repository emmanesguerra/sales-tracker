// src/modules/items/store/itemStore.ts
import { defineStore } from 'pinia';
import { ItemModel } from '../models/ItemModel';
import itemService from '../services/itemService';

export const useItemStore = defineStore('itemStore', {
    state: () => ({
        items: [] as ItemModel[],
    }),
    actions: {
        async fetchItems() {
            try {
                const response = await itemService.fetchItems();
                this.items = response.map((itemData: any) => new ItemModel(itemData.id, itemData.code, itemData.name, itemData.description, itemData.price, itemData.stock));
            } catch (error) {
                console.error('Error fetching items:', error);
                throw new Error('Failed to fetch items.');
            }
        },

        async getItemById(id: number) {
            try {
                const existingItem = this.items.find((item: ItemModel) => item.id === id);
                return existingItem;
            } catch (error) {
                console.error('Error fetching item by ID:', error);
                throw new Error('Failed to fetch item.');
            }
        },

        async createItem(itemData: any) {
            try {
                const newItemModel = new ItemModel(
                    itemData.id,
                    itemData.code,
                    itemData.name,
                    itemData.description,
                    parseFloat(itemData.price),  // Convert to number
                    parseInt(itemData.stock, 10)  // Convert to integer
                );

                const createdItem = await itemService.createItem(newItemModel);
                this.items.push(createdItem);
            } catch (error) {
                throw error;
            }
        },

        async updateItem(itemData: ItemModel) {
            try {
                // Update the item in the database via the API
                const updatedItem = await itemService.updateItem(itemData);  // Assuming you have an updateItem in itemService
               
                // Update the item in the store's state
                const index = this.items.findIndex((item: ItemModel) => item.id === updatedItem.id);
                if (index !== -1) {
                    this.items[index] = updatedItem;  // Replace the old item with the updated one
                }
            } catch (error) {
                throw error;
            }
        },

        async deleteItem(id: number): Promise<void> {
            try {
                await itemService.deleteItem(id);
                this.items = this.items.filter((item: ItemModel) => item.id !== id);
            } catch (error) {
                console.error('Error deleting item:', error);
                throw new Error('Failed to delete item.');
            }
        },
    },
});
