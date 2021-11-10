<script>
  import { defineComponent, h, unref, computed } from 'vue';
  import BasicButton from './BasicButton.vue';
  import { Popconfirm } from 'ant-design-vue';
  import { extendSlots } from '@/utils/helper/jsxHelper';
  import { omit } from 'lodash-es';
  import { useAttrs } from '@/utils/hooks/core/useAttrs';

  const props = {
    /**
     * 是否启用下拉菜单
     * @default: true
     */
    enable: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'PopButton',
    components: { Popconfirm, BasicButton },
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const attrs = useAttrs();

      // 获取继承绑定值
      const getBindValues = computed(() => {
        const popValues = Object.assign(
          {
            okText: '确定',
            cancelText: '取消',
          },
          { ...props, ...unref(attrs) }
        );
        return popValues;
      });

      return () => {
        const bindValues = omit(unref(getBindValues), 'icon');
        const Button = h(BasicButton, bindValues, extendSlots(slots));

        // If it is not enabled, it is a normal button
        if (!props.enable) {
          return Button;
        }
        return h(Popconfirm, bindValues, { default: () => Button });
      };
    },
  });
</script>
