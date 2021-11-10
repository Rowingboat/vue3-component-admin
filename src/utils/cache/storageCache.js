import { cacheCipher } from '@/utils/settings/encryptionSetting';
import { AesEncryption } from '@/utils/cipher';
import { isNullOrUnDef } from '@/utils/is';

export const createStorage = ({
    prefixKey = '',
    storage = sessionStorage,
    key = cacheCipher.key,
    iv = cacheCipher.iv,
    timeout = null,
    hasEncrypt = true,
} = {}) => {
    if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
        throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
    }

    const encryption = new AesEncryption({ key, iv });
    /**
     *Cache class
     *构造参数可以传递到sessionStorage、localStorage、
     * @class Cache
     * @example
     */
    const WebStorage = class WebStorage {
        #storage;
        #prefixKey;
        #encryption;
        #hasEncrypt;
        /**
         *
         * @param {*} storage
         */
        constructor() {
            this.#storage = storage;
            this.#prefixKey = prefixKey;
            this.#encryption = encryption;
            this.#hasEncrypt = hasEncrypt;
        }

        #getKey(key) {
            return `${this.#prefixKey}${key}`.toUpperCase();
        }

        /**
         *
         *  设置缓存
         * @param {string} key
         * @param {*} value
         * @expire 过期时间
         * @memberof Cache
         */
        set(key, value, expire = timeout) {
            const stringData = JSON.stringify({
                value,
                time: Date.now(),
                expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
            });
            const stringifyValue = this.#hasEncrypt ? this.#encryption.encryptByAES(stringData) : stringData;
            this.#storage.setItem(this.#getKey(key), stringifyValue);
        }

        /**
         *Read cache
         * @param {string} key
         * @memberof Cache
         */
        get(key, def = null) {
            const val = this.#storage.getItem(this.#getKey(key));
            if (!val) return def;

            try {
                const decVal = this.#hasEncrypt ? this.#encryption.decryptByAES(val) : val;
                const data = JSON.parse(decVal);
                const { value, expire } = data;
                if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
                    return value;
                }
                this.remove(key);
            } catch (e) {
                return def;
            }
        }

        /**
         * 根据密钥删除缓存
         * @param {string} key
         * @memberof Cache
         */
        remove(key) {
            this.#storage.removeItem(this.#getKey(key));
        }

        /**
         * 删除此实例的所有缓存
         */
        clear() {
            this.#storage.clear();
        }
    };
    return new WebStorage();
};
