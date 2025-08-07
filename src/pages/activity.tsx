import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { activityApi } from '@/services/api';
// import { useNavigate } from 'react-router-dom';

export function ActivityPage() {
  const { user } = useAuth();
  // const navigate = useNavigate(); // 暂时注释掉未使用的变量
  const [formData, setFormData] = useState({
    activityCallsign: '',
    controlRoom: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userActivities, setUserActivities] = useState<any[]>([]);

  useEffect(() => {
    const loadUserActivities = async () => {
      if (!user) return;
      
      try {
        // 使用正确的API方法 getByUser 而不是 getUserActivities
        const activities = await activityApi.getByUser(user.callsign);
        setUserActivities(activities);
      } catch (error) {
        console.error('加载活动记录失败:', error);
      }
    };
    
    loadUserActivities();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // 按照API要求的格式传递参数
      await activityApi.create(user.callsign, {
        controlRoom: formData.controlRoom,
        activityCallsign: formData.activityCallsign,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime
      });
      
      // 重新加载活动记录
      const activities = await activityApi.getByUser(user.callsign);
      setUserActivities(activities);
      
      // 重置表单
      setFormData({
        activityCallsign: '',
        controlRoom: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      });
      
      alert('活动申请已提交！');
    } catch (error) {
      console.error('提交活动申请失败:', error);
      alert('提交活动申请失败，请重试！');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">待确认</span>;
      case 'confirmed':
        return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">已确认</span>;
      case 'completed':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">已完成</span>;
      default:
        return <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">未知</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">活动考核</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>申请活动</CardTitle>
            <CardDescription>
              请填写以下信息申请活动考核
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityCallsign">管制席位</Label>
                <Input 
                  id="activityCallsign"
                  name="activityCallsign"
                  placeholder="请输入管制席位呼号" 
                  value={formData.activityCallsign}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  例如：ZBAA_TWR, ZGGG_APP
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="controlRoom">申请席位</Label>
                <select 
                  id="controlRoom"
                  name="controlRoom"
                  value={formData.controlRoom}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">请选择申请席位</option>
                  <option value="TWR">塔台管制(TWR)</option>
                  <option value="GND">地面管制(GND)</option>
                  <option value="APP">进近管制(APP)</option>
                  <option value="CTR">区域管制(CTR)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredDate">期望日期</Label>
                <Input 
                  id="preferredDate"
                  name="preferredDate"
                  type="date" 
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredTime">期望时间</Label>
                <select 
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">请选择时间段</option>
                  <option value="14:00-17:00">下午 14:00-17:00</option>
                  <option value="19:00-22:00">晚上 19:00-22:00</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">备注信息</Label>
                <textarea 
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="如有特殊要求，请在此说明"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交申请'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>我的活动记录</CardTitle>
            <CardDescription>
              查看您的活动申请和结果
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userActivities.length > 0 ? (
              <div className="space-y-4">
                {userActivities.map(activity => (
                  <Card key={activity.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">
                            {activity.activityCallsign}
                          </span>
                        </div>
                        {getStatusBadge(activity.status)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>申请席位: {activity.controlRoom}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {activity.status === 'pending' 
                              ? `期望日期: ${activity.preferredDate}` 
                              : `活动日期: ${activity.activityDate || activity.preferredDate}`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {activity.status === 'pending' 
                              ? `期望时间: ${activity.preferredTime}` 
                              : `活动时间: ${activity.activityTime || activity.preferredTime}`}
                          </span>
                        </div>
                        
                        {activity.status === 'completed' && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="flex justify-between">
                              <span>考核结果:</span>
                              <span className={activity.result === 'pass' ? 'text-green-600' : 'text-red-600'}>
                                {activity.result === 'pass' ? '通过' : '未通过'}
                              </span>
                            </div>
                            {activity.permission && (
                              <div className="flex justify-between">
                                <span>获得权限:</span>
                                <span className="bg-gold/20 text-gold px-2 py-0.5 rounded font-medium">
                                  {activity.permission}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">暂无活动记录</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}