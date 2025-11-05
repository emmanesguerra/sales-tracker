<template>
    <v-container>
        <v-row>
            <v-col :cols="12" :md="6">
                <v-card class="pa-5" elevation="0">
                    <v-card-title>Upload Form</v-card-title>
                    <v-card-text>
                        <v-file-input label="Choose a file" v-model="file" show-size accept=".csv"></v-file-input>
                        <v-row>
                            <v-col :cols="12">
                                <v-btn class="mt-4" color="primary" @click="uploadFile">
                                    Submit
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from "vue";
import { uploadCsv } from "@/modules/sales/services/uploadCsvService";

const file = ref(null);
const loading = ref(false);

const uploadFile = async () => {
    if (!file.value) {
        alert("Please select a file first.");
        return;
    }

    try {
        loading.value = true;
        const response = await uploadCsv(file.value);
        alert("File uploaded successfully!");
        console.log("Server Response:", response);
    } catch (error) {
        alert("File upload failed. Please try again.");
        console.error("Upload Error:", error);
    } finally {
        loading.value = false;
    }
};
</script>