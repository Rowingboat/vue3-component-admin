import { useRouter } from 'vue-router';
import { unref } from 'vue';

import store from '@/store';

const TableActionEnum = {
    REFRESH: 0,
    CLOSE_ALL: 1,
    CLOSE_LEFT: 2,
    CLOSE_RIGHT: 3,
    CLOSE_OTHER: 4,
    CLOSE_CURRENT: 5,
    CLOSE: 6,
};

export function useTabs(_router) {

    function canIUseTabs() {
        const { show } = store.getters['app/getMultiTabsSetting'];
        if (!show) {
            throw new Error('The multi-tab page is currently not open, please open it in the settings！');
        }
        return !!show;
    }

    const router = _router || useRouter();

    const { currentRoute } = router;

    function getCurrentTab() {
        const route = unref(currentRoute);
        return store.getters['multipleTab/getTabList'].find((item) => item.path === route.path);
    }

    async function updateTabTitle(title, tab) {
        const canIUse = canIUseTabs;
        if (!canIUse) {
            return;
        }
        const targetTab = tab || getCurrentTab();
        await store.dispatch('multipleTab/setTabTitle', { title, route: targetTab });
    }

    async function handleTabAction(action, tab) {
        const canIUse = canIUseTabs;
        if (!canIUse) {
            return;
        }
        const currentTab = getCurrentTab();
        switch (action) {
            case TableActionEnum.REFRESH:
                await store.dispatch('multipleTab/refreshPage', router);
                break;

            case TableActionEnum.CLOSE_ALL:
                await store.dispatch('multipleTab/closeAllTab', router);
                break;

            case TableActionEnum.CLOSE_LEFT:
                await store.dispatch('multipleTab/closeLeftTabs', { route: currentTab, router });
                break;

            case TableActionEnum.CLOSE_RIGHT:
                await store.dispatch('multipleTab/closeRightTabs', { route: currentTab, router });
                break;

            case TableActionEnum.CLOSE_OTHER:
                await store.dispatch('multipleTab/closeOtherTabs', { route: currentTab, router });
                break;

            case TableActionEnum.CLOSE_CURRENT:
            case TableActionEnum.CLOSE:
                await store.dispatch('multipleTab/closeTab', { tab: tab || currentTab, router }); 
                break;
        }
    }

    return {
        refreshPage: () => handleTabAction(TableActionEnum.REFRESH),
        closeAll: () => handleTabAction(TableActionEnum.CLOSE_ALL),
        closeLeft: () => handleTabAction(TableActionEnum.CLOSE_LEFT),
        closeRight: () => handleTabAction(TableActionEnum.CLOSE_RIGHT),
        closeOther: () => handleTabAction(TableActionEnum.CLOSE_OTHER),
        closeCurrent: () => handleTabAction(TableActionEnum.CLOSE_CURRENT),
        close: (tab) => {
            handleTabAction(TableActionEnum.CLOSE, tab);
        },
        setTitle: (title, tab) => updateTabTitle(title, tab),
    };
}
