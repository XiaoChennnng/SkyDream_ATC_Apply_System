import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Monitor, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { examApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';

export function ExamPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examType: 'theory',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userExams, setUserExams] = useState<any[]>([]);

  useEffect(() => {
    const loadUserExams = async () => {
      if (!user) return;
      
      try {
        // 使用正确的API方法 getByUser 而不是 getUserExams
        const exams = await examApi.getByUser(user.callsign);
        setUserExams(exams);
      } catch (error) {
        console.error('加载考试记录失败:', error);
      }
    };
    
    loadUserExams();
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
      await examApi.create(user.callsign, {
        examType: formData.examType === 'theory' ? 'theory' : 'simulator',
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime
      });
      
      // 重新加载考试记录
      const exams = await examApi.getByUser(user.callsign);
      setUserExams(exams);
      
      // 重置表单
      setFormData({
        examType: 'theory',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      });
      
      alert('考试申请已提交！');
    } catch (error) {
      console.error('提交考试申请失败:', error);
      alert('提交考试申请失败，请重试！');
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
      <h1 className="text-3xl font-bold">考试预约</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>申请考试</CardTitle>
            <CardDescription>
              请填写以下信息申请考试
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examType">考试类型</Label>
                <select 
                  id="examType"
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="theory">理论考试</option>
                  <option value="practical">实操考试</option>
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
                  <option value="09:00-11:00">上午 09:00-11:00</option>
                  <option value="14:00-16:00">下午 14:00-16:00</option>
                  <option value="19:00-21:00">晚上 19:00-21:00</option>
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
            <CardTitle>我的考试记录</CardTitle>
            <CardDescription>
              查看您的考试申请和结果
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userExams.length > 0 ? (
              <div className="space-y-4">
                {userExams.map(exam => (
                  <Card key={exam.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          {exam.examType === 'theory' ? (
                            <BookOpen className="h-4 w-4 mr-2 text-primary" />
                          ) : (
                            <Monitor className="h-4 w-4 mr-2 text-primary" />
                          )}
                          <span className="font-medium">
                            {exam.examType === 'theory' ? '理论考试' : '实操考试'}
                          </span>
                        </div>
                        {getStatusBadge(exam.status)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {exam.status === 'pending' 
                              ? `期望日期: ${exam.preferredDate}` 
                              : `考试日期: ${exam.examDate || exam.preferredDate}`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {exam.status === 'pending' 
                              ? `期望时间: ${exam.preferredTime}` 
                              : `考试时间: ${exam.examTime || exam.preferredTime}`}
                          </span>
                        </div>
                        
                        {exam.status === 'completed' && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="flex justify-between">
                              <span>考试结果:</span>
                              <span className={exam.result === 'pass' ? 'text-green-600' : 'text-red-600'}>
                                {exam.result === 'pass' ? '通过' : '未通过'}
                              </span>
                            </div>
                            {exam.score && (
                              <div className="flex justify-between">
                                <span>分数:</span>
                                <span>{exam.score}</span>
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
                <p className="text-muted-foreground">暂无考试记录</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}