import { getParentLayout, LAYOUT } from '@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '@/utils/log';
import { createRouter, createWebHashHistory } from 'vue-router';
import { importAll } from '@/utils';

const IFRAME = () => import('@/views/sys/iframe/FrameBlank.vue');

const LayoutMap = new Map();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);

let dynamicViewsModules;

// 动态引入
function asyncImportRoute(routes) {
    dynamicViewsModules = dynamicViewsModules ||  importAll(require.context('../../views', true, /\.vue\.jsx$/), 0);
    if (!routes) return;
    routes.forEach((item) => {
        if (!item.component && item.meta?.frameSrc) {
            item.component = 'IFRAME';
        }
        const { component, name } = item;
        const { children } = item;
        if (component) {
            const layoutFound = LayoutMap.get(component);
            if (layoutFound) {
                item.component = layoutFound;
            } else {
                item.component = dynamicImport(dynamicViewsModules, component);
            }
        } else if (name) {
            item.component = getParentLayout();
        }
        children && asyncImportRoute(children);
    });
}

function dynamicImport(dynamicViewsModules, component) {
    const keys = Object.keys(dynamicViewsModules);
    const matchKeys = keys.filter((key) => {
        let k = key.replace('../../views', '');
        const lastIndex = k.lastIndexOf('.');
        k = k.substring(0, lastIndex);
        return k === component;
    });
    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0];
        return dynamicViewsModules[matchKey];
    }
    if (matchKeys?.length > 1) {
        warn(
            'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
        );
        return;
    }
}

// 将背景对象转换为路由对象
export function transformObjToRoute(routeList) {
    routeList.forEach((route) => {
        if (route.component) {
            if (route.component.toUpperCase() === 'LAYOUT') {
                //route.component = LayoutMap.get(route.component as LayoutMapKey);
                route.component = LayoutMap.get(route.component.toUpperCase());
            } else {
                route.children = [cloneDeep(route)];
                route.component = LAYOUT;
                route.name = `${route.name}Parent`;
                route.path = '';
                const meta = route.meta || {};
                meta.single = true;
                meta.affix = false;
                route.meta = meta;
            }
        }
        route.children && asyncImportRoute(route.children);
    });
    return routeList;
}

/**
 * 将多级路由转换为二级路由
 */
export function flatMultiLevelRoutes(routeModules) {
    const modules = cloneDeep(routeModules);
    for (let index = 0; index < modules.length; index++) {
        const routeModule = modules[index];
        // 判断 路由是否超过二级    不超过二级 跳过本次操作
        if (!isMultipleRoute(routeModule)) {
            continue;
        }
        promoteRouteLevel(routeModule);
    }
    return modules;
}

// 路由等级提升
function promoteRouteLevel(routeModule) {
    // 使用vue-router来拼接菜单
    let router = createRouter({
        routes: [routeModule],
        history: createWebHashHistory(),
    });
    const routes = router.getRoutes();

    addToChildren(routes, routeModule.children || [], routeModule);
    router = null;

    routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// 将所有子路由添加到 二级路由中
function addToChildren(routes, children, routeModule) {
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const route = routes.find((item) => item.name === child.name);
        if (!route) {
            continue;
        }
        routeModule.children = routeModule.children || [];
        if (!routeModule.children.find((item) => item.name === route.name)) {
            routeModule.children?.push(route);
        }
        if (child.children?.length) {
            addToChildren(routes, child.children, routeModule);
        }
    }
}

// 判断级别是否超过2级
function isMultipleRoute(routeModule) {
    if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
        return false;
    }

    const children = routeModule.children;

    let flag = false;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.children?.length) {
            flag = true;
            break;
        }
    }
    return flag;
}
