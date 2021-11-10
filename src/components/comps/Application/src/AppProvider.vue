<script>
import { ref, toRefs } from 'vue';
import { prefixCls } from '@/utils/settings/designSetting';
import { createAppProviderContext } from './useAppContext';
const props = {
    /**
     * class style prefix
     */
    prefixCls: { type: String, default: prefixCls },
};

export default {
    name: 'AppProvider',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
        const isMobile = ref(false);

        const { prefixCls } = toRefs(props);

        // 创建全局provider
        createAppProviderContext({ prefixCls, isMobile });

        return () => slots.default?.();
    },
};
</script>
