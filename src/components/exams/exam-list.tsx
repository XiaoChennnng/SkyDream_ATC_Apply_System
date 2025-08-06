import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, BookOpen, Monitor } from 'lucide-react';

interface ExamListProps {
  exams: any[];
  activeTab: 'pending' | 'confirmed' | 'completed';
  selectedExam: string | null;
  onSelectExam: (id: string) => void;
}

export function ExamList({ exams, activeTab, selectedExam, onSelectExam }: ExamListProps) {
  if (exams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {activeTab === 'pending' ? '暂无待确认考试' : 
           activeTab === 'confirmed' ? '暂无已确认考试' : 
           '暂无已完成考试'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
      {exams.map(exam => (
        <Card 
          key={exam.id} 
          className={`cursor-pointer hover:border-primary transition-colors ${selectedExam === exam.id ? 'border-primary' : ''}`}
          onClick={() => onSelectExam(exam.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{exam.callsign}</span>
              </div>
              <span className={`text-xs ${
                activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                activeTab === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                exam.result === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              } px-2 py-0.5 rounded-full`}>
                {activeTab === 'pending' ? '待确认' : 
                 activeTab === 'confirmed' ? '已确认' : 
                 exam.result === 'pass' ? '通过' : '未通过'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>考试类型</span>
                <span className="flex items-center">
                  {exam.examType === 'theory' ? (
                    <BookOpen className="h-3 w-3 mr-1" />
                  ) : (
                    <Monitor className="h-3 w-3 mr-1" />
                  )}
                  {exam.examType === 'theory' ? '理论考试' : '实操考试'}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>{activeTab === 'pending' ? '期望日期' : '考试日期'}</span>
                <span>{activeTab === 'pending' ? exam.preferredDate : (exam.examDate || exam.preferredDate)}</span>
              </div>
              <div className="flex justify-between mt-1">
                {activeTab === 'pending' ? (
                  <>
                    <span>期望时间</span>
                    <span>{exam.preferredTime}</span>
                  </>
                ) : activeTab === 'confirmed' ? (
                  <>
                    <span>考试时间</span>
                    <span>{exam.examTime || exam.preferredTime}</span>
                  </>
                ) : (
                  <>
                    <span>分数</span>
                    <span>{exam.score}</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}