<template>
    <v-container>
        <!-- Table Header Section (Content) -->
        <v-card class="mt-4" elevation="0">
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h5">Item List</span>
                <v-btn color="primary" @click="router.push({ name: 'CreateItemPage' })">
                    Add Item
                </v-btn>
            </v-card-title>

            <v-card-text>
                <!-- Data Table -->
                <v-data-table :headers="headers" :items="itemStore.items">
                    <!-- Table Rows and Actions -->
                    <template v-slot:item.price="{ item }">
                        <span class="text-right">{{ parseFloat(item.price).toFixed(2) }}</span>
                    </template>
                    <template v-slot:item.stock="{ item }">
                        <span>{{ item.stock }}</span>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-row>
                            <v-col cols="auto">
                                <v-btn density="comfortable" color="primary" data-testid="edit-button"
                                    @click="router.push({ name: 'EditItemPage', params: { id: item.id } })">
                                    <v-icon icon="mdi-pencil"></v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn density="comfortable" color="danger" data-testid="delete-button" @click="deleteItem(item.id)">
                                    <v-icon icon="mdi-delete"></v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useItemStore } from '../store/itemStore';
import { useRouter } from 'vue-router';

const itemStore = useItemStore();
const router = useRouter();

// Table headers
const headers = ref([
    { title: 'ID', key: 'id', width: '150px' },
    { title: 'Code', key: 'code', width: '200px' },
    { title: 'Name', key: 'name' },
    { title: 'Price', key: 'price', width: '150px' },
    { title: 'Stock', key: 'stock', width: '200px' },
    { title: 'Actions', key: 'actions', width: '300px', sortable: false }
]);

// Fetch items when page is mounted
onMounted(() => {
    if (itemStore.items.length === 0) { 
        itemStore.fetchItems();
    }
});

// Function to delete an item
const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        await itemStore.deleteItem(id);
    }
};
</script>