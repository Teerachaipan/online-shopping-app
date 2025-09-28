// src/stores/cart.ts

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { mockConfig } from '@/data/mockData'
import type { Product, CartItem } from '@/entities/product'

// Utility function สำหรับการจัดรูปแบบตัวเลขเป็นสกุลเงิน (ใช้สำหรับการแสดงผล)
const formatCurrency = (amount: number): string => {
  return amount.toFixed(2)
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const promotionCode = ref('')
  const appliedDiscount = ref(0)

  // --- Actions/Mutations ---

  /**
   * เพิ่มสินค้าลงในตะกร้า หรือเพิ่มปริมาณหากมีอยู่แล้ว
   */
  function addToCart(product: Product) {
    const existingItem = items.value.find((item) => item.sku === product.sku)

    if (existingItem) {
      // เพิ่มปริมาณ 1 หากมีอยู่แล้ว
      updateQuantity(product.sku, existingItem.quantity + 1)
    } else {
      // เพิ่มสินค้าใหม่
      items.value.push({
        ...product,
        quantity: 1,
        total_item_price: product.price * 1,
      })
    }
    // 💡 Note: ใน production, ควรเรียกใช้ Notification Service ที่นี่แทน alert
    console.log(`Product SKU ${product.sku} added to cart.`)
  }

  /**
   * ปรับปรุงปริมาณสินค้าในตะกร้า (Min 1, Max 999)
   */
  function updateQuantity(sku: number, newQuantity: number) {
    const item = items.value.find((i) => i.sku === sku)

    if (item) {
      // จำกัดปริมาณให้อยู่ในช่วง 1 ถึง 999
      const clampedQty = Math.max(1, Math.min(999, newQuantity))
      item.quantity = clampedQty
      // คำนวณราคารวมของสินค้ารายการนั้นๆ ใหม่
      item.total_item_price = item.price * clampedQty
    }
  }

  /**
   * ลบสินค้าออกจากตะกร้า
   */
  function removeFromCart(sku: number) {
    items.value = items.value.filter((item) => item.sku !== sku)
    // 💡 Note: ใน production, ควรเรียกใช้ Notification Service ที่นี่แทน alert
    console.log(`Product SKU ${sku} removed from cart.`)
  }

  /**
   * ใช้รหัสโปรโมชั่น
   */
  function applyPromotion() {
    if (promotionCode.value.toUpperCase() === mockConfig.config.promotion.discount_code) {
      appliedDiscount.value = mockConfig.config.promotion.discount_amount
      return true
    } else {
      appliedDiscount.value = 0
      return false
    }
  }

  // --- Getters (Computed Properties) ---

  // 1. Total SKU Count (จำนวนสินค้าที่แตกต่างกัน)
  const totalSkuCount = computed(() => items.value.length)

  // 2. Total Quantity (จำนวนชิ้นทั้งหมด)
  const totalQuantity = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))

  // 3. Subtotal (รวมราคาสินค้าทั้งหมดก่อนส่วนลด/ค่าจัดส่ง)
  const subTotal = computed(() => items.value.reduce((acc, item) => acc + item.total_item_price, 0))

  // 4. Delivery Fee (ค่าจัดส่ง)
  const deliveryFee = computed(() => {
    const minimumAmount = mockConfig.config.delivery_fee.minimum_cart_amount
    const feeAmount = mockConfig.config.delivery_fee.delivery_fee_amount

    // หาก Subtotal ถึงเกณฑ์ขั้นต่ำ จะจัดส่งฟรี
    if (subTotal.value >= minimumAmount) {
      return 0 // Free Delivery
    }
    return feeAmount
  })

  // 5. Discount (ส่วนลดที่ถูกนำมาใช้)
  const finalDiscount = computed(() => appliedDiscount.value)

  // 6. Final Total Amount (ราคาสุทธิที่ต้องจ่าย)
  // สูตร: ((Total of all (Product Price x Product Quantity)) – Discount) + Delivery Fee
  const finalTotalAmount = computed(() => {
    return subTotal.value - finalDiscount.value + deliveryFee.value
  })

  return {
    items,
    promotionCode,

    // Computed (Getters)
    totalSkuCount,
    totalQuantity,
    subTotal,
    deliveryFee,
    finalDiscount,
    finalTotalAmount,

    // Actions/Mutations
    addToCart,
    updateQuantity,
    removeFromCart,
    applyPromotion,
    formatCurrency, // Export utility function สำหรับใช้ใน component
  }
})
