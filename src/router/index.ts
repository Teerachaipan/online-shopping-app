import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ProductDetailPage from '../views/ProductDetailPage.vue'
import CartPage from '../views/CartPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    { path: '/product/:sku', name: 'product-detail', component: ProductDetailPage, props: true },
    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/checkout/:orderId', name: 'checkout', component: CheckoutPage, props: true },
  ],
})

export default router
