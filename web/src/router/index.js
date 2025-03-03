import { createRouter, createWebHistory } from 'vue-router';
import managerLogin from '../views/ManagerLogin.vue';
import ManagerHome from '../views/ManagerHome.vue';
import ReservationManager from '../views/ReservationManager.vue';
import GuestManager from '../views/GuestManager.vue';
import GuestReservation from '../views/GuestReservation.vue';
import GuestReservationList from '../views/GuestReservationList.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard/ReservationManager'  // 修改默认重定向到登录页
    },
    {
      path: '/guestReservation',
      name: 'guestReservation',
      component: GuestReservation
    },
    {
      path: '/guestReservationList',
      name: 'guestReservationList',
      component: GuestReservationList
    },
    {
      path: '/managerLogin',
      name: 'managerLogin',
      component: managerLogin,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: ManagerHome,
      children: [
        {
          path: 'reservationManager',
          name: 'reservationManager',
          component: ReservationManager,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'guestManager',
          name: 'guestManager',
          component: GuestManager,
          meta: {
            requiresAuth: true
          }
        }
      ],
    },

  ]
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    const user = localStorage.getItem('user');
    if (!user) {
      // 未登录则跳转到登录页
      next('/managerLogin');
    } else {
      // 已登录则允许访问
      next();
    }
  } else {
    // 不需要认证的路由直接放行
    next();
  }
});

export default router;
