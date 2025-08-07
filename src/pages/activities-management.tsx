import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { activityApi } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';
import { ActivityList } from '@/components/activities/activity-list';
import { ActivityDetail } from '@/components/activities/activity-detail';
import { ConfirmForm } from '@/components/activities/confirm-form';
import { EvaluationForm } from '@/components/activities/evaluation-form';

export function ActivitiesManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('pending');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [activities, setActivities] = useState<{
    pending: any[];
    confirmed: any[];
    completed: any[];
  }>({
    pending: [],
    confirmed: [],
    completed: []
  });
  const [activityDetails, setActivityDetails] = useState<Record<string, any>>({});
  const [confirmForm, setConfirmForm] = useState({
    teacherCallsign: user?.callsign || '',
    activityDate: '',
    activityTime: '',
    activityCallsign: '',
    notes: '',
    action: 'confirm' as 'confirm' | 'reject'
  });
  const [evaluationForm, setEvaluationForm] = useState({
    teacherCallsign: user?.callsign || '',
    result: 'pass',
    permission: 'S1',
    comment: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加载活动列表
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const allActivities = await activityApi.getAll();
        
        const pending = allActivities.filter((activity: any) => 
          activity.status === 'pending' || !activity.status
        );
        
        const confirmed = allActivities.filter((activity: any) => 
          activity.status === 'confirmed'
        );
        
        const completed = allActivities.filter((activity: any) => 
          activity.status === 'completed'
        );
        
        setActivities({
          pending,
          confirmed,
          completed
        });
        
        // 预加载活动详情
        const details: Record<string, any> = {};
        allActivities.forEach((activity: any) => {
          details[activity.id] = activity;
        });
        setActivityDetails(details);
      } catch (error) {
        console.error('加载活动列表失败:', error);
      }
    };
    
    loadActivities();
  }, []);

  // 处理搜索
  const filteredActivities = {
    pending: activities.pending.filter(activity => 
      activity.callsign?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    confirmed: activities.confirmed.filter(activity => 
      activity.callsign?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    completed: activities.completed.filter(activity => 
      activity.callsign?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  // 当选择活动时，初始化表单数据
  useEffect(() => {
    if (selectedActivity && activityDetails[selectedActivity]) {
      const activity = activityDetails[selectedActivity];
      
      // 初始化确认表单
      if (activeTab === 'pending') {
        setConfirmForm({
          teacherCallsign: user?.callsign || '',
          activityDate: activity.preferredDate || '',
          activityTime: activity.preferredTime || '',
          activityCallsign: activity.activityCallsign || '',
          notes: '',
          action: 'confirm'
        });
      }
      
      // 初始化评价表单
      if (activeTab === 'confirmed') {
        setEvaluationForm({
          teacherCallsign: activity.teacherCallsign || user?.callsign || '',
          result: 'pass',
          permission: 'S1',
          comment: '',
        });
      }
    }
  }, [selectedActivity, activeTab, activityDetails, user]);

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfirmForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEvaluationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvaluationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    
    setIsSubmitting(true);
    
    try {
      const activity = activityDetails[selectedActivity];
      
      // 更新活动状态
      await activityApi.update(selectedActivity, {
        ...activity,
        status: 'confirmed',
        teacherCallsign: confirmForm.teacherCallsign,
        activityDate: confirmForm.activityDate,
        activityTime: confirmForm.activityTime,
        activityCallsign: confirmForm.activityCallsign,
        notes: confirmForm.notes,
        confirmedAt: new Date().toISOString()
      });
      
      // 重新加载活动列表
      const allActivities = await activityApi.getAll();
      const pending = allActivities.filter((act: any) => 
        act.status === 'pending' || !act.status
      );
      const confirmed = allActivities.filter((act: any) => 
        act.status === 'confirmed'
      );
      const completed = allActivities.filter((act: any) => 
        act.status === 'completed'
      );
      
      setActivities({
        pending,
        confirmed,
        completed
      });
      
      // 更新活动详情
      const details: Record<string, any> = {};
      allActivities.forEach((act: any) => {
        details[act.id] = act;
      });
      setActivityDetails(details);
      
      // 清除选中的活动
      setSelectedActivity(null);
      
      alert('活动已确认！');
    } catch (error) {
      console.error('确认活动失败:', error);
      alert('确认活动失败，请重试！');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理拒绝活动申请
  const handleRejectActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    
    setIsSubmitting(true);
    
    try {
      const activity = activityDetails[selectedActivity];
      
      // 更新活动状态为拒绝
      await activityApi.update(selectedActivity, {
        ...activity,
        status: 'rejected',
        teacherCallsign: confirmForm.teacherCallsign,
        notes: confirmForm.notes,
        rejectedAt: new Date().toISOString()
      });
      
      // 重新加载活动列表
      const allActivities = await activityApi.getAll();
      const pending = allActivities.filter((act: any) => 
        act.status === 'pending' || !act.status
      );
      const confirmed = allActivities.filter((act: any) => 
        act.status === 'confirmed'
      );
      const completed = allActivities.filter((act: any) => 
        act.status === 'completed'
      );
      
      setActivities({
        pending,
        confirmed,
        completed
      });
      
      // 更新活动详情
      const details: Record<string, any> = {};
      allActivities.forEach((act: any) => {
        details[act.id] = act;
      });
      setActivityDetails(details);
      
      // 清除选中的活动
      setSelectedActivity(null);
      
      alert('活动申请已拒绝！');
    } catch (error) {
      console.error('拒绝活动申请失败:', error);
      alert('拒绝活动申请失败，请重试！');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvaluationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    
    setIsSubmitting(true);
    
    try {
      const activity = activityDetails[selectedActivity];
      
      // 更新活动状态
      await activityApi.update(selectedActivity, {
        ...activity,
        status: 'completed',
        result: evaluationForm.result,
        permission: evaluationForm.permission === 'none' ? null : evaluationForm.permission,
        comment: evaluationForm.comment,
        completedAt: new Date().toISOString()
      });
      
      // 重新加载活动列表
      const allActivities = await activityApi.getAll();
      const pending = allActivities.filter((act: any) => 
        act.status === 'pending' || !act.status
      );
      const confirmed = allActivities.filter((act: any) => 
        act.status === 'confirmed'
      );
      const completed = allActivities.filter((act: any) => 
        act.status === 'completed'
      );
      
      setActivities({
        pending,
        confirmed,
        completed
      });
      
      // 更新活动详情
      const details: Record<string, any> = {};
      allActivities.forEach((act: any) => {
        details[act.id] = act;
      });
      setActivityDetails(details);
      
      // 清除选中的活动
      setSelectedActivity(null);
      
      alert('评价已提交！');
    } catch (error) {
      console.error('提交评价失败:', error);
      alert('提交评价失败，请重试！');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">活动管理</h1>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'pending' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('pending')}
          >
            待确认
            {activities.pending.length > 0 && (
              <span className="ml-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activities.pending.length}
              </span>
            )}
          </Button>
          <Button 
            variant={activeTab === 'confirmed' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('confirmed')}
          >
            已确认
          </Button>
          <Button 
            variant={activeTab === 'completed' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('completed')}
          >
            已完成
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

          <ActivityList 
            activities={
              activeTab === 'pending' ? filteredActivities.pending :
              activeTab === 'confirmed' ? filteredActivities.confirmed :
              filteredActivities.completed
            }
            activeTab={activeTab}
            selectedActivity={selectedActivity}
            onSelectActivity={setSelectedActivity}
          />
        </div>

        <div className="w-2/3">
          {selectedActivity && activityDetails[selectedActivity] ? (
            <>
              <ActivityDetail 
                activity={activityDetails[selectedActivity]} 
                activeTab={activeTab} 
              />
              
              {activeTab === 'pending' && (
                <ConfirmForm 
                  form={confirmForm}
                  onChange={handleConfirmChange}
                  onSubmit={handleConfirmActivity}
                  onReject={handleRejectActivity}
                  isSubmitting={isSubmitting}
                />
              )}
              
              {activeTab === 'confirmed' && (
                <EvaluationForm 
                  form={evaluationForm}
                  onChange={handleEvaluationChange}
                  onSubmit={handleEvaluationSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                请从左侧列表中选择一个活动查看详情
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}