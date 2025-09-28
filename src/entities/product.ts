export interface Product {
  sku: number
  brand: string
  name: string
  pack_size: string
  image_url: string[]
  price: number
}

export interface CartItem extends Product {
  /** จำนวนสินค้าชิ้นนี้ในตะกร้า (Quantity) */
  quantity: number
  /** ราคารวมของสินค้าชิ้นนี้ (Price * Quantity) */
  total_item_price: number
}
