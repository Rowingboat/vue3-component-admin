// import { warn } from '@/utils/log';
import { getAppEnvConfig } from '@/utils/env';


// 使用全局环境变量配置
export const useGlobSetting = () => {
    const {
        VUE_APP_GLOB_TITLE,
        VUE_APP_GLOB_SHORT_NAME,
        VUE_APP_GLOB_API_URL_PREFIX,
        VUE_APP_GLOB_API_URL
    } = getAppEnvConfig();

    // 全局配置
    const glob = {
        title: VUE_APP_GLOB_TITLE,
        shortName:VUE_APP_GLOB_SHORT_NAME,
        urlPrefix: VUE_APP_GLOB_API_URL_PREFIX,
        apiUrl:VUE_APP_GLOB_API_URL
    };

    return glob;
};
