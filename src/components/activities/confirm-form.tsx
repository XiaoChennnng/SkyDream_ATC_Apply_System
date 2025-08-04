import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';

interface ConfirmFormProps {
  form: {
    teacherCallsign: string;
    activityDate: string;
    activityTime: string;
    activityCallsign: string;
    notes: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function ConfirmForm({ form, onChange, onSubmit, isSubmitting }: ConfirmFormProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-4">确认活动</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">教员呼号 *</label>
          <Input 
            name="teacherCallsign"
            placeholder="请输入您的教员呼号" 
            value={form.teacherCallsign}
            onChange={onChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">活动日期 *</label>
          <Input 
            name="activityDate"
            type="date" 
            value={form.activityDate}
            onChange={onChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">活动时间 *</label>
          <select 
            name="activityTime"
            value={form.activityTime}
            onChange={onChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          >
            <option value="14:00-17:00">下午 14:00-17:00</option>
            <option value="19:00-22:00">晚上 19:00-22:00</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">监管席位 *</label>
          <Input 
            name="activityCallsign"
            placeholder="请输入您的监管席位" 
            value={form.activityCallsign}
            onChange={onChange}
            required
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            请输入您将在活动中监管的席位呼号
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">备注信息</label>
          <textarea 
            name="notes"
            value={form.notes}
            onChange={onChange}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
            placeholder="如有特殊安排，请在此说明"
          />
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              '提交中...'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                确认活动
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}