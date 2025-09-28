<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import QrcodeVue from 'qrcode.vue';
import { HomeIcon } from '@heroicons/vue/24/outline';
import type { OrderDetail } from '@/entities/product';


// รับค่า Prop orderId
const props = defineProps<{
  orderId: string;
}>();

const router = useRouter();
const cartStore = useCartStore();

const order = ref<OrderDetail | null>(null);

onMounted(() => {
  // ดึงข้อมูล Order จาก Store
  const foundOrder = cartStore.getOrderById(props.orderId);
  if (foundOrder) {
    order.value = foundOrder;
  } else {
    // หากไม่พบ Order (เช่น รีเฟรชหน้า), ให้แจ้งเตือนและกลับไป Home
    alert('ไม่พบข้อมูลคำสั่งซื้อที่ระบุ กรุณาลองใหม่อีกครั้ง');
    router.replace({ name: 'home' });
  }
});

// URL สำหรับ QR Code
const qrCodeUrl = computed(() => {
  if (!order.value) return '';
  const baseUrl = 'https://payment-api.yimpla[orm.com/orders';
  const price = order.value.finalTotalAmount.toFixed(2); // ต้องใช้ทศนิยม 2 ตำแหน่ง

  return `${baseUrl}/${order.value.orderId}/checkout?price=${price}`;
});

// ฟังก์ชันกลับไปหน้า Home
const goToHome = () => {
  if (order.value) {
        // 🆕 เมื่อกลับไป Home ให้ลบ Order นี้ออกจาก Local Storage
        cartStore.clearOrderFromStorage(order.value.orderId);
    }
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="min-h-screen">

    <div class="flex justify-end mb-6">
      <button @click="goToHome" class="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition">
        <HomeIcon class="w-5 h-5 mr-2" />
        กลับสู่หน้าหลัก
      </button>
    </div>

    <h1 class="text-4xl font-extrabold text-gray-900 mb-2">ยืนยันคำสั่งซื้อและการชำระเงิน</h1>
    <p v-if="order" class="text-xl text-gray-600 mb-8">Order ID: <span class="font-bold text-indigo-600">{{ order.orderId }}</span></p>

    <div v-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <section class="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">รายละเอียดสินค้าในคำสั่งซื้อ</h2>

        <div class="space-y-4">
          <div v-for="item in order.items" :key="item.sku" class="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
            <img :src="item.image_url[0]" :alt="item.name" class="w-16 h-16 rounded-lg object-cover mr-4" />
            <div class="flex-grow">
              <p class="font-semibold text-gray-800">{{ item.name }}</p>
              <p class="text-sm text-gray-500">SKU: {{ item.sku }} | Size: {{ item.pack_size }}</p>
              <p class="text-sm text-gray-500">ราคา/หน่วย: ฿{{ cartStore.formatCurrency(item.price) }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="font-bold text-gray-800">฿{{ cartStore.formatCurrency(item.total_item_price) }}</p>
              <p class="text-sm text-gray-600">x {{ item.quantity }} ชิ้น</p>
            </div>
          </div>
        </div>
      </section>

      <aside class="lg:col-span-1">
        <div class="bg-indigo-50 p-6 rounded-xl shadow-lg">
          <h2 class="text-2xl font-bold text-indigo-700 mb-4">สรุปยอดชำระเงิน</h2>

          <div class="space-y-2 border-b border-indigo-200 pb-4 mb-4 text-gray-700">
            <div class="flex justify-between"><span>รวมราคาสินค้า:</span><span>฿{{ cartStore.formatCurrency(order.subTotal) }}</span></div>
            <div class="flex justify-between"><span>ส่วนลดโปรโมชั่น:</span><span class="text-green-600">- ฿{{ cartStore.formatCurrency(order.finalDiscount) }}</span></div>
            <div class="flex justify-between"><span>ค่าจัดส่ง:</span><span :class="{'text-green-600': order.deliveryFee === 0}">{{ order.deliveryFee === 0 ? 'ฟรี!' : `฿${cartStore.formatCurrency(order.deliveryFee)}` }}</span></div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-xl font-bold">ยอดชำระสุทธิ:</span>
            <span class="text-3xl font-extrabold text-red-600">฿{{ cartStore.formatCurrency(order.finalTotalAmount) }}</span>
          </div>

          <p class="text-sm text-center text-gray-500 mt-6">สแกน QR Code เพื่อดำเนินการชำระเงิน</p>

          <div class="flex justify-center mt-3 p-4 bg-white rounded-lg shadow-inner">
            <QrcodeVue
              :value="qrCodeUrl"
              :size="200"
              level="H"
              class="w-full h-auto max-w-[200px]"
            />
          </div>
          <p class="text-xs text-center text-gray-500 break-words mt-3">{{ qrCodeUrl }}</p>
        </div>
      </aside>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
