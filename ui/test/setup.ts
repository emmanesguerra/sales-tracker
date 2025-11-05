import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { mount } from '@vue/test-utils'

// Create the Vuetify instance
const vuetify = createVuetify()

export const mountWithVuetify = (component: any) =>
  mount(component, {
    global: {
      plugins: [vuetify]  // Use Vuetify plugin here
    }
  })
