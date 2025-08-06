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

// API服务器地址
const API_BASE_URL = 'http://localhost:3001';

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
      await axios.post(`${API_BASE_URL}/api/fs/write`, { path, data });
      return true;
    } catch (error) {
      console.error(`写入文件失败: ${path}`, error);
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
  const fs = await initFileSystem();
  
  if (!fs.users[callsign]) {
    await createUserFolder(callsign);
  }
  
  // 保存用户个人资料到文件
  await api.writeFile(`${BASE_PATH}/users/${callsign}/profile.json`, profile);
  
  // 更新文件系统索引
  fs.users[callsign].profile = profile;
  await saveFileSystemIndex(fs);
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
    return await api.readFile(`${BASE_PATH}/users/${callsign}/profile.json`);
  } catch (error) {
    console.error(`获取用户个人资料失败: ${callsign}`, error);
    return null;
  }
};

// 获取用户所有申请
const getUserApplications = async (callsign: string) => {
  try {
    const applications: Record<string, any> = {};
    const files = await api.listFiles(`${BASE_PATH}/users/${callsign}/applications`);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const applicationId = file.replace('.json', '');
        const application = await api.readFile(`${BASE_PATH}/users/${callsign}/applications/${file}`);
        applications[applicationId] = application;
      }
    }
    
    return applications;
  } catch (error) {
    console.error(`获取用户申请失败: ${callsign}`, error);
    return {};
  }
};

// 获取用户所有考试
const getUserExams = async (callsign: string) => {
  try {
    const exams: Record<string, any> = {};
    const files = await api.listFiles(`${BASE_PATH}/users/${callsign}/exams`);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const examId = file.replace('.json', '');
        const exam = await api.readFile(`${BASE_PATH}/users/${callsign}/exams/${file}`);
        exams[examId] = exam;
      }
    }
    
    return exams;
  } catch (error) {
    console.error(`获取用户考试失败: ${callsign}`, error);
    return {};
  }
};

// 获取用户所有活动
const getUserActivities = async (callsign: string) => {
  try {
    const activities: Record<string, any> = {};
    const files = await api.listFiles(`${BASE_PATH}/users/${callsign}/activities`);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const activityId = file.replace('.json', '');
        const activity = await api.readFile(`${BASE_PATH}/users/${callsign}/activities/${file}`);
        activities[activityId] = activity;
      }
    }
    
    return activities;
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

// 删除用户
const deleteUser = async (callsign: string) => {
  try {
    // 删除用户目录下的所有文件
    await api.deleteFile(`${BASE_PATH}/users/${callsign}/profile.json`);
    
    // 删除用户的申请、考试、活动和附件目录
    const applicationFiles = await api.listFiles(`${BASE_PATH}/users/${callsign}/applications`);
    for (const file of applicationFiles) {
      await api.deleteFile(`${BASE_PATH}/users/${callsign}/applications/${file}`);
    }
    
    const examFiles = await api.listFiles(`${BASE_PATH}/users/${callsign}/exams`);
    for (const file of examFiles) {
      await api.deleteFile(`${BASE_PATH}/users/${callsign}/exams/${file}`);
    }
    
    const activityFiles = await api.listFiles(`${BASE_PATH}/users/${callsign}/activities`);
    for (const file of activityFiles) {
      await api.deleteFile(`${BASE_PATH}/users/${callsign}/activities/${file}`);
    }
    
    const attachmentFiles = await api.listFiles(`${BASE_PATH}/users/${callsign}/attachments`);
    for (const file of attachmentFiles) {
      await api.deleteFile(`${BASE_PATH}/users/${callsign}/attachments/${file}`);
    }
    
    // 删除用户目录
    await api.deleteFile(`${BASE_PATH}/users/${callsign}/applications`);
    await api.deleteFile(`${BASE_PATH}/users/${callsign}/exams`);
    await api.deleteFile(`${BASE_PATH}/users/${callsign}/activities`);
    await api.deleteFile(`${BASE_PATH}/users/${callsign}/attachments`);
    await api.deleteFile(`${BASE_PATH}/users/${callsign}`);
    
    // 更新文件系统索引
    const fs = await initFileSystem();
    if (fs.users[callsign]) {
      delete fs.users[callsign];
      await saveFileSystemIndex(fs);
    }
    
    console.log(`用户 ${callsign} 已被删除`);
    return true;
  } catch (error) {
    console.error(`删除用户失败: ${callsign}`, error);
    return false;
  }
};

// 获取所有用户
const getAllUsers = async () => {
  try {
    const fs = await initFileSystem();
    const users: any[] = [];
    
    for (const callsign of Object.keys(fs.users)) {
      const profile = await getUserProfile(callsign);
      if (profile) {
        users.push(profile);
      }
    }
    
    return users;
  } catch (error) {
    console.error('获取所有用户失败', error);
    return [];
  }
};

// 获取所有申请
const getAllApplications = async () => {
  try {
    const fs = await initFileSystem();
    const applications: any[] = [];
    
    for (const callsign of Object.keys(fs.users)) {
      const userApps = await getUserApplications(callsign);
      
      for (const appId of Object.keys(userApps)) {
        applications.push({
          ...userApps[appId],
          callsign
        });
      }
    }
    
    return applications;
  } catch (error) {
    console.error('获取所有申请失败', error);
    return [];
  }
};

// 获取所有考试
const getAllExams = async () => {
  try {
    const fs = await initFileSystem();
    const exams: any[] = [];
    
    for (const callsign of Object.keys(fs.users)) {
      const userExams = await getUserExams(callsign);
      
      for (const examId of Object.keys(userExams)) {
        exams.push({
          ...userExams[examId],
          callsign
        });
      }
    }
    
    return exams;
  } catch (error) {
    console.error('获取所有考试失败', error);
    return [];
  }
};

// 获取所有活动
const getAllActivities = async () => {
  try {
    const fs = await initFileSystem();
    const activities: any[] = [];
    
    for (const callsign of Object.keys(fs.users)) {
      const userActivities = await getUserActivities(callsign);
      
      for (const activityId of Object.keys(userActivities)) {
        activities.push({
          ...userActivities[activityId],
          callsign
        });
      }
    }
    
    return activities;
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

export const fileSystem = {
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
