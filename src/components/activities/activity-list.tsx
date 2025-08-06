import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ActivityListProps {
  activities: any[];
  activeTab: 'pending' | 'confirmed' | 'completed';
  selectedActivity: string | null;
  onSelectActivity: (id: string) => void;
}

export function ActivityList({ activities, activeTab, selectedActivity, onSelectActivity }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {activeTab === 'pending' ? '暂无待确认活动' : 
           activeTab === 'confirmed' ? '暂无已确认活动' : '暂无已完成活动'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
      {activities.map(activity => (
        <Card 
          key={activity.id} 
          className={`cursor-pointer hover:border-primary transition-colors ${selectedActivity === activity.id ? 'border-primary' : ''}`}
          onClick={() => onSelectActivity(activity.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{activity.callsign}</span>
              </div>
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
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>管制席位</span>
                <span className="font-mono">{activity.activityCallsign}</span>
              </div>
              {activeTab === 'pending' ? (
                <>
                  <div className="flex justify-between mt-1">
                    <span>期望日期</span>
                    <span>{activity.preferredDate}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>期望时间</span>
                    <span>{activity.preferredTime}</span>
                  </div>
                </>
              ) : activeTab === 'confirmed' ? (
                <>
                  <div className="flex justify-between mt-1">
                    <span>活动日期</span>
                    <span>{activity.activityDate}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>活动时间</span>
                    <span>{activity.activityTime}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between mt-1">
                    <span>活动日期</span>
                    <span>{activity.activityDate}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>获得权限</span>
                    <span className="bg-gold/20 text-gold px-2 py-0.5 rounded font-medium">
                      {activity.permission || '无'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}