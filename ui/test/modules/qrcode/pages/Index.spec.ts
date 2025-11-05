import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import Index from '@/modules/qrcode/pages/Index.vue'; // Adjust path if needed
import { vi } from 'vitest';
import { ref } from 'vue';
import { useItemStore } from '@/modules/item-management/store/itemStore'; // Import the store
import { qrCodeService } from '@/modules/qrcode/services/qrCodeService'; // Import the service
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify';

const vuetify = createVuetify({
    components,
    directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

// Set up a mock for the item store
vi.mock('@/modules/item-management/store/itemStore', () => ({
    useItemStore: vi.fn(() => ({
        items: ref([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]), // Use ref for reactivity
        fetchItems: vi.fn().mockResolvedValue([]), // Mock the fetchItems method
    })),
}));

// Set up a mock for qrCodeService
vi.mock('@/modules/qrcode/services/qrCodeService', () => ({
    qrCodeService: {
        submitForm: vi.fn().mockResolvedValue(new Blob(['test data'], { type: 'text/csv' })),
    },
}));

describe('Index.vue', () => {
    it('renders the QR Selection Form title', async () => {
        const pinia = createPinia();
        const wrapper = mount(Index, {
            global: {
                plugins: [pinia, vuetify], // Use Pinia and Vuetify in the global config
            },
        });

        await wrapper.vm.$nextTick(); // Ensure reactivity is processed

        const cardTitle = wrapper.find('.v-card-title');
        expect(cardTitle.text()).toBe('QR Selection Form');
    });

    it('renders the radio group for selection', async () => {
        const pinia = createPinia();
        
        const wrapper = mount(Index, {
          global: {
            plugins: [pinia, vuetify], // Use Vuetify in the global config
          },
        });
    
        await wrapper.vm.$nextTick(); // Ensure reactivity is processed
    
        // Find v-radio-group component
        const radioGroup = wrapper.findComponent({ name: 'v-radio-group' });
        expect(radioGroup.exists()).toBe(true);
    
        // Find all v-radio components inside v-radio-group
        const radioButtons = wrapper.findAllComponents({ name: 'v-radio' });
        expect(radioButtons).toHaveLength(4); // Expect 4 radio buttons
      });

    it('renders the multi-select dropdown', async () => {
        const pinia = createPinia();
        const wrapper = mount(Index, {
            global: {
                plugins: [pinia, vuetify], // Add Vuetify plugin here
            },
        });

        await wrapper.vm.$nextTick(); // Ensure reactivity is processed

        const autocomplete = wrapper.findComponent({ name: 'v-autocomplete' });
        expect(autocomplete.exists()).toBe(true); // Check if v-autocomplete exists
    });

    it('renders the submit button', async () => {
        const pinia = createPinia();

        const wrapper = mount(Index, {
            global: {
                plugins: [pinia, vuetify],
            },
        });

        await wrapper.vm.$nextTick(); // Ensure reactivity is processed

        // Test for v-btn
        const submitButton = wrapper.findComponent({ name: 'v-btn' });
        expect(submitButton.exists()).toBe(true);
        expect(submitButton.text()).toBe('Submit');
    });
});
