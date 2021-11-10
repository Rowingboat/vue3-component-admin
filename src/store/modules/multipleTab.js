import { toRaw, unref } from 'vue';
// 跳转 和 恢复当前页
import { useGo, useRedo } from '@/utils/hooks/web/usePage';
import { Persistent } from '@/utils/cache/persistent';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';
import { getRawRoute } from '@/utils';
import { MULTIPLE_TABS_KEY } from '@/enums/cacheEnum';
import { PageEnum } from '@/enums/pageEnum';

import projectSetting from '@/utils/settings/projectSetting';

function handleGotoPage(router) {
    const go = useGo(router);
    go(unref(router.currentRoute).path, true);
}

const cacheTab = projectSetting.multiTabsSetting.cache;

export default {
    name: 'app-multiple-tab',
    state: () => ({
        // 需要缓存的选项卡
        cacheTabList: new Set(),
        // 多个选项卡列表
        tabList: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
        // 最后移动的选项卡的索引
        lastDragEndIndex: 0,
    }),
    getters: {
        getTabList: (state) => state.tabList,
        getCachedTabList: (state) => Array.from(state.cacheTabList),
        getLastDragEndIndex: (state) => state.lastDragEndIndex,
    },
    mutations: {
        clearCacheTabs(state) {
            state.cacheTabList = new Set();
        },
        goToPage(state, router) {
            const go = useGo(router);
            const len = state.tabList.length;
            const { path } = unref(router.currentRoute);
            let toPath = PageEnum.BASE_HOME;
            if (len > 0) {
                const page = state.tabList[len - 1];
                const p = page.fullPath || page.path;
                if (p) {
                    toPath = p;
                }
            }
            // 跳转到当前页面并报告错误
            path !== toPath && go(toPath, true);
        },
        /**
         * 根据当前打开的选项卡更新缓存
         */
        async updateCacheTab(state) {
            const cacheMap = new Set();
            for (const tab of state.tabList) {
                const item = getRawRoute(tab);
                // 忽略缓存
                const needCache = !item.meta?.ignoreKeepAlive;
                if (!needCache) {
                    continue;
                }
                const name = item.name;
                cacheMap.add(name);
            }
            state.cacheTabList = cacheMap;
        },

        commitTabRoutesState(state, route) {
            const { path, fullPath, params, query } = route;

            let updateIndex = -1;
            // 现有页面，不要重复添加选项卡
            const tabHasExits = state.tabList.some((tab, index) => {
                updateIndex = index;
                return (tab.fullPath || tab.path) === (fullPath || path);
            });

            // 如果该选项卡已经存在，则执行更新操作
            if (tabHasExits) {
                const curTab = toRaw(state.tabList)[updateIndex];
                if (!curTab) {
                    return;
                }
                curTab.params = params || curTab.params;
                curTab.query = query || curTab.query;
                curTab.fullPath = fullPath || curTab.fullPath;
                state.tabList.splice(updateIndex, 1, curTab);
            } else {
                // Add tab
                state.tabList.push(route);
            }
        },

        deleteCacheTabs(state, findTab) {
            state.cacheTabList.delete(findTab);
        },
        resetState(state) {
            state.tabList = [];
            state.cacheTabList = new Set();
        },
        // 关闭 tab
        commitCloseTab(state, route) {
            const { fullPath, meta: { affix } = {} } = route;
            if (affix) return;
            const index = state.tabsState.findIndex((item) => item.fullPath === fullPath);
            index !== -1 && state.tabsState.splice(index, 1);
        },
        // 对标签进行排序
        sortTabs(state, { oldIndex, newIndex }) {
            const currentTab = state.tabList[oldIndex];
            state.tabList.splice(oldIndex, 1);
            state.tabList.splice(newIndex, 0, currentTab);
            state.lastDragEndIndex = state.lastDragEndIndex + 1;
        },
        /**
         * 批量关闭选项卡
         */
        bulkCloseTabs(state, pathList) {
            state.tabList = state.tabList.filter((item) => !pathList.includes(item.fullPath));
        },
        commitCloseAllTab(state) {
            state.tabList = state.tabList.filter((item) => item?.meta?.affix ?? false);
        },
    },
    actions: {
        async addTab({ commit, state }, route) {
            const { path, name } = route;
            // 404  该页面不需要添加选项卡
            if (
                path === PageEnum.ERROR_PAGE ||
                !name ||
                [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name)
            ) {
                return;
            }
            commit('commitTabRoutesState', getRawRoute(route));
            commit('updateCacheTab');
            cacheTab && Persistent.setLocal(MULTIPLE_TABS_KEY, state.tabList);
        },

        async closeTab({ commit, getters }, { tab, router }) {
            const getToTarget = (tabItem) => {
                const { params, path, query } = tabItem;
                return {
                    params: params || {},
                    path,
                    query: query || {},
                };
            };

            const { currentRoute, replace } = router;

            const { path } = unref(currentRoute);
            if (path !== tab.path) {
                // 关闭不是激活选项卡
                commit('commitCloseTab', tab);
                return;
            }

            // 关闭即激活
            let toTarget = {};

            const index = getters.getTabList.findIndex((item) => item.path === path);

            // 如果当前是最左边的选项卡
            if (index === 0) {
                // 只有一个选项卡，然后跳转到主页，否则跳转到右选项卡
                if (getters.getTabList.length === 1) {
                    toTarget = PageEnum.BASE_HOME;
                } else {
                    //  跳转到右侧选项卡
                    const page = getters.getTabList[index + 1];
                    toTarget = getToTarget(page);
                }
            } else {
                // 关闭当前选项卡
                const page = getters.getTabList[index - 1];
                toTarget = getToTarget(page);
            }
            commit('commitCloseTab', currentRoute.value);
            replace(toTarget);
        },

        /**
         * 刷新 tabs
         */
        async refreshPage({ commit, getters }, router) {
            const { currentRoute } = router;
            const route = unref(currentRoute);
            const name = route.name;
            const findTab = getters.getCachedTabList.find((item) => item === name);
            if (findTab) {
                commit('deleteCacheTabs', findTab);
            }
            const redo = useRedo(router);
            await redo();
        },

        // 按键关闭
        async closeTabByKey({ dispatch, getters }, key) {
            const index = getters.getTabList.findIndex((item) => (item.fullPath || item.path) === key);
            index !== -1 && dispatch('closeTab', getters.getTabList[index]);
        },

        // 关闭右边的选项卡并跳转
        async closeLeftTabs({ commit, getters }, { route, router }) {
            const index = getters.getTabList.findIndex((item) => item.path === route.path);

            if (index > 0) {
                const leftTabs = getters.getTabList.slice(0, index);
                const pathList = [];
                for (const item of leftTabs) {
                    const affix = item?.meta?.affix ?? false;
                    if (!affix) {
                        pathList.push(item.fullPath);
                    }
                }
                commit('bulkCloseTabs', pathList);
            }
            commit('updateCacheTab');
            handleGotoPage(router);
        },

        // 关闭左边的选项卡并跳转
        async closeRightTabs({ commit, getters }, { route, router }) {
            const index = getters.getTabList.findIndex((item) => item.fullPath === route.fullPath);

            if (index >= 0 && index < getters.getTabList.length - 1) {
                const rightTabs = getters.getTabList.slice(index + 1, getters.getTabList.length);

                const pathList = [];
                for (const item of rightTabs) {
                    const affix = item?.meta?.affix ?? false;
                    if (!affix) {
                        pathList.push(item.fullPath);
                    }
                }
                commit('bulkCloseTabs', pathList);
            }
            commit('updateCacheTab');
            handleGotoPage(router);
        },

        /**
         * 关闭其他选项卡
         */
        async closeOtherTabs({ commit, getters }, { route, router }) {
            const closePathList = getters.getTabList.map((item) => item.fullPath);

            const pathList = [];

            for (const path of closePathList) {
                if (path !== route.fullPath) {
                    const closeItem = getters.getTabList.find((item) => item.path === path);
                    if (!closeItem) {
                        continue;
                    }
                    const affix = closeItem?.meta?.affix ?? false;
                    if (!affix) {
                        pathList.push(closeItem.fullPath);
                    }
                }
            }
            commit('bulkCloseTabs', pathList);
            commit('updateCacheTab');
            handleGotoPage(router);
        },

        async closeAllTab({ commit }, router) {
            commit('commitCloseAllTab');
            commit('clearCacheTabs');
            commit('goToPage', router);
        },

        /**
         * 设置标签的标题
         */
        async setTabTitle({ commit, getters }, { title, route }) {
            const findTab = getters.getTabList.find((item) => item === route);
            if (findTab) {
                findTab.meta.title = title;
                await commit('updateCacheTab');
            }
        },
    },
};
