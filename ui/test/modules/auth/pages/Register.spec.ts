import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createRouter, createMemoryHistory } from 'vue-router';
import Register from '@/modules/auth/pages/Register.vue';  // Adjust this import path as necessary
import { expect, it, vi } from 'vitest';
import authService from '@/modules/auth/services/authService';

// Fix: Mock the register function in authService with the default export
vi.mock('@/modules/auth/services/authService', () => ({
    default: {
        register: vi.fn(),
    },
}));

const vuetify = createVuetify({
    components,
    directives,
});

// Create a mock router with necessary routes
const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: '/', name: 'Login', component: { template: '<div>Login Page</div>' } },
        { path: '/register', name: 'Register', component: Register },  // Register route for the test
    ]
});

// Create a mock Pinia store
const pinia = createPinia();

// Test case: Renders the register form
it('renders the register form', async () => {
    const wrapper = mount(Register, {
        global: {
            plugins: [pinia, vuetify, router],
        },
    });

    expect(wrapper.findComponent({ name: 'v-form' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'v-card-title' }).text()).toBe('Sign Up');
    expect(wrapper.findComponent({ name: 'v-btn' }).text()).toBe('Submit');
    expect(wrapper.findComponent({ name: 'v-btn' }).exists()).toBe(true);
});

// Test case: Navigates to the login page when "Login" link is clicked
it('navigates to login page when "Login" link is clicked', async () => {
    const wrapper = mount(Register, {
        global: {
            plugins: [pinia, vuetify, router],
        },
    });

    const loginLink = wrapper.find('a[href="/"]');
    expect(loginLink.exists()).toBe(true);

    // Simulate click on "Login" link
    await loginLink.trigger('click');

    // Wait for the router to navigate
    await router.isReady();

    // Check if the route has changed to /login
    expect(wrapper.vm.$route.path).toBe('/');
});