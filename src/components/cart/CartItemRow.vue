<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';
import type { CartItem } from '@/entities/product'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  item: CartItem;
}>();

const cartStore = useCartStore();

// ฟังก์ชันสำหรับปรับปริมาณ
const updateQty = (delta: number) => {
  const newQty = props.item.quantity + delta;
  cartStore.updateQuantity(props.item.sku, newQty);
  //ถ้าปริมาณเป็น 0 คุณอาจต้องการยืนยันการลบ
};

// ฟังก์ชันสำหรับลบสินค้า
const removeItem = () => {
  if (confirm(`คุณต้องการลบ "${props.item.name}" ออกจากตะกร้าหรือไม่?`)) {
    cartStore.removeFromCart(props.item.sku);
    alert(`สินค้า "${props.item.name}" ถูกลบออกจากตะกร้าแล้ว`);
  }
};
</script>

<template>
  <div class="flex items-center py-4 border-b border-gray-200">

    <RouterLink :to="{ name: 'product-detail', params: { sku: item.sku } }" class="flex-shrink-0 w-20 h-20 mr-4 rounded-lg overflow-hidden">
      <img :src="item.image_url[0]" :alt="item.name" class="w-full h-full object-cover" />
    </RouterLink>

    <div class="flex-grow">
      <RouterLink :to="{ name: 'product-detail', params: { sku: item.sku } }" class="text-base font-semibold text-gray-800 hover:text-indigo-600 line-clamp-2">
        {{ item.name }}
      </RouterLink>
      <p class="text-sm text-gray-500">SKU: {{ item.sku }}</p>
      <p class="text-lg font-bold text-indigo-600 mt-1">
        ฿{{ cartStore.formatCurrency(item.price) }}
      </p>
    </div>

    <div class="flex items-center mx-4 flex-shrink-0">
      <button
        @click="updateQty(-1)"
        :disabled="item.quantity <= 1"
        class="p-1 rounded-l-md bg-gray-100 border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition"
      >
        <MinusIcon class="w-4 h-4" />
      </button>
      <input
        type="number"
        :value="item.quantity"
        @input="e => cartStore.updateQuantity(item.sku, Math.max(1, parseInt((e.target as HTMLInputElement).value) || 0))"
        min="1" max="999"
        class="w-12 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button
        @click="updateQty(1)"
        :disabled="item.quantity >= 999"
        class="p-1 rounded-r-md bg-gray-100 border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition"
      >
        <PlusIcon class="w-4 h-4" />
      </button>
    </div>

    <div class="text-right w-24 flex-shrink-0">
      <p class="text-base font-bold text-gray-800">
        ฿{{ cartStore.formatCurrency(item.total_item_price) }}
      </p>
    </div>

    <button @click="removeItem" class="ml-4 text-red-500 hover:text-red-700 transition flex-shrink-0">
      <TrashIcon class="w-5 h-5" />
    </button>
  </div>
</template>
