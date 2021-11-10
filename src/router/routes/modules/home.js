
import { LAYOUT } from '@/router/constant';

const dashboard = {
  path: '/home',
  name: 'Home',
  component: LAYOUT,
  redirect: '/home/welcome',
  meta: {
    icon: 'ion:home',
    title: '首页',
  },
  children: [
    {
      path: 'welcome',
      name: '首页',
      component: () => import('@/views/sys/login/Login.vue'),
      meta: {
        title: '首页',
        affix: true,
        icon: 'ion:home',
      },
    },
  ],
};

export default dashboard;
