import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import { CreditReport } from '@/services/credit-api';

interface UserListProps {
  reports: CreditReport[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedReport: CreditReport | null;
  setSelectedReport: (report: CreditReport) => void;
  isLoading: boolean;
}

export function UserList({
  reports,
  searchQuery,
  setSearchQuery,
  selectedReport,
  setSelectedReport,
  isLoading
}: UserListProps) {
  // 过滤报告
  const filteredReports = reports.filter(report => 
    report.user.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/3 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="搜索用户呼号..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <Card 
              key={report.user.callsign} 
              className={`cursor-pointer hover:border-primary transition-colors ${selectedReport?.user.callsign === report.user.callsign ? 'border-primary' : ''}`}
              onClick={() => setSelectedReport(report)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{report.user.callsign}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    report.summary.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                    report.summary.overallScore >= 60 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.summary.overallScore}分
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>姓名</span>
                    <span>{report.user.name}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>申请</span>
                    <span>{report.applications.total}次</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>考试</span>
                    <span>{report.exams.total}次</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>活动</span>
                    <span>{report.activities.total}次</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">未找到匹配的用户</p>
          </div>
        )}
      </div>
    </div>
  );
}