import { computed } from 'vue';
import store from "@/store"

// 使用过度设置
export function useTransitionSetting() {
  
  const getEnableTransition = computed(() => store.getters['app/getTransitionSetting']?.enable);

  // 获取 打开进度条
  const getOpenNProgress = computed(() => store.getters['app/getTransitionSetting']?.openNProgress);

  // 获取 打开页面加载
  const getOpenPageLoading = computed(() => {
    return !!store.getters['app/getTransitionSetting']?.openPageLoading;
  });

  // 获取 基础过度
  const getBasicTransition = computed(() => store.getters['app/getTransitionSetting']?.basicTransition);

  // 初始化项目配置
  function setTransitionSetting(transitionSetting) {
    store.commit('app/setProjectConfig',{ transitionSetting })
  }
  return {
    setTransitionSetting,

    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  };
}
