import type { Product } from '@/entities/product'

// รายการแบรนด์ที่ไม่ซ้ำกันจากรายการสินค้าทั้งหมด
export const getUniqueBrands = (products: Product[]): string[] => {
  const brands = products.map((p) => p.brand)
  return [...new Set(brands)].sort()
}

// กรองรายการสินค้าตามเงื่อนไขที่กำหนด
export const filterProducts = (
  products: Product[],
  searchTerm: string,
  selectedBrands: string[],
  priceRange: [number, number],
): Product[] => {
  let result = products

  // 1. Filter ด้วย Search Term
  if (searchTerm) {
    result = result.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  // 2. Filter ด้วย แบรนด์
  if (selectedBrands.length > 0) {
    result = result.filter((p) => selectedBrands.includes(p.brand))
  }

  // 3. Filter ด้วย ช่วงราคา
  result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

  return result
}
