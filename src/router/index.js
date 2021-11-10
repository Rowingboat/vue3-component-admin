import { createRouter, createWebHashHistory } from 'vue-router';
import { basicRoutes, LoginRoute } from './routes';
import { REDIRECT_NAME } from './constant';

const WHITE_NAME_LIST = [LoginRoute.name, REDIRECT_NAME];

// 路由实例
export const router = createRouter({
    history: createWebHashHistory('/'),
    routes: basicRoutes,
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 重置路由 登录页会清空所有状态
export function resetRouter() {
    router.getRoutes().forEach((route) => {
        const { name } = route;
        if (name && !WHITE_NAME_LIST.includes(name)) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    });
}

// 配置路由
export function setupRouter(app) {
    app.use(router);
}

export default router;
