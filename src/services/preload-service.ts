/**
 * 数据预加载服务
 * 用于在应用启动时预加载常用数据，减少用户等待时间
 */
import { fileSystem } from './file-system';
import { cacheService } from './cache-service';
import { userApi, applicationApi, examApi, activityApi } from './api';

class PreloadService {
  // 是否已经初始化
  private initialized = false;
  
  /**
   * 初始化预加载服务
   */
  async initialize() {
    if (this.initialized) {
      return;
    }
    
    console.log('开始预加载数据...');
    
    try {
      // 并行预加载多种数据
      await Promise.all([
        this.preloadUsers(),
        this.preloadApplications(),
        this.preloadExams(),
        this.preloadActivities()
      ]);
      
      this.initialized = true;
      console.log('数据预加载完成');
    } catch (error) {
      console.error('数据预加载失败:', error);
    }
  }
  
  /**
   * 预加载用户数据
   */
  private async preloadUsers() {
    try {
      console.log('预加载用户数据...');
      await fileSystem.getAllUsers();
      console.log('用户数据预加载完成');
    } catch (error) {
      console.error('预加载用户数据失败:', error);
    }
  }
  
  /**
   * 预加载申请数据
   */
  private async preloadApplications() {
    try {
      console.log('预加载申请数据...');
      await fileSystem.getAllApplications();
      console.log('申请数据预加载完成');
    } catch (error) {
      console.error('预加载申请数据失败:', error);
    }
  }
  
  /**
   * 预加载考试数据
   */
  private async preloadExams() {
    try {
      console.log('预加载考试数据...');
      await fileSystem.getAllExams();
      console.log('考试数据预加载完成');
    } catch (error) {
      console.error('预加载考试数据失败:', error);
    }
  }
  
  /**
   * 预加载活动数据
   */
  private async preloadActivities() {
    try {
      console.log('预加载活动数据...');
      await fileSystem.getAllActivities();
      console.log('活动数据预加载完成');
    } catch (error) {
      console.error('预加载活动数据失败:', error);
    }
  }
  
  /**
   * 预加载特定用户的数据
   * @param callsign 用户呼号
   */
  async preloadUserData(callsign: string) {
    try {
      console.log(`预加载用户 ${callsign} 的数据...`);
      
      // 并行预加载用户相关数据
      await Promise.all([
        fileSystem.getUserProfile(callsign),
        fileSystem.getUserApplications(callsign),
        fileSystem.getUserExams(callsign),
        fileSystem.getUserActivities(callsign)
      ]);
      
      console.log(`用户 ${callsign} 的数据预加载完成`);
    } catch (error) {
      console.error(`预加载用户 ${callsign} 的数据失败:`, error);
    }
  }
  
  /**
   * 清除所有缓存数据
   */
  clearCache() {
    cacheService.clear();
    console.log('所有缓存数据已清除');
  }
}

// 导出单例
export const preloadService = new PreloadService();