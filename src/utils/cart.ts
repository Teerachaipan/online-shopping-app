import type { CartItem } from '@/entities/product'
import type { AppConfig } from '@/entities/config'

// คำนวณยอดรวมราคาสินค้าทั้งหมดในตะกร้า (Subtotal)
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
}

// คำนวณค่าจัดส่งตามเงื่อนไข
export const calculateDeliveryFee = (subTotal: number, config: AppConfig): number => {
  const minAmount = config.config.delivery_fee.minimum_cart_amount
  const fee = config.config.delivery_fee.delivery_fee_amount

  return subTotal >= minAmount ? 0 : fee
}

// คำนวณราคาสุทธิทั้งหมดตามสูตร
export const calculateFinalTotal = (
  subTotal: number,
  discount: number,
  deliveryFee: number,
): number => {
  return subTotal - discount + deliveryFee
}
