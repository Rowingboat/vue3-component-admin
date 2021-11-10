import store from "@/store"
import { PageEnum } from '@/enums/pageEnum';
import { removeTabChangeListener } from '@/utils/logics/mitt/routeChange';

export function createStateGuard(router) {

  router.afterEach((to) => {
    // 只需进入登录页面并清除身份验证信息
    if (to.path === PageEnum.BASE_LOGIN) {
      store.commit('app/resetAllState')
      store.commit('permission/resetState')
      store.commit('multipleTab/resetState')
      store.commit('user/resetState')
      removeTabChangeListener();
    }
  });
}
