/**
 * https://github.com/developit/mitt
 */

/**
 * Mitt: Tiny (~200b) 功能事件发射器/ pubsub。
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt(all) {
    all = all || new Map();

    return {
        /**
         * 事件名称到注册处理程序函数的映射。
         */
        all,

        /**
         * 为给定类型注册一个事件处理程序。
         * @param {string|symbol} type 要侦听的事件类型，或“*”表示所有事件
         * @param {Function} handler 响应给定事件调用的函数
         * @memberOf mitt
         */
        on(type, handler) {
            const handlers = all?.get(type);
            const added = handlers && handlers.push(handler);
            if (!added) {
                all?.set(type, [handler]);
            }
        },

        /**
         * 移除给定类型的事件处理程序。
         * @param {string|symbol} type 要注销' handler '或' "*"的事件类型
         * @param {Function} handler 要删除的处理程序函数
         * @memberOf mitt
         */
        off(type, handler) {
            const handlers = all?.get(type);
            if (handlers) {
                handlers.splice(handlers.indexOf(handler) >>> 0, 1);
            }
        },

        /**
         * 调用给定类型的所有处理程序。
         * 如果存在，' "*" '处理程序将在类型匹配的处理程序之后被调用。
         *
         * Note: 不支持手动触发"*"处理程序。
         *
         * @param {string|symbol} type 要调用的事件类型
         * @param {Any} [evt] 传递给每个处理程序的任何值(推荐使用且功能强大的对象)
         * @memberOf mitt
         */
        emit(type, evt) {
            (all?.get(type) || []).slice().map((handler) => {
                handler(evt);
            });
            (all?.get('*') || []).slice().map((handler) => {
                handler(type, evt);
            });
        },

        /**
         * Clear all
         */
        clear() {
            this.all.clear();
        },
    };
}
