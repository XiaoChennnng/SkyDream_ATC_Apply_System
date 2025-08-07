import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditReport } from '@/services/credit-api';

interface OverviewTabProps {
  report: CreditReport;
  formatDate: (dateString: string) => string;
}

export function OverviewTab({ report }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">用户信息</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">呼号</div>
              <div>{report.user.callsign}</div>
              <div className="text-muted-foreground">姓名</div>
              <div>{report.user.name}</div>
              <div className="text-muted-foreground">邮箱</div>
              <div>{report.user.email}</div>
              {report.user.qq && (
                <>
                  <div className="text-muted-foreground">QQ</div>
                  <div>{report.user.qq}</div>
                </>
              )}
              {report.user.phone && (
                <>
                  <div className="text-muted-foreground">电话</div>
                  <div>{report.user.phone}</div>
                </>
              )}
              <div className="text-muted-foreground">权限</div>
              <div>{report.user.permissions.length > 0 ? report.user.permissions.join(', ') : '无'}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">评分摘要</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">可靠性</span>
                  <span className="text-sm font-medium">{report.summary.reliability}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${report.summary.reliability}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">活跃度</span>
                  <span className="text-sm font-medium">{report.summary.activityLevel}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${report.summary.activityLevel}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">成功率</span>
                  <span className="text-sm font-medium">{report.summary.successRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${report.summary.successRate}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">违规影响</span>
                  <span className="text-sm font-medium">{report.summary.violationImpact}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${report.summary.violationImpact}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">综合评分</span>
                  <span className="text-sm font-medium">{report.summary.overallScore}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`rounded-full h-3 ${
                      report.summary.overallScore >= 80 ? 'bg-green-500' :
                      report.summary.overallScore >= 60 ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${report.summary.overallScore}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">申请统计</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center py-2">
              <div className="text-3xl font-bold">{report.applications.total}</div>
              <div className="text-sm text-muted-foreground">总申请数</div>
            </div>
            <div className="grid grid-cols-3 text-center mt-4">
              <div>
                <div className="text-lg font-medium text-green-600">{report.applications.approved}</div>
                <div className="text-xs text-muted-foreground">已批准</div>
              </div>
              <div>
                <div className="text-lg font-medium text-red-600">{report.applications.rejected}</div>
                <div className="text-xs text-muted-foreground">已拒绝</div>
              </div>
              <div>
                <div className="text-lg font-medium text-yellow-600">{report.applications.pending}</div>
                <div className="text-xs text-muted-foreground">待处理</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">考试统计</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center py-2">
              <div className="text-3xl font-bold">{report.exams.total}</div>
              <div className="text-sm text-muted-foreground">总考试数</div>
            </div>
            <div className="grid grid-cols-3 text-center mt-4">
              <div>
                <div className="text-lg font-medium text-green-600">{report.exams.passed}</div>
                <div className="text-xs text-muted-foreground">通过</div>
              </div>
              <div>
                <div className="text-lg font-medium text-red-600">{report.exams.failed}</div>
                <div className="text-xs text-muted-foreground">未通过</div>
              </div>
              <div>
                <div className="text-lg font-medium text-yellow-600">{report.exams.pending}</div>
                <div className="text-xs text-muted-foreground">待完成</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">活动统计</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center py-2">
              <div className="text-3xl font-bold">{report.activities.total}</div>
              <div className="text-sm text-muted-foreground">总活动数</div>
            </div>
            <div className="grid grid-cols-3 text-center mt-4">
              <div>
                <div className="text-lg font-medium text-green-600">{report.activities.passed}</div>
                <div className="text-xs text-muted-foreground">通过</div>
              </div>
              <div>
                <div className="text-lg font-medium text-red-600">{report.activities.failed}</div>
                <div className="text-xs text-muted-foreground">未通过</div>
              </div>
              <div>
                <div className="text-lg font-medium text-yellow-600">{report.activities.pending}</div>
                <div className="text-xs text-muted-foreground">待完成</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">违规统计</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center py-2">
              <div className="text-3xl font-bold">{report.violations.total}</div>
              <div className="text-sm text-muted-foreground">总违规数</div>
            </div>
            <div className="grid grid-cols-3 text-center mt-4">
              <div>
                <div className="text-lg font-medium text-yellow-600">{report.violations.minor}</div>
                <div className="text-xs text-muted-foreground">轻微</div>
              </div>
              <div>
                <div className="text-lg font-medium text-orange-600">{report.violations.moderate}</div>
                <div className="text-xs text-muted-foreground">中度</div>
              </div>
              <div>
                <div className="text-lg font-medium text-red-600">{report.violations.severe}</div>
                <div className="text-xs text-muted-foreground">严重</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}