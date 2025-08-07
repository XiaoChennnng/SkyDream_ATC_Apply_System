import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';
import { CreditReport, ViolationRecord } from '@/services/credit-api';
import { violationApi } from '@/services/violation-api';
import { useAuth } from '@/contexts/auth-context';

interface ViolationsTabProps {
  report: CreditReport;
  formatDate: (date: string) => string;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (status: string) => string;
}

export function ViolationsTab({ report, formatDate }: ViolationsTabProps) {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'minor' | 'moderate' | 'severe'>('minor');
  const [error, setError] = useState('');
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // 加载违规记录
  useEffect(() => {
    const loadViolations = async () => {
      try {
        const userViolations = await violationApi.getByUser(report.user.callsign);
        setViolations(userViolations);
      } catch (error) {
        console.error('加载违规记录失败:', error);
      }
    };
    
    loadViolations();
  }, [report.user.callsign, refreshKey]);
  
  // 检查当前用户是否是教员或管理员
  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin');
  
  // 获取违规严重程度的标签样式
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 获取违规严重程度的文本
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'minor':
        return '轻微';
      case 'moderate':
        return '中度';
      case 'severe':
        return '严重';
      default:
        return severity;
    }
  };
  
  // 添加违规记录
  const handleAddViolation = async () => {
    if (!title.trim()) {
      setError('请输入违规标题');
      return;
    }
    
    if (!description.trim()) {
      setError('请输入违规描述');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const newViolation = await violationApi.addViolation(
        report.user.callsign,
        title,
        description,
        severity,
        user?.callsign || ''
      );
      
      // 关闭对话框并重置表单
      setIsAddDialogOpen(false);
      setTitle('');
      setDescription('');
      setSeverity('minor');
      
      // 通过更新refreshKey触发重新加载违规记录
      setRefreshKey(prevKey => prevKey + 1);
      
      // 更新report中的违规记录
      if (report.violations && report.violations.records) {
        // 添加新记录到本地状态
        setViolations(prev => [...prev, newViolation]);
      }
    } catch (error: any) {
      setError(error.message || '添加违规记录失败');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 删除违规记录
  const handleDeleteViolation = async (violationId: string) => {
    if (!confirm('确定要删除此违规记录吗？')) {
      return;
    }
    
    try {
      await violationApi.deleteViolation(violationId, user?.callsign || '');
      
      // 通过更新refreshKey触发重新加载违规记录
      setRefreshKey(prevKey => prevKey + 1);
      
      // 从本地状态中移除被删除的记录
      setViolations(prev => prev.filter(v => v.id !== violationId));
    } catch (error: any) {
      alert(error.message || '删除违规记录失败');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">违规记录</h3>
        {isTeacherOrAdmin && (
          <Button onClick={() => setIsAddDialogOpen(true)}>添加违规记录</Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {violations && violations.length > 0 ? (
          violations.map((violation) => (
            <Card key={violation.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                      <span className="font-medium">{violation.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDate(violation.date)}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityBadgeClass(violation.severity)}`}>
                    {getSeverityText(violation.severity)}
                  </span>
                </div>
                
                <div className="text-sm mt-3 p-3 bg-muted rounded-md">
                  {violation.description}
                </div>
                
                <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    <span>报告人: {violation.reportedBy} ({violation.reporterCallsign})</span>
                  </div>
                  
                  {isTeacherOrAdmin && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteViolation(violation.id)}
                    >
                      删除
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无违规记录</p>
          </div>
        )}
      </div>
      
      {/* 添加违规记录对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加违规记录</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">违规标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入违规标题"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">违规描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请详细描述违规行为"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="severity">违规严重程度</Label>
              <Select
                value={severity}
                onValueChange={(value) => setSeverity(value as 'minor' | 'moderate' | 'severe')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择严重程度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">轻微 (-5分)</SelectItem>
                  <SelectItem value="moderate">中度 (-15分)</SelectItem>
                  <SelectItem value="severe">严重 (-30分)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddViolation} disabled={isLoading}>
              {isLoading ? '添加中...' : '添加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}