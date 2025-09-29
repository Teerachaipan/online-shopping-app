<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/entities/product'
import { ShoppingBagIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();

// ฟังก์ชันสำหรับเพิ่มสินค้าลงตะกร้า
const handleAddToCart = () => {
  cartStore.addToCart(props.product);
  alert(`สินค้า "${props.product.name}" ถูกเพิ่มลงในตะกร้าแล้ว!`);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">

    <RouterLink :to="{ name: 'product-detail', params: { sku: product.sku } }" class="block">
      <div class="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          :src="product.image_url[0]"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    </RouterLink>

    <div class="p-4 flex flex-col flex-grow">
      <RouterLink :to="{ name: 'product-detail', params: { sku: product.sku } }" class="block flex-grow">
        <p class="text-xs text-gray-500 font-medium uppercase mb-1">{{ product.brand }} (SKU: {{ product.sku }})</p>
        <h3 class="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-indigo-600 transition">{{ product.name }}</h3>
      </RouterLink>

      <div class="mt-3 flex items-baseline justify-between">
        <p class="text-2xl font-extrabold text-indigo-600">
          ฿{{ product.price.toFixed(2) }}
        </p>
        <p class="text-sm text-gray-500">ขนาด: {{ product.pack_size }}</p>
      </div>

      <button
        @click="handleAddToCart"
        class="mt-4 w-full flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 transform hover:scale-[1.02]"
      >
        <ShoppingBagIcon class="w-5 h-5" />
        <span>หยิบใส่ตะกร้า</span>
      </button>
    </div>
  </div>
</template>
