import { setRouteChange } from '@/utils/logics/mitt/routeChange';

export function createPageGuard(router) {
  const loadedPageMap = new Map();

  router.beforeEach(async (to) => {
    to.meta.loaded = !!loadedPageMap.get(to.path);
    // 通知路由变化
    setRouteChange(to);

    return true;
  });

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true);
  });
}
