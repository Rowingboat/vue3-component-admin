import { useMultipleTabStore } from '@/store/modules/multipleTab';

import store from '@/store';

import { useTabs } from './useTabs';
import { router, resetRouter } from '@/router';
import projectSetting from '@/utils/settings/projectSetting';
import { PermissionModeEnum } from '@/enums/appEnum';

import { intersection } from 'lodash-es';
import { isArray } from '@/utils/is';

// 用户权限相关操作
export function usePermission() {
    const { closeAll } = useTabs(router);

    /**
     * Change permission mode
     */
    async function togglePermissionMode() {
        store.commit('app/setProjectConfig', {
            permissionMode:
                projectSetting.permissionMode === PermissionModeEnum.BACK
                    ? PermissionModeEnum.ROLE
                    : PermissionModeEnum.BACK,
        });

        location.reload();
    }

    /**
     * Reset and regain authority resource information
     * @param id
     */
    async function resume() {
        const tabStore = useMultipleTabStore();
        tabStore.clearCacheTabs();
        resetRouter();
        const routes = await store.dispatch('permission/buildRoutesAction') ;
        routes.forEach((route) => {
            router.addRoute(route);
        });
        store.commit('permission/setLastBuildMenuTime')
        closeAll();
    }

    /**
     * Determine whether there is permission
     */
    function hasPermission(value, def = true) {
        const permMode = projectSetting.permissionMode;

        if (PermissionModeEnum.ROLE === permMode) {
            // Visible by default
            if (!value) {
                return def;
            }
            if (!isArray(value)) {
                return store.getters['user/getRoleList']?.includes(value);
            }
            return intersection(value, store.getters['user/getRoleList']).length > 0;
        }

        if (PermissionModeEnum.BACK === permMode) {
            // Visible by default
            if (!value) {
                return def;
            }
            const allCodeList = store.getters['permission/getPermCodeList'];
            if (!isArray(value)) {
                return allCodeList.includes(value);
            }
            return intersection(value, allCodeList).length > 0;
        }
        return true;
    }

    /**
     * Change roles
     * @param roles
     */
    async function changeRole(roles) {
        if (projectSetting.permissionMode !== PermissionModeEnum.ROLE) {
            throw new Error('Please switch PermissionModeEnum to ROLE mode in the configuration to operate!');
        }

        if (!isArray(roles)) {
            roles = [roles];
        }
        store.commit('user/setRoleList', roles);
        await resume();
    }

    /**
     * refresh menu data
     */
    async function refreshMenu() {
        resume();
    }

    return { changeRole, hasPermission, togglePermissionMode, refreshMenu };
}
