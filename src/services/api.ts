/**
 * API服务
 * 用于与后端进行交互
 */
import { fileSystem } from './file-system';
import { accountManager } from './account-manager';

// 用户类型
export interface User {
  id: string;
  callsign: string;
  name: string;
  email: string;
  password: string;
  role: 'applicant' | 'teacher' | 'admin';
  permissions: string[];
  status: 'active' | 'inactive' | 'pending';
  qq?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// 申请类型
export interface Application {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'S1' | 'S2' | 'S3' | 'C1' | 'C2' | 'C3';
  englishLevel: string;
  experience: string;
  reason: string;
  attachments?: string[];
  teacherCallsign?: string;
  teacherComment?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}

// 考试类型
export interface Exam {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'completed';
  examType: 'theory' | 'simulator';
  preferredDate: string;
  preferredTime: string;
  examDate?: string;
  examTime?: string;
  examRoom?: string;
  teacherCallsign?: string;
  result?: 'pass' | 'fail';
  score?: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

// 活动类型
export interface Activity {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'completed';
  controlRoom: string;
  activityCallsign: string;
  preferredDate: string;
  preferredTime: string;
  activityDate?: string;
  activityTime?: string;
  teacherCallsign?: string;
  result?: 'pass' | 'fail';
  permission?: string;
  comment?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

// 附件类型
export interface Attachment {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  content: string; // Base64编码的文件内容
  uploadedAt: string;
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// 确保存储已初始化
const ensureStorageInitialized = async () => {
  // 使用账号管理服务初始化系统
  await accountManager.initializeSystem();
};

// 用户API
const userApi = {
  // 获取所有用户
  getAll: async () => {
    await ensureStorageInitialized();
    const users = await fileSystem.getAllUsers();
    return users.filter(user => user !== null);
  },
  
  // 根据ID获取用户
  getById: async (id: string) => {
    await ensureStorageInitialized();
    const users = await fileSystem.getAllUsers();
    return users.find(user => user?.id === id) || null;
  },
  
  // 根据呼号获取用户
  getByCallsign: async (callsign: string) => {
    await ensureStorageInitialized();
    return await fileSystem.getUserProfile(callsign);
  },
  
  // 创建用户
  create: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('开始创建用户:', userData);
    await ensureStorageInitialized();
    
    // 检查呼号是否已存在
    try {
      const existingUser = await userApi.getByCallsign(userData.callsign);
      if (existingUser) {
        console.log('呼号已存在:', userData.callsign);
        throw new Error('呼号已存在');
      }
    } catch (error: unknown) {
      // 如果是因为用户不存在导致的错误，继续创建流程
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('呼号已存在')) {
        console.log('检查用户是否存在时出错，继续创建流程:', error);
      } else {
        throw error;
      }
    }
    
    // 创建新用户
    const newUser = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('准备保存新用户:', newUser);
    
    try {
      // 保存用户
      await fileSystem.saveUserProfile(userData.callsign, newUser);
      console.log('用户保存成功:', userData.callsign);
      
      // 验证用户是否真的保存成功
      const savedUser = await fileSystem.getUserProfile(userData.callsign);
      if (!savedUser) {
        throw new Error('用户保存失败，无法读取保存的用户数据');
      }
      
      console.log('用户创建并验证成功:', savedUser);
      return newUser;
    } catch (error: unknown) {
      console.error('保存用户时出错:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`用户创建失败: ${errorMessage}`);
    }
  },
  
