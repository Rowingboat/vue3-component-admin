/**
 * Global authority directive
 * 用于组件权限的细粒度控制
 * @Example v-auth="RoleEnum.TEST"
 */

import { usePermission } from '@/utils/hooks/web/usePermission';

function isAuth(el, binding) {
  const { hasPermission } = usePermission();

  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el, binding) => {
  isAuth(el, binding);
};

const authDirective = {
  mounted,
};

export function setupPermissionDirective(app) {
  app.directive('auth', authDirective);
}

export default authDirective;
