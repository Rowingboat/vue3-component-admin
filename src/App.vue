<template>
    <ConfigProvider :locale="zhCN">
        <AppProvider>
            <router-view />
        </AppProvider>
    </ConfigProvider>
</template>

<script>
import { ConfigProvider } from 'ant-design-vue';
import { AppProvider } from '@/components/comps/Application';
import { useTitle } from '@/utils/hooks/web/useTitle';

import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default {
    name: 'App',
    components: {
        ConfigProvider,
        AppProvider,
    },
    setup() {

      // 创建监听 动态改变 title
      useTitle();

        return {
            zhCN,
        };
    },
};
</script>

<style></style>
