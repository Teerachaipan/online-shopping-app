<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { ref, watch } from 'vue';

const productStore = useProductStore();

// ใช้ local ref สำหรับ Price Range Slider เพื่อประสิทธิภาพ
const localPriceMin = ref(productStore.priceRange[0]);
const localPriceMax = ref(productStore.priceRange[1]);

// watch เพื่อซิงค์กับ Pinia เมื่อ local refs เปลี่ยนแปลง
watch([localPriceMin, localPriceMax], ([newMin, newMax]) => {
  productStore.priceRange = [newMin, newMax];
});

// กำหนดช่วงราคาสูงสุด/ต่ำสุดแบบตายตัว (สามารถทำให้ dynamic ได้ ถ้าต้องการ)
const MAX_PRICE = 500;
const MIN_PRICE = 0;
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-lg sticky top-24">
    <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
      ตัวกรองสินค้า (Filter)
    </h3>

    <div class="mb-6">
      <h4 class="font-semibold text-lg mb-2">ช่วงราคา (Price Range)</h4>
      <p class="text-sm text-gray-500 mb-2">
        ฿{{ localPriceMin.toFixed(2) }} - ฿{{ localPriceMax.toFixed(2) }}
      </p>

      <label class="block mb-2">
        <span class="text-sm text-gray-700">ราคาต่ำสุด:</span>
        <input
          type="range"
          :min="MIN_PRICE"
          :max="MAX_PRICE"
          v-model.number="localPriceMin"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
      </label>

      <label class="block">
        <span class="text-sm text-gray-700">ราคาสูงสุด:</span>
        <input
          type="range"
          :min="MIN_PRICE"
          :max="MAX_PRICE"
          v-model.number="localPriceMax"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
      </label>
    </div>

    <div class="mb-6 border-t pt-4">
      <h4 class="font-semibold text-lg mb-3">แบรนด์ (Brand)</h4>

      <div v-for="brand in productStore.availableBrands" :key="brand" class="mb-2">
        <label class="inline-flex items-center">
          <input
            type="checkbox"
            :value="brand"
            v-model="productStore.selectedBrands"
            class="form-checkbox h-5 w-5 text-indigo-600 rounded"
          >
          <span class="ml-2 text-gray-700">{{ brand }}</span>
        </label>
      </div>
    </div>

    <div class="mt-6 border-t pt-4">
      <button
        @click="productStore.resetFilters"
        class="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-150"
      >
        รีเซ็ตตัวกรอง (Reset)
      </button>
    </div>
  </div>
</template>
