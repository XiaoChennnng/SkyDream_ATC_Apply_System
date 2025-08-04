/**
 * 征信系统API服务
 * 用于获取用户的征信信息
 */
import { userApi, applicationApi, examApi, activityApi, attachmentApi } from './api';

// 征信记录类型
export interface CreditRecord {
  id: string;
  userId: string;
  callsign: string;
  type: 'application' | 'exam' | 'activity';
  status: string;
  result?: string;
  date: string;
  details: any;
}

// 征信报告类型
export interface CreditReport {
  user: {
    callsign: string;
    name: string;
    email: string;
    qq?: string;
    phone?: string;
    permissions: string[];
    createdAt: string;
  };
  applications: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    records: CreditRecord[];
  };
  exams: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
    records: CreditRecord[];
  };
  activities: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
    records: CreditRecord[];
  };
  summary: {
    reliability: number; // 0-100，可靠性评分
    activityLevel: number; // 0-100，活跃度评分
    successRate: number; // 0-100，成功率评分
    overallScore: number; // 0-100，综合评分
  };
}

// 征信系统API
const creditApi = {
  // 获取用户的征信报告
  getUserReport: async (callsign: string): Promise<CreditReport> => {
    // 获取用户信息
    const user = await userApi.getByCallsign(callsign);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 如果是教员或管理员，不生成征信报告
    if (user.role === 'teacher' || user.role === 'admin') {
      throw new Error('不能为教员或管理员生成征信报告');
    }
    
    // 获取用户的申请记录
    const applications = await applicationApi.getByUser(callsign);
    const applicationRecords: CreditRecord[] = applications.map(app => ({
      id: app.id,
      userId: app.userId,
      callsign: user.callsign,
      type: 'application',
      status: app.status,
      result: app.status === 'approved' ? 'approved' : app.status === 'rejected' ? 'rejected' : undefined,
      date: app.createdAt,
      details: app
    }));
    
    // 获取用户的考试记录
    const exams = await examApi.getByUser(callsign);
    const examRecords: CreditRecord[] = exams.map(exam => ({
      id: exam.id,
      userId: exam.userId,
      callsign: user.callsign,
      type: 'exam',
      status: exam.status,
      result: exam.result,
      date: exam.createdAt,
      details: exam
    }));
    
    // 获取用户的活动记录
    const activities = await activityApi.getByUser(callsign);
    const activityRecords: CreditRecord[] = activities.map(activity => ({
      id: activity.id,
      userId: activity.userId,
      callsign: user.callsign,
      type: 'activity',
      status: activity.status,
      result: activity.result,
      date: activity.createdAt,
      details: activity
    }));
    
    // 计算申请统计数据
    const appTotal = applications.length;
    const appApproved = applications.filter(app => app.status === 'approved').length;
    const appRejected = applications.filter(app => app.status === 'rejected').length;
    const appPending = applications.filter(app => app.status === 'pending').length;
    
    // 计算考试统计数据
    const examTotal = exams.length;
    const examPassed = exams.filter(exam => exam.result === 'pass').length;
    const examFailed = exams.filter(exam => exam.result === 'fail').length;
    const examPending = exams.filter(exam => exam.status !== 'completed').length;
    
    // 计算活动统计数据
    const activityTotal = activities.length;
    const activityPassed = activities.filter(activity => activity.result === 'pass').length;
    const activityFailed = activities.filter(activity => activity.result === 'fail').length;
    const activityPending = activities.filter(activity => activity.status !== 'completed').length;
    
    // 计算评分
    // 可靠性评分：基于申请和考试的完成率
    const totalEvents = appTotal + examTotal + activityTotal;
    const completedEvents = (appApproved + appRejected) + (examPassed + examFailed) + (activityPassed + activityFailed);
    const reliability = totalEvents > 0 ? Math.min(100, Math.round((completedEvents / totalEvents) * 100)) : 50;
    
    // 活跃度评分：基于总事件数和最近活动
    const activityLevel = Math.min(100, Math.round((totalEvents / 10) * 100));
    
    // 成功率评分：基于通过的考试和活动比例
    const totalCompletedExamsAndActivities = examPassed + examFailed + activityPassed + activityFailed;
    const successfulEvents = examPassed + activityPassed;
    const successRate = totalCompletedExamsAndActivities > 0 
      ? Math.round((successfulEvents / totalCompletedExamsAndActivities) * 100)
      : 50;
    
    // 综合评分：三个评分的加权平均
    const overallScore = Math.round((reliability * 0.4) + (activityLevel * 0.3) + (successRate * 0.3));
    
    // 构建征信报告
    const report: CreditReport = {
      user: {
        callsign: user.callsign,
        name: user.name,
        email: user.email,
        qq: user.qq,
        phone: user.phone,
        permissions: user.permissions,
        createdAt: user.createdAt
      },
      applications: {
        total: appTotal,
        approved: appApproved,
        rejected: appRejected,
        pending: appPending,
        records: applicationRecords
      },
      exams: {
        total: examTotal,
        passed: examPassed,
        failed: examFailed,
        pending: examPending,
        records: examRecords
      },
      activities: {
        total: activityTotal,
        passed: activityPassed,
        failed: activityFailed,
        pending: activityPending,
        records: activityRecords
      },
      summary: {
        reliability,
        activityLevel,
        successRate,
        overallScore
      }
    };
    
    return report;
  },
  
  // 获取所有用户的征信报告
  getAllReports: async (): Promise<CreditReport[]> => {
    // 获取所有用户
    const users = await userApi.getAll();
    
    // 过滤出申请者用户
    const applicants = users.filter(user => user.role === 'applicant');
    
    // 获取每个用户的征信报告
    const reports: CreditReport[] = [];
    for (const user of applicants) {
      try {
        const report = await creditApi.getUserReport(user.callsign);
        reports.push(report);
      } catch (error) {
        console.error(`获取用户 ${user.callsign} 的征信报告失败:`, error);
      }
    }
    
    return reports;
  }
};

export { creditApi };