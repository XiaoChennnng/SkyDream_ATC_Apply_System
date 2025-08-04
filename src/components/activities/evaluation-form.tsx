import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';

interface EvaluationFormProps {
  form: {
    teacherCallsign: string;
    result: string;
    permission: string;
    comment: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function EvaluationForm({ form, onChange, onSubmit, isSubmitting }: EvaluationFormProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-4">活动评价</h3>
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
          <label className="text-sm font-medium">考核结果 *</label>
          <select 
            name="result"
            value={form.result}
            onChange={onChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          >
            <option value="pass">通过</option>
            <option value="fail">未通过</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">授予权限 *</label>
          <select 
            name="permission"
            value={form.permission}
            onChange={onChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          >
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
            <option value="C3">C3</option>
            <option value="none">不授予权限</option>
          </select>
          <p className="text-sm text-muted-foreground mt-1">
            如果考核通过，请选择要授予的权限等级
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">教员评语 *</label>
          <textarea 
            name="comment"
            value={form.comment}
            onChange={onChange}
            rows={3}
            required
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
            placeholder="请输入对申请者的评语和建议"
          />
          <p className="text-sm text-muted-foreground mt-1">
            评语将发送给申请者，请提供有建设性的反馈
          </p>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            type="submit" 
            className="flex-1"
            variant={form.result === 'pass' ? 'default' : 'destructive'}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              '提交中...'
            ) : form.result === 'pass' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                提交评价
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                提交评价
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}