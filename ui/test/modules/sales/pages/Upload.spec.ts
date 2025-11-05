import { render, fireEvent, screen, waitFor } from '@testing-library/vue';
import Upload from '@/modules/sales/pages/Upload.vue';
import { uploadCsv } from '@/modules/sales/services/uploadCsvService';
import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify';

const vuetify = createVuetify({
    components,
    directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

// Mock the uploadCsv function
vi.mock('@/modules/sales/services/uploadCsvService', () => ({
    uploadCsv: vi.fn(),
}));

describe('Upload.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form correctly', async () => {
        const wrapper = mount(Upload, {
            global: {
                plugins: [vuetify], // Use Pinia and Vuetify in the global config
            },
        });


        await wrapper.vm.$nextTick();

        // Check if the file input and submit button are rendered;
        const cardTitle = wrapper.find('.v-card-title');
        expect(cardTitle.text()).toBe('Upload Form');
    });

    it('alerts when no file is selected and submit is clicked', async () => {
        const wrapper = mount(Upload, {
            global: {
                plugins: [vuetify], // Use Vuetify in the global config
            },
        });

        // Spy on window.alert to verify that the alert is called
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });

        // Find the submit button using a more flexible method
        const submitButton = wrapper.findComponent({ name: 'v-btn' });

        // Ensure the submit button exists
        expect(submitButton.exists()).toBe(true);

        // Click the submit button
        await submitButton.trigger('click');

        // Expect alert to be called
        expect(alertSpy).toHaveBeenCalledWith('Please select a file first.');

        // Restore the original alert function
        alertSpy.mockRestore();
    });
});
