/**
 * 缓存服务
 * 用于缓存频繁访问的数据，减少API调用和文件读取
 */

// 缓存项接口
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // 过期时间（毫秒）
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  
  // 默认缓存过期时间（5分钟）
  private defaultExpiry = 5 * 60 * 1000;
  
  /**
   * 获取缓存数据
   * @param key 缓存键
   * @returns 缓存的数据，如果不存在或已过期则返回null
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    // 如果缓存不存在，返回null
    if (!item) {
      return null;
    }
    
    // 如果缓存已过期，删除并返回null
    if (Date.now() > item.timestamp + item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param data 要缓存的数据
   * @param expiry 过期时间（毫秒），默认为5分钟
   */
  set<T>(key: string, data: T, expiry: number = this.defaultExpiry): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }
  
  /**
   * 删除缓存
   * @param key 缓存键
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * 获取或设置缓存
   * @param key 缓存键
   * @param fetchFn 获取数据的函数
   * @param expiry 过期时间（毫秒），默认为5分钟
   * @returns 缓存的数据或新获取的数据
   */
  async getOrSet<T>(key: string, fetchFn: () => Promise<T>, expiry: number = this.defaultExpiry): Promise<T> {
    // 尝试从缓存获取
    const cachedData = this.get<T>(key);
    if (cachedData !== null) {
      return cachedData;
    }
    
    // 如果缓存不存在或已过期，获取新数据
    const newData = await fetchFn();
    
    // 缓存新数据
    this.set(key, newData, expiry);
    
    return newData;
  }
}

// 导出单例
export const cacheService = new CacheService();