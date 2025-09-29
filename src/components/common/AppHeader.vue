<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingCartIcon } from '@heroicons/vue/24/outline';
const cartStore = useCartStore();
</script>
<template>
  <header class="shadow-md sticky bg-indigo-600 top-0 z-20">
    <div class="container sticky mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">

      <RouterLink to="/" class="text-2xl font-bold text-white hover:text-black transition duration-150">
        YIM Store
      </RouterLink>

      <nav>
        <RouterLink
          to="/cart"
          class="relative p-2 rounded-full text-gray-400 hover:text-white focus:outline-none transition duration-150"
          aria-label="View shopping cart"
        >
          <ShoppingCartIcon class="h-6 w-6" />
          <span
            v-if="cartStore.totalQuantity > 0"
            class="absolute top-4 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
          >
            {{ cartStore.totalQuantity }}
          </span>
        </RouterLink>
      </nav>

    </div>
  </header>
</template>
