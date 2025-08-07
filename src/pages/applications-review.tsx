import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, FileText, CheckCircle, XCircle, User, Clock } from 'lucide-react';
import { applicationApi, userApi } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

export function ApplicationsReviewPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [applications, setApplications] = useState<{
    pending: any[];
    reviewed: any[];
  }>({
    pending: [],
    reviewed: []
  });
  const [applicationDetails, setApplicationDetails] = useState<Record<string, any>>({});
  const [reviewForm, setReviewForm] = useState({
    teacherCallsign: user?.callsign || '',
    status: 'approved',
    comment: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加载申请列表
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const allApplications = await applicationApi.getAll();
        
        const pending = allApplications.filter((app: any) => 
          app.status === 'pending' || !app.status
        );
        
        const reviewed = allApplications.filter((app: any) => 
          app.status === 'approved' || app.status === 'rejected'
        );
        
        setApplications({
          pending,
          reviewed
        });
        
        // 预加载申请详情
        const details: Record<string, any> = {};
        
        // 为每个申请获取用户详细信息
        for (const app of allApplications) {
          try {
            const userProfile = await userApi.getByCallsign(app.callsign);
            if (userProfile) {
              // 将用户信息添加到申请详情中
              details[app.id] = {
                ...app,
                userEmail: userProfile.email,
                userQQ: userProfile.qq,
                userName: userProfile.name
              };
            } else {
              details[app.id] = app;
            }
          } catch (error) {
            console.error(`获取用户信息失败: ${app.callsign}`, error);
            details[app.id] = app;
          }
        }
        
        setApplicationDetails(details);
      } catch (error) {
        console.error('加载申请列表失败:', error);
      }
    };
    
    loadApplications();
  }, []);

  // 处理搜索
  const filteredApplications = {
    pending: applications.pending.filter(app => 
      app.callsign?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    reviewed: applications.reviewed.filter(app => 
      app.callsign?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication) return;
    
    setIsSubmitting(true);
    
    try {
      const application = applicationDetails[selectedApplication];
      
      // 更新申请状态
      await applicationApi.update(selectedApplication, {
        ...application,
        status: reviewForm.status,
        teacherCallsign: reviewForm.teacherCallsign,
        comment: reviewForm.comment,
        reviewedAt: new Date().toISOString()
      });
      
      // 重新加载申请列表
      const allApplications = await applicationApi.getAll();
      const pending = allApplications.filter((app: any) => 
        app.status === 'pending' || !app.status
      );
      const reviewed = allApplications.filter((app: any) => 
        app.status === 'approved' || app.status === 'rejected'
      );
      
      setApplications({
        pending,
        reviewed
      });
      
      // 更新申请详情
      const details: Record<string, any> = {};
      allApplications.forEach((app: any) => {
        details[app.id] = app;
      });
      setApplicationDetails(details);
      
      // 重置表单
      setReviewForm({
        teacherCallsign: user?.callsign || '',
        status: 'approved',
        comment: '',
      });
      
      // 清除选中的申请
      setSelectedApplication(null);
      
      alert('审核已提交！');
    } catch (error) {
      console.error('提交审核失败:', error);
      alert('提交审核失败，请重试！');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">申请审核</h1>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'pending' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('pending')}
          >
            待审核
            {applications.pending.length > 0 && (
              <span className="ml-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {applications.pending.length}
              </span>
            )}
          </Button>
          <Button 
            variant={activeTab === 'reviewed' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('reviewed')}
          >
            已审核
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="w-1/3 space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="搜索申请者呼号..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {activeTab === 'pending' ? (
              filteredApplications.pending.length > 0 ? (
                filteredApplications.pending.map(app => (
                  <Card 
                    key={app.id} 
                    className={`cursor-pointer hover:border-primary transition-colors ${selectedApplication === app.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedApplication(app.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{app.callsign}</span>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          待审核
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>申请席位</span>
                          <span>{app.type}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>提交时间</span>
                          <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">暂无待审核申请</p>
                </div>
              )
            ) : (
              filteredApplications.reviewed.length > 0 ? (
                filteredApplications.reviewed.map(app => (
                  <Card 
                    key={app.id} 
                    className={`cursor-pointer hover:border-primary transition-colors ${selectedApplication === app.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedApplication(app.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{app.callsign}</span>
                        </div>
                        <span className={`text-xs ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        } px-2 py-0.5 rounded-full`}>
                          {app.status === 'approved' ? '已通过' : '已拒绝'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>申请席位</span>
                          <span>{app.type}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>审核时间</span>
                          <span>{app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : '未知'}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>审核教员</span>
                          <span>{app.teacherCallsign || '未知'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">暂无已审核申请</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="w-2/3">
          {selectedApplication && applicationDetails[selectedApplication] ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>申请详情</CardTitle>
                  <span className={`text-xs ${
                    !applicationDetails[selectedApplication].status || applicationDetails[selectedApplication].status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : applicationDetails[selectedApplication].status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  } px-2 py-0.5 rounded-full`}>
                    {!applicationDetails[selectedApplication].status || applicationDetails[selectedApplication].status === 'pending'
                      ? '待审核'
                      : applicationDetails[selectedApplication].status === 'approved'
                      ? '已通过'
                      : '已拒绝'}
                  </span>
                </div>
                <CardDescription>
                  申请者呼号: {applicationDetails[selectedApplication].callsign}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">申请席位</p>
                    <p>{applicationDetails[selectedApplication].type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">提交时间</p>
                    <p>{new Date(applicationDetails[selectedApplication].createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">英语水平</p>
                    <p>{applicationDetails[selectedApplication].englishLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">是否有管制经验</p>
                    <p>{applicationDetails[selectedApplication].experience ? '是' : '否'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">电子邮箱</p>
                    <p>{applicationDetails[selectedApplication].userEmail || '未提供'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">QQ号码</p>
                    <p>{applicationDetails[selectedApplication].userQQ || '未提供'}</p>
                  </div>
                </div>

                {applicationDetails[selectedApplication].hasExperience && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">管制经验详情</p>
                    <p className="bg-muted p-3 rounded-md text-sm">
                      {applicationDetails[selectedApplication].experienceDetails}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">申请理由</p>
                  <p className="bg-muted p-3 rounded-md text-sm">
                    {applicationDetails[selectedApplication].reason || applicationDetails[selectedApplication].applicationReason || '未填写'}
                  </p>
                </div>

                {applicationDetails[selectedApplication].attachments && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      查看上传文件
                    </Button>
                  </div>
                )}

                {(!applicationDetails[selectedApplication].status || applicationDetails[selectedApplication].status === 'pending') && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">审核决定</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">教员呼号 *</label>
                        <Input 
                          name="teacherCallsign"
                          placeholder="请输入您的教员呼号" 
                          value={reviewForm.teacherCallsign}
                          onChange={handleReviewChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">教员评语 *</label>
                        <textarea 
                          name="comment"
                          value={reviewForm.comment}
                          onChange={handleReviewChange}
                          rows={3}
                          required
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                          placeholder="请输入对申请者的评语和建议"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          评语将发送给申请者，请提供有建设性的反馈
                        </p>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button 
                          type="button"
                          onClick={(e) => {
                            setReviewForm(prev => ({ ...prev, status: 'approved' }));
                            handleReviewSubmit(e);
                          }}
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && reviewForm.status === 'approved' ? (
                            '提交中...'
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              通过申请
                            </>
                          )}
                        </Button>
                        <Button 
                          type="button"
                          onClick={(e) => {
                            setReviewForm(prev => ({ ...prev, status: 'rejected' }));
                            handleReviewSubmit(e);
                          }}
                          variant="destructive"
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && reviewForm.status === 'rejected' ? (
                            '提交中...'
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              拒绝申请
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {applicationDetails[selectedApplication].status && applicationDetails[selectedApplication].status !== 'pending' && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">审核信息</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">审核结果</p>
                        <p className={applicationDetails[selectedApplication].status === 'approved' ? 'text-green-600' : 'text-red-600'}>
                          {applicationDetails[selectedApplication].status === 'approved' ? '通过' : '拒绝'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">审核教员</p>
                        <p>{applicationDetails[selectedApplication].teacherCallsign || '未知'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">审核时间</p>
                        <p>{applicationDetails[selectedApplication].reviewedAt ? new Date(applicationDetails[selectedApplication].reviewedAt).toLocaleString() : '未知'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">教员评语</p>
                        <p className="bg-muted p-3 rounded-md text-sm">
                          {applicationDetails[selectedApplication].comment || '无评语'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg border-dashed p-12">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">选择申请进行审核</h3>
                <p className="text-muted-foreground">
                  从左侧列表中选择一个申请进行审核
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationsReviewPage;