import React from 'react';
import { CreditReport } from '@/services/credit-api';

interface ActivitiesTabProps {
  report: CreditReport;
  formatDate: (dateString: string) => string;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (status: string) => string;
}

export function ActivitiesTab({ report, formatDate, getStatusBadgeClass, getStatusText }: ActivitiesTabProps) {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <h3 className="text-lg font-medium">活动记录</h3>
        <p className="text-sm text-muted-foreground">
          用户的所有活动记录，包括管制活动和其他类型的活动
        </p>
      </div>
      <div className="border-t">
        {report.activities.records.length > 0 ? (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-4 py-3">管制席位</th>
                  <th className="px-4 py-3">状态</th>
                  <th className="px-4 py-3">结果</th>
                  <th className="px-4 py-3">获得权限</th>
                  <th className="px-4 py-3">申请日期</th>
                  <th className="px-4 py-3">活动日期</th>
                  <th className="px-4 py-3">负责教员</th>
                </tr>
              </thead>
              <tbody>
                {report.activities.records.map(record => (
                  <tr key={record.id} className="border-t">
                    <td className="px-4 py-3">{record.details.activityCallsign}</td>
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
                    <td className="px-4 py-3">
                      {record.details.permission ? (
                        <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs font-medium">
                          {record.details.permission}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">{formatDate(record.date)}</td>
                    <td className="px-4 py-3">
                      {record.status !== 'pending' 
                        ? formatDate(record.details.activityDate || record.details.preferredDate) 
                        : formatDate(record.details.preferredDate)}
                    </td>
                    <td className="px-4 py-3">{record.details.teacherCallsign || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无活动记录</p>
          </div>
        )}
      </div>
    </div>
  );
}