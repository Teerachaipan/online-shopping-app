// src/stores/product.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { mockProducts } from '@/data/mockData'
import type { Product } from '@/entities/product'

export const useProductStore = defineStore('product', () => {
  const allProducts = ref<Product[]>(mockProducts)
  const searchTerm = ref('')

  // 🆕 สถานะใหม่สำหรับ Sidebar Filter
  const selectedBrands = ref<string[]>([]) // สำหรับเก็บแบรนด์ที่ถูกเลือก
  const priceRange = ref<[number, number]>([0, 500]) // [min, max]

  // 🆕 Computed Property สำหรับดึงรายการแบรนด์ที่ไม่ซ้ำกัน
  const availableBrands = computed(() => {
    const brands = allProducts.value.map((p) => p.brand)
    return [...new Set(brands)].sort()
  })

  const filteredProducts = computed(() => {
    let products = allProducts.value

    // 1. Filter ด้วย Search Term (ชื่อสินค้า)
    if (searchTerm.value) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
      )
    }

    // 2. Filter ด้วย แบรนด์
    if (selectedBrands.value.length > 0) {
      products = products.filter((p) => selectedBrands.value.includes(p.brand))
    }

    // 3. Filter ด้วย ช่วงราคา
    products = products.filter(
      (p) => p.price >= priceRange.value[0] && p.price <= priceRange.value[1],
    )

    return products
  })

  // 🆕 Action เพื่อรีเซ็ต Filter
  function resetFilters() {
    searchTerm.value = ''
    selectedBrands.value = []
    priceRange.value = [0, 500]
  }

  return {
    allProducts,
    filteredProducts,
    searchTerm,
    selectedBrands,
    priceRange,
    availableBrands,
    resetFilters,
  }
})
