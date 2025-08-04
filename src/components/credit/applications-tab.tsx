import React from 'react';
import { CreditReport, CreditRecord } from '@/services/credit-api';

interface ApplicationsTabProps {
  report: CreditReport;
  formatDate: (dateString: string) => string;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (status: string) => string;
}

export function ApplicationsTab({ report, formatDate, getStatusBadgeClass, getStatusText }: ApplicationsTabProps) {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <h3 className="text-lg font-medium">申请记录</h3>
        <p className="text-sm text-muted-foreground">
          用户的所有申请记录，包括权限申请和其他类型的申请
        </p>
      </div>
      <div className="border-t">
        {report.applications.records.length > 0 ? (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-4 py-3">申请类型</th>
                  <th className="px-4 py-3">状态</th>
                  <th className="px-4 py-3">申请日期</th>
                  <th className="px-4 py-3">处理日期</th>
                  <th className="px-4 py-3">处理人</th>
                </tr>
              </thead>
              <tbody>
                {report.applications.records.map(record => (
                  <tr key={record.id} className="border-t">
                    <td className="px-4 py-3">{record.details.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(record.date)}</td>
                    <td className="px-4 py-3">
                      {record.status !== 'pending' 
                        ? formatDate(record.status === 'approved' 
                            ? record.details.approvedAt 
                            : record.details.rejectedAt) 
                        : '-'}
                    </td>
                    <td className="px-4 py-3">{record.details.teacherCallsign || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无申请记录</p>
          </div>
        )}
      </div>
    </div>
  );
}