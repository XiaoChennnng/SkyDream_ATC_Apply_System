import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Exam, examApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, FileText, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    examType: '理论考试' as const,
    preferredDate: '',
    preferredTime: ''
  });

  // 获取用户的考试列表
  useEffect(() => {
    if (user) {
      const userExams = examApi.getByCallsign(user.callsign);
      setExams(userExams);
      setLoading(false);
    }
  }, [user]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'examType' ? (value as '理论考试' | '模拟机考试') : value
    }));
  };

  // 提交考试预约
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const newExam = examApi.create({
        callsign: user.callsign,
        examType: formData.examType,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime
      });
      setExams(prev => [...prev, newExam]);
      setShowForm(false);
      setFormData({
        examType: '理论考试' as const,
        preferredDate: '',
        preferredTime: ''
      });
    }
  };

  // 查看考试详情
  const handleViewDetails = (exam: Exam) => {
    setSelectedExam(exam);
  };

  // 获取状态标签样式
  const getStatusBadgeClass = (status: Exam['status']) => {
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
  const getStatusIcon = (status: Exam['status']) => {
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
        <h1 className="text-2xl font-bold">考试预约管理</h1>
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
                <CardTitle>新建考试预约</CardTitle>
                <CardDescription>
                  请填写以下信息以预约您的考试
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="examType" className="text-sm font-medium">
                      考试类型
                    </label>
                    <select
                      id="examType"
                      name="examType"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={formData.examType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="理论考试">理论考试</option>
                      <option value="模拟机考试">模拟机考试</option>
                    </select>
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

          {exams.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">暂无考试预约</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                您还没有预约过考试，点击"新建预约"按钮开始预约流程。
              </p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                新建预约
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map(exam => (
                <Card key={exam.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{exam.examType}</CardTitle>
                      <span className={getStatusBadgeClass(exam.status)}>
                        {exam.status}
                      </span>
                    </div>
                    <CardDescription>
                      预约日期: {exam.preferredDate} {exam.preferredTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {getStatusIcon(exam.status)}
                        <span className="ml-2">
                          {exam.status === '待确认' ? '正在等待教员确认' : 
                           exam.status === '已确认' ? `已确认，负责教员：${exam.teacherCallsign}` : 
                           exam.status === '已完成' ? '考试已完成' : ''}
                        </span>
                      </div>
                      {exam.result && (
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          <p className="font-medium">考试结果：{exam.result}</p>
                          {exam.score && <p>分数：{exam.score}</p>}
                        </div>
                      )}
                      {exam.teacherComment && (
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          <p className="font-medium">教员评语：</p>
                          <p>{exam.teacherComment}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleViewDetails(exam)}>
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* 考试详情对话框 */}
          <Dialog open={!!selectedExam} onOpenChange={(open) => !open && setSelectedExam(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>考试详情</DialogTitle>
                <DialogDescription>
                  考试的详细信息
                </DialogDescription>
              </DialogHeader>
              {selectedExam && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">考试类型</h4>
                      <p className="text-base">{selectedExam.examType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">状态</h4>
                      <p className="text-base">
                        <span className={getStatusBadgeClass(selectedExam.status)}>
                          {selectedExam.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">预约日期</h4>
                      <p className="text-base">{selectedExam.preferredDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">预约时间</h4>
                      <p className="text-base">{selectedExam.preferredTime || '未指定'}</p>
                    </div>
                  </div>

                  {selectedExam.teacherCallsign && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">负责教员</h4>
                      <p className="text-base">{selectedExam.teacherCallsign}</p>
                    </div>
                  )}

                  {selectedExam.result && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">考试结果</h4>
                      <p className="text-base">{selectedExam.result}</p>
                    </div>
                  )}

                  {selectedExam.score && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">分数</h4>
                      <p className="text-base">{selectedExam.score}</p>
                    </div>
                  )}

                  {selectedExam.teacherComment && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">教员评语</h4>
                      <p className="text-base whitespace-pre-wrap">{selectedExam.teacherComment}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">创建时间</h4>
                      <p className="text-base">{new Date(selectedExam.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">更新时间</h4>
                      <p className="text-base">{new Date(selectedExam.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <Button onClick={() => setSelectedExam(null)}>关闭</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}