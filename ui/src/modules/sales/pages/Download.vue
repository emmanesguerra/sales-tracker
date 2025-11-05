<template>
    <v-container>
        <v-row>
            <v-col :cols="12" :md="6">
                <v-card class="mt-4" elevation="0">
                    <v-card-title>Sales Export Form</v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-card-title>Range</v-card-title>
                            <!-- Radio Buttons -->
                            <v-radio-group v-model="selectAll" @change="toggleDateSelection">
                                <v-radio label="Select All" :value="true"></v-radio>
                                <v-radio label="Custom Selection" :value="false"></v-radio>
                            </v-radio-group>

                            <v-row dense>
                                <v-col cols="12" md="6">
                                    <v-date-input label="Select initial date" variant="solo" :disabled="selectAll"
                                        v-model="startDate"></v-date-input>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-date-input label="Select final date" variant="solo" :disabled="selectAll"
                                        v-model="endDate"></v-date-input>
                                </v-col>
                            </v-row>

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
import { ref } from 'vue';
import { salesService } from '@/modules/sales/services/salesService';
import dayjs from 'dayjs'; // Assuming you're using date-fns

const selectAll = ref(true); // Default to Select All
const startDate = ref();
const endDate = ref();

// Toggle date selection based on radio button choice
const toggleDateSelection = () => {
    if (selectAll.value) {
        startDate.value = null; // Clear date when Select All is chosen
        endDate.value = null;
    }
};

// Format date as YYYY-MM-DD    
const formatDate = (date: any) => dayjs(date).format('YYYY-MM-DD');

// Generate the report based on the selected range
const generateReport = async () => {
    const reportData = {
        selectedDates: selectAll.value
            ? []
            : [
                formatDate(startDate.value),
                formatDate(endDate.value),
            ],
        selectAll: selectAll.value,
    };

    try {
        const reportBlob = await salesService.generateReport(reportData);

        const fileURL = window.URL.createObjectURL(reportBlob);

        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'sales-report.xlxs';

        a.click();
        a.remove();

        // Release the object URL after download to avoid memory leaks
        window.URL.revokeObjectURL(fileURL);

        console.log('Report generated successfully');
    } catch (error) {
        console.error('Error generating report:', error);
    }
};

// Form submission
const submitForm = () => {
    generateReport();
};
</script>