export interface Product {
  sku: number
  brand: string
  name: string
  pack_size: string
  image_url: string[]
  price: number
}

export interface CartItem extends Product {
  quantity: number
  total_item_price: number
}

export interface OrderDetail {
  orderId: string
  items: CartItem[]
  subTotal: number
  finalDiscount: number
  deliveryFee: number
  finalTotalAmount: number
  createdAt: number
}
