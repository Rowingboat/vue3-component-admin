import { createStore, createNamespacedHelpers } from 'vuex';

import { importAll } from '@/utils';
let modulesArr = importAll(require.context('./modules', false, /\.js$/));

let modules = {};
// 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突
Object.keys(modulesArr).forEach((key) => {
    modules[key] = { ...modulesArr[key].default, namespaced: true };
});

const store = createStore({
    modules,
    strict: process.env.NODE_ENV !== 'production', //判断是否是开发模式
    // strict: isDevMode(),
});

export function setupStore(app) {
    app.use(store);
}

export function useModelStore(path) {
    const { mapMutations } = createNamespacedHelpers(path);
    mapMutations(['commitToken']).commitToken('213');
    console.log(store);
    return {
        ...mapMutations(['commitToken']),
    };
}

export default store;
