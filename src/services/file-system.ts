/**
 * 文件系统服务
 * 用于管理用户数据文件和附件
 */

// 导入必要的模块
import axios from 'axios';

// 文件系统结构接口
interface FileSystem {
  users: Record<string, UserFolder>;
}

interface UserFolder {
  profile: any; // 用户个人资料
  applications: Record<string, any>; // 用户的申请
  exams: Record<string, any>; // 用户的考试
  activities: Record<string, any>; // 用户的活动
  attachments: Record<string, Attachment>; // 用户的附件
}

interface Attachment {
  name: string;
  type: string;
  size: number;
  content: string; // Base64编码的文件内容
  uploadedAt: string;
}

// 文件系统基础路径
const BASE_PATH = './data';

// API服务器地址 - 服务器环境配置
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3001`;

console.log('API_BASE_URL:', API_BASE_URL);
console.log('当前域名:', window.location.hostname);
console.log('当前协议:', window.location.protocol);

// 创建API请求函数
const api = {
  async readFile(path: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fs/read?path=${encodeURIComponent(path)}`);
      return response.data;
    } catch (error) {
      console.error(`读取文件失败: ${path}`, error);
      return null;
    }
  },
  
  async writeFile(path: string, data: any): Promise<boolean> {
    try {
      console.log(`尝试写入文件: ${path}`);
      console.log(`API地址: ${API_BASE_URL}`);
      console.log(`请求数据:`, { path, data });
      
      const response = await axios.post(`${API_BASE_URL}/api/fs/write`, { path, data });
      console.log(`文件写入响应:`, response.data);
      console.log(`响应状态:`, response.status);
      
      if (response.data && response.data.success) {
        console.log(`文件写入成功: ${path}`);
        return true;
      } else {
        console.error(`文件写入失败，服务器响应:`, response.data);
        return false;
      }
    } catch (error: any) {
      console.error(`写入文件失败: ${path}`, error);
      console.error(`错误类型:`, error.name);
      console.error(`错误消息:`, error.message);
      
      if (error.response) {
        console.error('服务器错误响应:', error.response.data);
        console.error('状态码:', error.response.status);
        console.error('响应头:', error.response.headers);
      } else if (error.request) {
        console.error('网络请求失败 - 无响应');
        console.error('请求详情:', error.request);
      } else {
        console.error('请求配置错误:', error.message);
      }
      return false;
    }
  },
  
  async deleteFile(path: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/api/fs/delete?path=${encodeURIComponent(path)}`);
      return true;
    } catch (error) {
      console.error(`删除文件失败: ${path}`, error);
      return false;
    }
  },
  
  async createDirectory(path: string): Promise<boolean> {
    try {
      await axios.post(`${API_BASE_URL}/api/fs/mkdir`, { path });
      return true;
    } catch (error) {
      console.error(`创建目录失败: ${path}`, error);
      return false;
    }
  },
  
  async listFiles(path: string): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fs/list?path=${encodeURIComponent(path)}`);
      return response.data;
    } catch (error) {
      console.error(`列出文件失败: ${path}`, error);
      return [];
    }
  }
};

// 导入缓存服务
import { cacheService } from './cache-service';

// 初始化文件系统
const initFileSystem = async (): Promise<FileSystem> => {
  try {
    // 确保基础目录存在
    await api.createDirectory(BASE_PATH);
    
    // 读取文件系统索引
    const fsIndex = await api.readFile(`${BASE_PATH}/index.json`);
    if (fsIndex) {
      return fsIndex;
    }
  } catch (e) {
    console.error('初始化文件系统失败:', e);
  }
  
  // 创建默认文件系统结构
  const defaultFS = {
    users: {}
  };
  
  // 保存默认文件系统结构
  await api.writeFile(`${BASE_PATH}/index.json`, defaultFS);
  
  return defaultFS;
};

// 保存文件系统索引
const saveFileSystemIndex = async (fs: FileSystem) => {
  await api.writeFile(`${BASE_PATH}/index.json`, fs);
};

