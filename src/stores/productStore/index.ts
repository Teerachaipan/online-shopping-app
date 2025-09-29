import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { mockProducts } from '@/data/mockData'
import type { Product } from '@/entities/product'
import { getUniqueBrands, filterProducts } from '@/utils/product'

export const useProductStore = defineStore('product', () => {
  const allProducts = ref<Product[]>(mockProducts)
  const searchTerm = ref('')

  const selectedBrands = ref<string[]>([]) // สำหรับเก็บแบรนด์ที่ถูกเลือก
  const priceRange = ref<[number, number]>([0, 500]) // [min, max]

  // ดึงรายการแบรนด์ที่ไม่ซ้ำกัน
  const availableBrands = computed(() => {
    return getUniqueBrands(allProducts.value)
  })

  // filter product
  const filteredProducts = computed(() => {
    return filterProducts(
      allProducts.value,
      searchTerm.value,
      selectedBrands.value,
      priceRange.value,
    )
  })

  // รีเซ็ต Filter
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
