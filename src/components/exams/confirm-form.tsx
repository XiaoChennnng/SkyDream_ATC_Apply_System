import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

interface ConfirmFormProps {
  form: {
    teacherCallsign: string;
    examDate: string;
    examTime: string;
    notes: string;
    action: 'confirm' | 'reject';
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReject: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function ConfirmForm({ form, onChange, onSubmit, onReject, isSubmitting }: ConfirmFormProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-4">考试处理</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="teacherCallsign">教员呼号 *</Label>
          <Input 
            id="teacherCallsign"
            name="teacherCallsign"
            placeholder="请输入您的教员呼号" 
            value={form.teacherCallsign}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="examDate">考试日期 *</Label>
          <Input 
            id="examDate"
            name="examDate"
            type="date" 
            value={form.examDate}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="examTime">考试时间 *</Label>
          <select 
            id="examTime"
            name="examTime"
            value={form.examTime}
            onChange={onChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">请选择时间段</option>
            <option value="09:00-11:00">上午 09:00-11:00</option>
            <option value="14:00-16:00">下午 14:00-16:00</option>
            <option value="19:00-21:00">晚上 19:00-21:00</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">备注信息</Label>
          <textarea 
            id="notes"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={onChange}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="如有特殊安排，请在此说明"
          />
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            onClick={onSubmit}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              '提交中...'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                确认考试
              </>
            )}
          </Button>
          <Button 
            onClick={onReject}
            variant="destructive"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              '提交中...'
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                拒绝申请
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}