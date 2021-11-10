import { getStorageShortName } from '@/utils/env';
import { createStorage as create } from './storageCache';
import { enableStorageEncryption, DEFAULT_CACHE_TIME } from '@/utils/settings/encryptionSetting';


const createOptions = (storage, options = {}) => {
  return {
    // 在调试模式中没有加密
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    ...options,
  };
};

export const WebStorage = create(createOptions(sessionStorage));

export const createStorage = (storage = sessionStorage, options = {}) => {
  return create(createOptions(storage, options));
};

export const createSessionStorage = (options = {}) => {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export const createLocalStorage = (options = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export default WebStorage;