// 创建用户文件夹
const createUserFolder = async (callsign: string): Promise<UserFolder> => {
  const fs = await initFileSystem();
  
  if (!fs.users[callsign]) {
    // 创建用户目录
    const userPath = `${BASE_PATH}/users/${callsign}`;
    await api.createDirectory(userPath);
    await api.createDirectory(`${userPath}/applications`);
    await api.createDirectory(`${userPath}/exams`);
    await api.createDirectory(`${userPath}/activities`);
    await api.createDirectory(`${userPath}/attachments`);
    
    // 更新文件系统索引
    fs.users[callsign] = {
      profile: null,
      applications: {},
      exams: {},
      activities: {},
      attachments: {}
    };
    
    await saveFileSystemIndex(fs);
    console.log(`为用户 ${callsign} 创建了文件夹`);
  }
  
  return fs.users[callsign];
};

// 获取或创建用户文件夹
const getUserFolder = async (callsign: string): Promise<UserFolder> => {
  return await createUserFolder(callsign);
};

// 保存用户个人资料
const saveUserProfile = async (callsign: string, profile: any) => {
  console.log(`开始保存用户资料: ${callsign}`);
  
  try {
    // 确保用户文件夹存在
    await createUserFolder(callsign);
    
    // 保存用户个人资料到文件 - 不进行压缩，避免登录问题
    const saveResult = await api.writeFile(`${BASE_PATH}/users/${callsign}/profile.json`, profile);
    if (!saveResult) {
      throw new Error('文件写入失败');
    }
    
    // 重新获取最新的文件系统索引
    const fs = await initFileSystem();
    
    // 确保用户条目存在
    if (!fs.users[callsign]) {
      fs.users[callsign] = {
        profile: null,
        applications: {},
        exams: {},
        activities: {},
        attachments: {}
      };
    }
    
    // 更新文件系统索引
    fs.users[callsign].profile = profile;
    await saveFileSystemIndex(fs);
    
    console.log(`用户资料保存完成: ${callsign}`);
    
    // 验证保存是否成功 - 等待一小段时间确保文件写入完成
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 尝试读取刚保存的文件
    const savedProfile = await api.readFile(`${BASE_PATH}/users/${callsign}/profile.json`);
    if (!savedProfile) {
      throw new Error('保存后无法读取用户文件，可能是文件系统权限问题');
    }
    
    // 清除相关缓存
    cacheService.delete(`user_profile_${callsign}`);
    cacheService.delete('all_users');
    
    console.log(`用户资料验证成功: ${callsign}`, savedProfile);
    return true;
    
  } catch (error) {
    console.error(`保存用户资料失败: ${callsign}`, error);
    throw error;
  }
};

// 保存用户
const saveUser = async (user: any) => {
  const callsign = user.callsign;
  await saveUserProfile(callsign, user);
  console.log(`用户 ${callsign} 的数据已保存`);
};

// 保存用户申请
const saveUserApplication = async (callsign: string, applicationId: string, application: any) => {
  const fs = await initFileSystem();
  
  if (!fs.users[callsign]) {
    await createUserFolder(callsign);
  }
  
  // 保存申请到文件
  await api.writeFile(`${BASE_PATH}/users/${callsign}/applications/${applicationId}.json`, application);
  
  // 更新文件系统索引
  fs.users[callsign].applications[applicationId] = application;
  await saveFileSystemIndex(fs);
  
  // 清除相关缓存
  cacheService.delete(`user_applications_${callsign}`);
  cacheService.delete('all_applications');
};

// 保存用户考试
const saveUserExam = async (callsign: string, examId: string, exam: any) => {
  const fs = await initFileSystem();
  
  if (!fs.users[callsign]) {
    await createUserFolder(callsign);
  }
  
  // 保存考试到文件
  await api.writeFile(`${BASE_PATH}/users/${callsign}/exams/${examId}.json`, exam);
  
  // 更新文件系统索引
  fs.users[callsign].exams[examId] = exam;
  await saveFileSystemIndex(fs);
  
  // 清除相关缓存
  cacheService.delete(`user_exams_${callsign}`);
  cacheService.delete('all_exams');
};

