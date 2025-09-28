<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import ProductSidebarFilter from '@/components/home/SidebarFilter.vue';
import ProductCard from '@/components/home/ProductCard.vue';
const productStore = useProductStore();

</script>

<template>
  <div class="min-h-screen">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8">รายการสินค้าทั้งหมด</h1>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

      <aside class="lg:col-span-1">
        <ProductSidebarFilter />
      </aside>

      <section class="lg:col-span-3">

        <input
          v-model="productStore.searchTerm"
          type="text"
          placeholder="ค้นหาสินค้าจากชื่อ..."
          class="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />

        <div v-if="productStore.filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in productStore.filteredProducts"
            :key="product.sku"
            :product="product"
          />
        </div>

        <div v-else class="text-center py-10 bg-gray-100 rounded-lg">
          <p class="text-xl text-gray-500">ไม่พบสินค้าที่ตรงกับตัวกรอง</p>
          <button @click="productStore.resetFilters" class="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold">
            คลิกเพื่อรีเซ็ตตัวกรองทั้งหมด
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
