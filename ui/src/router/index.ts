import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store/authStore';
import authService from '@/modules/auth/services/authService';
import Login from '@/modules/auth/pages/Login.vue';
import Register from '@/modules/auth/pages/Register.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage.vue';
import ItemPage from '@/modules/item-management/pages/Index.vue';

import itemRoutes from '@/modules/item-management/router/route';
import qrRoutes from '@/modules/qrcode/router/route';
import salesRoutes from '@/modules/sales/router/route';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'DashboardPage',
        component: DashboardPage,
      },
      ...itemRoutes,
      ...qrRoutes,
      ...salesRoutes,
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  console.log('Navigating to:', to.path);

  // Redirect authenticated users to the dashboard if they are already logged in
  if (to.path === '/' && authStore.token) {
    return next({ path: '/dashboard' });
  }

  // Allow access to the login page and register page without token verification
  if (to.path === '/' || to.path === '/register') {
    return next();
  }

  // If token exists, allow navigation to other pages
  if (authStore.token) {
    return next();
  }

  try {
    // Attempt to fetch a new token
    const response = await authService.retriveToken();
    if (response.token) {
      authStore.setToken(response.token); // Store new token in Pinia
      authStore.setSubdomain(response.subdomain);
      return next();
    }
  } catch (error) {
    console.error('Token retrieval failed:', error);
  }

  // If token is missing and cannot be retrieved, redirect to login
  return next({ path: '/' });
})

export default router;
