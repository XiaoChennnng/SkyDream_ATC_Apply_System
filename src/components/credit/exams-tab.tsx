import React from 'react';
import { CreditReport } from '@/services/credit-api';

interface ExamsTabProps {
  report: CreditReport;
  formatDate: (dateString: string) => string;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (status: string) => string;
}

export function ExamsTab({ report, formatDate, getStatusBadgeClass, getStatusText }: ExamsTabProps) {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <h3 className="text-lg font-medium">考试记录</h3>
        <p className="text-sm text-muted-foreground">
          用户的所有考试记录，包括理论考试和实操考试
        </p>
      </div>
      <div className="border-t">
        {report.exams.records.length > 0 ? (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-4 py-3">考试类型</th>
                  <th className="px-4 py-3">状态</th>
                  <th className="px-4 py-3">结果</th>
                  <th className="px-4 py-3">分数</th>
                  <th className="px-4 py-3">申请日期</th>
                  <th className="px-4 py-3">考试日期</th>
                  <th className="px-4 py-3">监考人</th>
                  <th className="px-4 py-3">教员评价</th>
                </tr>
              </thead>
              <tbody>
                {report.exams.records.map(record => (
                  <tr key={record.id} className="border-t">
                    <td className="px-4 py-3">
                      {record.details.examType === 'theory' ? '理论考试' : '实操考试'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.result ? (
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(record.result)}`}>
                          {getStatusText(record.result)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">{record.details.score || '-'}</td>
                    <td className="px-4 py-3">{formatDate(record.date)}</td>
                    <td className="px-4 py-3">
                      {record.status !== 'pending' 
                        ? formatDate(record.details.examDate || record.details.preferredDate) 
                        : formatDate(record.details.preferredDate)}
                    </td>
                    <td className="px-4 py-3">{record.details.teacherCallsign || '-'}</td>
                    <td className="px-4 py-3">{record.details.comment || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无考试记录</p>
          </div>
        )}
      </div>
    </div>
  );
}