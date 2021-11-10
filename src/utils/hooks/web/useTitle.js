import { watch, unref } from 'vue';
import { useTitle as usePageTitle } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useGlobSetting } from '@/utils/hooks/setting';

export function useTitle(){

    // 获取初始配置标题
    const { title } = useGlobSetting();
    // 获取当前路由
    const { currentRoute } = useRouter();
    // 获取文档标题属性
    const pageTitle = usePageTitle();

    // 监听路由变化 动态修改标题
    watch(
        () => currentRoute.value.path,
        () => {
            const route = unref(currentRoute);
            const tTitle = route?.meta?.title;
            // 改变页面标题
            pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`;
        },
        { immediate: true }
    )
}