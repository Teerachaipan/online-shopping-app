<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <AppHeader />

    <main class="flex-grow">
      <div class="container mx-auto p-4 sm:p-6 lg:p-8">
        <RouterView />
      </div>
    </main>

    <AppFooter />

  </div>
</template>

<style scoped>

</style>
