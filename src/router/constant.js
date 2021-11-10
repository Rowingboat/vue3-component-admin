// 重定向
export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const EXCEPTION_COMPONENT = () => import('@/views/sys/exception/Exception.vue');

/**
 * @description: 默认布局
 */
 export const LAYOUT = () => import('@/layouts/default/index.vue');

 /**
 * @description: 父级布局
 */
export const getParentLayout = () => {
    return () =>
      new Promise((resolve) => {
        resolve({
          name: PARENT_LAYOUT_NAME,
        });
      });
  };
  
