<template>
    <v-container>
        <!-- App bar -->
        <v-app-bar color="primary" elevation="2">
            <v-app-bar-title>
                <router-link :to="{ name: 'DashboardPage' }" class="no-hover-link">
                    Dashboard
                </router-link>
            </v-app-bar-title>
        </v-app-bar>

        <!-- Navigation Drawer -->
        <v-navigation-drawer elevation="1" expand-on-hover permanent rail>
            <v-list class="large-font" nav>
                <v-list-item prepend-icon="mdi-tshirt-crew" title="Item Management" value="items"
                    :to="{ name: 'ItemPage' }"></v-list-item>
                <v-list-item prepend-icon="mdi-chart-box" title="Sales Report" value="sales"
                    :to="{ name: 'SalesPage' }"></v-list-item>
                <v-list-item prepend-icon="mdi-qrcode" title="QR Generator" value="qrcode"
                    :to="{ name: 'QRPage' }"></v-list-item>
            </v-list>

            <template v-slot:append>
                <v-list class="large-font" nav>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings"></v-list-item>
                    <v-list-item prepend-icon="mdi-logout" title="Logout" @click="logout"></v-list-item>
                </v-list>
            </template>
        </v-navigation-drawer>

        <!-- Main content -->
        <v-layout>
            <v-container fluid width="100vw">
                <!-- Here, we will render the page content dynamically -->
                <router-view />
            </v-container>
        </v-layout>
    </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
    authStore.clearToken();
    window.location.href = `http://${import.meta.env.VITE_APP_DOMAIN}`;
};
</script>

<style scoped>
.large-font :deep(.v-list-item-title) {
    font-size: 1rem !important;
}

.no-hover-link {
    text-decoration: none;
    color: white;
}

.no-hover-link:hover {
    background-color: transparent;
}
</style>