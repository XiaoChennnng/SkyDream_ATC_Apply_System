import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Monitor } from 'lucide-react';

interface ExamDetailProps {
  exam: any;
  activeTab: 'pending' | 'confirmed' | 'completed';
}

export function ExamDetail({ exam, activeTab }: ExamDetailProps) {
  if (!exam) return null;

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>考试详情</CardTitle>
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
        <CardDescription>
          考生呼号: {exam.callsign}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">考试类型</p>
            <p className="flex items-center">
              {exam.examType === 'theory' ? (
                <BookOpen className="h-4 w-4 mr-1 text-primary" />
              ) : (
                <Monitor className="h-4 w-4 mr-1 text-primary" />
              )}
              {exam.examType === 'theory' ? '理论考试' : '实操考试'}
            </p>
          </div>
          
          {activeTab === 'pending' ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground">期望日期</p>
                <p>{exam.preferredDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">期望时间</p>
                <p>{exam.preferredTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">申请时间</p>
                <p>{new Date(exam.createdAt).toLocaleString()}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground">考试日期</p>
                <p>{exam.examDate || exam.preferredDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">考试时间</p>
                <p>{exam.examTime || exam.preferredTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{activeTab === 'confirmed' ? '确认时间' : '完成时间'}</p>
                <p>{activeTab === 'confirmed' 
                    ? (exam.confirmedAt ? new Date(exam.confirmedAt).toLocaleString() : '未知')
                    : (exam.completedAt ? new Date(exam.completedAt).toLocaleString() : '未知')
                  }</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">负责教员</p>
                <p>{exam.teacherCallsign}</p>
              </div>
              
              {activeTab === 'completed' && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">考试结果</p>
                    <p className={exam.result === 'pass' ? 'text-green-600' : 'text-red-600'}>
                      {exam.result === 'pass' ? '通过' : '未通过'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">考试分数</p>
                    <p>{exam.score}</p>
                  </div>
                </>
              )}
            </>
          )}
          
          <div>
            <p className="text-sm text-muted-foreground">电子邮箱</p>
            <p>{exam.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">QQ号码</p>
            <p>{exam.qq}</p>
          </div>
        </div>

        {exam.comment && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">教员评语</p>
            <p className="bg-muted p-3 rounded-md text-sm">
              {exam.comment}
            </p>
          </div>
        )}
      </CardContent>
    </>
  );
}