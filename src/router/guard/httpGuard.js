import { AxiosCanceler } from '@/utils/http/axios/axiosCancel';
import projectSetting from '@/utils/settings/projectSetting';

/**
 * 当路由切换时，关闭当前页面以完成请求的接口
 * @param router
 */
export function createHttpGuard(router) {
  const { removeAllHttpPending } = projectSetting;
  let axiosCanceler;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  router.beforeEach(async () => {
    // 切换路由将删除先前的请求
    axiosCanceler?.removeAllPending();
    return true;
  });
}
