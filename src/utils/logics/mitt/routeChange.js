/**
 * 用于监控路由变化，以更改菜单和选项卡的状态。无需监控路由，因为路由状态的变化受页面呈现时间的影响，会比较慢
 */

import mitt from '@/utils/mitt';
import { getRawRoute } from '@/utils';

const emitter = mitt();

const key = Symbol();

let lastChangeTab;

export function setRouteChange(lastChangeRoute) {
    const r = getRawRoute(lastChangeRoute);
    emitter.emit(key, r);
    lastChangeTab = r;
}

export function listenerRouteChange(callback, immediate = true) {
    emitter.on(key, callback);
    immediate && lastChangeTab && callback(lastChangeTab);
}

export function removeTabChangeListener() {
    emitter.clear();
}
