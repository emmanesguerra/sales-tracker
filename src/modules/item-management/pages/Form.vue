<template>
    <v-container>
        <v-row>
            <v-col :cols="12" :md="6">
                <v-card class="mt-4" elevation="0">
                    <v-card-title>
                        <span class="text-h5">{{ isEditMode ? 'Edit Item' : 'Create Item' }}</span>
                    </v-card-title>

                    <v-card-text>

                        <v-form v-model="valid" ref="form" lazy-validation>
                            <v-row>
                                <v-col :cols="12" :md="6">
                                    <v-text-field v-model="item.code" label="Item Code" required @input="handleInput"
                                        :error="!!fieldErrors.code" :error-messages="fieldErrors.code"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col :cols="12">
                                    <v-text-field v-model="item.name" label="Item Name" required
                                        :error="!!fieldErrors.name" :error-messages="fieldErrors.name"></v-text-field>
                                </v-col>

                                <v-col :cols="12">
                                    <v-textarea v-model="item.description" label="Description"
                                        :error="!!fieldErrors.description"
                                        :error-messages="fieldErrors.description"></v-textarea>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col :cols="12" :md="6">
                                    <v-text-field v-model="item.price" label="Price" type="number" required
                                        :error="!!fieldErrors.price" :error-messages="fieldErrors.price"></v-text-field>
                                </v-col>

                                <v-col :cols="12" :md="6">
                                    <v-text-field v-model="item.stock" label="Stock" type="number" required
                                        :error="!!fieldErrors.stock" :error-messages="fieldErrors.stock"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col :cols="12">
                                    <v-btn class="mt-4" color="primary" @click="saveItem" :loading="loading">
                                        {{ isEditMode ? 'Update Item' : 'Save Item' }}
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useItemStore } from '../store/itemStore';
import { ItemModel } from '../models/ItemModel';

const router = useRouter();
const route = useRoute();
const itemStore = useItemStore();

const valid = ref(false);
const item = ref(new ItemModel());
const isEditMode = ref(false);
const loading = ref(false);

// Errors
const fieldErrors = ref < { [key: string]: string[] } > ({});
const generalError = ref('');

// Validation rules (Vuetify client-side)
const rules = {
    required: value => !!value || 'This field is required.',
    numeric: value => !isNaN(value) || 'Must be a number.',
    integer: value => Number.isInteger(Number(value)) || 'Must be an integer.',
};

onMounted(async () => {
    if (route.params.id) {
        isEditMode.value = true;
        await loadItem(route.params.id);
    }
});

const loadItem = async (id: string | number) => {
    try {
        const fetchedItem = await itemStore.getItemById(Number(id));
        item.value = new ItemModel(
            fetchedItem.id,
            fetchedItem.code,
            fetchedItem.name,
            fetchedItem.description,
            fetchedItem.price,
            fetchedItem.stock
        );
    } catch (error) {
        console.error('Error loading item:', error);
    }
};

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    item.value.code = target.value.toUpperCase();
};

const saveItem = async () => {
    loading.value = true;
    fieldErrors.value = {};
    generalError.value = '';

    try {
        if (isEditMode.value) {
            await itemStore.updateItem(item.value);
        } else {
            await itemStore.createItem(item.value);
        }

        router.push({ name: 'ItemPage' });
    } catch (error: any) {
        if (error.data?.errors) {
            fieldErrors.value = error.data.errors;
        }

        if (error.data?.message) {
            generalError.value = error.data.message;
        } else {
            generalError.value = error.message || 'Something went wrong.';
        }
    } finally {
        loading.value = false;
    }
};
</script>
