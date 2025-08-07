import { createContext, useState, useEffect, ReactNode } from 'react';
import { userApi } from '@/services/api';

export interface User {
  id: string;
  callsign: string;
  name: string;
  email: string;
  role: 'applicant' | 'teacher' | 'admin';
  permissions: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  qq?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (callsign: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

// 创建上下文
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // 在组件挂载时从localStorage恢复用户会话
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('已从localStorage恢复用户会话:', parsedUser);
      } catch (error) {
        console.error('解析存储的用户数据时出错:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // 登录函数
  const login = async (callsign: string, password: string): Promise<boolean> => {
    try {
      console.log('尝试登录:', callsign);
      const authenticatedUser = await userApi.authenticate(callsign, password);
      
      if (authenticatedUser) {
        console.log('登录成功:', authenticatedUser);
        setUser(authenticatedUser);
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        return true;
      } else {
        console.log('登录失败: 用户名或密码错误');
        return false;
      }
    } catch (error) {
      console.error('登录过程中出错:', error);
      return false;
    }
  };

  // 注销函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    console.log('用户已注销');
  };

  // 注册函数
  const register = async (userData: any, password: string): Promise<boolean> => {
    try {
      const newUser = await userApi.create({
        ...userData,
        password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      });
      
      console.log('注册成功:', newUser);
      return true;
    } catch (error) {
      console.error('注册过程中出错:', error);
      return false;
    }
  };

  // 更新个人资料
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // 使用callsign而不是id
      const updatedUser = await userApi.update(user.callsign, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log('个人资料已更新:', updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新个人资料时出错:', error);
      return false;
    }
  };

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // 使用正确的API调用方式，提供三个参数：callsign, oldPassword, newPassword
      const success = await userApi.changePassword(user.callsign, oldPassword, newPassword);
      
      if (success) {
        console.log('密码已修改');
        return true;
      }
      return false;
    } catch (error) {
      console.error('修改密码时出错:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}