// 保存用户活动
const saveUserActivity = async (callsign: string, activityId: string, activity: any) => {
  const fs = await initFileSystem();
  
  if (!fs.users[callsign]) {
    await createUserFolder(callsign);
  }
  
  // 保存活动到文件
  await api.writeFile(`${BASE_PATH}/users/${callsign}/activities/${activityId}.json`, activity);
  
  // 更新文件系统索引
  fs.users[callsign].activities[activityId] = activity;
  await saveFileSystemIndex(fs);
  
  // 清除相关缓存
  cacheService.delete(`user_activities_${callsign}`);
  cacheService.delete('all_activities');
};

// 保存用户附件
const saveUserAttachment = async (callsign: string, attachmentId: string, attachment: Attachment) => {
  const fs = await initFileSystem();
  
  if (!fs.users[callsign]) {
    await createUserFolder(callsign);
  }
  
  // 保存附件到文件
  await api.writeFile(`${BASE_PATH}/users/${callsign}/attachments/${attachmentId}.json`, attachment);
  
  // 更新文件系统索引
  fs.users[callsign].attachments[attachmentId] = attachment;
  await saveFileSystemIndex(fs);
};

// 获取用户个人资料
const getUserProfile = async (callsign: string) => {
  try {
    // 使用缓存服务获取用户资料
    const cacheKey = `user_profile_${callsign}`;
    return await cacheService.getOrSet(cacheKey, async () => {
      console.log(`尝试读取用户资料: ${callsign}`);
      const profile = await api.readFile(`${BASE_PATH}/users/${callsign}/profile.json`);
      console.log(`用户资料读取结果: ${callsign}`, profile ? '成功' : '失败');
      return profile;
    }, 5 * 60 * 1000); // 缓存5分钟
  } catch (error) {
    console.error(`获取用户个人资料失败: ${callsign}`, error);
    return null;
  }
};

// 获取用户所有申请
const getUserApplications = async (callsign: string) => {
  try {
    // 使用缓存服务获取用户申请
    const cacheKey = `user_applications_${callsign}`;
    return await cacheService.getOrSet(cacheKey, async () => {
      const applications: Record<string, any> = {};
      const files = await api.listFiles(`${BASE_PATH}/users/${callsign}/applications`);
      
      // 使用Promise.all并行处理所有文件读取
      const readPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async (file) => {
          const applicationId = file.replace('.json', '');
          const application = await api.readFile(`${BASE_PATH}/users/${callsign}/applications/${file}`);
          return { applicationId, application };
        });
      
      // 等待所有读取操作完成
      const results = await Promise.all(readPromises);
      
      // 将结果整合到applications对象中
      results.forEach(({ applicationId, application }) => {
        if (application) {
          applications[applicationId] = application;
        }
      });
      
      return applications;
    }, 3 * 60 * 1000); // 缓存3分钟
  } catch (error) {
    console.error(`获取用户申请失败: ${callsign}`, error);
    return {};
  }
};

// 获取用户所有考试
const getUserExams = async (callsign: string) => {
  try {
    // 使用缓存服务获取用户考试
    const cacheKey = `user_exams_${callsign}`;
    return await cacheService.getOrSet(cacheKey, async () => {
      const exams: Record<string, any> = {};
      const files = await api.listFiles(`${BASE_PATH}/users/${callsign}/exams`);
      
      // 使用Promise.all并行处理所有文件读取
      const readPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async (file) => {
          const examId = file.replace('.json', '');
          const exam = await api.readFile(`${BASE_PATH}/users/${callsign}/exams/${file}`);
          return { examId, exam };
        });
      
      // 等待所有读取操作完成
      const results = await Promise.all(readPromises);
      
      // 将结果整合到exams对象中
      results.forEach(({ examId, exam }) => {
        if (exam) {
          exams[examId] = exam;
        }
      });
      
      return exams;
    }, 3 * 60 * 1000); // 缓存3分钟
  } catch (error) {
    console.error(`获取用户考试失败: ${callsign}`, error);
    return {};
  }
};

