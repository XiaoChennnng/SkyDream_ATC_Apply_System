import { v4 as uuidv4 } from 'uuid';
import { fileSystem } from './file-system';
import { User } from './api';

// 账号管理服务
class AccountManager {
  // 初始化系统
  async initializeSystem(): Promise<void> {
    try {
      // 检查是否已经有用户
      const users = await fileSystem.getAllUsers();
      
      // 如果没有用户，创建默认管理员账号
      if (users.length === 0) {
        console.log('系统中没有用户，创建默认管理员账号');
        await this.createAdminAccount('admin', '系统管理员', 'admin123');
      }
    } catch (error) {
      console.error('初始化系统失败:', error);
    }
  }

  // 清除所有账号
  async clearAllAccounts(): Promise<void> {
    try {
      // 清除所有数据
      await fileSystem.clearAll();
      console.log('所有账号已清除');
      
      // 重新初始化系统，创建默认管理员账号
      await this.initializeSystem();
    } catch (error) {
      console.error('清除账号失败:', error);
      throw new Error('清除账号失败');
    }
  }

  // 创建管理员账号
  async createAdminAccount(callsign: string, name: string, password: string): Promise<User> {
    try {
      // 创建管理员用户
      const adminUser: User = {
        id: uuidv4(),
        callsign: callsign.toUpperCase(),
        name,
        email: `${callsign.toLowerCase()}@skydream.com`,
        password,
        role: 'admin',
        status: 'active',
        permissions: ['all'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 为用户创建文件夹
      await fileSystem.createUserFolder(adminUser.callsign);

      // 保存用户数据
      await fileSystem.saveUser(adminUser);

      console.log(`管理员账号 ${adminUser.callsign} 创建成功`);
      return adminUser;
    } catch (error) {
      console.error('创建管理员账号失败:', error);
      throw new Error('创建管理员账号失败');
    }
  }

  // 创建教员账号
  async createTeacherAccount(callsign: string, name: string, password: string): Promise<User> {
    try {
      // 创建教员用户
      const teacherUser: User = {
        id: uuidv4(),
        callsign: callsign.toUpperCase(),
        name,
        email: `${callsign.toLowerCase()}@skydream.com`,
        password,
        role: 'teacher',
        status: 'active',
        permissions: ['teach'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 为用户创建文件夹
      await fileSystem.createUserFolder(teacherUser.callsign);

      // 保存用户数据
      await fileSystem.saveUser(teacherUser);

      console.log(`教员账号 ${teacherUser.callsign} 创建成功`);
      return teacherUser;
    } catch (error) {
      console.error('创建教员账号失败:', error);
      throw new Error('创建教员账号失败');
    }
  }

  // 创建申请者账号
  async createApplicantAccount(userData: {
    callsign: string;
    name: string;
    email: string;
    password: string;
    qq?: string;
    phone?: string;
  }): Promise<User> {
    try {
      // 创建申请者用户
      const applicantUser: User = {
        id: uuidv4(),
        callsign: userData.callsign.toUpperCase(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        qq: userData.qq,
        phone: userData.phone,
        role: 'applicant',
        status: 'active',
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 为用户创建文件夹
      await fileSystem.createUserFolder(applicantUser.callsign);

      // 保存用户数据
      await fileSystem.saveUser(applicantUser);

      console.log(`申请者账号 ${applicantUser.callsign} 创建成功`);
      return applicantUser;
    } catch (error) {
      console.error('创建申请者账号失败:', error);
      throw new Error('创建申请者账号失败');
    }
  }
}

export const accountManager = new AccountManager();