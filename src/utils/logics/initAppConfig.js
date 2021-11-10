/**
 * 应用程序配置
 */

import { PROJ_CFG_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/utils/settings/projectSetting';

// import { updateHeaderBgColor, updateSidebarBgColor } from '@/logics/theme/updateBackground';
// import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
// import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
// import { updateDarkTheme } from '/@/logics/theme/dark';
// import { changeTheme } from '/@/logics/theme';

import store from '@/store';

import { getCommonStoragePrefix, getStorageShortName } from '@/utils/env';

// import { primaryColor } from '../../build/config/themeConfig';
import { Persistent } from '@/utils/cache/persistent';
import { deepMerge } from '@/utils';
// import { ThemeEnum } from '/@/enums/appEnum';

// 最初的项目配置
export function initAppConfigStore() {
    let projCfg = Persistent.getLocal(PROJ_CFG_KEY);
    projCfg = deepMerge(projectSetting, projCfg || {});
    //   const darkMode = store.getters['app/getDarkMode'] ;
    //   const {
    //     colorWeak,
    //     grayMode,
    //     themeColor,

    //     headerSetting: { bgColor: headerBgColor } = {},
    //     menuSetting: { bgColor } = {},
    //   } = projCfg;
    //   try {
    //     if (themeColor && themeColor !== primaryColor) {
    //       changeTheme(themeColor);
    //     }

    //     grayMode && updateGrayMode(grayMode);
    //     colorWeak && updateColorWeak(colorWeak);
    //   } catch (error) {
    //     console.log(error);
    //   }
    store.commit('app/setProjectConfig', projCfg);

    // init dark mode
    //   updateDarkTheme(darkMode);
    //   if (darkMode === ThemeEnum.DARK) {
    //     updateHeaderBgColor();
    //     updateSidebarBgColor();
    //   } else {
    //     headerBgColor && updateHeaderBgColor(headerBgColor);
    //     bgColor && updateSidebarBgColor(bgColor);
    //   }

    setTimeout(() => {
        clearObsoleteStorage();
    }, 16);
}

/**
 * 随着版本的继续迭代，将有越来越多的缓存键存储在localStorage中。
 * 删除无用的密钥
 */
export function clearObsoleteStorage() {
    const commonPrefix = getCommonStoragePrefix();
    const shortPrefix = getStorageShortName();
    

    [localStorage, sessionStorage].forEach((item) => {
        Object.keys(item).forEach((key) => {
            if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
                item.removeItem(key);
            }
        });
    });
}
