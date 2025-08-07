import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityDetailProps {
  activity: any;
  activeTab: 'pending' | 'confirmed' | 'completed';
}

export function ActivityDetail({ activity, activeTab }: ActivityDetailProps) {
  if (!activity) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>活动详情</CardTitle>
          <span className={`text-xs ${
            activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            activeTab === 'confirmed' ? 'bg-blue-100 text-blue-800' :
            activity.result === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } px-2 py-0.5 rounded-full`}>
            {activeTab === 'pending' ? '待确认' : 
             activeTab === 'confirmed' ? '已确认' : 
             activity.result === 'pass' ? '通过' : '未通过'}
          </span>
        </div>
        <CardDescription>
          申请者呼号: {activity.callsign}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">管制席位</p>
            <p className="font-mono">{activity.activityCallsign}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">申请席位</p>
            <p>{activity.controlRoom}</p>
          </div>
          {activeTab === 'pending' ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground">期望日期</p>
                <p>{activity.preferredDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">期望时间</p>
                <p>{activity.preferredTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">申请时间</p>
                <p>{new Date(activity.createdAt).toLocaleString()}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground">活动日期</p>
                <p>{activity.activityDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">活动时间</p>
                <p>{activity.activityTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">确认时间</p>
                <p>{activity.confirmedAt ? new Date(activity.confirmedAt).toLocaleString() : '未知'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">负责教员</p>
                <p>{activity.teacherCallsign}</p>
              </div>
            </>
          )}
          <div>
            <p className="text-sm text-muted-foreground">电子邮箱</p>
            <p>{activity.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">QQ号码</p>
            <p>{activity.qq}</p>
          </div>
        </div>

        {activity.notes && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">备注信息</p>
            <p className="bg-muted p-3 rounded-md text-sm">
              {activity.notes}
            </p>
          </div>
        )}

        {activeTab === 'completed' && activity.comment && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">教员评语</p>
            <p className="bg-muted p-3 rounded-md text-sm">
              {activity.comment}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}