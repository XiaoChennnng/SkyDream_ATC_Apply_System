/**
 * 违规信息API服务
 * 用于管理用户的违规记录
 */
import { v4 as uuidv4 } from 'uuid';
import { ViolationRecord } from './credit-api';
import { userApi } from './api';
import { readData, writeData } from '@/utils/data-utils';

// 违规信息API
const violationApi = {
  // 获取所有违规记录
  getAll: async (): Promise<ViolationRecord[]> => {
    try {
      const violations = await readData('violations.json') || [];
      return violations;
    } catch (error) {
      console.error('获取违规记录失败:', error);
      return [];
    }
  },
  
  // 获取指定用户的违规记录
  getByUser: async (callsign: string): Promise<ViolationRecord[]> => {
    try {
      const violations = await violationApi.getAll();
      return violations.filter(violation => violation.callsign === callsign);
    } catch (error) {
      console.error(`获取用户 ${callsign} 的违规记录失败:`, error);
      return [];
    }
  },
  
  // 添加违规记录
  addViolation: async (
    userCallsign: string, 
    title: string, 
    description: string, 
    severity: 'minor' | 'moderate' | 'severe',
    reporterCallsign: string
  ): Promise<ViolationRecord> => {
    try {
      // 验证用户是否存在
      const user = await userApi.getByCallsign(userCallsign);
      if (!user) {
        throw new Error('用户不存在');
      }
      
      // 验证报告人是否存在且是教员或管理员
      const reporter = await userApi.getByCallsign(reporterCallsign);
      if (!reporter) {
        throw new Error('报告人不存在');
      }
      
      if (reporter.role !== 'teacher' && reporter.role !== 'admin') {
        throw new Error('只有教员或管理员可以添加违规记录');
      }
      
      // 创建违规记录
      const violation: ViolationRecord = {
        id: uuidv4(),
        userId: user.id,
        callsign: user.callsign,
        title,
        description,
        severity,
        date: new Date().toISOString(),
        reportedBy: reporter.name,
        reporterCallsign: reporter.callsign
      };
      
      // 获取现有违规记录
      const violations = await violationApi.getAll();
      
      // 添加新记录
      violations.push(violation);
      
      // 保存到文件
      await writeData('violations.json', violations);
      
      return violation;
    } catch (error) {
      console.error('添加违规记录失败:', error);
      throw error;
    }
  },
  
  // 删除违规记录
  deleteViolation: async (violationId: string, userCallsign: string): Promise<boolean> => {
    try {
      // 验证用户是否是教员或管理员
      const user = await userApi.getByCallsign(userCallsign);
      if (!user) {
        throw new Error('用户不存在');
      }
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        throw new Error('只有教员或管理员可以删除违规记录');
      }
      
      // 获取现有违规记录
      const violations = await violationApi.getAll();
      
      // 找到要删除的记录索引
      const index = violations.findIndex(v => v.id === violationId);
      if (index === -1) {
        throw new Error('违规记录不存在');
      }
      
      // 删除记录
      violations.splice(index, 1);
      
      // 保存到文件
      await writeData('violations.json', violations);
      
      return true;
    } catch (error) {
      console.error('删除违规记录失败:', error);
      throw error;
    }
  }
};

export { violationApi };