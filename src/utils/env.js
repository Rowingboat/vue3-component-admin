import { warn } from '@/utils/log';
import pkg from '../../package.json';

export function getAppEnvConfig() {
    const ENV = process.env;

    const { VUE_APP_GLOB_TITLE, VUE_APP_GLOB_SHORT_NAME, VUE_APP_GLOB_API_URL_PREFIX, VUE_APP_GLOB_API_URL } = ENV;

    if (!/[a-zA-Z_]*/.test(VUE_APP_GLOB_SHORT_NAME)) {
        warn(`VUE_APP_GLOB_SHORT_NAME 变量只能是字符/下划线，请在环境变量中修改并重新运行`);
    }

    return {
        VUE_APP_GLOB_TITLE,
        VUE_APP_GLOB_SHORT_NAME,
        VUE_APP_GLOB_API_URL_PREFIX,
        VUE_APP_GLOB_API_URL,
    };
}

export function getCommonStoragePrefix() {
  const { VUE_APP_GLOB_SHORT_NAME } = getAppEnvConfig();
  return `${VUE_APP_GLOB_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// 根据版本生成缓存密钥
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

/**
 * @description: Development model
 */
 export const devMode = 'development';

 /**
  * @description: Production mode
  */
 export const prodMode = 'production';
 

/**
 * @description: 获取环境变量
 * @returns:
 * @example:
 */
 export function getEnv() {
    return process.env.NODE_ENV;
  }

/**
 * @description: 判断是否是开发环境
 * @returns:
 * @example:
 */
 export function isDevMode() {
    return getEnv() == devMode;
  }