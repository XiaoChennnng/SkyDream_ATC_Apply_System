import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { creditApi, CreditReport } from '@/services/credit-api';
import { useAuth } from '@/contexts/auth-context';

// 导入组件
import { UserList } from '@/components/credit/user-list';
import { OverviewTab } from '@/components/credit/overview-tab';
import { ApplicationsTab } from '@/components/credit/applications-tab';
import { ExamsTab } from '@/components/credit/exams-tab';
import { ActivitiesTab } from '@/components/credit/activities-tab';
import { ViolationsTab } from '@/components/credit/violations-tab';
import { exportReportToHtml } from '@/components/credit/html-exporter';

export function CreditSystemPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState<CreditReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CreditReport | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // 解析URL参数
  const parseUrlParams = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const userParam = searchParams.get('user');
    const tabParam = searchParams.get('tab');
    
    return { userParam, tabParam };
  }, [location.search]);
  
  // 更新URL参数
  const updateUrlParams = useCallback((callsign: string, tab: string) => {
    navigate(`/credit-system?user=${callsign}&tab=${tab}`, { replace: true });
  }, [navigate]);
  
  // 处理标签页变更
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (selectedReport) {
      updateUrlParams(selectedReport.user.callsign, value);
    }
  };
  
  // 处理用户选择
  const handleUserSelect = (report: CreditReport) => {
    setSelectedReport(report);
    updateUrlParams(report.user.callsign, activeTab);
  };
  
  // 加载所有征信报告
  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const allReports = await creditApi.getAllReports();
        setReports(allReports);
        
        // 处理URL参数
        const { userParam, tabParam } = parseUrlParams();
        
        // 如果URL中有用户参数，选择对应的用户
        if (userParam && allReports.length > 0) {
          const report = allReports.find(r => r.user.callsign === userParam);
          if (report) {
            setSelectedReport(report);
          }
        }
        
        // 如果URL中有标签页参数，切换到对应的标签页
        if (tabParam) {
          setActiveTab(tabParam);
        }
      } catch (error) {
        console.error('加载征信报告失败:', error);
        alert('加载征信报告失败，请重试！');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReports();
  }, [parseUrlParams]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 导出HTML
  const handleExportHtml = async () => {
    if (!selectedReport) return;
    
    try {
      // 在导出前重新获取最新的征信报告
      const latestReport = await creditApi.getUserReport(selectedReport.user.callsign);
      exportReportToHtml(latestReport, formatDate);
    } catch (error) {
      console.error('获取最新征信报告失败:', error);
      alert('导出失败，请重试！');
    }
  };

  // 获取状态标签样式
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已批准';
      case 'rejected':
        return '已拒绝';
      case 'pending':
        return '待处理';
      case 'confirmed':
        return '已确认';
      case 'completed':
        return '已完成';
      case 'pass':
        return '通过';
      case 'fail':
        return '未通过';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">征信系统</h1>
        {selectedReport && (
          <Button 
            variant="outline" 
            onClick={handleExportHtml}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            导出HTML
          </Button>
        )}
      </div>

      <div className="flex space-x-4">
        <UserList
          reports={reports}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedReport={selectedReport}
          setSelectedReport={handleUserSelect}
          isLoading={isLoading}
        />

        <div className="w-2/3">
          {selectedReport ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>征信报告 - {selectedReport.user.callsign}</CardTitle>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedReport.summary.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                    selectedReport.summary.overallScore >= 60 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    综合评分: {selectedReport.summary.overallScore}
                  </span>
                </div>
                <CardDescription>
                  用户: {selectedReport.user.name} | 注册时间: {formatDate(selectedReport.user.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid grid-cols-5 mb-6">
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    <TabsTrigger value="applications">申请记录</TabsTrigger>
                    <TabsTrigger value="exams">考试记录</TabsTrigger>
                    <TabsTrigger value="activities">活动记录</TabsTrigger>
                    <TabsTrigger value="violations">违规记录</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <OverviewTab report={selectedReport} formatDate={formatDate} />
                  </TabsContent>
                  
                  <TabsContent value="applications">
                    <ApplicationsTab 
                      report={selectedReport} 
                      formatDate={formatDate} 
                      getStatusBadgeClass={getStatusBadgeClass} 
                      getStatusText={getStatusText} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="exams">
                    <ExamsTab 
                      report={selectedReport} 
                      formatDate={formatDate} 
                      getStatusBadgeClass={getStatusBadgeClass} 
                      getStatusText={getStatusText} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="activities">
                    <ActivitiesTab 
                      report={selectedReport} 
                      formatDate={formatDate} 
                      getStatusBadgeClass={getStatusBadgeClass} 
                      getStatusText={getStatusText} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="violations">
                    <ViolationsTab 
                      report={selectedReport} 
                      formatDate={formatDate} 
                      getStatusBadgeClass={getStatusBadgeClass} 
                      getStatusText={getStatusText} 
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full border rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">请选择用户</h3>
                <p className="text-muted-foreground">从左侧列表中选择一个用户查看其征信报告</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}