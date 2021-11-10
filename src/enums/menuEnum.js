/**
 * @description: 菜单类型
 */
export const MenuTypeEnum = {
  // 左菜单
  SIDEBAR: 'sidebar',
  MIX_SIDEBAR: 'mix-sidebar',
  // 主菜单
  MIX: 'mix',
  // 顶部菜单
  TOP_MENU: 'top-menu',
};

// 折叠触发器位置
export const TriggerEnum = {
  // 不显示
  NONE: 'NONE',
  // 菜单底部
  FOOTER: 'FOOTER',
  // 头部
  HEADER: 'HEADER',
};

// 菜单模式
export const MenuModeEnum = {
  VERTICAL: 'vertical', //垂直模式
  HORIZONTAL: 'horizontal', //水平模式
  VERTICAL_RIGHT: 'vertical-right',
  INLINE: 'inline', //内嵌模式
};
export const MenuSplitTyeEnum = {
  NONE: 0,
  TOP: 1, //顶部
  LEFT: 2, //左边
};

export const TopMenuAlignEnum = {
  CENTER: 'center',
  START: 'start',
  END: 'end',
};

export const MixSidebarTriggerEnum = {
  HOVER: 'hover',
  CLICK: 'click',
};
