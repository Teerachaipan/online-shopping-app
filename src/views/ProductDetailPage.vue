<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { ArrowLeftIcon, ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'; // นำเข้าไอคอนที่จำเป็น

const props = defineProps<{
  sku: string;
}>();

const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

// ค้นหาสินค้าจาก SKU
const product = computed(() => {
  const productSku = parseInt(props.sku);
  return productStore.allProducts.find(p => p.sku === productSku);
});

// สถานะสำหรับการแสดงภาพ (ค่าเริ่มต้นคือ 0 = ภาพแรก)
const currentImageIndex = ref(0);

const mainImage = computed(() => {
  return product.value?.image_url[currentImageIndex.value] || '';
});

// รายการภาพย่อที่ถูกจำกัดจำนวนแล้ว (สูงสุด 3 ภาพ)
const thumbnailImages = computed(() => {
  return product.value?.image_url.slice(0, 3) || [];
});

// ฟังก์ชันเพิ่มสินค้าลงตะกร้า (อัปเดต Cart Store + Popup)
const handleAddToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value);
    alert(`🛒 สินค้า "${product.value.name}" ถูกเพิ่มลงในตะกร้าแล้ว!`);
  }
};

const goBack = () => {
  router.push({ name: 'home' });
};

onMounted(() => {
  if (!product.value) {
    console.error(`Product with SKU ${props.sku} not found.`);
    router.replace({ name: 'home' });
  }
});
</script>

<template>
  <div v-if="product" class="min-h-screen">

    <div class="flex justify-between items-center mb-6">
      <button @click="goBack" class="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition">
        <ArrowLeftIcon class="w-5 h-5 mr-2" />
        กลับไปหน้ารายการสินค้า
      </button>

      <RouterLink
        :to="{ name: 'cart' }"
        class="flex items-center space-x-2 p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
      >
        <ShoppingCartIcon class="w-6 h-6" />
        <span class="font-semibold hidden sm:inline">ดูตะกร้าสินค้า</span>
        <span class="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
          {{ cartStore.totalQuantity }}
        </span>
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-2xl">

      <section>
        <div class="mb-4 aspect-square w-full rounded-lg overflow-hidden border-2 border-gray-100">
          <img :src="mainImage" :alt="product.name" class="w-full h-full object-cover" />
        </div>

        <div v-if="thumbnailImages.length > 1" class="flex space-x-3 overflow-x-auto">
          <div
            v-for="(image, index) in thumbnailImages"
            :key="index"
            @click="currentImageIndex = index"
            class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer p-1 transition-all duration-200"
            :class="{
              'border-2 border-indigo-600 shadow-md': index === currentImageIndex,
              'border border-gray-300 hover:border-indigo-400': index !== currentImageIndex
            }"
          >
            <img :src="image" :alt="`${product.name} thumbnail ${index + 1}`" class="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">{{ product.name }}</h1>
        <p class="text-xl text-gray-500 mb-6">{{ product.brand }}</p>

        <h1 class="text-2xl font-extrabold text-gray-900 mb-2">Product Detail</h1>
        <div class="space-y-2 mb-8 text-gray-700">
          <p class="text-lg"><strong>SKU:</strong> <span class="font-medium">{{ product.sku }}</span></p>
          <p class="text-lg"><strong>Brand:</strong> <span class="font-medium">{{ product.brand }}</span></p>
          <p class="text-lg"><strong>Pack Size:</strong> <span class="font-medium">{{ product.pack_size }}</span></p>
        </div>

        <div class="mb-8 border-t pt-4">
          <p class="text-5xl font-extrabold text-indigo-700">
            ฿{{ cartStore.formatCurrency(product.price) }}
          </p>
          <p class="text-lg text-gray-500 mt-1">ราคาต่อหน่วย</p>
        </div>

        <button
          @click="handleAddToCart"
          class="w-full flex items-center justify-center space-x-3 py-4 text-xl bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 transform hover:scale-[1.01]"
        >
          <ShoppingBagIcon class="w-6 h-6" />
          <span>เพิ่มลงในตะกร้า</span>
        </button>

      </section>
    </div>

  </div>

  <div v-else class="text-center py-20">
    <h1 class="text-4xl font-bold text-red-500">404 Product Not Found</h1>
    <p class="mt-4 text-gray-600">สินค้าที่คุณค้นหาอาจถูกลบไปแล้ว หรือ SKU ไม่ถูกต้อง</p>
    <button @click="router.push('/')" class="mt-6 text-indigo-600 hover:text-indigo-800 font-semibold underline">
      กลับสู่หน้าหลัก
    </button>
  </div>
</template>
