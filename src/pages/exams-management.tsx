import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, Clock } from 'lucide-react';
import { examApi, userApi } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';
import { ExamList } from '@/components/exams/exam-list';
import { ExamDetail } from '@/components/exams/exam-detail';
import { ConfirmForm } from '@/components/exams/confirm-form';
import { EvaluationForm } from '@/components/exams/evaluation-form';

export function ExamsManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('pending');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [exams, setExams] = useState<{
    pending: any[];
    confirmed: any[];
    completed: any[];
  }>({
    pending: [],
    confirmed: [],
    completed: []
  });
  const [examDetails, setExamDetails] = useState<Record<string, any>>({});
  const [evaluationForm, setEvaluationForm] = useState({
    teacherCallsign: user?.callsign || '',
    result: 'pass' as 'pass' | 'fail',
    score: '',
    comment: '',
  });
  const [confirmForm, setConfirmForm] = useState({
    teacherCallsign: user?.callsign || '',
    examDate: '',
    examTime: '',
    notes: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加载考试数据
  useEffect(() => {
    const loadExams = async () => {
      try {
        const allExams = await examApi.getAll();
        const allUsers = await userApi.getAll();
        
        // 为每个考试添加用户信息
        const examsWithUserInfo = allExams.map((exam: any) => {
          const user = allUsers.find((u: any) => u.id === exam.userId);
          return {
            ...exam,
            email: user?.email || '',
            qq: user?.qq || '',
            name: user?.name || ''
          };
        });
        
        const pending = examsWithUserInfo.filter((exam: any) => 
          exam.status === 'pending' || !exam.status
        );
        
        const confirmed = examsWithUserInfo.filter((exam: any) => 
          exam.status === 'confirmed'
        );
        
        const completed = examsWithUserInfo.filter((exam: any) => 
          exam.status === 'completed'
        );
        
        setExams({
          pending,
          confirmed,
          completed
        });
        
        // 预加载考试详情
        const details: Record<string, any> = {};
        examsWithUserInfo.forEach((exam: any) => {
          details[exam.id] = exam;
        });
        setExamDetails(details);
      } catch (error) {
        console.error('加载考试列表失败:', error);
      }
    };
    
    loadExams();
  }, []);

  // 处理搜索
  const filteredExams = {
    pending: exams.pending.filter(exam => 
      exam.callsign?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    confirmed: exams.confirmed.filter(exam => 
      exam.callsign?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    completed: exams.completed.filter(exam => 
      exam.callsign?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  // 获取选中的考试
  const getSelectedExam = () => {
    if (!selectedExam || !examDetails[selectedExam]) return null;
    return examDetails[selectedExam];
  };

  // 当选择考试时，初始化表单
  useEffect(() => {
    const exam = getSelectedExam();
    if (exam) {
      if (activeTab === 'pending') {
        setConfirmForm({
          teacherCallsign: user?.callsign || '',
          examDate: exam.preferredDate || '',
          examTime: exam.preferredTime || '',
          notes: ''
        });
      } else if (activeTab === 'confirmed') {
        setEvaluationForm({
          teacherCallsign: exam.teacherCallsign || user?.callsign || '',
          result: 'pass',
          score: '',
          comment: ''
        });
      }
    }
  }, [selectedExam, activeTab, user, examDetails]);

  // 处理确认表单变化
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfirmForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理评价表单变化
  const handleEvaluationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvaluationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理确认考试
  const handleConfirmExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;
    
    setIsSubmitting(true);
    
    try {
      const exam = examDetails[selectedExam];
      
      // 更新考试状态
      await examApi.update(selectedExam, {
        ...exam,
        status: 'confirmed',
        teacherCallsign: confirmForm.teacherCallsign,
        examDate: confirmForm.examDate,
        examTime: confirmForm.examTime,
        notes: confirmForm.notes,
        confirmedAt: new Date().toISOString()
      });
      
      // 重新加载考试列表
      const allExams = await examApi.getAll();
      const pending = allExams.filter((ex: any) => 
        ex.status === 'pending' || !ex.status
      );
      const confirmed = allExams.filter((ex: any) => 
        ex.status === 'confirmed'
      );
      const completed = allExams.filter((ex: any) => 
        ex.status === 'completed'
      );
      
      setExams({
        pending,
        confirmed,
        completed
      });
      
      // 更新考试详情
      const details: Record<string, any> = {};
      allExams.forEach((ex: any) => {
        details[ex.id] = ex;
      });
      setExamDetails(details);
      
      // 清除选中的考试
      setSelectedExam(null);
      
      alert('考试已确认！');
    } catch (error) {
      console.error('确认考试失败:', error);
      alert('确认考试失败，请重试！');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理提交评价
  const handleEvaluationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;
    
    setIsSubmitting(true);
    
    try {
      const exam = examDetails[selectedExam];
      
      // 更新考试状态
      await examApi.update(selectedExam, {
        ...exam,
        status: 'completed',
        result: evaluationForm.result,
        score: parseInt(evaluationForm.score) || 0,
        comment: evaluationForm.comment,
        completedAt: new Date().toISOString()
      });
      
      // 重新加载考试列表
      const allExams = await examApi.getAll();
      const pending = allExams.filter((ex: any) => 
        ex.status === 'pending' || !ex.status
      );
      const confirmed = allExams.filter((ex: any) => 
        ex.status === 'confirmed'
      );
      const completed = allExams.filter((ex: any) => 
        ex.status === 'completed'
      );
      
      setExams({
        pending,
        confirmed,
        completed
      });
      
      // 更新考试详情
      const details: Record<string, any> = {};
      allExams.forEach((ex: any) => {
        details[ex.id] = ex;
      });
      setExamDetails(details);
      
      // 清除选中的考试
      setSelectedExam(null);
      
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
        <h1 className="text-3xl font-bold">考试管理</h1>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'pending' ? 'default' : 'outline'} 
            onClick={() => {
              setActiveTab('pending');
              setSelectedExam(null);
            }}
          >
            待确认
            {exams.pending.length > 0 && (
              <span className="ml-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {exams.pending.length}
              </span>
            )}
          </Button>
          <Button 
            variant={activeTab === 'confirmed' ? 'default' : 'outline'} 
            onClick={() => {
              setActiveTab('confirmed');
              setSelectedExam(null);
            }}
          >
            已确认
          </Button>
          <Button 
            variant={activeTab === 'completed' ? 'default' : 'outline'} 
            onClick={() => {
              setActiveTab('completed');
              setSelectedExam(null);
            }}
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
                placeholder="搜索考生呼号..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <ExamList 
            exams={filteredExams[activeTab]} 
            activeTab={activeTab} 
            selectedExam={selectedExam} 
            onSelectExam={setSelectedExam} 
          />
        </div>

        <div className="w-2/3">
          {selectedExam && examDetails[selectedExam] ? (
            <Card>
              <ExamDetail exam={examDetails[selectedExam]} activeTab={activeTab} />
              
              {activeTab === 'pending' && (
                <ConfirmForm 
                  form={confirmForm} 
                  onChange={handleConfirmChange} 
                  onSubmit={handleConfirmExam} 
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
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg border-dashed p-12">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">选择考试进行管理</h3>
                <p className="text-muted-foreground">
                  从左侧列表中选择一个考试进行确认或评价
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}