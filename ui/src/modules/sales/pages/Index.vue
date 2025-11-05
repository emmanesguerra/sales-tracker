<template>
    <v-container>
        <!-- Table Header Section -->
        <v-card class="mt-4" elevation="0">
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h5">Sales Report</span>

                <div class="d-flex align-center">
                    <v-date-input 
                        v-model="dateMenu" 
                        variant="outlined" 
                        density="compact" 
                        label="Select a date"
                        :width="350"
                        clearable 
                        hide-details="auto"></v-date-input>
                    <v-btn class="mx-3" color="primary" @click="router.push({ name: 'DownloadPage' })">
                        Download Report
                    </v-btn>
                    <v-btn color="primary" @click="router.push({ name: 'UploadPage' })">
                        Upload Sales
                    </v-btn>
                </div>
            </v-card-title>

            <v-card-text>
                <!-- Data Table -->
                <v-data-table :headers="headers" :items="items">
                    <template v-slot:item.item_price="{ item }">
                        <span class="text-right">{{ parseFloat(item.item_price).toFixed(2) }}</span>
                    </template>
                    <template v-slot:item.total_amount="{ item }">
                        <span class="text-right">{{ parseFloat(item.total_amount).toFixed(2) }}</span>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { salesService } from "@/modules/sales/services/salesService"
import { useDate } from 'vuetify'
import dayjs from "dayjs"

const router = useRouter();

const adapter = useDate()
const dateMenu = ref()

// Table headers
const headers = ref([
    { title: 'Date', key: 'order_date', width: '150px' },
    { title: 'Time', key: 'order_time', width: '200px' },
    { title: 'Name', key: 'item_name' },
    { title: 'Price', key: 'item_price', width: '200px' },
    { title: 'Quantity', key: 'quantity', width: '200px' },
    { title: 'Total Amount', key: 'total_amount', width: '200px' },
]);

const items = ref([]);

// Fetch sales data with selected date
const fetchSalesData = async () => { 
    
    const formattedDate = dateMenu.value 
        ? dayjs(dateMenu.value).format("YYYY-MM-DD") 
        : '';

    items.value = await salesService.fetchSales(formattedDate);
};

onMounted(fetchSalesData);

watch(dateMenu, fetchSalesData);
</script>

<style scoped>
.date-container {
    background: var(--vt-c-indigo);
}
</style>