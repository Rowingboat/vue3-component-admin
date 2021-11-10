// @ts-nocheck
import { createContext, useContext } from '@/utils/hooks/core/useContext';

const key = Symbol();
/**
 *
 * @param {*} context Provide 向下传入数据
 */
export function createAppProviderContext(context) {
  return createContext(context, key);
}
/**
 * inject 获取传入的数据
 */
export function useAppProviderContext() {
  return useContext(key);
}
