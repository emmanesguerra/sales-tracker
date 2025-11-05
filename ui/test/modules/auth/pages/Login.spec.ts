import { mount } from '@vue/test-utils'
import { expect, test, describe, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { shallowMount } from '@vue/test-utils'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Login from '@/modules/auth/pages/Login.vue'

// Create a mock router instance with routes
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home', component: Login },
        { path: '/register', name: 'Register', component: '<div>Register</div>' },
        { path: '/dashboard', name: 'Dashboard', component: { template: '<div>Dashboard</div>' } },
    ],
})

const vuetify = createVuetify({
    components,
    directives,
})

const pinia = createPinia()

global.ResizeObserver = require('resize-observer-polyfill')


describe('Login', () => {
    it('renders login form', async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [pinia, vuetify, router],
            }
        })

        expect(wrapper.findComponent({ name: 'v-form' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'v-card-title' }).text()).toBe('Welcome')
        expect(wrapper.findComponent({ name: 'v-btn' }).text()).toBe('Login')
        expect(wrapper.findComponent({ name: 'v-btn' }).exists()).toBe(true)
    })

    it('renders the password field with correct label', async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [pinia, vuetify, router]
            }
        })
        
        const passwordLabel = wrapper.find('.password-field .v-field-label')
        
        expect(passwordLabel.exists()).toBe(true)
        expect(passwordLabel.text()).toBe('Password')
    })

    it('renders the email field with correct label', async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [pinia, vuetify, router]
            }
        })
        
        const emailLabel = wrapper.find('.email-field .v-field-label')
        
        expect(emailLabel.exists()).toBe(true)
        expect(emailLabel.text()).toBe('Email')
    })

    it('checks if the login button is enabled', async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [pinia, vuetify, router],
            }
        })
        
        const button = wrapper.findComponent({ name: 'v-btn' })
        expect(button.exists()).toBe(true)
    
        expect(button.attributes('disabled')).toBeUndefined()
    })
})