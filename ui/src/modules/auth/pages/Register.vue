<!-- src/modules/auth/pages/Login.vue -->
<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-card class="login-card" elevation="20" width="400">
            <v-card-title class="text-center">Sign Up</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="handleRegistration">

                    <v-text-field v-model="name" label="Name" :error="!!fieldErrors.name"
                        :error-messages="fieldErrors.name" required></v-text-field>

                    <v-text-field v-model="email" label="Email" type="email" :error="!!fieldErrors.email"
                        :error-messages="fieldErrors.email" required :class="{ 'mt-4': !!fieldErrors.email }"></v-text-field>

                    <v-text-field v-model="password" label="Password" type="password" :error="!!fieldErrors.password"
                        :error-messages="fieldErrors.password" required :class="{ 'mt-4': !!fieldErrors.password }"></v-text-field>

                    <v-btn type="submit" color="primary" block :loading="loading" class="mt-4">Submit</v-btn>
                </v-form>

                <v-row class="mt-3">
                    <v-col class="text-center">
                        <span>Already have an account?</span>
                        <router-link :to="{ name: 'Login' }">Login</router-link>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/modules/auth/services/authService';
import { useAuthStore } from '@/modules/auth/store/authStore';

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const fieldErrors = ref<{ [key: string]: string[] }>({});
const authStore = useAuthStore();
const router = useRouter();

const handleRegistration = async () => {
    loading.value = true;
    errorMessage.value = '';
    fieldErrors.value = {};

    try {
        const data = await authService.register(email.value, password.value, name.value);

        // Redirect to dashboard after login
        window.location.href = `http://${data.tenant_domain}.${import.meta.env.VITE_APP_DOMAIN}/dashboard`;
    } catch (error: any) {
        // Laravel validation errors
        if (error.data?.errors) {
            fieldErrors.value = error.data.errors;
        }

        // General message
        if (error.data?.message) {
            errorMessage.value = error.data.message;
        } else {
            errorMessage.value = error.message || 'Something went wrong.';
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    if (authStore.token) {
        authStore.clearToken()
    }
});
</script>

<style scoped>
.login-card {
    border: 1px solid var(--vt-c-indigo);
    padding: 2rem 2rem 3.5rem;
}
</style>