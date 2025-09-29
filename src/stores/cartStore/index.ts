import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { mockConfig } from '@/data/mockData'
import type { Product, CartItem, OrderDetail } from '@/entities/product'
import { formatCurrency } from '@/utils/format'
import { calculateSubtotal, calculateDeliveryFee, calculateFinalTotal } from '@/utils/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const promotionCode = ref('')
  const appliedDiscount = ref(0)
  const completedOrder = ref<OrderDetail | null>(null)

  // เพิ่มสินค้าลงในตะกร้า หรือเพิ่มปริมาณหากมีอยู่แล้ว
  function addToCart(product: Product) {
    const existingItem = items.value.find((item) => item.sku === product.sku)

    if (existingItem) {
      updateQuantity(product.sku, existingItem.quantity + 1)
    } else {
      // เพิ่มสินค้าใหม่
      items.value.push({
        ...product,
        quantity: 1,
        total_item_price: product.price * 1,
      })
    }
    console.log(`Product SKU ${product.sku} added to cart.`)
  }

  // ปริมาณสินค้าในตะกร้า (Min 1, Max 999)
  function updateQuantity(sku: number, newQuantity: number) {
    const item = items.value.find((i) => i.sku === sku)

    if (item) {
      const clampedQty = Math.max(1, Math.min(999, newQuantity))
      item.quantity = clampedQty
      item.total_item_price = item.price * clampedQty
    }
  }

  // ลบสินค้าออกจากตะกร้า
  function removeFromCart(sku: number) {
    items.value = items.value.filter((item) => item.sku !== sku)
    console.log(`Product SKU ${sku} removed from cart.`)
  }

  // ใช้รหัสโปรโมชั่น
  function applyPromotion() {
    if (promotionCode.value.toUpperCase() === mockConfig.config.promotion.discount_code) {
      appliedDiscount.value = mockConfig.config.promotion.discount_amount
      return true
    } else {
      appliedDiscount.value = 0
      return false
    }
  }

  // บันทึก Cart ปัจจุบันเป็น Order
  function createOrder(orderId: string): OrderDetail {
    const order: OrderDetail = {
      orderId,
      items: JSON.parse(JSON.stringify(items.value)),
      subTotal: subTotal.value,
      finalDiscount: finalDiscount.value,
      deliveryFee: deliveryFee.value,
      finalTotalAmount: finalTotalAmount.value,
      createdAt: Date.now(),
    }

    // บันทึก Order
    localStorage.setItem(`order-${orderId}`, JSON.stringify(order))

    // รีเซ็ต Cart (เมื่อ Checkout สำเร็จ)
    items.value = []
    promotionCode.value = ''
    appliedDiscount.value = 0
    completedOrder.value = null

    return order
  }

  function clearOrderFromStorage(orderId: string) {
    localStorage.removeItem(`order-${orderId}`)
  }

  // Total SKU Count (จำนวนสินค้าที่แตกต่างกัน)
  const totalSkuCount = computed(() => items.value.length)

  // Total Quantity (จำนวนชิ้นทั้งหมด)
  const totalQuantity = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))

  // Subtotal (รวมราคาสินค้าทั้งหมดก่อนส่วนลด/ค่าจัดส่ง)
  const subTotal = computed(() => calculateSubtotal(items.value))

  // Delivery Fee (ค่าจัดส่ง)
  const deliveryFee = computed(() => {
    return calculateDeliveryFee(subTotal.value, mockConfig)
  })

  // Discount (ส่วนลดที่ถูกนำมาใช้)
  const finalDiscount = computed(() => appliedDiscount.value)

  // Final Total Amount (ราคาสุทธิที่ต้องจ่าย)
  const finalTotalAmount = computed(() => {
    return calculateFinalTotal(subTotal.value, finalDiscount.value, deliveryFee.value)
  })

  function getOrderById(orderId: string): OrderDetail | undefined {
    const key = `order-${orderId}` // ใช้ Key ที่ถูกต้อง
    const orderJson = localStorage.getItem(key)

    if (orderJson) {
      try {
        const parsedOrder = JSON.parse(orderJson) as OrderDetail
        return parsedOrder
      } catch (e) {
        console.error(`Failed to parse order ID ${orderId} from localStorage:`, e)
        return undefined
      }
    }

    return completedOrder.value?.orderId === orderId ? completedOrder.value : undefined
  }

  return {
    items,
    promotionCode,
    completedOrder,

    totalSkuCount,
    totalQuantity,
    subTotal,
    deliveryFee,
    finalDiscount,
    finalTotalAmount,
    appliedDiscount,

    addToCart,
    updateQuantity,
    removeFromCart,
    applyPromotion,
    formatCurrency,
    createOrder,
    getOrderById,
    clearOrderFromStorage,
  }
})
