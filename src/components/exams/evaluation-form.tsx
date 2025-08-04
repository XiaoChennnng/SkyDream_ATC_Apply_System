import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

interface EvaluationFormProps {
  form: {
    teacherCallsign: string;
    result: 'pass' | 'fail';
    score: string;
    comment: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function EvaluationForm({ form, onChange, onSubmit, isSubmitting }: EvaluationFormProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-4">考试评价</h3>
      <form onSubmit={onSubmit} className="space-y-4">
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
          <Label htmlFor="result">考试结果 *</Label>
          <select 
            id="result"
            name="result"
            value={form.result}
            onChange={onChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="pass">通过</option>
            <option value="fail">不通过</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="score">考试分数 *</Label>
          <Input 
            id="score"
            name="score"
            type="number" 
            min="0" 
            max="100" 
            placeholder="请输入分数（0-100）" 
            value={form.score}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">教员评语 *</Label>
          <textarea 
            id="comment"
            name="comment"
            value={form.comment}
            onChange={onChange}
            rows={3}
            required
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="请输入对考生的评语和建议"
          />
          <p className="text-sm text-muted-foreground">
            评语将发送给考生，请提供有建设性的反馈
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