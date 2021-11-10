import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { transformRouteToMenu } from '@/router/helper/menuHelper';
import { asyncRoutes } from '@/router/routes'; // 总路由List
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';

import { getPermCode } from '@/api/sys/user';
import { getMenuList } from '@/api/sys/menu';

import { PermissionModeEnum } from '@/enums/appEnum';
import projectSetting from '@/utils/settings/projectSetting';

import { filter } from '@/utils/helper/treeHelper';

import { useMessage } from '@/utils/hooks/web/useMessage';

export default {
    name: 'app-permission',
    state: () => ({
        permCodeList: [],
        isDynamicAddedRoute: false, //是否已动态添加路由
        lastBuildMenuTime: 0, //触发菜单更新
        backMenuList: [], //后台菜单列表
    }),
    getters: {
        getPermCodeList: (state) => state.permCodeList,
        getBackMenuList: (state) => state.backMenuList,
        getLastBuildMenuTime: (state) => state.lastBuildMenuTime,
        getIsDynamicAddedRoute: (state) => state.isDynamicAddedRoute,
    },
    mutations: {
        setPermCodeList(state, codeList) {
            state.permCodeList = codeList;
        },
        setBackMenuList(state, list) {
            state.backMenuList = list;
            if(list?.length > 0){
                state.lastBuildMenuTime = new Date().getTime();
            }
        },
        setLastBuildMenuTime(state) {
            state.lastBuildMenuTime = new Date().getTime();
        },
        setDynamicAddedRoute(state, added) {
            state.isDynamicAddedRoute = added;
        },
        resetState(state) {
            state.isDynamicAddedRoute = false;
            state.permCodeList = [];
            state.backMenuList = [];
            state.lastBuildMenuTime = 0;
        },
    },
    actions: {
        async changePermissionCode({ commit }) {
            const codeList = await getPermCode();
            commit('setPermCodeList', codeList);
        },
        async buildRoutesAction({ dispatch, commit, rootGetters }) {
            let routes = [];
            // 获取角色列表
            const roleList = toRaw(rootGetters['user/getRoleList']) || [];
            // 获取权限模式
            const { permissionMode = projectSetting.permissionMode } = rootGetters['app/getProjectConfig'];
            // 角色权限
            if (permissionMode === PermissionModeEnum.ROLE) {
                // 路由筛选规则
                const routeFilter = (route) => {
                    const { meta } = route;
                    const { roles } = meta || {};
                    if (!roles) return true; // 没有角色 代表所有页面有权限
                    return roleList.some((role) => roles.includes(role));
                };
                routes = filter(asyncRoutes, routeFilter);
                routes = routes.filter(routeFilter);
                // 将多级路由转换为二级路由
                routes = flatMultiLevelRoutes(routes);
                // 动态路由权限
            } else if (permissionMode === PermissionModeEnum.BACK) {
                const { createMessage } = useMessage();
                createMessage.loading({
                    content: '菜单加载中！',
                    duration: 1,
                });
                // 模拟从后台获取权限码，
                // 这个函数可能只需要执行一次，并且实际的项目可以自己在正确的时间放置
                let routeList = [];
                try {
                    dispatch('changePermissionCode');
                    routeList = await getMenuList();
                } catch (error) {
                    console.error(error);
                }

                // 动态引入组件
                routeList = transformObjToRoute(routeList);

                // 后台路由到菜单结构
                const backMenuList = transformRouteToMenu(routeList);
                commit('setBackMenuList', backMenuList);
                
                // 将多级路由转换为二级路由
                routeList = flatMultiLevelRoutes(routeList);
                routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
            }

            routes.push(ERROR_LOG_ROUTE);
            return routes;
        },
    },
};
