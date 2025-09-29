export interface DeliveryConfig {
  delivery_fee_amount: number
  minimum_cart_amount: number
}

export interface PromotionConfig {
  discount_code: string
  discount_amount: number
}

export interface AppConfig {
  config: {
    delivery_fee: DeliveryConfig
    promotion: PromotionConfig
  }
}
