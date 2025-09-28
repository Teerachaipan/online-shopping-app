<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { useProductStore } from '@/stores/productStore';
import CartItemRow from '@/components/cart/CartItemRow.vue';
import CartSummary from '@/components/cart/CartSummary.vue';
import ProductCard from '@/components/home/ProductCard.vue'; // ใช้ ProductCard ซ้ำสำหรับ Recommended
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore();

// ------------------------------------------------
// Recommended Section Logic
// ------------------------------------------------

// SKU ของสินค้าที่มีอยู่ในตะกร้าแล้ว
const cartSkus = computed(() => cartStore.items.map(item => item.sku));

// รายการสินค้าแนะนำ (สินค้าที่ผู้ใช้ยังไม่ได้เพิ่มลงในตะกร้า)
const recommendedProducts = computed(() => {
  return productStore.allProducts.filter(p => !cartSkus.value.includes(p.sku));
});

// ฟังก์ชันกลับไปหน้า Home
const goBack = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="min-h-screen">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-extrabold text-gray-900">ตะกร้าสินค้า (Cart)</h1>
      <button @click="goBack" class="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition">
        <ArrowLeftIcon class="w-5 h-5 mr-2" />
        กลับไปหน้ารายการสินค้า
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <section class="lg:col-span-2">

        <div class="bg-white p-6 rounded-xl shadow-lg mb-8 text-black">
          <h2 class="text-2xl font-bold mb-4">สินค้าในตะกร้า ({{ cartStore.totalQuantity }} ชิ้น)</h2>

          <div v-if="cartStore.totalQuantity > 0">
            <CartItemRow
              v-for="item in cartStore.items"
              :key="item.sku"
              :item="item"
            />
          </div>
          <div v-else class="text-center py-10 text-gray-500">
            <p class="text-lg">ตะกร้าสินค้าของคุณว่างเปล่า</p>
            <RouterLink :to="{ name: 'home' }" class="mt-2 text-indigo-600 hover:underline">
              เริ่มเลือกซื้อสินค้าได้เลย!
            </RouterLink>
          </div>
        </div>

        <div v-if="recommendedProducts.length > 0">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">สินค้าแนะนำสำหรับคุณ</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in recommendedProducts"
              :key="product.sku"
              :product="product"
            />
          </div>
        </div>

      </section>

      <aside class="lg:col-span-1">
        <CartSummary />
      </aside>

    </div>
  </div>
</template>
