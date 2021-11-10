export const SIDE_BAR_MINI_WIDTH = 48;
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80;

export const ContentEnum = {
    // 自动宽度
    FULL: 'full',
    // 固定宽度
    FIXED: 'fixed',
};

// 应用程序当前的主题
export const ThemeModeEnum = {
    LIGHT: 'light-mode',
    DARK: 'dark-mode',
    SEMI_DARK: 'semi-dark-mode',
};

// 菜单主题
export const ThemeEnum = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const SettingButtonPositionEnum = {
    AUTO: 'auto',
    HEADER: 'header',
    FIXED: 'fixed',
};

/**
 * 权限模式
 */
export const PermissionModeEnum = {
    // 角色权限模式
    ROLE: 'ROLE',
    // 动态权限
    BACK: 'BACK',
};

//  线路切换动画
export const RouterTransitionEnum = {
    ZOOM_FADE: 'zoom-fade',
    ZOOM_OUT: 'zoom-out',
    FADE_SIDE: 'fade-slide',
    FADE: 'fade',
    FADE_BOTTOM: 'fade-bottom',
    FADE_SCALE: 'fade-scale',
};

export const SessionTimeoutProcessingEnum = {
    ROUTE_JUMP: 0,
    PAGE_COVERAGE: 1,
};