  // 更新用户
  update: async (callsign: string, userData: Partial<User>) => {
    await ensureStorageInitialized();
    
    // 获取现有用户
    const existingUser = await userApi.getByCallsign(callsign);
    if (!existingUser) {
      throw new Error('用户不存在');
    }
    
    // 更新用户
    const updatedUser = {
      ...existingUser,
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    // 保存用户
    await fileSystem.saveUserProfile(callsign, updatedUser);
    
    return updatedUser;
  },
  
  // 更新用户角色
  updateRole: async (callsign: string, role: 'applicant' | 'teacher' | 'admin') => {
    await ensureStorageInitialized();
    
    // 获取现有用户
    const existingUser = await userApi.getByCallsign(callsign);
    if (!existingUser) {
      throw new Error('用户不存在');
    }
    
    // 更新用户角色
    const updatedUser = {
      ...existingUser,
      role,
      updatedAt: new Date().toISOString()
    };
    
    // 保存用户
    await fileSystem.saveUserProfile(callsign, updatedUser);
    
    return updatedUser;
  },
  
  // 删除用户
  delete: async (callsign: string) => {
    await ensureStorageInitialized();
    
    // 获取现有用户
    const existingUser = await userApi.getByCallsign(callsign);
    if (!existingUser) {
      throw new Error('用户不存在');
    }
    
    // 真正删除用户
    const result = await fileSystem.deleteUser(callsign);
    if (!result) {
      throw new Error('删除用户失败');
    }
    
    return true;
  },
  
  // 验证用户
  authenticate: async (callsign: string, password: string) => {
    await ensureStorageInitialized();
    
    console.log(`尝试验证用户: ${callsign}`);
    
    // 特殊处理管理员账户 - 不区分大小写
    if (callsign.toUpperCase() === 'ADMIN') {
      console.log('检测到管理员登录尝试，使用特殊处理');
      
      // 尝试重新初始化管理员账户
      try {
        await accountManager.initializeSystem();
        console.log('系统已重新初始化');
        
        // 如果是管理员账户，直接验证密码
        if (password === 'admin123') {
          console.log('管理员密码验证成功');
          
          // 返回管理员用户信息
          return {
            id: 'admin-id',
            callsign: 'ADMIN',
            name: '系统管理员',
            email: 'admin@skydream.com',
            role: 'admin',
            permissions: ['all'],
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
        }
      } catch (error) {
        console.error('重新初始化系统失败:', error);
      }
    }
    
    // 获取用户
    const user = await userApi.getByCallsign(callsign);
    
    console.log('找到用户:', user);
    
    if (!user) {
      console.log('用户不存在');
      return null;
    }
    
    // 验证密码
    if (user.password !== password) {
      console.log('密码不匹配');
      return null;
    }
    
    // 检查用户状态
    if (user.status !== 'active') {
      console.log('用户状态不是active');
      return null;
    }
    
    console.log('用户验证成功');
    
    // 更新最后登录时间
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 保存更新后的用户信息
    await fileSystem.saveUserProfile(callsign, updatedUser);
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = updatedUser;
    return userInfo;
  },
  
  // 修改密码
  changePassword: async (callsign: string, oldPassword: string, newPassword: string) => {
    await ensureStorageInitialized();
    
    // 验证用户
    const user = await userApi.authenticate(callsign, oldPassword);
    if (!user) {
      throw new Error('原密码不正确');
    }
    
    // 更新密码
    const fullUser = await userApi.getByCallsign(callsign);
    if (!fullUser) {
      throw new Error('用户不存在');
    }
    
    const updatedUser = {
      ...fullUser,
      password: newPassword,
      updatedAt: new Date().toISOString()
    };
    
    // 保存用户
    await fileSystem.saveUserProfile(callsign, updatedUser);
    
    return true;
  },
  
  // 清除所有账号
  clearAllAccounts: async () => {
    // 使用账号管理服务清除所有账号
    await accountManager.clearAllAccounts();
    return true;
  }
};

// 申请API
const applicationApi = {
  // 获取所有申请
  getAll: async () => {
    await ensureStorageInitialized();
    return await fileSystem.getAllApplications();
  },
  
  // 获取用户的所有申请
  getByUser: async (callsign: string) => {
    await ensureStorageInitialized();
    const applications = await fileSystem.getUserApplications(callsign);
    return Object.values(applications);
  },
  
  // 根据ID获取申请
  getById: async (id: string) => {
    await ensureStorageInitialized();
    const allApplications = await fileSystem.getAllApplications();
    return allApplications.find(app => app.id === id) || null;
  },
  
  // 创建申请
  create: async (callsign: string, applicationData: Omit<Application, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) => {
    await ensureStorageInitialized();
    
    // 获取用户
    const user = await userApi.getByCallsign(callsign);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 创建新申请
    const newApplication = {
      ...applicationData,
      id: generateId(),
      userId: user.id,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 保存申请
    await fileSystem.saveUserApplication(callsign, newApplication.id, newApplication);
    
    return newApplication;
  },
  
  // 更新申请
  update: async (id: string, applicationData: Partial<Application>) => {
    await ensureStorageInitialized();
    
    // 获取现有申请
    const allApplications = await fileSystem.getAllApplications();
    const existingApp = allApplications.find(app => app.id === id);
    
    if (!existingApp) {
      throw new Error('申请不存在');
    }
    
    // 获取用户呼号
    const users = await userApi.getAll();
    const user = users.find(u => u.id === existingApp.userId);
    
    if (!user) {
      throw new Error('申请关联的用户不存在');
    }
    
    // 更新申请
    const updatedApplication = {
      ...existingApp,
      ...applicationData,
      updatedAt: new Date().toISOString()
    };
    
    // 如果状态变为approved，添加approvedAt时间戳
    if (applicationData.status === 'approved' && existingApp.status !== 'approved') {
      updatedApplication.approvedAt = new Date().toISOString();
    }
    
    // 如果状态变为rejected，添加rejectedAt时间戳
    if (applicationData.status === 'rejected' && existingApp.status !== 'rejected') {
      updatedApplication.rejectedAt = new Date().toISOString();
    }
    
    // 保存申请
    await fileSystem.saveUserApplication(user.callsign, id, updatedApplication);
    
    return updatedApplication;
  },
  
  // 删除申请
  delete: async (id: string) => {
    await ensureStorageInitialized();
    
    // 获取现有申请
    const allApplications = await fileSystem.getAllApplications();
    const existingApp = allApplications.find(app => app.id === id);
    
    if (!existingApp) {
      throw new Error('申请不存在');
    }
    
    // 获取用户呼号
    const users = await userApi.getAll();
    const user = users.find(u => u.id === existingApp.userId);
    
    if (!user) {
      throw new Error('申请关联的用户不存在');
    }
    
    // 删除申请（将状态设置为rejected）
    const updatedApplication = {
      ...existingApp,
      status: 'rejected' as const,
      updatedAt: new Date().toISOString(),
      rejectedAt: new Date().toISOString()
    };
    
    // 保存申请
    await fileSystem.saveUserApplication(user.callsign, id, updatedApplication);
    
    return true;
  }
};

// 考试API
const examApi = {
  // 获取所有考试
  getAll: async () => {
    await ensureStorageInitialized();
    return await fileSystem.getAllExams();
  },
  
  // 获取用户的所有考试
  getByUser: async (callsign: string) => {
    await ensureStorageInitialized();
    const exams = await fileSystem.getUserExams(callsign);
    return Object.values(exams);
  },
  
  // 根据ID获取考试
  getById: async (id: string) => {
    await ensureStorageInitialized();
    const allExams = await fileSystem.getAllExams();
    return allExams.find(exam => exam.id === id) || null;
  },
  
  // 创建考试
  create: async (callsign: string, examData: Omit<Exam, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) => {
    await ensureStorageInitialized();
    
    // 获取用户
    const user = await userApi.getByCallsign(callsign);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 创建新考试
    const newExam = {
      ...examData,
      id: generateId(),
      userId: user.id,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 保存考试
    await fileSystem.saveUserExam(callsign, newExam.id, newExam);
    
    return newExam;
  },
  
  // 更新考试
  update: async (id: string, examData: Partial<Exam>) => {
    await ensureStorageInitialized();
    
    // 获取现有考试
    const allExams = await fileSystem.getAllExams();
    const existingExam = allExams.find(exam => exam.id === id);
    
    if (!existingExam) {
      throw new Error('考试不存在');
    }
    
    // 获取用户呼号
    const users = await userApi.getAll();
    const user = users.find(u => u.id === existingExam.userId);
    
    if (!user) {
      throw new Error('考试关联的用户不存在');
    }
    
    // 更新考试
    const updatedExam = {
      ...existingExam,
      ...examData,
      updatedAt: new Date().toISOString()
    };
    
    // 如果状态变为confirmed，添加confirmedAt时间戳
    if (examData.status === 'confirmed' && existingExam.status !== 'confirmed') {
      updatedExam.confirmedAt = new Date().toISOString();
    }
    
    // 如果状态变为completed，添加completedAt时间戳
    if (examData.status === 'completed' && existingExam.status !== 'completed') {
      updatedExam.completedAt = new Date().toISOString();
    }
    
    // 保存考试
    await fileSystem.saveUserExam(user.callsign, id, updatedExam);
    
    return updatedExam;
  },
  
  // 删除考试
  delete: async (id: string) => {
    await ensureStorageInitialized();
    
    // 获取现有考试
    const allExams = await fileSystem.getAllExams();
    const existingExam = allExams.find(exam => exam.id === id);
    
    if (!existingExam) {
      throw new Error('考试不存在');
    }
    
    // 获取用户呼号
    const users = await userApi.getAll();
    const user = users.find(u => u.id === existingExam.userId);
    
    if (!user) {
      throw new Error('考试关联的用户不存在');
    }
    
    // 删除考试（将状态设置为completed，结果设置为fail）
    const updatedExam = {
      ...existingExam,
      status: 'completed' as const,
      result: 'fail' as const,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    
    // 保存考试
    await fileSystem.saveUserExam(user.callsign, id, updatedExam);
    
    return true;
  }
};

// 活动API
const activityApi = {
  // 获取所有活动
  getAll: async () => {
    await ensureStorageInitialized();
    return await fileSystem.getAllActivities();
  },
  
  // 获取用户的所有活动
  getByUser: async (callsign: string) => {
    await ensureStorageInitialized();
    const activities = await fileSystem.getUserActivities(callsign);
    return Object.values(activities);
  },
  
  // 根据ID获取活动
  getById: async (id: string) => {
    await ensureStorageInitialized();
    const allActivities = await fileSystem.getAllActivities();
    return allActivities.find(activity => activity.id === id) || null;
  },
  
  // 创建活动
  create: async (callsign: string, activityData: Omit<Activity, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) => {
    await ensureStorageInitialized();
    
    // 获取用户
    const user = await userApi.getByCallsign(callsign);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 创建新活动
    const newActivity = {
      ...activityData,
      id: generateId(),
      userId: user.id,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 保存活动
    await fileSystem.saveUserActivity(callsign, newActivity.id, newActivity);
    
    return newActivity;
  },
  
  // 更新活动
  update: async (id: string, activityData: Partial<Activity>) => {
    await ensureStorageInitialized();
    
    // 获取现有活动
    const allActivities = await fileSystem.getAllActivities();
    const existingActivity = allActivities.find(activity => activity.id === id);
    
    if (!existingActivity) {
      throw new Error('活动不存在');
    }
    
    // 获取用户呼号
    const users = await userApi.getAll();
    const user = users.find(u => u.id === existingActivity.userId);
    
    if (!user) {
      throw new Error('活动关联的用户不存在');
    }
    
    // 更新活动
    const updatedActivity = {
      ...existingActivity,
      ...activityData,
      updatedAt: new Date().toISOString()
    };
    
    // 如果状态变为confirmed，添加confirmedAt时间戳
    if (activityData.status === 'confirmed' && existingActivity.status !== 'confirmed') {
      updatedActivity.confirmedAt = new Date().toISOString();
    }
    
    // 如果状态变为completed，添加completedAt时间戳
    if (activityData.status === 'completed' && existingActivity.status !== 'completed') {
      updatedActivity.completedAt = new Date().toISOString();
    }
    
    // 保存活动
    await fileSystem.saveUserActivity(user.callsign, id, updatedActivity);
    
    return updatedActivity;
  },
  
  // 删除活动
  delete: async (id: string) => {
    await ensureStorageInitialized();
    
    // 获取现有活动
    const allActivities = await fileSystem.getAllActivities();
    const existingActivity = allActivities.find(activity => activity.id === id);
    
    if (!existingActivity) {
      throw new Error('活动不存在');
    }
    
    // 获取用户呼号
    const users = await userApi.getAll();
    const user = users.find(u => u.id === existingActivity.userId);
    
    if (!user) {
      throw new Error('活动关联的用户不存在');
    }
    
    // 删除活动（将状态设置为completed，结果设置为fail）
    const updatedActivity = {
      ...existingActivity,
      status: 'completed' as const,
      result: 'fail' as const,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    
    // 保存活动
    await fileSystem.saveUserActivity(user.callsign, id, updatedActivity);
    
    return true;
  }
};

// 附件API
const attachmentApi = {
  // 获取用户的所有附件
  getByUser: async (callsign: string) => {
    await ensureStorageInitialized();
    const attachments = await fileSystem.getUserAttachments(callsign);
    return Object.values(attachments);
  },
  
  // 根据ID获取附件
  getById: async (callsign: string, id: string) => {
    await ensureStorageInitialized();
    return await fileSystem.getUserAttachment(callsign, id);
  },
  
  // 上传附件
  upload: async (callsign: string, file: { name: string, type: string, size: number, content: string }) => {
    await ensureStorageInitialized();
    
    // 获取用户
    const user = await userApi.getByCallsign(callsign);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 创建新附件
    const newAttachment = {
      id: generateId(),
      userId: user.id,
      name: file.name,
      type: file.type,
      size: file.size,
      content: file.content,
      uploadedAt: new Date().toISOString()
    };
    
    // 保存附件
    await fileSystem.saveUserAttachment(callsign, newAttachment.id, newAttachment);
    
    return newAttachment;
  },
  
  // 删除附件
  delete: async (callsign: string, id: string) => {
    await ensureStorageInitialized();
    return await fileSystem.deleteUserAttachment(callsign, id);
  }
};

// 确保存储已初始化
ensureStorageInitialized();

export {
  userApi,
  applicationApi,
  examApi,
  activityApi,
  attachmentApi
};