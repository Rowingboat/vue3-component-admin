<template>
    <div class="logo">213</div>
</template>

<script>
import { useRouter } from 'vue-router';
import { getAppEnvConfig } from '@/utils/env';
import { useStore } from "vuex"
export default {
    setup() {
        const router = useRouter();
        console.log(router.getRoutes());
        const { VUE_APP_GLOB_TITLE } = getAppEnvConfig();
        console.log(VUE_APP_GLOB_TITLE);
        const store = useStore();
        store.dispatch('app/setApp')
        return {
            
        };
    },
};
</script>

<style lang="less">

</style>
