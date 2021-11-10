import { PageEnum } from '@/enums/pageEnum';
import store from '@/store';

import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList = [LOGIN_PATH,'/main-out'];

export function createPermissionGuard(router) {
    router.beforeEach(async (to, from, next) => {
       
        // 处理登录后跳转到404页面
        if (from.path === LOGIN_PATH && to.name === PAGE_NOT_FOUND_ROUTE.name) {
            next(PageEnum.BASE_HOME);
            return;
        }
        // 白名单    不需要权限
        if (whitePathList.includes(to.path)) {
            next();
            return;
        }

        const token = store.state.user.getToken;

        // token 不存在
        if (!token) {
            // 可以不需要权限进入 需要设置路由元信息 meta.ignoreAuth 为 true
            if (
                to.meta.ignoreAuth
                // || to.name === FULL_PAGE_NOT_FOUND_ROUTE.name
            ) {
                next();
                return;
            }
            // 登录页面重定向
            const redirectData = {
                path: LOGIN_PATH,
                replace: true,
            };
            if (to.path) {
                redirectData.query = {
                    ...redirectData.query,
                    redirect: to.path,
                };
            }
            next(redirectData);
            return;
        }
        if (store.getters['permission/getIsDynamicAddedRoute']) {
            next();
            return;
        }
        const routes = await store.dispatch('permission/buildRoutesAction');

        routes.forEach((route) => {
            router.addRoute(route);
        });

        const redirectPath = from.query.redirect || to.path;
        const redirect = decodeURIComponent(redirectPath);
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
        store.commit('permission/setDynamicAddedRoute',true)
        next(nextData);
    });
}
