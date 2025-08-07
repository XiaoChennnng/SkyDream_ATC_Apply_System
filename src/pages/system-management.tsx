import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { fileSystem } from '@/services/file-system';
// import { userApi } from '@/services/api'; // 暂时注释掉未使用的导入
import { accountManager } from '@/services/account-manager';
import { useAuth } from '@/contexts/auth-context';
import { AlertCircle, Database, RefreshCw, Shield, Trash2, UserPlus } from 'lucide-react';

export function SystemManagementPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // 确认重置系统
  const handleConfirmReset = async () => {
    if (confirmText !== '确认重置系统') {
      toast({
        variant: "destructive",
        title: "确认文本不匹配",
        description: "请输入'确认重置系统'以继续"
      });
      return;
    }

    try {
      setIsResetting(true);
      
      // 清除所有数据
      accountManager.clearAllAccounts();
      
      // 创建管理员账号
      await accountManager.createAdminAccount(adminUsername, '系统管理员', adminPassword);
      
      toast({
        title: "系统已重置",
        description: "所有账号已清除，并创建了新的管理员账号"
      });
      
      setShowResetDialog(false);
      setConfirmText('');
    } catch (error) {
      console.error('重置系统失败:', error);
      toast({
        variant: "destructive",
        title: "重置系统失败",
        description: "请稍后重试或联系技术支持"
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>访问被拒绝</AlertTitle>
          <AlertDescription>
            您没有权限访问此页面。此页面仅供系统管理员使用。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">系统管理</h1>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">系统设置</TabsTrigger>
          <TabsTrigger value="data">数据管理</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>系统信息</CardTitle>
              <CardDescription>查看系统基本信息和状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>系统名称</Label>
                  <div className="text-sm mt-1">Skydream管制员申请及管理系统</div>
                </div>
                <div>
                  <Label>版本</Label>
                  <div className="text-sm mt-1">1.0.0</div>
                </div>
                <div>
                  <Label>存储方式</Label>
                  <div className="text-sm mt-1">json存储</div>
                </div>
                <div>
                  <Label>当前管理员</Label>
                  <div className="text-sm mt-1">{user.callsign}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">危险操作</CardTitle>
              <CardDescription>这些操作可能会导致数据丢失，请谨慎操作</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>警告</AlertTitle>
                <AlertDescription>
                  重置系统将清除所有用户数据，包括申请、考试、活动记录等。此操作不可逆，请谨慎操作。
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重置系统
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>重置系统</DialogTitle>
                    <DialogDescription>
                      此操作将清除所有用户数据，并创建一个新的管理员账号。此操作不可逆，请确认后继续。
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminUsername">管理员用户名</Label>
                      <Input
                        id="adminUsername"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">管理员密码</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                    </div>
                    
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>最终确认</AlertTitle>
                      <AlertDescription>
                        请输入"确认重置系统"以继续操作
                      </AlertDescription>
                    </Alert>
                    
                    <Input
                      placeholder="确认重置系统"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                      取消
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleConfirmReset}
                      disabled={isResetting || confirmText !== '确认重置系统'}
                    >
                      {isResetting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          重置中...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          确认重置
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据管理</CardTitle>
              <CardDescription>管理系统数据和存储</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">用户数据</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        <span>用户账号</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={async () => {
                        try {
                          const users = await fileSystem.getAllUsers();
                          const validUsers = users.filter(user => user !== null);
                          toast({
                            title: "用户数据统计",
                            description: `系统中共有 ${validUsers.length} 个用户账号`
                          });
                        } catch (error) {
                          console.error('获取用户数据失败:', error);
                          toast({
                            variant: "destructive",
                            title: "统计失败",
                            description: "获取用户数据时发生错误"
                          });
                        }
                      }}>
                        统计
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">申请数据</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 mr-2 text-primary" />
                        <span>申请记录</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={async () => {
                        try {
                          const applications = await fileSystem.getAllApplications();
                          toast({
                            title: "申请数据统计",
                            description: `系统中共有 ${applications.length} 条申请记录`
                          });
                        } catch (error) {
                          console.error('获取申请数据失败:', error);
                          toast({
                            variant: "destructive",
                            title: "统计失败",
                            description: "获取申请数据时发生错误"
                          });
                        }
                      }}>
                        统计
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">考试数据</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 mr-2 text-primary" />
                        <span>考试记录</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={async () => {
                        try {
                          const exams = await fileSystem.getAllExams();
                          toast({
                            title: "考试数据统计",
                            description: `系统中共有 ${exams.length} 条考试记录`
                          });
                        } catch (error) {
                          console.error('获取考试数据失败:', error);
                          toast({
                            variant: "destructive",
                            title: "统计失败",
                            description: "获取考试数据时发生错误"
                          });
                        }
                      }}>
                        统计
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">活动数据</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 mr-2 text-primary" />
                        <span>活动记录</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={async () => {
                        try {
                          const activities = await fileSystem.getAllActivities();
                          toast({
                            title: "活动数据统计",
                            description: `系统中共有 ${activities.length} 条活动记录`
                          });
                        } catch (error) {
                          console.error('获取活动数据失败:', error);
                          toast({
                            variant: "destructive",
                            title: "统计失败",
                            description: "获取活动数据时发生错误"
                          });
                        }
                      }}>
                        统计
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={async () => {
                try {
                  const users = await fileSystem.getAllUsers();
                  const validUsers = users.filter(user => user !== null);
                  const applications = await fileSystem.getAllApplications();
                  const exams = await fileSystem.getAllExams();
                  const activities = await fileSystem.getAllActivities();
                  
                  toast({
                    title: "系统数据统计",
                    description: `用户: ${validUsers.length}个, 申请: ${applications.length}条, 考试: ${exams.length}条, 活动: ${activities.length}条`
                  });
                } catch (error) {
                  console.error('获取系统数据失败:', error);
                  toast({
                    variant: "destructive",
                    title: "统计失败",
                    description: "获取系统数据时发生错误"
                  });
                }
              }}>
                <Database className="h-4 w-4 mr-2" />
                统计所有数据
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>创建初始账号</CardTitle>
              <CardDescription>创建系统初始账号，包括管理员和教员账号</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminCallsign">管理员呼号</Label>
                    <Input id="adminCallsign" defaultValue="ADMIN" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminName">管理员姓名</Label>
                    <Input id="adminName" defaultValue="系统管理员" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherCallsign">教员呼号</Label>
                    <Input id="teacherCallsign" defaultValue="TEACHER" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherName">教员姓名</Label>
                    <Input id="teacherName" defaultValue="系统教员" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={async () => {
                const adminCallsign = (document.getElementById('adminCallsign') as HTMLInputElement).value;
                const adminName = (document.getElementById('adminName') as HTMLInputElement).value;
                const teacherCallsign = (document.getElementById('teacherCallsign') as HTMLInputElement).value;
                const teacherName = (document.getElementById('teacherName') as HTMLInputElement).value;
                
                try {
                  // 创建管理员账号
                  await accountManager.createAdminAccount(adminCallsign, adminName, 'admin123');
                  
                  // 创建教员账号
                  await accountManager.createTeacherAccount(teacherCallsign, teacherName, 'teacher123');
                  
                  toast({
                    title: "初始账号创建成功",
                    description: `已创建管理员账号 ${adminCallsign} 和教员账号 ${teacherCallsign}`
                  });
                } catch (error) {
                  console.error('创建初始账号失败:', error);
                  toast({
                    variant: "destructive",
                    title: "创建初始账号失败",
                    description: "请检查账号信息是否正确，或者账号是否已存在"
                  });
                }
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                创建初始账号
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}