// 获取用户所有活动
const getUserActivities = async (callsign: string) => {
  try {
    // 使用缓存服务获取用户活动
    const cacheKey = `user_activities_${callsign}`;
    return await cacheService.getOrSet(cacheKey, async () => {
      const activities: Record<string, any> = {};
      const files = await api.listFiles(`${BASE_PATH}/users/${callsign}/activities`);
      
      // 使用Promise.all并行处理所有文件读取
      const readPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async (file) => {
          const activityId = file.replace('.json', '');
          const activity = await api.readFile(`${BASE_PATH}/users/${callsign}/activities/${file}`);
          return { activityId, activity };
        });
      
      // 等待所有读取操作完成
      const results = await Promise.all(readPromises);
      
      // 将结果整合到activities对象中
      results.forEach(({ activityId, activity }) => {
        if (activity) {
          activities[activityId] = activity;
        }
      });
      
      return activities;
    }, 3 * 60 * 1000); // 缓存3分钟
  } catch (error) {
    console.error(`获取用户活动失败: ${callsign}`, error);
    return {};
  }
};

// 获取用户所有附件
const getUserAttachments = async (callsign: string) => {
  try {
    const attachments: Record<string, Attachment> = {};
    const files = await api.listFiles(`${BASE_PATH}/users/${callsign}/attachments`);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const attachmentId = file.replace('.json', '');
        const attachment = await api.readFile(`${BASE_PATH}/users/${callsign}/attachments/${file}`);
        attachments[attachmentId] = attachment;
      }
    }
    
    return attachments;
  } catch (error) {
    console.error(`获取用户附件失败: ${callsign}`, error);
    return {};
  }
};

// 获取特定附件
const getUserAttachment = async (callsign: string, attachmentId: string) => {
  try {
    return await api.readFile(`${BASE_PATH}/users/${callsign}/attachments/${attachmentId}.json`);
  } catch (error) {
    console.error(`获取用户附件失败: ${callsign}/${attachmentId}`, error);
    return null;
  }
};

// 删除用户附件
const deleteUserAttachment = async (callsign: string, attachmentId: string) => {
  try {
    await api.deleteFile(`${BASE_PATH}/users/${callsign}/attachments/${attachmentId}.json`);
    
    // 更新文件系统索引
    const fs = await initFileSystem();
    if (fs.users[callsign]?.attachments[attachmentId]) {
      delete fs.users[callsign].attachments[attachmentId];
      await saveFileSystemIndex(fs);
    }
    
    return true;
  } catch (error) {
    console.error(`删除用户附件失败: ${callsign}/${attachmentId}`, error);
    return false;
  }
};

// 删除用户 - 真正删除
const deleteUser = async (callsign: string) => {
  try {
    console.log(`开始真正删除用户: ${callsign}`);
    
    // 删除用户整个目录（包括所有子目录和文件）
    const userDirPath = `${BASE_PATH}/users/${callsign}`;
    console.log(`删除用户目录: ${userDirPath}`);
    
    const deleteResult = await api.deleteFile(userDirPath);
    
    if (!deleteResult) {
      console.error(`删除用户目录失败: ${callsign}`);
      return false;
    }
    
    console.log(`用户目录删除成功: ${callsign}`);
    
    // 然后更新文件系统索引，从索引中移除用户
    const fs = await initFileSystem();
    if (fs.users[callsign]) {
      delete fs.users[callsign];
      await saveFileSystemIndex(fs);
      console.log(`已从索引中移除用户: ${callsign}`);
    }
    
    console.log(`用户 ${callsign} 已被完全删除`);
    return true;
  } catch (error) {
    console.error(`删除用户失败: ${callsign}`, error);
    return false;
  }
};

// 获取所有用户
const getAllUsers = async () => {
  try {
    // 使用缓存服务获取所有用户
    const cacheKey = 'all_users';
    return await cacheService.getOrSet(cacheKey, async () => {
      const fs = await initFileSystem();
      const users: any[] = [];
      
      // 使用Promise.all并行获取所有用户资料
      const userPromises = Object.keys(fs.users).map(async (callsign) => {
        const profile = await getUserProfile(callsign);
        return profile;
      });
      
      // 等待所有获取操作完成
      const profiles = await Promise.all(userPromises);
      
      // 过滤掉null值并返回结果
      return profiles.filter(profile => profile !== null);
    }, 2 * 60 * 1000); // 缓存2分钟
  } catch (error) {
    console.error('获取所有用户失败', error);
    return [];
  }
};

