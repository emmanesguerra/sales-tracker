<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
/* Ensure v-main takes up the full viewport */
.v-main {
  height: 100vh;
}
</style>
