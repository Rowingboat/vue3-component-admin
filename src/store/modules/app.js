import { APP_DARK_MODE_KEY_, PROJ_CFG_KEY } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';
import { darkMode } from '@/utils/settings/designSetting';
import { resetRouter } from '@/router';
import { deepMerge } from '@/utils';


let timeId;
export default {
    state: () => ({
        darkMode: undefined,
        pageLoading: false,
        projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
        beforeMiniInfo: {},
    }),
    getters: {
        getPageLoading: (state) => state.pageLoading,
        getDarkMode: (state) => state.darkMode || localStorage.getItem(APP_DARK_MODE_KEY_) || darkMode,
        getBeforeMiniInfo: (state) => state.beforeMiniInfo,
        getProjectConfig: (state) => state.projectConfig || {},// 项目配置
        getHeaderSetting: (_, getters) => getters.getProjectConfig.headerSetting,
        getMenuSetting: (_, getters) => getters.getProjectConfig.menuSetting,
        getTransitionSetting: (_, getters) => getters.getProjectConfig.transitionSetting,
        getMultiTabsSetting: (_, getters) => getters.getProjectConfig.multiTabsSetting,
    },
    mutations: {
        // 设置页面加载状态
        setPageLoading(state, loading) {
            state.pageLoading = loading;
        },
        // 设置主题
        setDarkMode(state, mode) {
            state.darkMode = mode;
            localStorage.setItem(APP_DARK_MODE_KEY_, mode);
        },
        // 设置 加载前初始化
        setBeforeMiniInfo(state, status) {
            state.beforeMiniInfo = status;
        },
        // 设置 项目配置
        setProjectConfig(state, config) {
            state.projectConfig = deepMerge(state.projectConfig || {}, config);
            Persistent.setLocal(PROJ_CFG_KEY, state.projectConfig);
        },
        // 重置所有状态
        async resetAllState() {
            resetRouter();
            Persistent.clearAll();
        },
    },
    actions: {
        // 设置页面加载状态
        async setPageLoadingAction(context, loading) {
            if (loading) {
                clearTimeout(timeId);
                // Prevent flicker
                timeId = setTimeout(() => {
                    context.commit('setPageLoading', loading);
                }, 50);
            } else {
                context.commit('setPageLoading', loading);
                clearTimeout(timeId);
            }
        },
        setApp({state}){
            console.log(state);
        }
    },
};