// 获取所有申请
const getAllApplications = async () => {
  try {
    // 使用缓存服务获取所有申请
    const cacheKey = 'all_applications';
    return await cacheService.getOrSet(cacheKey, async () => {
      const fs = await initFileSystem();
      const applications: any[] = [];
      
      // 使用Promise.all并行获取所有用户的申请
      const appPromises = Object.keys(fs.users).map(async (callsign) => {
        const userApps = await getUserApplications(callsign);
        
        // 将用户的申请转换为数组，并添加callsign字段
        return Object.keys(userApps).map(appId => ({
          ...userApps[appId],
          callsign
        }));
      });
      
      // 等待所有获取操作完成
      const appArrays = await Promise.all(appPromises);
      
      // 将二维数组扁平化为一维数组
      return appArrays.flat();
    }, 2 * 60 * 1000); // 缓存2分钟
  } catch (error) {
    console.error('获取所有申请失败', error);
    return [];
  }
};

// 获取所有考试
const getAllExams = async () => {
  try {
    // 使用缓存服务获取所有考试
    const cacheKey = 'all_exams';
    return await cacheService.getOrSet(cacheKey, async () => {
      const fs = await initFileSystem();
      
      // 使用Promise.all并行获取所有用户的考试
      const examPromises = Object.keys(fs.users).map(async (callsign) => {
        const userExams = await getUserExams(callsign);
        
        // 将用户的考试转换为数组，并添加callsign字段
        return Object.keys(userExams).map(examId => ({
          ...userExams[examId],
          callsign
        }));
      });
      
      // 等待所有获取操作完成
      const examArrays = await Promise.all(examPromises);
      
      // 将二维数组扁平化为一维数组
      return examArrays.flat();
    }, 2 * 60 * 1000); // 缓存2分钟
  } catch (error) {
    console.error('获取所有考试失败', error);
    return [];
  }
};

// 获取所有活动
const getAllActivities = async () => {
  try {
    // 使用缓存服务获取所有活动
    const cacheKey = 'all_activities';
    return await cacheService.getOrSet(cacheKey, async () => {
      const fs = await initFileSystem();
      
      // 使用Promise.all并行获取所有用户的活动
      const activityPromises = Object.keys(fs.users).map(async (callsign) => {
        const userActivities = await getUserActivities(callsign);
        
        // 将用户的活动转换为数组，并添加callsign字段
        return Object.keys(userActivities).map(activityId => ({
          ...userActivities[activityId],
          callsign
        }));
      });
      
      // 等待所有获取操作完成
      const activityArrays = await Promise.all(activityPromises);
      
      // 将二维数组扁平化为一维数组
      return activityArrays.flat();
    }, 2 * 60 * 1000); // 缓存2分钟
  } catch (error) {
    console.error('获取所有活动失败', error);
    return [];
  }
};

// 清除所有数据
const clearAll = async () => {
  try {
    // 删除所有用户目录
    const fs = await initFileSystem();
    
    for (const callsign of Object.keys(fs.users)) {
      await api.deleteFile(`${BASE_PATH}/users/${callsign}`);
    }
    
    // 重置文件系统索引
    await api.writeFile(`${BASE_PATH}/index.json`, { users: {} });
    
    console.log('文件系统已清空');
    return true;
  } catch (error) {
    console.error('清除所有数据失败', error);
    return false;
  }
};

// 初始化文件系统
const initialize = async () => {
  console.log('初始化文件系统...');
  await initFileSystem();
  console.log('文件系统初始化完成');
};

export const fileSystem = {
  initialize,
  createUserFolder,
  getUserFolder,
  saveUser,
  saveUserProfile,
  saveUserApplication,
  saveUserExam,
  saveUserActivity,
  saveUserAttachment,
  getUserProfile,
  getUserApplications,
  getUserExams,
  getUserActivities,
  getUserAttachments,
  getUserAttachment,
  deleteUserAttachment,
  deleteUser,
  getAllUsers,
  getAllApplications,
  getAllExams,
  getAllActivities,
  clearAll
};