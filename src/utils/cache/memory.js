const NOT_ALIVE = 0;

export class Memory {
    #cache = {};
    #alive;
    constructor(alive = NOT_ALIVE) {
        // 单位秒
        this.#alive = alive * 1000;
    }

    // 对cache 拦截
    get getCache() {
        return this.#cache;
    }

    setCache(cache) {
        this.#cache = cache;
    }

    // get(key) {
    //   const item = this.getItem(key);
    //   const time = item?.time;
    //   if (!isNullOrUnDef(time) && time < new Date().getTime()) {
    //     this.remove(key);
    //   }
    //   return item?.value ?? undefined;
    // }

    get(key) {
        return this.#cache[key];
    }

    set(key, value, expires) {
        let item = this.get(key);
        if (!expires || expires <= 0) {
            expires = this.#alive;
        }

        if (item) {
            if (item.timeoutId) {
                clearTimeout(item.timeoutId);
                item.timeoutId = undefined;
            }
            item.value = value;
        } else {
            item = { value, alive: expires };
            this.#cache[key] = item;
        }

        if (!expires) {
            return value;
        }

        // 设置过期时间
        const now = new Date().getTime();
        item.time = now + this.#alive;
        item.timeoutId = setTimeout(
            () => {
                this.remove(key);
            },
            expires > now ? expires - now : expires
        );

        return value;
    }

    // 删除缓存
    remove(key) {
        const item = this.get(key);
        Reflect.deleteProperty(this.#alive, key);
        if (item) {
            clearTimeout(item.timeoutId);
            return item.value;
        }
    }

    // 重置缓存
    resetCache(cache) {
        Object.keys(cache).forEach((key) => {
            const k = key;
            const item = cache[k];
            if (item && item.time) {
                const now = new Date().getTime();
                const expire = item.time;
                if (expire > now) {
                    this.set(k, item.value, expire);
                }
            }
        });
    }

    // 清空缓存
    clear() {
        Object.keys(this.#cache).forEach((key) => {
            const item = this.#cache[key];
            item.timeoutId && clearTimeout(item.timeoutId);
        });
        this.#cache = {};
    }
}
