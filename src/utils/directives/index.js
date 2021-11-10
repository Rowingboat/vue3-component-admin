/**
 * 配置和注册全局指令
 */
import { setupPermissionDirective } from './permission';
import { setupLoadingDirective } from './loading';

export function setupGlobDirectives(app) {
  setupPermissionDirective(app);
  setupLoadingDirective(app);
}
