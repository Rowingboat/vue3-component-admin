//引入404页面，重定向页面
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';
import { PageEnum } from '@/enums/pageEnum';
import { importAll } from '@/utils';
import { mainOutRoutes } from './mainOut';

const modules = importAll(require.context('./modules', false, /\.js$/));

const routeModuleList = [];
Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
});

// 总路由
export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];
 
export const RootRoute = {
    path: '/',
    name: 'Root',
    redirect: PageEnum.BASE_HOME,
    meta: {
        title: 'Root',
    },
};

export const LoginRoute = {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/sys/login/Login.vue'),
    meta: {
        title: '登录页',
    },
};

export const basicRoutes = [LoginRoute, RootRoute, REDIRECT_ROUTE, ...mainOutRoutes];
