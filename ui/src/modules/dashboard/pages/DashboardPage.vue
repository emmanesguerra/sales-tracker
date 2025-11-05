<template>
  <v-calendar class="custom-calendar" :show-adjacent-months="true"></v-calendar>
</template>

<script setup>
import { VCalendar } from 'vuetify/labs/VCalendar';  // Import the VCalendar component

</script>

<style scoped>
.custom-calendar :deep(.v-calendar-month__day) {
  min-height: 120px;
}

.custom-calendar :deep(.v-calendar-weekly__head) {
  background: rgb(var(--v-theme-surface-light));
}
</style>
