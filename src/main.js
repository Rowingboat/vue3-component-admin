import { createApp } from 'vue';
import App from './App.vue';

import '@/design/index.less';
import 'tailwindcss/tailwind.css';

import { setupStore } from '@/store';
import { initAppConfigStore } from '@/utils/logics/initAppConfig';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupGlobDirectives } from '@/utils/directives';
import { registerGlobComp } from '@/components/registerGlobComp';

async function bootstrap() {
    const app = createApp(App);

    // 配置 状态管理
    setupStore(app);

    // 初始化系统内部配置
    initAppConfigStore();

    // 全局注册组件
    registerGlobComp(app);

    // 配置路由
    setupRouter(app);

    // 加载路由守卫
    setupRouterGuard();

    // 全局注册指令
    setupGlobDirectives(app);

    // 当路由准备好时就挂载
    await router.isReady();

    app.mount('#app', true);
}

bootstrap();
