// @ts-nocheck
import { REDIRECT_NAME, LAYOUT, EXCEPTION_COMPONENT } from '@/router/constant';

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPage',
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
      },
    },
  ],
};

export const REDIRECT_ROUTE = {
  path: '/redirect',
  name: REDIRECT_NAME,
  component: LAYOUT,
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('@/views/sys/redirect'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

export const ERROR_LOG_ROUTE = {
  path: '/error-log',
  name: 'errorLog',
  component: LAYOUT,
  meta: {
    title: 'ErrorLog',
    hideBreadcrumb: true,
  },
  children: [
    {
      path: 'list',
      name: 'errorLogList',
      component: () => import('@/views/sys/error-log/index.vue'),
      meta: {
        title: 'errorLogList',
        hideBreadcrumb: true,
      },
    },
  ],
};
