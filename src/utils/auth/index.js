import { Persistent } from '@/utils/cache/persistent';
import { CacheTypeEnum, TOKEN_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/utils/settings/projectSetting';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
    return getAuthCache(TOKEN_KEY);
}

export function getAuthCache(key) {
    const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
    return fn(key);
}

export function setAuthCache(key, value) {
    const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
    return fn(key, value, true);
}
