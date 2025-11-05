<template>
    <v-container>
        <v-row>
            <v-col :cols="12" :md="6">
                <v-card class="mt-4" elevation="0">
                    <v-card-title>QR Selection Form</v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-card-title>Items</v-card-title>
                            <!-- Radio Buttons -->
                            <v-radio-group v-model="selectAll">
                                <v-radio label="Select All" :value="true"></v-radio>
                                <v-radio label="Custom Selection" :value="false"></v-radio>
                            </v-radio-group>

                            <!-- Multi-Select Dropdown -->
                            <v-autocomplete v-model="form.selectedItems" label="Select Items" :items="allItems"
                                item-title="name" item-value="id" multiple chips clearable
                                :disabled="selectAll"></v-autocomplete>

                            <v-card-title>Printing Layout</v-card-title>

                            <v-radio-group v-model="layout">
                                <v-radio label="Grid" :value="true"></v-radio>
                                <v-radio label="Tabular" :value="false"></v-radio>
                            </v-radio-group>

                            <v-row>
                                <v-col :cols="12">
                                    <v-btn class="mt-4" color="primary" @click="submitForm">
                                        Submit
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia'; // Add this import
import { useItemStore } from '@/modules/item-management/store/itemStore';
import { qrCodeService } from '@/modules/qrcode/services/qrCodeService'; // Import the service

const itemStore = useItemStore();
const { items } = storeToRefs(itemStore);
const selectAll = ref(false);
const layout = ref(true);
const form = ref({
    selectedItems: [] as number[],
    layout: layout.value,
});

// Convert items from store to an array of objects with { id, name }
const allItems = computed(() => items.value.map(item => ({ id: item.id, name: item.name })));

// Fetch items on component mount if needed
onMounted(async () => {
    if (items.value.length === 0) {
        await itemStore.fetchItems();
    }
});

// Watch selectAll to update selectedItems
watch(selectAll, (newValue) => {
    form.value.selectedItems = newValue ? allItems.value.map(item => item.id) : [];
});

// Handle form submission and file download
const submitForm = async () => {
    try {
        const formData = {
            selectedItems: form.value.selectedItems,
            isGrid: layout.value, // Pass the selected layout to the service
        };
        
        const fileBlob = await qrCodeService.submitForm(formData);

        // Ensure the file is a valid blob (e.g., a PDF)
        const fileURL = window.URL.createObjectURL(fileBlob);

        // Create an anchor tag to trigger the download
        const a = document.createElement('a');
        a.href = fileURL;

        // Set the correct filename based on the type of file (PDF in this case)
        a.download = 'generated-file.pdf'; // Change to the appropriate file type extension if needed

        // Programmatically click the link to trigger the download
        a.click();
        a.remove();

        // Release the object URL after download to avoid memory leaks
        window.URL.revokeObjectURL(fileURL);
    } catch (error) {
        console.error('Error during form submission or file download:', error);
    }
};
</script>
