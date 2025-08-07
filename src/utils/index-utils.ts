/**
 * 数据索引工具
 * 用于加快数据查找速度
 */

/**
 * 创建数据索引
 * @param data 要索引的数据数组
 * @param keyFn 从数据项中提取索引键的函数
 * @returns 索引对象
 */
export function createIndex<T>(data: T[], keyFn: (item: T) => string): Record<string, T> {
  const index: Record<string, T> = {};
  
  for (const item of data) {
    const key = keyFn(item);
    if (key) {
      index[key] = item;
    }
  }
  
  return index;
}

/**
 * 创建多值索引（一个键可以对应多个值）
 * @param data 要索引的数据数组
 * @param keyFn 从数据项中提取索引键的函数
 * @returns 多值索引对象
 */
export function createMultiIndex<T>(data: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const index: Record<string, T[]> = {};
  
  for (const item of data) {
    const key = keyFn(item);
    if (key) {
      if (!index[key]) {
        index[key] = [];
      }
      index[key].push(item);
    }
  }
  
  return index;
}

/**
 * 创建复合索引（使用多个字段作为索引键）
 * @param data 要索引的数据数组
 * @param keyFns 从数据项中提取索引键的函数数组
 * @returns 复合索引对象
 */
export function createCompositeIndex<T>(data: T[], keyFns: ((item: T) => string)[]): Record<string, T[]> {
  const index: Record<string, T[]> = {};
  
  for (const item of data) {
    const keys = keyFns.map(fn => fn(item));
    const compositeKey = keys.join('::');
    
    if (!index[compositeKey]) {
      index[compositeKey] = [];
    }
    index[compositeKey].push(item);
  }
  
  return index;
}

/**
 * 使用索引查找数据
 * @param index 索引对象
 * @param key 索引键
 * @returns 找到的数据项或undefined
 */
export function findByIndex<T>(index: Record<string, T>, key: string): T | undefined {
  return index[key];
}

/**
 * 使用多值索引查找数据
 * @param index 多值索引对象
 * @param key 索引键
 * @returns 找到的数据项数组或空数组
 */
export function findAllByIndex<T>(index: Record<string, T[]>, key: string): T[] {
  return index[key] || [];
}

/**
 * 使用复合索引查找数据
 * @param index 复合索引对象
 * @param keys 索引键数组
 * @returns 找到的数据项数组或空数组
 */
export function findByCompositeIndex<T>(index: Record<string, T[]>, keys: string[]): T[] {
  const compositeKey = keys.join('::');
  return index[compositeKey] || [];
}