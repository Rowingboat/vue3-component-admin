// @ts-nocheck
import { Modal, notification } from 'ant-design-vue';
import projectSetting from '@/utils/settings/projectSetting';
import { warn } from '@/utils/log';

/**
 * 用于切换路由时关闭消息实例
 * @param router
 */
export function createMessageGuard(router) {
  const { closeMessageOnSwitch } = projectSetting;

  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll();
        notification.destroy();
      }
    } catch (error) {
      warn('message guard error:' + error);
    }
    return true;
  });
}
