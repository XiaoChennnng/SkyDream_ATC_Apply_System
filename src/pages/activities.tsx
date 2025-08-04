import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Activity, activityApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, FileText, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    activityCallsign: '',
    preferredDate: '',
    preferredTime: ''
  });

  // 获取用户的活动列表
  useEffect(() => {
    if (user) {
      const userActivities = activityApi.getByCallsign(user.callsign);
      setActivities(userActivities);
      setLoading(false);
    }
  }, [user]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 提交活动预约
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const newActivity = activityApi.create({
        callsign: user.callsign,
        ...formData
      });
      setActivities(prev => [...prev, newActivity]);
      setShowForm(false);
      setFormData({
        activityCallsign: '',
        preferredDate: '',
        preferredTime: ''
      });
    }
  };

  // 查看活动详情
  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  // 获取状态标签样式
  const getStatusBadgeClass = (status: Activity['status']) => {
    switch (status) {
      case '待确认':
        return 'status-badge status-pending';
      case '已确认':
        return 'status-badge status-approved';
      case '已完成':
        return 'status-badge status-completed';
      default:
        return 'status-badge';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case '待确认':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case '已确认':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case '已完成':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">活动考核管理</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建预约
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>新建活动考核预约</CardTitle>
                <CardDescription>
                  请填写以下信息以预约您的活动考核
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="activityCallsign" className="text-sm font-medium">
                      预计上管的呼号
                    </label>
                    <Input
                      id="activityCallsign"
                      name="activityCallsign"
                      type="text"
                      placeholder="例如：ZBAA_APP"
                      value={formData.activityCallsign}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredDate" className="text-sm font-medium">
                      期望日期
                    </label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredTime" className="text-sm font-medium">
                      期望时间段
                    </label>
                    <Input
                      id="preferredTime"
                      name="preferredTime"
                      type="text"
                      placeholder="例如：19:00-22:00"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                      取消
                    </Button>
                    <Button type="submit">
                      提交预约
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activities.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">暂无活动考核预约</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                您还没有预约过活动考核，点击"新建预约"按钮开始预约流程。
              </p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                新建预约
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map(activity => (
                <Card key={activity.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{activity.activityCallsign}</CardTitle>
                      <span className={getStatusBadgeClass(activity.status)}>
                        {activity.status}
                      </span>
                    </div>
                    <CardDescription>
                      预约日期: {activity.preferredDate} {activity.preferredTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {getStatusIcon(activity.status)}
                        <span className="ml-2">
                          {activity.status === '待确认' ? '正在等待教员确认' : 
                           activity.status === '已确认' ? `已确认，负责教员：${activity.teacherCallsign}` : 
                           activity.status === '已完成' ? '活动已完成' : ''}
                        </span>
                      </div>
                      {activity.result && (
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          <p className="font-medium">考核结果：{activity.result}</p>
                          {activity.permission && <p>获得权限：{activity.permission}</p>}
                        </div>
                      )}
                      {activity.teacherComment && (
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          <p className="font-medium">教员评语：</p>
                          <p>{activity.teacherComment}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleViewDetails(activity)}>
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* 活动详情对话框 */}
          <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>活动考核详情</DialogTitle>
                <DialogDescription>
                  活动考核的详细信息
                </DialogDescription>
              </DialogHeader>
              {selectedActivity && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">活动呼号</h4>
                      <p className="text-base">{selectedActivity.activityCallsign}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">状态</h4>
                      <p className="text-base">
                        <span className={getStatusBadgeClass(selectedActivity.status)}>
                          {selectedActivity.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">预约日期</h4>
                      <p className="text-base">{selectedActivity.preferredDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">预约时间</h4>
                      <p className="text-base">{selectedActivity.preferredTime || '未指定'}</p>
                    </div>
                  </div>

                  {selectedActivity.teacherCallsign && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">负责教员</h4>
                      <p className="text-base">{selectedActivity.teacherCallsign}</p>
                    </div>
                  )}

                  {selectedActivity.result && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">考核结果</h4>
                      <p className="text-base">{selectedActivity.result}</p>
                    </div>
                  )}

                  {selectedActivity.permission && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">获得权限</h4>
                      <p className="text-base">{selectedActivity.permission}</p>
                    </div>
                  )}

                  {selectedActivity.teacherComment && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">教员评语</h4>
                      <p className="text-base whitespace-pre-wrap">{selectedActivity.teacherComment}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">创建时间</h4>
                      <p className="text-base">{new Date(selectedActivity.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">更新时间</h4>
                      <p className="text-base">{new Date(selectedActivity.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <Button onClick={() => setSelectedActivity(null)}>关闭</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}