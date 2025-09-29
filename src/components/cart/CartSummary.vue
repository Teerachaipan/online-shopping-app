<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { generateOrderId } from '@/utils/format'

const cartStore = useCartStore();
const router = useRouter();

const promoInput = ref(cartStore.promotionCode);
const promoError = ref('');

// ฟังก์ชันใช้ Promotion
const handleApplyPromotion = () => {
  cartStore.promotionCode = promoInput.value.toUpperCase();
  const success = cartStore.applyPromotion();

  if (success) {
    promoError.value = '';
    alert('✅ ใช้รหัสโปรโมชั่นสำเร็จ! ได้รับส่วนลด ฿100.00');
  } else {
    promoError.value = 'รหัสโปรโมชั่นไม่ถูกต้องหรือไม่สามารถใช้ได้';
  }
};

// ฟังก์ชัน Checkout
const handleCheckout = () => {
  if (cartStore.totalQuantity === 0) {
    alert('ตะกร้าสินค้าว่างเปล่า ไม่สามารถดำเนินการชำระเงินได้');
    return;
  }

  if (confirm('ยืนยันเพื่อดำเนินการชำระเงินและสร้าง Order ID หรือไม่?')) {

    const orderId = generateOrderId()

    try {
        const order = cartStore.createOrder(orderId);

        alert(`🎉 Order ID: ${order.orderId} ถูกสร้างสำเร็จแล้ว! กำลังนำไปหน้าชำระเงิน`);

        router.push({ name: 'checkout', params: { orderId: order.orderId } });

    } catch (error) {
        console.error("Error creating order:", error);
        alert("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่");
    }
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-lg sticky top-24">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">สรุปยอดคำสั่งซื้อ</h3>

    <div class="space-y-3 border-b pb-4">
      <div class="flex justify-between text-gray-700">
        <span>ราคาสินค้ารวม ({{ cartStore.totalQuantity }} ชิ้น)</span>
        <span>฿{{ cartStore.formatCurrency(cartStore.subTotal) }}</span>
      </div>

      <div class="flex justify-between">
        <input
          type="text"
          v-model="promoInput"
          placeholder="กรอกรหัสโปรโมชั่น"
          class="flex-grow p-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
        />
        <button
          @click="handleApplyPromotion"
          class="p-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 text-sm font-semibold transition disabled:opacity-50"
          :disabled="!promoInput"
        >
          ใช้โค้ด
        </button>
      </div>
      <p v-if="promoError" class="text-red-500 text-sm mt-1">{{ promoError }}</p>

      <div class="flex justify-between text-green-600 font-medium pt-2">
        <span>ส่วนลดโปรโมชั่น</span>
        <span>- ฿{{ cartStore.formatCurrency(cartStore.finalDiscount) }}</span>
      </div>
    </div>

    <div class="flex justify-between pt-4 pb-2 text-gray-700">
      <span>ค่าจัดส่ง</span>
      <span v-if="cartStore.deliveryFee === 0" class="font-bold text-green-600">
        ฟรี! (Free Delivery)
      </span>
      <span v-else>
        ฿{{ cartStore.formatCurrency(cartStore.deliveryFee) }}
      </span>
    </div>

    <div class="flex justify-between items-center border-t border-gray-300 pt-4 mt-4">
      <span class="text-xl font-bold text-gray-900">ยอดชำระสุทธิ</span>
      <span class="text-3xl font-extrabold text-red-600">
        ฿{{ cartStore.formatCurrency(cartStore.finalTotalAmount) }}
      </span>
    </div>

    <button
      @click="handleCheckout"
      class="w-full mt-6 py-3 bg-red-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-red-700 transition duration-150 disabled:opacity-50"
      :disabled="cartStore.totalQuantity === 0"
    >
      ดำเนินการชำระเงิน (Checkout)
    </button>

  </div>
</template>
