import store from "@/store"
import { useTransitionSetting } from '@/utils/hooks/setting/useTransitionSetting';
import { unref } from 'vue';

export function createPageLoadingGuard(router) {
  const { getOpenPageLoading } = useTransitionSetting();
  router.beforeEach(async (to) => {
    if (!store.state.user.getToken) {
      return true;
    }
    if (to.meta.loaded) {
      return true;
    }

    if (unref(getOpenPageLoading)) {
      store.dispatch('app/setPageLoadingAction',true)
      return true;
    }

    return true;
  });
  router.afterEach(async () => {
    if (unref(getOpenPageLoading)) {
      setTimeout(() => {
        store.commit('app/setPageLoading',false)
      }, 220);
    }
    return true;
  });
}
